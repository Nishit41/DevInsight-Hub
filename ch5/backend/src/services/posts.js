import { Post } from '../db/models/post.js'
import mongoose from 'mongoose'
import { User } from '../db/models/user.js'
import { createUser } from './user.js'

export async function createPost({ title, author, contents, tags }) {
    if (typeof author === 'string' && !mongoose.Types.ObjectId.isValid(author)) {
      let user = await User.findOne({ username: author })
      if (!user) {
        user = await createUser({ username: author, password: 'password123' })
      }
      author = user._id
    }
    const post = new Post({ title, author, contents, tags })
    const savedPost = await post.save()
    const populated = await savedPost.populate('author')
    const postObj = populated.toObject()
    if (postObj.author && typeof postObj.author === 'object') {
      postObj.author = postObj.author.username
    }
    return postObj
  }

  export async function getPostById(postId) {
    const post = await Post.findById(postId).populate('author')
    if (post) {
      const postObj = post.toObject()
      if (postObj.author && typeof postObj.author === 'object') {
        postObj.author = postObj.author.username
      }
      return postObj
    }
    return null
  }

  async function listPosts(
    query = {},
    { sortBy = 'createdAt', sortOrder = 'descending' } = {},
  ) {
    const posts = await Post.find(query).sort({ [sortBy]: sortOrder }).populate('author')
    return posts.map(post => {
      const postObj = post.toObject()
      if (postObj.author && typeof postObj.author === 'object') {
        postObj.author = postObj.author.username
      }
      return postObj
    })
  }
export async function deletePost(postId) {
  return await Post.findByIdAndDelete(postId);
}

export async function updatePost(postId, updateData) {
    return await Post.updateOne(
      { _id: postId },  
      { $set: updateData } 
    );
}

export async function listAllPosts(options) {
    return await listPosts({}, options)
  }

  export async function listPostsByAuthor(author, options) {
    if (typeof author === 'string' && !mongoose.Types.ObjectId.isValid(author)) {
      const user = await User.findOne({ username: author })
      if (!user) return [] // Return empty if author username does not exist
      author = user._id
    }
    return await listPosts({ author }, options)
  }

  export async function listPostsByTag(tags, options) {
    return await listPosts({ tags }, options)
  }

