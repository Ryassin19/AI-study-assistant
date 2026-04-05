import axios from 'axios'
import { useState, useEffect } from 'react'

function App() {
  const [msg, setMsg] = useState("Loading...");

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/hello/')
      .then( 
        response => {setMsg(response.data.message);}
      )
      .catch(error => {setMsg("connection failed");})
  }, []); 

  return (
    <div>
      <h1>AI Study Assistant</h1>
      <p>{msg}</p>
    </div>
  );
}

export default App;