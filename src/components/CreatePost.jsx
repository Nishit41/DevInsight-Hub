import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createPost } from "../api/posts"
import { useState } from "react"
import { RichEditor } from "./RichEditor.jsx"

export const CreatePost = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [contents, setContents] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const queryClient = useQueryClient()

  const createPostMutation = useMutation({
    mutationFn: () => createPost({ title, author, contents, coverImage, tags: ['Full Stack'] }),
    onSuccess: () => {
      queryClient.invalidateQueries(['posts'])
      setTitle('')
      setAuthor('')
      setContents('')
      setCoverImage('')
      setIsOpen(false) // Collapse accordion on success
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createPostMutation.mutate()
  }

  return (
    <div className="glass-card" style={{ padding: '1.25rem 1.75rem' }}>
      {/* Accordion Header */}
      <div 
        onClick={() => setIsOpen(!isOpen)} 
        style={{ 
          cursor: 'pointer', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}
      >
        <h3 className="card-title" style={{ margin: 0 }}>
          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.1em" width="1.1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
          Create New Post
        </h3>
        <span style={{ fontSize: '0.9rem', color: 'var(--accent-purple)', fontWeight: 'bold' }}>
          {isOpen ? 'Collapse ▲' : 'Write Post ▼'}
        </span>
      </div>

      {/* Accordion Content */}
      {isOpen && (
        <form onSubmit={handleSubmit} style={{ marginTop: '1.75rem' }}>
          <div className="form-group">
            <label htmlFor='create-title'>Title</label>
            <input 
              type='text' 
              name='create-title' 
              id='create-title'
              placeholder="Enter post title..."
              value={title}
              onChange={(e)=>setTitle(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor='create-author'>Author Username</label>
            <input 
              type='text' 
              name='create-author' 
              id='create-author' 
              placeholder="Your username..."
              value={author}
              onChange={(e)=>setAuthor(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor='create-image'>Cover Image & Media URL</label>
            <input 
              type='text' 
              name='create-image' 
              id='create-image' 
              placeholder="Paste cover image URL (e.g. Unsplash)..."
              value={coverImage}
              onChange={(e)=>setCoverImage(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Content</label>
            <RichEditor 
              value={contents}
              onChange={(html) => setContents(html)}
              placeholder="Write your story content here. Select text to format as bold, italic, lists, or add links!"
              minHeight="180px"
            />
          </div>
          
          <button 
            type='submit' 
            className="btn-primary"
            style={{ marginTop: '1rem' }}
            disabled={!title || !author || !contents || createPostMutation.isPending}
          >
            {createPostMutation.isPending ? 'Publishing...' : 'Publish Post'}
          </button>
        </form>
      )}

      {createPostMutation.isSuccess ? (
        <div style={{ marginTop: 12, color: '#10b981', fontSize: '0.9rem', fontWeight: 600 }}>
          ✓ Post published successfully!
        </div>
      ) : null}
    </div>
  )
}

