import os, fitz, io
from openai import OpenAI
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

client = OpenAI(
    api_key=os.getenv("API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

def get_ai_response(instruction, user_input):
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": instruction},
            {"role": "user", "content": user_input}
        ]
    )
    return response.choices[0].message.content

def process_and_index_pdf(file_obj, doc_id):
    """Extracts text, splits into chunks, and stores in ChromaDB."""
    extracted_text = ""
    file_obj.seek(0)
    with fitz.open(stream=io.BytesIO(file_obj.read()), filetype="pdf") as pdf:
        for page in pdf:
            extracted_text += page.get_text()

    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    chunks = text_splitter.split_text(extracted_text)

    Chroma.from_texts(
        texts=chunks,
        embedding=embeddings, 
        persist_directory="./chroma_db",
        collection_name=f"doc_{doc_id}" 
    )
    return chunks

def get_vector_db(doc_id):
    """Helper to retrieve a specific document's collection."""
    return Chroma(
        persist_directory="./chroma_db", 
        embedding_function=embeddings,
        collection_name=f"doc_{doc_id}"
    )