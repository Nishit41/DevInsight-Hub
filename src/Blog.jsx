import { useState } from 'react'
import { PostFilter } from './components/PostFilter.jsx'
import { PostSorting } from './components/PostSorting.jsx'
import { useQuery } from '@tanstack/react-query'
import { getPosts } from './api/posts.js'
import { PostList } from './components/PostLists.jsx'
import { CreatePost } from './components/CreatePost.jsx'
import { PostDetails } from './components/PostDetails.jsx'

export function Blog() {
  const [author, setAuthor] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('descending')
  const [selectedPostId, setSelectedPostId] = useState(null)
  
  const postsQuery = useQuery({
    queryKey: ['posts', { author, sortBy, sortOrder }],
    queryFn: () => getPosts({ author, sortBy, sortOrder }),
  })
  const posts = postsQuery?.data || []

  return (
    <div className="app-container">
      <header className="app-header" style={{ marginBottom: '2.5rem' }}>
        <h1 className="app-title" style={{ fontSize: '3.5rem' }}>DevInsight Hub</h1>
        <p className="app-subtitle">A premium space for full-stack developers to share insights and stories</p>
      </header>

      {selectedPostId ? (
        <PostDetails 
          postId={selectedPostId} 
          onBack={() => setSelectedPostId(null)} 
        />
      ) : (
        <div className="dashboard-layout">
          <div className="create-post-section">
            <CreatePost />
          </div>

          <div className="feed-section">
            {/* Linear Search & Filter Bar at the Top of the Feed */}
            <div className="glass-card search-filter-bar">
              <div style={{ flex: '1 1 240px' }}>
                <PostFilter
                  field='author'
                  value={author}
                  onChange={(value) => setAuthor(value)}
                />
              </div>
              
              <div style={{ flex: '2 1 360px' }}>
                <PostSorting
                  fields={['createdAt', 'updatedAt']}
                  value={sortBy}
                  onChange={(value) => setSortBy(value)}
                  orderValue={sortOrder}
                  onOrderChange={(orderValue) => setSortOrder(orderValue)}
                />
              </div>
            </div>

            <PostList posts={posts} onSelectPost={(id) => setSelectedPostId(id)} />
          </div>
        </div>
      )}
    </div>
  )
}
