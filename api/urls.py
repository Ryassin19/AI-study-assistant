from django.contrib import admin
from django.urls import path
from .views import ask_ai, DocumentUploadView

urlpatterns = [
    path('summerize/', ask_ai),
    path('upload/', DocumentUploadView.as_view()),
]