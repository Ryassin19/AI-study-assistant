from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view

import os
from openai import OpenAI

# Create your views here.
 
client = OpenAI(
        api_key = os.getenv("API_KEY"),
        base_url="https://api.groq.com/openai/v1"
    )

@api_view(['POST'])
def ask_ai(request):
    user_input = request.data.get('text', '')
    
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "You are a specialized study assistant "
            "that summerizes the notes of the students "
            "and answers their questions"}, 
            {"role": "user", "content": user_input} 
        ]
    )
    summary_text = response.choices[0].message.content
    return Response({"summary": summary_text})

