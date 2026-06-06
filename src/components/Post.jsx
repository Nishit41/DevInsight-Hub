import PropTypes from "prop-types"

export const Post=({_id,title,contents,author,tags = [],createdAt,coverImage,onSelect})=>{
  const initial = author ? author.charAt(0) : '?'
  const formattedDate = createdAt ? new Date(createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) : 'Recently'

  const displayTags = tags && tags.length > 0 ? tags : ['GCP Cloud', 'Full Stack']

  return(
     <article 
       className="glass-card post-card" 
       style={{ marginBottom: '1.5rem', padding: '0', overflow: 'hidden' }}
       onClick={() => onSelect && onSelect(_id)}
     >
       {coverImage && (
         <div style={{ width: '100%', height: '180px', overflow: 'hidden', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
           <img 
             src={coverImage} 
             alt={title} 
             style={{ width: '100%', height: '100%', objectFit: 'cover' }}
             onError={(e) => { e.target.style.display = 'none'; }}
           />
         </div>
       )}

       <div style={{ padding: '1.75rem' }}>
         <h2 className="post-title">{title}</h2>
         
         <div className="tags-container">
           {displayTags.map((tag, idx) => (
             <span className="tag-badge" key={idx}>#{tag}</span>
           ))}
         </div>

         <p className="post-contents">
           {contents && contents.length > 220 ? `${contents.substring(0, 220)}...` : contents}
         </p>
         
         <div className="post-meta">
           {author && (
             <div className="post-author">
               <div className="avatar">{initial}</div>
               <span>{author}</span>
             </div>
           )}
           <div className="post-date">{formattedDate}</div>
         </div>
       </div>
     </article>
  )
}

Post.propTypes = {
    _id: PropTypes.string,
    title: PropTypes.string.isRequired,
    contents: PropTypes.string,
    author: PropTypes.string,
    coverImage: PropTypes.string,
    onSelect: PropTypes.func,
  }