import axios from 'axios'
import { useState, useEffect } from 'react'
import Markdown from 'react-markdown'

function Ask_ai() {
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("summary")
  const [copied, setCopied] = useState(false)

  function copyToClipboard(summary){
    navigator.clipboard.writeText(summary);
    setCopied(true);
  }
  
  const getModeStyle = (targetMode) => ({
    backgroundColor: mode === targetMode ? "#646cff" : "#333",
    padding: "8px 16px",
    margin: "5px",
    borderRadius: "8px",
    border: "1px solid #555",
    color: "white",
    cursor: "pointer",
    fontWeight: mode === targetMode ? "bold" : "normal",
    transition: "0.2s"
  });
  
  const handleInputChange = e => {
    setInput(e.target.value)
  }

  const handleSummarize = async () => {
    setLoading(true);
    try{
      const response = await axios.post(
      'http://127.0.0.1:8000/api/summarize/', {
        text: input,
        mode: mode
      });
      setSummary( response.data.summary);
    } catch (error){
      console.error("Error:" , error)
    }
    setLoading(false);  
  }

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer); 
    }
  }, [copied]);

  return (
    <div>
      <div className="mode-selection">
        <button 
          onClick={() => setMode("summary")}
          style={getModeStyle("summary")}
        >
          Summary
        </button>
        
        <button 
          onClick={() => setMode("quiz")}
          style={getModeStyle("quiz")}        
        >
          Quiz
        </button>
        
        <button 
          onClick={() => setMode("eli5")}
          style={getModeStyle("eli5")}        
        >
          ELI5
        </button>
      </div>

      <textarea 
        name="input" 
        id="input"
        value={input} 
        onChange={handleInputChange}
        placeholder="Put your notes or questions here..."
      ></textarea> <br />

      <button onClick={handleSummarize} disabled={loading}>
        {loading ? "Thinking..." : `Generate ${mode.charAt(0).toUpperCase() + mode.slice(1)}`}
      </button>

      {(summary || loading) && (
        <div className="summary-container">
          {loading ? (
            <p>AI is generating your study notes...</p>
          ) : (
            <Markdown>{summary}</Markdown>
          )}
          <
            button onClick={() => copyToClipboard(summary)}
            style={{ fontSize: '0.7rem', padding: '4px 8px', marginBottom: '10px' }}
          >
            {copied ? "Copied! ✅" : "Copy to Clipboard"}
          </button>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <h1>AI Study Assistant</h1>
      <Ask_ai />
    </div>
  );
}

export default App;