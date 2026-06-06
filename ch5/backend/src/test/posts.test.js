import { describe, test, expect } from '@jest/globals'
import {
  createPost,
  getPostById,
  updatePost,
  listAllPosts,
  deletePost,
} from '../services/posts.js'

describe('Posts Service', () => {
  test('should perform full CRUD operations on posts', async () => {
    // 1. Create a post
    const postData = {
      title: 'Testing the CI/CD Pipeline',
      author: 'ci_test_user',
      contents: 'This is a test post content for CI validation.',
      tags: ['ci', 'test', 'jest'],
    }

    const createdPost = await createPost(postData)
    expect(createdPost).toBeDefined()
    expect(createdPost._id).toBeDefined()
    expect(createdPost.title).toBe(postData.title)
    expect(createdPost.author).toBe(postData.author)
    expect(createdPost.contents).toBe(postData.contents)
    expect(createdPost.tags).toContain('ci')

    // 2. Read the post by ID
    const fetchedPost = await getPostById(createdPost._id)
    expect(fetchedPost).toBeDefined()
    expect(fetchedPost._id.toString()).toBe(createdPost._id.toString())
    expect(fetchedPost.title).toBe(postData.title)

    // 3. Update the post
    const updateData = {
      title: 'Testing the CI/CD Pipeline - Updated',
      contents: 'Updated test post content.',
    }
    const updatedPost = await updatePost(createdPost._id, updateData)
    expect(updatedPost).toBeDefined()
    expect(updatedPost.title).toBe(updateData.title)
    expect(updatedPost.contents).toBe(updateData.contents)

    // 4. List all posts and verify our post is in the list
    const allPosts = await listAllPosts()
    expect(allPosts).toBeDefined()
    expect(allPosts.length).toBeGreaterThanOrEqual(1)
    const found = allPosts.some(
      (p) => p._id.toString() === createdPost._id.toString() && p.title === updateData.title
    )
    expect(found).toBe(true)

    // 5. Delete the post
    const deleted = await deletePost(createdPost._id)
    expect(deleted).toBeDefined()

    // 6. Verify it is deleted
    const postAfterDelete = await getPostById(createdPost._id)
    expect(postAfterDelete).toBeNull()
  })
})
