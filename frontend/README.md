# 🎓 AI Study Assistant

A full-stack web application that uses Llama 3.3 to help students transform their notes into summaries, ELI5 explanations, or interactive quizzes.

---

## 🚀 Features

- Multi-Mode Processing: Toggle between Summary, Quiz, and ELI5 (Explain Like I'm 5) modes.  
- Real-time AI Integration: Powered by Groq API for lightning-fast responses.  
- Markdown Support: Beautifully formatted AI responses.  
- One-Click Copy: Easily move your generated notes to other documents.  
- Responsive UI: Built with React for a smooth experience.  

---

## 🛠️ Tech Stack

**Frontend:** React, Axios, React-Markdown  
**Backend:** Django, Django REST Framework  
**AI:** Groq Cloud API (Llama-3.3-70B)  

---

## 🏁 Getting Started

1. Clone the repository  

2. Create a `.env` file and add your API key:
   ```
   API_KEY=your_groq_api_key
   ```

3. Start the backend:
   ```
   python manage.py runserver
   ```

4. Start the frontend:
   ```
   npm run dev
   ```

---

Built as a full-stack AI project to explore real-time LLM applications.