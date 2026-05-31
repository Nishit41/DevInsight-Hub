import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createPost } from "../api/posts"
import { useState } from "react"

export const CreatePost = () => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [contents, setContents] = useState('')
  const queryClient = useQueryClient()
  const createPostMutation = useMutation({
    mutationFn: () => createPost({ title, author, contents }),
    onSuccess: () => queryClient.invalidateQueries(['posts']),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createPostMutation.mutate()
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card">
      <h3 className="card-title">
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
        Create New Post
      </h3>
      
      <div className="form-group">
        <label htmlFor='create-title'>Title</label>
        <input 
          type='text' 
          name='create-title' 
          id='create-title'
          placeholder="Enter post title..."
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
          onChange={(e)=>setAuthor(e.target.value)}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor='create-contents'>Content</label>
        <textarea 
          id='create-contents'
          placeholder="Write your story here..."
          value={contents}
          onChange={(e)=>setContents(e.target.value)}
        />
      </div>
      
      <button 
        type='submit' 
        className="btn-primary"
        disabled={!title || !author || createPostMutation.isPending}
      >
        {createPostMutation.isPending ? 'Publishing...' : 'Publish Post'}
      </button>

      {createPostMutation.isSuccess ? (
        <div style={{ marginTop: 12, color: '#10b981', fontSize: '0.9rem', fontWeight: 600 }}>
          ✓ Post published successfully!
        </div>
      ) : null}
    </form>
  )
}
