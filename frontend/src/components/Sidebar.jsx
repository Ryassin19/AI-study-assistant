import React from 'react';

const Sidebar = ({ history, activeDoc, selectDoc, handleDelete, startNewChat }) => {
  return (
    <div className="sidebar" style={{ 
      width: '260px', 
      height: '100vh', 
      overflowY: 'auto', 
      padding: '15px',
      backgroundColor: '#1a1a1a',
      borderRight: '1px solid #333',
      flexShrink: 0,      
      display: 'flex',          
      flexDirection: 'column',   
      position: 'relative',
      boxSizing: 'border-box'
    }}>
      {/* New Chat Button */}
      <button 
        onClick={startNewChat}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#333',
          color: 'white',
          border: '1px dashed #555',
          borderRadius: '8px',
          marginBottom: '20px',
          cursor: 'pointer',
          fontWeight: 'bold',
          flexShrink: 0,
        }}
      >
        + New Chat
      </button>

      <h3>Your Library</h3>

      {/* Document List */}
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
            display: 'flex',          
            alignItems: 'center',     
            justifyContent: 'space-between', 
            gap: '10px'                
          }}
        >
          <strong style={{ 
            fontSize: '0.9rem', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap',
            flex: 1                  
          }}>
            {doc.title.replace('.pdf', '')}
          </strong>

          {/* Delete Button */}
          <button 
            onClick={(e) => handleDelete(e, doc.id)}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#ff4d4d', 
              cursor: 'pointer', 
              fontWeight: 'bold', 
              fontSize: '1.1rem',
              flexShrink: 0,       
              padding: '0 5px'
            }}
          >
            🗑️
          </button>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;