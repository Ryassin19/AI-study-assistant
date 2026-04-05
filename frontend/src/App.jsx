import axios from 'axios'
import { useState, useEffect } from 'react'
import Markdown from 'react-markdown'

function Ask_ai() {
  const [input, setInput] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleInputChange = e => {
    setInput(e.target.value)
  }

  const handleSummarize = async () => {
    setLoading(true);
    try{
      const response = await axios.post(
      'http://127.0.0.1:8000/api/summarize/', {
        text: input
      });
      setSummary( response.data.summary);
    } catch (error){
      console.error("Error:" , error)
    }
    setLoading(false);  
  }

  return (
    <div>
      <textarea 
        name="input" 
        id="input"
        value={input} 
        onChange={handleInputChange}
        placeholder="Paste your notes here..."
      ></textarea> <br />

      <button onClick={handleSummarize} disabled={loading}>
        {loading ? "Thinking..." : "Summarize"}
        </button>

    {(summary || loading) && (
      <div className="summary-container">
        {loading ? (
          <p>AI is generating your study notes...</p>
        ) : (
          <Markdown>{summary}</Markdown>
        )}
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