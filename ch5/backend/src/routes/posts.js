import {
    listAllPosts,
    listPostsByAuthor,
    listPostsByTag,
    getPostById,
    updatePost,
    createPost,
    deletePost
} from '../services/posts.js'

  export function postsRoutes(app) {
    app.get('/api/v1/posts', async (req, res) => {
        const { sortBy, sortOrder, author, tag } = req.query
        const options = { sortBy, sortOrder }
        try {
            if (author && tag) {
                return res
                  .status(400)
                  .json({ error: 'query by either author or tag, not both' })
            }
            else if (author) {
                return res.json(await listPostsByAuthor(author, options))
              } else if (tag) {
                return res.json(await listPostsByTag(tag, options))
              } else {
                return res.json(await listAllPosts(options))
              }
            } catch (err) {
              console.error('error listing posts', err)
              return res.status(500).end()
            }
          })

       app.get('/api/v1/posts/:id', async (req,res)=>{
        const {id} = req.params
        try{
            const post = await getPostById(id);
            if(post === null) return res.status(404).end();
            return res.json(post)
        } catch (err) {
          console.error('error getting post', err)
          return res.status(500).end()
        }    
       })
       
       app.post('/api/v1/posts', async (req, res) => {
        try {
          const post = await createPost(req.body)
          return res.json(post)
        } catch (err) {
          console.error('error creating post', err)
          return res.status(500).end()
        }
      })

      app.patch('/api/v1/posts/:id', async (req, res) => {
        try {
          const post = await updatePost(req.params.id, req.body)
          return res.json(post)
        } catch (err) {
          console.error('error updating post', err)
          return res.status(500).end()
        }
      })

      app.delete('/api/v1/posts/:id', async (req, res) => {
        try {
          const deletedPost = await deletePost(req.params.id);
      
          if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
          }
      
          return res.status(200).json({ message: 'Post deleted' });
        } catch (err) {
          console.error(err);
          return res.status(500).json({ message: 'Delete failed' });
        }
    })
  }

