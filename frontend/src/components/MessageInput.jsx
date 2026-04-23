import React from 'react';

const MessageInput = ({ input, setInput, handleAsk, loading, activeDoc }) => {
  return (
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
            <button onClick={handleAsk} disabled={loading} style={{ width: '100%', marginTop: '10px' }}>
                {loading ? "Thinking..." : "Send to AI"}
            </button>
        </div>
  );
};

export default MessageInput;