import { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Post } from './Post.jsx'

export const PostList=({ posts = [] })=>{
    if (!posts || posts.length === 0) {
      return (
        <div className="glass-card empty-state">
          <div className="empty-state-icon">✍️</div>
          <h3 style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 600 }}>No stories found</h3>
          <p style={{ color: '#9ca3af', fontSize: '0.95rem' }}>Be the first to publish a story on this blog!</p>
        </div>
      )
    }

    return (
        <div className="post-feed">
          {posts.map((post) => (
            <Post {...post} key={post._id} />
          ))}
        </div>
      )
}