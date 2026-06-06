export const getPosts = async (queryParams) => {
    const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/posts?` +   new URLSearchParams(queryParams),
    )
    return await response.json()
}

export const createPost = async (post) => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
    })
    return await response.json()
}

export const getPostById = async (id) => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts/${id}`)
    return await response.json()
}

export const updatePost = async ({ id, ...post }) => {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
    })
    return await response.json()
}