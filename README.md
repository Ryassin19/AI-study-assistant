# 🎓 AI Study Assistant

A high-performance, full-stack web application that transforms complex study notes into structured, readable summaries, quizzes, and simplified explanations using state-of-the-art Large Language Models.

---

## 🚀 Key Features

* **Multi-Mode Processing:** Toggle between **Summary**, **Quiz**, and **ELI5** (Explain Like I'm 5) modes to customize your learning experience.  
* **Real-time AI Integration:** Powered by the **Llama 3.3 (70B)** model via the Groq Cloud API for near-instant, high-quality text analysis.  
* **Rich Markdown Rendering:** AI outputs are automatically formatted with headers, bold text, and bullet points for maximum readability.  
* **Dynamic UX:** Features integrated loading states ("Thinking...") and a "Copy to Clipboard" utility with instant visual feedback.  
* **Decoupled Architecture:** Built with a modern React frontend and a robust Django REST Framework backend.  

---

## 🛠️ Tech Stack

**Frontend**
* **React (Vite):** Fast, component-based UI development.  
* **Axios:** For robust asynchronous API communication.  
* **React-Markdown:** For rendering complex LLM outputs into clean HTML.  

**Backend**
* **Django & DRF:** Python-based framework for secure and scalable API endpoints.  
* **Groq SDK:** High-speed interface for Llama-based inference.  

---

## 🏁 Getting Started

### 1. Prerequisites
* Python 3.8+  
* Node.js & npm  
* A Groq API Key  

### 2. Clone the Repository
```bash
git clone <your-repository-url>
cd AI-study-assistant
```

### 3. Backend Setup
```bash
# Navigate to api folder (or your backend root)
cd api

# Create a .env file and add your key:
# API_KEY=your_groq_api_key_here

# Run the server
python manage.py runserver
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🔒 Security Note

This project uses a `.gitignore` file to ensure that the `.env` file containing the Groq API key and the local `db.sqlite3` database are never pushed to public version control.

---

## 🗺️ Roadmap

- [x] Integrate Llama 3.3 via Groq  
- [x] Implement Markdown rendering  
- [x] Add "Study Modes" (Quiz, ELI5)  
- [x] Add "Copy to Clipboard" functionality  
- [ ] Deploy to Vercel/Render  