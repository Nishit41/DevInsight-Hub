import { useState } from 'react'
import { PostFilter } from './components/PostFilter.jsx'
import { PostSorting } from './components/PostSorting.jsx'
import { useQuery } from '@tanstack/react-query'
import { getPosts } from './api/posts.js'
import { PostList } from './components/PostLists.jsx'
import { CreatePost } from './components/CreatePost.jsx'

export function Blog() {
  const [author, setAuthor] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('descending')
  
  const postsQuery = useQuery({
    queryKey: ['posts', { author, sortBy, sortOrder }],
    queryFn: () => getPosts({ author, sortBy, sortOrder }),
  })
  const posts = postsQuery?.data || []

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="badge">
          <span className="badge-dot"></span>
          Enterprise Cloud Demo
        </div>
        <h1 className="app-title">Modern Full-Stack Blog</h1>
        <p className="app-subtitle">Powered by GCP Cloud Run, MongoDB Atlas & React</p>
      </header>

      <div className="dashboard-grid">
        <div className="sidebar">
          <CreatePost />
          
          <div className="glass-card">
            <h3 className="card-title">
              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              Search & Filter
            </h3>
            <PostFilter
              field='author'
              value={author}
              onChange={(value) => setAuthor(value)}
            />
            <br />
            <PostSorting
              fields={['createdAt', 'updatedAt']}
              value={sortBy}
              onChange={(value) => setSortBy(value)}
              orderValue={sortOrder}
              onOrderChange={(orderValue) => setSortOrder(orderValue)}
            />
          </div>
        </div>

        <div className="main-content">
          <PostList posts={posts} />
        </div>
      </div>
    </div>
  )
}
