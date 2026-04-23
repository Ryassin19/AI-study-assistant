# 🎓 AI Architect: RAG-Powered Study Assistant (v2)

A full-stack Retrieval-Augmented Generation (RAG) application designed to turn static PDF lecture notes into dynamic, searchable knowledge bases. Unlike standard AI chatbots, this system "grounds" its responses in specific document excerpts to ensure academic integrity and eliminate hallucinations.

---

## 🚀 Evolution: What's New in V2?

While V1 focused on simple text processing, **V2 introduces a complete RAG Pipeline**:
* **Vector Embeddings:** Uses `all-MiniLM-L6-v2` to transform text into high-dimensional semantic vectors.
* **Semantic Search:** Integrated **ChromaDB** to perform similarity searches, retrieving the most relevant "context chunks" before the AI even speaks.
* **Service-Oriented Architecture:** Completely refactored backend with a dedicated Service Layer to decouple AI logic from API endpoints.
* **Modular Component UI:** A rewritten React frontend using a professional "Sidebar + Workspace" layout for managing multiple documents.

---

## 🛠️ Tech Stack

**The RAG Engine**
* **Vector Store:** ChromaDB (Local Persistent Storage)
* **Embeddings:** HuggingFace Transformers
* **LLM:** Llama 3.3 (70B) via Groq Cloud (Ultra-low latency inference)
* **Orchestration:** LangChain (Text splitting and vector management)

**Full-Stack Framework**
* **Backend:** Django REST Framework (Python)
* **Frontend:** React (Vite) + Markdown Support
* **Security:** Environment-based credential management via `python-dotenv`

---

## 🗺️ System Architecture

1. **Ingestion:** PDF text is extracted and split into 1,000-character chunks with semantic overlap.
2. **Indexing:** Chunks are vectorized and stored in a document-specific collection in ChromaDB.
3. **Retrieval:** When a user asks a question, the system finds the top 3 most relevant excerpts.
4. **Augmentation:** The LLM receives the prompt: *"Answer based ONLY on this context: [Excerpts]"*.

---

## 🚥 Getting Started

### 1. Prerequisites
* Python 3.10+
* Node.js & npm
* Groq API Key

### 2. Installation & Setup

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# Create a .env file with: API_KEY, DJANGO_SECRET_KEY, and DJANGO_DEBUG=True
python manage.py migrate
python manage.py runserver
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 🔒 Security & Best Practices

* **Credential Masking:** `.env` and `db.sqlite3` are strictly excluded from version control.
* **Data Privacy:** Local vector database storage (`chroma_db/`) is git-ignored to prevent accidental upload of processed document data.
* **CORS Policy:** Configured for seamless local development between React (5173) and Django (8000).

---

*Developed to demonstrate proficiency in RAG architecture, vector databases, and full-stack AI integration.*

---
