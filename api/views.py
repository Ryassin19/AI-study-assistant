from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view

# Create your views here.
 
# This "Decorator" tells Django this function only handles 'GET' requests (reading data)
@api_view(['GET'])
def hello_world(request):
    # This is the actual data we want to send
    data = {"message": "Hello from the Django Backend!!"}
    return Response(data)