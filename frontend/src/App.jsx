import axios from 'axios'
import { useState, useEffect, useRef } from 'react' 
import Sidebar from './components/Sidebar';
import ChatWindow from './components/Chatwindow';
import MessageInput from './components/MessageInput'

function Ask_ai() {
  const [input, setInput] = useState(""); 
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState(""); 
  const [messages, setMessages] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [activeDoc, setActiveDoc] = useState(null); 

  const fetchHistory = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/upload/');
      if (Array.isArray(response.data)) {
        setHistory(response.data);
      } else {
        console.error("Backend didn't return an array:", response.data);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
      scrollToBottom();
  }, [messages]);

  useEffect(() => { fetchHistory(); }, []);

  // 1. HANDLE UPLOAD (Calls DocumentUploadView)
  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/upload/', formData);
      
      await fetchHistory(); 

      // Only set activeDoc if the response actually gave us the new doc data
      if (response.data && response.data.id) {
        setActiveDoc(response.data);
        setSummary(response.data.summary || "");
      }
      
      setFile(null);
    } catch (e) {
      console.error("Upload Error:", e);
    }  
    setLoading(false);
    
  };

  // 2. HANDLE ASK (Calls ask_ai endpoint with RAG)
  const handleAskQuestion = async () => {
      if (!input) return;
      setLoading(true);

      let docIdToUse = activeDoc?.id;

      //If a file is waiting in the 'file' state, upload it first
      if (file && !activeDoc) {
          try {
              const formData = new FormData();
              formData.append('file', file);
              const uploadRes = await axios.post('http://127.0.0.1:8000/api/upload/', formData);
              
              docIdToUse = uploadRes.data.id || null; 

              setActiveDoc(uploadRes.data);
              await fetchHistory();
              setFile(null); 
          } catch (err) {
              alert("Upload failed");
              setLoading(false);
              return;
          }
      }
      // Send the chat request using docIdToUse
      // If no file was uploaded/no doc was active, docIdToUse stays 'undefined/null'
      try {
          const response = await axios.post('http://127.0.0.1:8000/api/summarize/', {
              text: input,
              doc_id: docIdToUse, 
              messages: messages,
          });
          
          setMessages(prev => [...prev, 
              { role: 'user', content: input }, 
              { role: 'ai', content: response.data.answer }
          ]);
          setInput(""); 
      } catch (error) {
          console.error(error);
      }
      setLoading(false);
  };

  const selectDoc = (doc) => {
    setActiveDoc(doc);
    setSummary(doc.summary);
    setMessages([]); 
  };

  const handleDelete = async (e, id) => {
      e.stopPropagation(); 
      if (!window.confirm("Are you sure you want to delete this document?")) return;

      try {
          await axios.delete(`http://127.0.0.1:8000/api/upload/${id}/`);
          fetchHistory(); 
          if (activeDoc?.id === id) {
              setActiveDoc(null);
              setSummary("");
              setMessages([]);
          }
      } catch (err) {
          console.error("Failed to delete:", err);
          alert("Could not delete file.");
      }
  };

  const startNewChat = () => {
    setActiveDoc(null);
    setSummary("");
    setMessages([]);
    setInput("");
  };

  return (
    <div className="main-layout" style={{ 
      display: 'flex', 
      height: '100vh', 
      width: '100vw',
      overflow: 'hidden', 
      backgroundColor: '#121212' 
    }}>
      
      <Sidebar 
        history={history}
        activeDoc={activeDoc}
        selectDoc={selectDoc}
        handleDelete={handleDelete}
        startNewChat={startNewChat}
      />

      {/* 2. MAIN AREA */}
      <div className="content" style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%' 
      }}>
        
        <ChatWindow 
          activeDoc={activeDoc}
          summary={summary}
          messages={messages}
          loading={loading}
          messagesEndRef={messagesEndRef}
          file={file}
          setFile={setFile}
          handleUpload={handleUpload}
        />

        <MessageInput 
          input={input}
          setInput={setInput}
          handleAsk={handleAskQuestion} 
          loading={loading}
          activeDoc={activeDoc}
        />       

      </div>
    </div>
  );
}

function App() {
  return (
    <div className="App" style={{ width: '100vw', height: '100vh' }}>
      <Ask_ai />
    </div>
  );
}

export default App;