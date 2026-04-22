import axios from 'axios'
import { useState, useEffect } from 'react'
import Markdown from 'react-markdown'

function Ask_ai() {
  const [input, setInput] = useState(""); 
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState(""); // This will show the "Static Summary"
  const [chatAnswer, setChatAnswer] = useState(""); // This will show "Chat/RAG responses"
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("summary");
  const [history, setHistory] = useState([]);
  const [activeDoc, setActiveDoc] = useState(null); // The "Selected" PDF

  const fetchHistory = async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/upload/');
    // Check: Is response.data actually an array? 
    if (Array.isArray(response.data)) {
      setHistory(response.data);
    } else {
      console.error("Backend didn't return an array:", response.data);
    }
  } catch (error) {
    console.error("Failed to fetch history:", error);
  }
};

  useEffect(() => { fetchHistory(); }, []);

  // 1. HANDLE UPLOAD (Calls DocumentUploadView)
  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/upload/', formData);
      
      // IMPORTANT: Wait for the refresh to finish
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
    try {
        const response = await axios.post('http://127.0.0.1:8000/api/summarize/', {
            text: input,
            doc_id: activeDoc ? activeDoc.id : null, // The "Switch"
            mode: mode
        });
        setChatAnswer(response.data.answer);
        setInput(""); // Clear question box
    } catch (error) { console.error("Chat Error:", error); }
    setLoading(false);
  };

  const selectDoc = (doc) => {
    setActiveDoc(doc);
    setSummary(doc.summary);
    setChatAnswer(""); 
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
              setChatAnswer("");
          }
      } catch (err) {
          console.error("Failed to delete:", err);
          alert("Could not delete file.");
      }
  };

  return (
    <div className="main-layout" style={{ 
      display: 'flex', 
      height: '100vh', 
      width: '100vw',
      overflow: 'hidden', 
      backgroundColor: '#121212' 
    }}>
      
      {/* 1. SIDEBAR (Remains Fixed) */}
      <div className="sidebar" style={{ 
        width: '260px', 
        height: '100%', 
        overflowY: 'auto', 
        padding: '20px',
        backgroundColor: '#1a1a1a',
        borderRight: '1px solid #333'
      }}>
        <button onClick={() => {setActiveDoc(null);setSummary("");setChatAnswer("");setInput("");}}
            style={{width: '100%',padding: '12px',backgroundColor: '#333',color: 'white',border: '1px dashed #555',borderRadius: '8px',marginBottom: '20px',cursor: 'pointer',fontWeight: 'bold'}}
          >
            + New Chat
          </button>
          <h3>Your Library</h3>
          {history.map(doc => (
              <div 
                  key={doc.id} 
                  onClick={() => selectDoc(doc)}
                  style={{ 
                      padding: '10px 12px', 
                      cursor: 'pointer', 
                      marginBottom: '10px', 
                      borderRadius: '8px',
                      background: activeDoc?.id === doc.id ? '#646cff' : '#222',
                      display: 'flex',          // 1. Keep them on one line
                      alignItems: 'center',      // 2. Center them vertically
                      justifyContent: 'space-between', // 3. Push title left, button right
                      gap: '10px'                // 4. Force a gap between them
                  }}
              >
                  <strong style={{ 
                      fontSize: '0.9rem', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap',
                      flex: 1                   // 5. This tells the title it's allowed to shrink!
                  }}>
                      {doc.title.replace('.pdf', '')}
                  </strong>

                  <button 
                      onClick={(e) => handleDelete(e, doc.id)}
                      style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: '#ff4d4d', 
                          cursor: 'pointer', 
                          fontWeight: 'bold', 
                          fontSize: '1.1rem',
                          flexShrink: 0,        // 6. This tells the button NEVER to shrink
                          padding: '0 5px'
                      }}
                  >
                      🗑️
                  </button>
              </div>
          ))}
      </div>

      {/* 2. MAIN AREA */}
      <div className="content" style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%' 
      }}>
        
        {/* AREA A: SCROLLABLE CONTENT (Summary, Upload, Answers) */}
        <div style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '40px' 
        }}>

            <h1>AI Study Assistant v2</h1>
            
            {/* Upload Box */}
            <div style={{ padding: '15px', background: '#222', borderRadius: '8px', marginBottom: '20px' }}>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                <button onClick={handleUpload} disabled={!file || loading}>Upload & Index</button>
            </div>

            {/* Summary Box */}
            {activeDoc && activeDoc.title ? (
              <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
                <h4>Overview: {activeDoc.title.replace(".pdf", "")}</h4>
                <Markdown>{summary}</Markdown>
              </div>
            ) : (
              <div style={{color: '#666'}}>Select or upload a document to see the summary...</div>
            )}

            {/* AI Answer Display */}
            {chatAnswer && (
              <div style={{ marginTop: '20px', background: '#1a1a1a', padding: '20px', borderRadius: '10px' }}>
                <Markdown>{chatAnswer}</Markdown>
              </div>
            )}
        </div>

        {/* AREA B: FIXED BOTTOM INPUT (Always visible) */}
        <div style={{ 
            padding: '20px', 
            borderTop: '1px solid #333', 
            background: '#121212' 
        }}>
            <textarea 
                value={input} 
                onChange={(e) => setInput(e.target.value)}
                placeholder={activeDoc ? "Ask a question about this file..." : "Ask a general question..."}
                style={{ 
                    width: '100%', height: '60px', background: '#1a1a1a', color: 'white', 
                    padding: '10px', borderRadius: '8px', border: '1px solid #444'
                }}
            />
            <button onClick={handleAskQuestion} disabled={loading} style={{ width: '100%', marginTop: '10px' }}>
                {loading ? "Thinking..." : "Send to AI"}
            </button>
        </div>

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

