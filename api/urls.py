from django.contrib import admin
from django.urls import path
from .views import ask_ai, DocumentUploadView, DocumentDetailView

urlpatterns = [
    path('summarize/', ask_ai),
    path('upload/', DocumentUploadView.as_view()),
    path('upload/<int:pk>/', DocumentDetailView.as_view())
]