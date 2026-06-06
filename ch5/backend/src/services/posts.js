import mongoose from 'mongoose'
import { Post } from '../db/models/post.js'
import { User } from '../db/models/user.js'
import { createUser } from './user.js'

// Create a new post, resolving the author's username to an ObjectId
export async function createPost({ title, author, contents, tags, coverImage, attachment }) {
  if (typeof author === 'string' && !mongoose.Types.ObjectId.isValid(author)) {
    let user = await User.findOne({ username: author })
    if (!user) {
      user = await createUser({ username: author, password: 'password123' })
    }
    author = user._id
  }
  
  const post = new Post({ title, author, contents, tags, coverImage, attachment })
  const savedPost = await post.save()
  const populated = await savedPost.populate('author')
  const postObj = populated.toObject()
  
  if (postObj.author && typeof postObj.author === 'object' && postObj.author.username) {
    postObj.author = postObj.author.username
  } else if (postObj.author && mongoose.Types.ObjectId.isValid(postObj.author)) {
    postObj.author = 'Unknown Author'
  }
  
  return postObj
}

// Get a post by its ID, populating the author
export async function getPostById(postId) {
  const post = await Post.findById(postId).populate('author')
  if (post) {
    const postObj = post.toObject()
    if (postObj.author && typeof postObj.author === 'object' && postObj.author.username) {
      postObj.author = postObj.author.username
    } else if (postObj.author && mongoose.Types.ObjectId.isValid(postObj.author)) {
      postObj.author = 'Unknown Author'
    }
    return postObj
  }
  return null
}

// Helper to list posts, populating and mapping author field
async function listPosts(
  query = {},
  { sortBy = 'createdAt', sortOrder = 'descending' } = {},
) {
  const posts = await Post.find(query).sort({ [sortBy]: sortOrder }).populate('author')
  return posts.map(post => {
    const postObj = post.toObject()
    if (postObj.author && typeof postObj.author === 'object' && postObj.author.username) {
      postObj.author = postObj.author.username
    } else if (postObj.author && mongoose.Types.ObjectId.isValid(postObj.author)) {
      postObj.author = 'Unknown Author'
    }
    return postObj
  })
}

export async function deletePost(postId) {
  return await Post.findByIdAndDelete(postId)
}

export async function updatePost(postId, updateData) {
  let { title, author, contents, tags, coverImage, attachment } = updateData

  if (author && typeof author === 'string' && !mongoose.Types.ObjectId.isValid(author)) {
    let user = await User.findOne({ username: author })
    if (!user) {
      user = await createUser({ username: author, password: 'password123' })
    }
    author = user._id
  }

  const setData = {}
  if (title !== undefined) setData.title = title
  if (author !== undefined) setData.author = author
  if (contents !== undefined) setData.contents = contents
  if (tags !== undefined) setData.tags = tags
  if (coverImage !== undefined) setData.coverImage = coverImage
  if (attachment !== undefined) setData.attachment = attachment

  const result = await Post.findByIdAndUpdate(
    postId,
    { $set: setData },
    { new: true }
  ).populate('author')

  if (result) {
    const postObj = result.toObject()
    if (postObj.author && typeof postObj.author === 'object' && postObj.author.username) {
      postObj.author = postObj.author.username
    } else if (postObj.author && mongoose.Types.ObjectId.isValid(postObj.author)) {
      postObj.author = 'Unknown Author'
    }
    return postObj
  }
  return null
}

export async function listAllPosts(options) {
  return await listPosts({}, options)
}

// List posts by author username or ID
export async function listPostsByAuthor(author, options) {
  if (typeof author === 'string' && !mongoose.Types.ObjectId.isValid(author)) {
    const user = await User.findOne({ username: author })
    if (!user) return [] // Return empty array if user does not exist
    author = user._id
  }
  return await listPosts({ author }, options)
}

// List posts by tag
export async function listPostsByTag(tags, options) {
  return await listPosts({ tags }, options)
}
