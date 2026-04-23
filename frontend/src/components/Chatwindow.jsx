import React from 'react';
import Markdown from "react-markdown";

const ChatWindow = ({ 
  activeDoc, 
  summary, 
  messages, 
  loading, 
  messagesEndRef, 
  setFile, 
  handleUpload, 
  file 
}) => {
  return (
    <div style={{ 
      flex: 1, 
      overflowY: 'auto', 
      padding: '40px',
      position: 'relative'
    }}>
      <h1>AI Study Assistant v2</h1>
      
      {/* 1. UPLOAD SECTION */}
      <div style={{ 
          padding: '15px', 
          background: '#222', 
          borderRadius: '8px', 
          marginBottom: '20px',
          border: '1px solid #333' 
      }}>
          <input 
            type="file" 
            onChange={(e) => setFile(e.target.files[0])} 
            style={{ color: '#888' }}
          />
          <button 
            onClick={handleUpload} 
            disabled={!file || loading}
            style={{ marginLeft: '10px' }}
          >
            {loading ? "Uploading..." : "Upload & Index"}
          </button>
      </div>

      {/* 2. SUMMARY BOX */}
      {activeDoc && activeDoc.title ? (
        <div style={{ background: '#1a1a1a', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
          <h4>Overview: {activeDoc.title.replace(".pdf", "")}</h4>
          <Markdown>{summary}</Markdown>
        </div>
      ) : (
        <div style={{color: '#666', marginBottom: '20px'}}>
            Select or upload a document to see the summary...
        </div>
      )}

      {/* 3. CHAT MESSAGES */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {messages.map((msg, index) => (
          <div 
            key={index} 
            style={{ 
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%',
              padding: '15px',
              borderRadius: '12px',
              background: msg.role === 'user' ? '#646cff' : '#1a1a1a',
              color: 'white',
              border: msg.role === 'ai' ? '1px solid #333' : 'none'
            }}
          >
            <strong style={{ fontSize: '0.7rem', display: 'block', marginBottom: '5px', opacity: 0.7 }}>
              {msg.role === 'user' ? 'YOU' : 'AI'}
            </strong>
            <Markdown>{msg.content}</Markdown>
          </div>
        ))}

        {loading && (
          <div style={{ alignSelf: 'flex-start', color: '#646cff', fontSize: '0.9rem' }}>
            ⏳ AI is thinking...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatWindow;