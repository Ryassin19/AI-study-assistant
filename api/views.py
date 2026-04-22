from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
import os, fitz, io
from openai import OpenAI
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from .models import StudyDocument
from django.shortcuts import get_object_or_404
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings 

# Create your views here.
 
client = OpenAI(
        api_key = os.getenv("API_KEY"),
        base_url="https://api.groq.com/openai/v1"
    )

def get_ai_response(instruction, user_input):
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": instruction},
            {"role": "user", "content": user_input}
        ]
    )
    return response.choices[0].message.content

embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

@api_view(['POST'])
def ask_ai(request):
    user_input = request.data.get('text', '')
    doc_id = request.data.get('doc_id', None) 
    mode = request.data.get('mode', 'summary')
    
    if doc_id:
        vector_db = Chroma(
            persist_directory="./chroma_db", 
            embedding_function=embeddings,
            collection_name=f"doc_{doc_id}"
        )
        
        search_results = vector_db.similarity_search(user_input, k=3)
        context = "\n\n".join([doc.page_content for doc in search_results])
        
        instruction = (
            f"You are a study assistant. Use the following excerpts from a textbook "
            f"to answer the student's question accurately: \n\n{context}"
        )
    
    else:
        instruction = "You are a general study assistant helping with student questions."
        if mode == "quiz":
            instruction = "Give a 5-question quiz based on the user's topic."
        elif mode == "eli5":
            instruction = "Explain the topic like I am 5 years old."
    
    return Response({"answer": get_ai_response(instruction, user_input)})

class DocumentUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        docs = StudyDocument.objects.all().order_by('-uploaded_at')
        data = []
        for d in docs:
            data.append({"id": d.id, "title": d.title, "summary": d.summary, "uploaded_at": d.uploaded_at})
        return Response(data)

    def post(self, request, *args, **kwargs):
        file_obj = request.data.get('file')
        title = request.data.get('title', file_obj.name)

        if not file_obj:
            return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        doc = StudyDocument.objects.create(file=file_obj, title=title)
        extracted_text = ""
        file_obj.seek(0)

        with fitz.open(stream=io.BytesIO(file_obj.read()), filetype="pdf") as pdf:
            for page in pdf:
                extracted_text += page.get_text()

        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000,chunk_overlap=100)
        chunks = text_splitter.split_text(extracted_text)

        Chroma.from_texts(
            texts=chunks,
            embedding=embeddings, 
            persist_directory="./chroma_db",
            collection_name=f"doc_{doc.id}" 
        )

        total = len(chunks)
        if total > 3:
            sample = [chunks[0], chunks[total // 2], chunks[-1]]
            summary_context = "\n\n".join(sample)
        else:
            summary_context = "\n\n".join(chunks)

        instruction = "Briefly summarize the main purpose of these lecture notes in 3-5 bullet points."        
        
        doc.summary = get_ai_response(instruction, summary_context)
        doc.save()

        return Response({
            "message": "File uploaded successfully!",
            "summary": doc.summary,
            "id": doc.id
        }, status=201)
    
class DocumentDetailView(APIView):
    def get(self, request, pk):
        doc = get_object_or_404(StudyDocument, pk=pk)
        return Response({
            "id": doc.id,
            "title": doc.title,
            "summary": doc.summary,
            "uploaded_at": doc.uploaded_at
        })

    def delete(self, request, pk):
        doc = get_object_or_404(StudyDocument, pk=pk)
        
        vector_db = Chroma(
            persist_directory="./chroma_db", 
            embedding_function=embeddings,
            collection_name=f"doc_{doc.id}"
        )
        vector_db.delete_collection()
        
        doc.delete()
        return Response({"message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)