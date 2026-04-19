import axios from 'axios'
import { useState, useEffect } from 'react'
import Markdown from 'react-markdown'

function Ask_ai() {
  const [input, setInput] = useState(""); // Re-added this!
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("summary");
  const [history, setHistory] = useState([]);
  const [copied, setCopied] = useState(false);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/upload/');
      setHistory(response.data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleProcess = async () => {
      setLoading(true);
      try {
          let response;
          // Logic: If there is a file, use FormData. Otherwise, use JSON text.
          if (file) {
              const formData = new FormData();
              formData.append('file', file);
              formData.append('mode', mode);
              
              response = await axios.post('http://127.0.0.1:8000/api/upload/', formData, {
                  headers: { 'Content-Type': 'multipart/form-data' }
              });
          } else {
              response = await axios.post('http://127.0.0.1:8000/api/summarize/', {
                  text: input,
                  mode: mode
              });
          }

          setSummary(response.data.summary);
          fetchHistory(); 
          setFile(null); // Clear file after upload
      } catch (error) {
          console.error("Processing Error:", error);
      }
      setLoading(false);
  };

  const getModeStyle = (targetMode) => ({
    backgroundColor: mode === targetMode ? "#646cff" : "#333",
    padding: "8px 16px",
    margin: "5px",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    fontWeight: mode === targetMode ? "bold" : "normal",
    border: "1px solid #555"
  });

  return (
    <div className="main-layout" style={{ display: 'flex', gap: '20px', minHeight: '80vh' }}>
      
      {/* SIDEBAR */}
      <div className="sidebar" style={{ width: '250px', borderRight: '1px solid #444', paddingRight: '20px', textAlign: 'left' }}>
        <h3>History</h3>
        <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            {history.map(doc => (
            <div 
                key={doc.id} 
                onClick={() => setSummary(doc.summary)}
                style={{ 
                padding: '10px', cursor: 'pointer', borderBottom: '1px solid #333',
                fontSize: '0.85rem', color: '#ccc', background: '#222', marginBottom: '5px', borderRadius: '5px'
                }}
            >
                <strong>{doc.title || "Untitled"}</strong>
                <div style={{fontSize: '0.7rem', color: '#777'}}>{new Date(doc.uploaded_at).toLocaleDateString()}</div>
            </div>
            ))}
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="content" style={{ flex: 1, textAlign: 'left' }}>
        <div className="mode-selection" style={{ marginBottom: '20px' }}>
          <button onClick={() => setMode("summary")} style={getModeStyle("summary")}>Summary</button>
          <button onClick={() => setMode("quiz")} style={getModeStyle("quiz")}>Quiz</button>
          <button onClick={() => setMode("eli5")} style={getModeStyle("eli5")}>ELI5</button>
        </div>

        {/* Option 1: Text Input */}
        <textarea 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your notes here..."
            style={{ width: '100%', height: '100px', background: '#1a1a1a', color: 'white', padding: '10px', borderRadius: '8px', border: '1px solid #444' }}
        />

        <div style={{ margin: '20px 0', padding: '15px', border: '1px dashed #555', borderRadius: '8px' }}>
          <label style={{ fontSize: '0.8rem', color: '#aaa' }}>Or upload a PDF:</label><br />
          <input type="file" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} style={{ marginTop: '10px' }} />
        </div>

        <button 
            onClick={handleProcess} 
            disabled={loading || (!input && !file)}
            style={{ width: '100%', padding: '12px', background: '#646cff', fontWeight: 'bold' }}
        >
          {loading ? "AI is Thinking..." : `Generate ${mode.charAt(0).toUpperCase() + mode.slice(1)}`}
        </button>

        {summary && (
          <div className="summary-container" style={{ marginTop: '30px', background: '#111', padding: '25px', borderRadius: '10px', border: '1px solid #333' }}>
            <Markdown>{summary}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  return (
    <div className="App" style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>AI Study Assistant v2</h1>
      <Ask_ai />
    </div>
  );
}

export default App;