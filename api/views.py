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

# Create your views here.
 
client = OpenAI(
        api_key = os.getenv("API_KEY"),
        base_url="https://api.groq.com/openai/v1"
    )

@api_view(['POST'])
def ask_ai(request):
    user_input = request.data.get('text', '')
    mode = "summary"
    mode = request.data.get('mode', '')
    instruction = ("You are a specialized study assistant "
    "that summerizes the notes of the students "
    "and answers their questions")
    
    if(mode == "quiz"):
        instruction = "give a quiz of 5 questions about the topic"
    elif(mode == "eli5"):
        instruction = "explain the topic like i am 5 years old"
    
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": instruction}, 
            {"role": "user", "content": user_input} 
        ]
    )
    summary_text = response.choices[0].message.content
    return Response({"summary": summary_text})

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
        
        file_obj.seek(0)
        file_bytes = file_obj.read()
        file_obj.seek(0)
        doc = StudyDocument.objects.create(file=file_obj, title=title)
        extracted_text = ""

        try:
            with fitz.open(stream=io.BytesIO(file_bytes), filetype="pdf") as pdf:
                for page in pdf:
                    extracted_text += page.get_text()

        except Exception as e:
            return Response({"error": f"Failed to read PDF: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        mode = request.data.get('mode', '') or 'summary'
        instruction = ("Summarize these lecture notes into key bullet points.")
        
        if(mode == "quiz"):
            instruction = "give a quiz of 5 questions about the lecture notes"
        elif(mode == "eli5"):
            instruction = "explain the lecture notes like i am 5 years old"
        
        ai_response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": instruction}, 
                {"role": "user", "content": extracted_text[:10000]} 
            ]
        )
        ai_content = ai_response.choices[0].message.content
       
        doc.summary = ai_content
        doc.save()

        return Response({
            "message": "File uploaded successfully!",
            "summary": doc.summary,
            "id": doc.id
        }, status=status.HTTP_201_CREATED)
    
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
        doc.delete()
        return Response({"message": "Deleted successfully"}, status=status.HTTP_204_NO_CONTENT)