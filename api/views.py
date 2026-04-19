from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view

import os
from openai import OpenAI

from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from .models import StudyDocument

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

    def post(self, request, *args, **kwargs):
        file_obj = request.data.get('file')
        title = request.data.get('title', file_obj.name)

        doc = StudyDocument.objects.create(file=file_obj, title=title)
        
        return Response({
            "message": "File uploaded successfully!",
            "id": doc.id
        }, status=status.HTTP_201_CREATED)
    
    