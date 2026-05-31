import PropTypes from "prop-types"

export const Post=({title,contents,author,tags = [],createdAt})=>{
  const initial = author ? author.charAt(0) : '?'
  const formattedDate = createdAt ? new Date(createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) : 'Recently'

  const displayTags = tags && tags.length > 0 ? tags : ['GCP Cloud', 'Full Stack']

  return(
     <article className="glass-card post-card" style={{ marginBottom: '1.5rem' }}>
       <h2 className="post-title">{title}</h2>
       
       <div className="tags-container">
         {displayTags.map((tag, idx) => (
           <span className="tag-badge" key={idx}>#{tag}</span>
         ))}
       </div>

       <p className="post-contents">{contents}</p>
       
       <div className="post-meta">
         {author && (
           <div className="post-author">
             <div className="avatar">{initial}</div>
             <span>{author}</span>
           </div>
         )}
         <div className="post-date">{formattedDate}</div>
       </div>
     </article>
  )
}

Post.propTypes = {
    title: PropTypes.string.isRequired,
    contents: PropTypes.string,
    author: PropTypes.string,
  }