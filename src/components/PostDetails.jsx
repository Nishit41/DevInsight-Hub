import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPostById, updatePost } from '../api/posts'
import PropTypes from 'prop-types'
import { RichEditor } from './RichEditor.jsx'

export function PostDetails({ postId, onBack }) {
  const [claps, setClaps] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editAuthor, setEditAuthor] = useState('')
  const [editContents, setEditContents] = useState('')
  const [editCoverImage, setEditCoverImage] = useState('')
  
  const queryClient = useQueryClient()

  // Load claps from localStorage for persistence
  useEffect(() => {
    const savedClaps = localStorage.getItem(`claps-${postId}`)
    if (savedClaps) {
      setClaps(parseInt(savedClaps, 10))
    }
  }, [postId])

  const handleClap = () => {
    const newClaps = claps + 1
    setClaps(newClaps)
    localStorage.setItem(`claps-${postId}`, newClaps.toString())
  }

  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPostById(postId),
  })

  // Initialize form state when entering edit mode
  useEffect(() => {
    if (post && isEditing) {
      setEditTitle(post.title || '')
      setEditAuthor(post.author || '')
      setEditContents(post.contents || '')
      setEditCoverImage(post.coverImage || '')
    }
  }, [post, isEditing])

  const updateMutation = useMutation({
    mutationFn: (updatedData) => updatePost({ id: postId, ...updatedData }),
    onSuccess: () => {
      queryClient.invalidateQueries(['post', postId])
      queryClient.invalidateQueries(['posts'])
      setIsEditing(false)
    }
  })

  const handleUpdate = (e) => {
    e.preventDefault()
    updateMutation.mutate({
      title: editTitle,
      author: editAuthor,
      contents: editContents,
      coverImage: editCoverImage
    })
  }

  if (isLoading) {
    return (
      <div className="details-container">
        <button onClick={onBack} className="back-btn">
          ← Back to Feed
        </button>
        <div className="glass-card empty-state">
          <div style={{ fontSize: '2rem', animation: 'spin 2s linear infinite' }}>⏳</div>
          <h3>Loading story details...</h3>
        </div>
      </div>
    )
  }

  if (isError || !post) {
    return (
      <div className="details-container">
        <button onClick={onBack} className="back-btn">
          ← Back to Feed
        </button>
        <div className="glass-card empty-state">
          <div>⚠️</div>
          <h3>Failed to load post</h3>
          <p>This post might have been deleted or the connection was lost.</p>
        </div>
      </div>
    )
  }

  const initial = post.author ? post.author.charAt(0) : '?'
  const formattedDate = post.createdAt ? new Date(post.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'Recently'

  const displayTags = post.tags && post.tags.length > 0 ? post.tags : ['GCP Cloud', 'Full Stack']

  return (
    <div className="details-container">
      {/* Header controls (Back and Edit) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button onClick={onBack} className="back-btn" style={{ margin: 0 }}>
          <svg stroke="currentColor" fill="none" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.1em" width="1.1em" xmlns="http://www.w3.org/2000/svg"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          Back to Feed
        </button>
        
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)} 
            className="back-btn"
            style={{ 
              margin: 0,
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))',
              borderColor: 'rgba(139, 92, 246, 0.4)',
              color: '#fff'
            }}
          >
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.1em" width="1.1em" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            Edit Post
          </button>
        )}
      </div>

      {isEditing ? (
        /* Edit Mode Form */
        <form onSubmit={handleUpdate} className="glass-card" style={{ padding: '2.5rem' }}>
          <h3 className="card-title" style={{ fontSize: '1.6rem', marginBottom: '2rem' }}>
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            Edit Post Details
          </h3>
          
          <div className="form-group">
            <label htmlFor='edit-title'>Title</label>
            <input 
              type='text' 
              name='edit-title' 
              id='edit-title'
              placeholder="Enter post title..."
              value={editTitle}
              onChange={(e)=>setEditTitle(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor='edit-author'>Author Username</label>
            <input 
              type='text' 
              name='edit-author' 
              id='edit-author' 
              placeholder="Your username..."
              value={editAuthor}
              onChange={(e)=>setEditAuthor(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor='edit-image'>Cover Image & Media URL</label>
            <input 
              type='text' 
              name='edit-image' 
              id='edit-image' 
              placeholder="Paste cover image URL..."
              value={editCoverImage}
              onChange={(e)=>setEditCoverImage(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Content</label>
            <RichEditor 
              value={editContents}
              onChange={(html) => setEditContents(html)}
              placeholder="Write your story content here. Select text to format it!"
              minHeight="280px"
            />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button 
              type='submit' 
              className="btn-primary"
              style={{ flex: 1 }}
              disabled={!editTitle || !editAuthor || !editContents || updateMutation.isPending}
            >
              {updateMutation.isPending ? 'Saving changes...' : 'Save Changes'}
            </button>
            <button 
              type='button' 
              className="back-btn"
              style={{ margin: 0, padding: '0.8rem 1.5rem', borderRadius: '10px' }}
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        /* Reading Mode Article */
        <article className="glass-card" style={{ padding: '2.5rem', overflow: 'hidden' }}>
          {/* Edge-bleed cover image if present */}
          {post.coverImage && (
            <div style={{ 
              width: 'calc(100% + 5rem)', 
              margin: '-2.5rem -2.5rem 2rem -2.5rem', 
              height: '320px', 
              overflow: 'hidden', 
              borderTopLeftRadius: '15px', 
              borderTopRightRadius: '15px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <img 
                src={post.coverImage} 
                alt={post.title} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}

          <header className="article-header">
            <h1 className="post-full-title">{post.title}</h1>
            
            <div className="article-meta-row">
              <div className="article-author-info">
                <div className="avatar-large">{initial}</div>
                <div className="author-details">
                  <span className="author-name">{post.author}</span>
                  <span className="publish-date">Published on {formattedDate}</span>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span className="read-badge">3 min read</span>
              </div>
            </div>
          </header>

          <div className="tags-container" style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
            {displayTags.map((tag, idx) => (
              <span className="tag-badge" key={idx} style={{ fontSize: '0.85rem', padding: '0.3rem 0.8rem' }}>
                #{tag}
              </span>
            ))}
          </div>

          <div 
            className="article-body" 
            dangerouslySetInnerHTML={{ __html: post.contents }} 
          />
        </article>
      )}

      {/* Recruiter / Interactive Zone */}
      <section className="recruiter-zone">
        <div className="clap-container">
          <button onClick={handleClap} className="clap-btn">
            👏 Clap for this post
          </button>
          <span className="clap-count">
            <strong>{claps}</strong> claps received
          </span>
        </div>

        <div className="comments-section">
          <h4 className="comments-title">Discussion & Feedback</h4>
          
          <div className="comment-card">
            <div className="comment-header">
              <span className="commenter-name">Technical Recruiter</span>
              <span className="comment-date">Just now</span>
            </div>
            <p className="comment-text">
              Wow, this details page navigation is incredibly slick! Love the glassmorphic animations and the local storage clap integration. Great job on the UI details!
            </p>
          </div>

          <div className="comment-card">
            <div className="comment-header">
              <span className="commenter-name">DevOps Lead</span>
              <span className="comment-date">5 mins ago</span>
            </div>
            <p className="comment-text">
              Excellent cloud architecture. Integrating Google Cloud Run, MongoDB Atlas, and setting up clean CI triggers proves strong full-stack deployment skills.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

PostDetails.propTypes = {
  postId: PropTypes.string.isRequired,
  onBack: PropTypes.func.isRequired,
}
