# 🎓 AI Study Assistant

A high-performance, full-stack web application that transforms complex study notes into structured, readable summaries using state-of-the-art Large Language Models.

---

## 🚀 Key Features

* **AI-Powered Summarization:** Leverages the **Llama 3.3 (70B)** model via the Groq Cloud API for near-instant, high-quality text analysis.
* **Rich Markdown Rendering:** Automatically formats AI output with bold headers, bullet points, and clear spacing for maximum readability.
* **Dynamic UX:** Integrated "Thinking..." loading states provide immediate visual feedback during API calls.
* **Responsive Design System:** A professional CSS architecture featuring a custom dark-mode-first aesthetic and fluid typography.
* **Secure Architecture:** Implements a decoupled frontend (React/Vite) and backend (Django REST Framework) with environment variable protection.

---

## 🛠️ Tech Stack

### Frontend
* **React (Vite):** Modern, fast frontend framework.
* **Axios:** For robust asynchronous API communication.
* **React-Markdown:** For rendering complex LLM outputs into clean HTML.
* **CSS3:** Custom variables and a modular design system.

### Backend
* **Django:** Robust Python-based web framework.
* **Django REST Framework (DRF):** To handle API endpoints and JSON serialization.
* **Groq SDK:** High-speed interface for Llama-based inference.

---

## 📦 Installation & Local Setup

### 1. Prerequisites
* Python 3.8+
* Node.js & npm
* A Groq API Key ([Get one here](https://console.groq.com/))

### 2. Clone the Repository
```bash
git clone <your-repository-url>
cd AI-study-assistant
```

### 3. Backend Configuration
```bash
# Navigate to backend and create virtual environment
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
# Create a .env file and add:
# API_KEY=your_groq_api_key_here

# Run the server
python manage.py runserver
```

### 4. Frontend Configuration
```bash
# Open a new terminal window
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

---

## 🔒 Security Note
This project uses a `.gitignore` file to ensure that the `.env` file containing the Groq API key and the `db.sqlite3` database are never pushed to public version control. 

## 🗺️ Roadmap
- [x] Integrate Llama 3.3 via Groq
- [x] Implement Markdown rendering
- [ ] Add "Study Modes" (Quiz, ELI5, Flashcards)
- [ ] Add "Copy to Clipboard" functionality
- [ ] Deploy to Vercel/Render

---
*Created by Rami Yassin as a Full-Stack Software Engineering Project.*