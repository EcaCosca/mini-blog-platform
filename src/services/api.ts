const API_URL = import.meta.env.VITE_API_URL;

const authHeaders = () => {
  const token = localStorage.getItem("access_token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export const fetchPosts = async () => {
  const response = await fetch(`${API_URL}/posts`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!response.ok) throw new Error("Failed to fetch posts");
  return response.json();
};

export const fetchPostById = async (postId: string) => {
  const response = await fetch(`${API_URL}/posts/${postId}`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch post");
  }
  return response.json();
};

export const createPost = async (title: string, content: string, email: string) => {
  const response = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ title, content, email }),
  });
  if (!response.ok) throw new Error("Failed to create post");
  return response.json();
};

export const updatePost = async (
  postId: string,
  title: string,
  content: string
) => {
  const response = await fetch(`${API_URL}/posts/${postId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ title, content }),
  });

  if (!response.ok) throw new Error("Failed to update post");
  return response.json();
};

export const fetchCommentsByPostId = async (postId: string) => {
  const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
    headers: authHeaders(),
  });

  if (!response.ok) throw new Error("Failed to fetch comments");
  return response.json();
};

export const createComment = async (postId: string, content: string, email: string) => {
  const response = await fetch(`${API_URL}/posts/${postId}/comments`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ content, email }),
  });

  if (!response.ok) throw new Error("Failed to create comment");
  return response.json();
};

export const deleteComment = async (commentId: string, postId: string) => {
  const response = await fetch(`${API_URL}/posts/${postId}/comments/${commentId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!response.ok) throw new Error("Failed to delete comment");
  return response.json();
};

export const updateComment = async (postId: string, commentId: string, content: string) => {
  const response = await fetch(`${API_URL}/posts/${postId}/comments/${commentId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ content }),
  });

  if (!response.ok) throw new Error("Failed to update comment");
  return response.json();
};