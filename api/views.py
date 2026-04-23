from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import StudyDocument
from .services import (
    get_ai_response, 
    process_and_index_pdf, 
    get_vector_db, 
    client, 
    embeddings
)

@api_view(['POST'])
def ask_ai(request):
    user_input = request.data.get('text', '')
    doc_id = request.data.get('doc_id', None) 
    history = request.data.get('messages', [])
    instruction = "You are a helpful study assistant."

    if doc_id:
        vector_db = get_vector_db(doc_id)
        search_results = vector_db.similarity_search(user_input, k=3)
        context = "\n\n".join([doc.page_content for doc in search_results])
        instruction = (
            f"Use these textbook excerpts to answer accurately: {context}. "
            "Use Markdown, **bold** key terms, and bullet points. If not in text, say you don't know."
        )

    llm_messages = [{"role": "system", "content": instruction}]
    for msg in history[-4:]:
        role = "assistant" if msg['role'] == 'ai' else "user"
        llm_messages.append({"role": role, "content": msg['content']})
    
    llm_messages.append({"role": "user", "content": user_input})

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=llm_messages
    )
    return Response({"answer": response.choices[0].message.content})

class DocumentUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request):
        docs = StudyDocument.objects.all().order_by('-uploaded_at')
        data = [{"id": d.id, "title": d.title, "summary": d.summary, "uploaded_at": d.uploaded_at} for d in docs]
        return Response(data)

    def post(self, request):
        file_obj = request.data.get('file')
        if not file_obj:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        doc = StudyDocument.objects.create(file=file_obj, title=file_obj.name)
        
        # Logic handled by Service
        chunks = process_and_index_pdf(file_obj, doc.id)

        # Summary Logic
        summary_context = "\n\n".join(chunks[:3]) if len(chunks) > 0 else ""
        instruction = "Briefly summarize the main purpose of these lecture notes in 3-5 bullet points."        
        doc.summary = get_ai_response(instruction, summary_context)
        doc.save()

        return Response({"message": "Success", "summary": doc.summary, "id": doc.id}, status=201)

class DocumentDetailView(APIView):
    def delete(self, request, pk):
        doc = get_object_or_404(StudyDocument, pk=pk)
        vector_db = get_vector_db(doc.id)
        vector_db.delete_collection()
        doc.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)