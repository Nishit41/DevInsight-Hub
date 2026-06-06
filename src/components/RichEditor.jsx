import { useRef, useEffect } from 'react'

export const RichEditor = ({ value, onChange, placeholder, minHeight = '180px' }) => {
  const editorRef = useRef(null)

  // Sync initial value once on mount or when editor is empty but value exists
  useEffect(() => {
    if (editorRef.current && value && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const executeCommand = (command, val = null) => {
    document.execCommand(command, false, val)
    handleInput()
  }

  const handleAddLink = () => {
    const url = prompt('Enter link URL (e.g. https://google.com):')
    if (url) {
      executeCommand('createLink', url)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* WYSIWYG Toolbar */}
      <div style={{ 
        display: 'flex', 
        gap: '0.4rem', 
        background: 'rgba(0,0,0,0.25)', 
        border: '1px solid rgba(255,255,255,0.08)',
        borderBottom: 'none',
        padding: '0.5rem 0.75rem', 
        borderTopLeftRadius: '10px', 
        borderTopRightRadius: '10px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <button 
          type="button" 
          onClick={() => executeCommand('bold')} 
          style={{ background: 'transparent', border: 'none', color: '#fff', padding: '0.2rem 0.5rem', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }} 
          title="Bold"
        >
          B
        </button>
        <button 
          type="button" 
          onClick={() => executeCommand('italic')} 
          style={{ background: 'transparent', border: 'none', color: '#fff', padding: '0.2rem 0.5rem', cursor: 'pointer', fontStyle: 'italic', fontSize: '0.9rem' }} 
          title="Italic"
        >
          I
        </button>
        <button 
          type="button" 
          onClick={() => executeCommand('underline')} 
          style={{ background: 'transparent', border: 'none', color: '#fff', padding: '0.2rem 0.5rem', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.9rem' }} 
          title="Underline"
        >
          U
        </button>
        <div style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.15)', margin: '0 0.25rem' }}></div>
        <button 
          type="button" 
          onClick={() => executeCommand('insertUnorderedList')} 
          style={{ background: 'transparent', border: 'none', color: '#fff', padding: '0.2rem 0.5rem', cursor: 'pointer', fontSize: '0.9rem' }} 
          title="Bullet List"
        >
          • List
        </button>
        <button 
          type="button" 
          onClick={() => executeCommand('insertOrderedList')} 
          style={{ background: 'transparent', border: 'none', color: '#fff', padding: '0.2rem 0.5rem', cursor: 'pointer', fontSize: '0.9rem' }} 
          title="Numbered List"
        >
          1. List
        </button>
        <button 
          type="button" 
          onClick={handleAddLink} 
          style={{ background: 'transparent', border: 'none', color: '#60a5fa', padding: '0.2rem 0.5rem', cursor: 'pointer', fontSize: '0.9rem' }} 
          title="Add Link"
        >
          🔗 Link
        </button>
        <button 
          type="button" 
          onClick={() => executeCommand('removeFormat')} 
          style={{ background: 'transparent', border: 'none', color: '#ef4444', padding: '0.2rem 0.5rem', cursor: 'pointer', fontSize: '0.8rem' }} 
          title="Clear Formatting"
        >
          ✕ Clear
        </button>
      </div>

      {/* Editor Content Area */}
      <div
        ref={editorRef}
        contentEditable={true}
        onInput={handleInput}
        className="wysiwyg-editor"
        style={{
          minHeight: minHeight,
          background: 'rgba(0, 0, 0, 0.2)',
          border: '1px solid var(--glass-border)',
          borderTop: 'none',
          borderBottomLeftRadius: '10px',
          borderBottomRightRadius: '10px',
          padding: '0.75rem 1rem',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-body)',
          fontSize: '0.95rem',
          outline: 'none',
          overflowY: 'auto',
          wordBreak: 'break-word',
          lineHeight: '1.6'
        }}
        placeholder={placeholder}
      />
    </div>
  )
}
