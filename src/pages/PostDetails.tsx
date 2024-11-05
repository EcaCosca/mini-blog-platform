import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchPostById,
  fetchCommentsByPostId,
  createComment,
  deleteComment,
  updateComment,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import Spinner from "../components/Spinner";

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const {
    data: post,
    status: postStatus,
  } = useQuery({
    queryKey: ["post", id],
    queryFn: () => fetchPostById(id as string),
  });

  const {
    data: comments,
    status: commentsStatus,
    error: commentsError,
  } = useQuery({
    queryKey: ["comments", id],
    queryFn: () => fetchCommentsByPostId(id as string),
    enabled: !!id,
  });

  const addComment = useMutation({
    mutationFn: async (content: string) => {
      if (id && user) {
        await createComment(id, content, user.email);
      } else {
        throw new Error("Post ID or user email missing");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
      setCommentText("");
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      if (id) {
        await deleteComment(commentId, id);
      } else {
        throw new Error("Post ID is undefined");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: async ({
      commentId,
      content,
    }: {
      commentId: string;
      content: string;
    }) => {
      if (id) {
        await updateComment(id, commentId, content);
      } else {
        throw new Error("Post ID is undefined");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
      setEditingCommentId(null);
      setEditText("");
    },
  });

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      addComment.mutate(commentText);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    deleteCommentMutation.mutate(commentId, post?.id);
  };

  const handleEditComment = (commentId: string, content: string) => {
    setEditingCommentId(commentId);
    setEditText(content);
  };

  const handleSaveEdit = (commentId: string) => {
    updateCommentMutation.mutate({ commentId, content: editText });
  };

  if (postStatus === "pending") return <Spinner />;
  if (postStatus === "error") {
    return (
      <div>
        <h2>Error loading post</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {/* Post Image */}
      <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
        <img
          src={`https://picsum.photos/800/400?random=${id}`}
          alt="Random post"
          className="w-full h-60 object-cover transition duration-500 hover:opacity-90"
        />
      </div>

      {/* Post Content */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          {post?.title}
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">{post?.content}</p>
        <div className="post-author mt-4 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-md">
          <p className="text-gray-700 dark:text-gray-300">
            Posted by: {post.email || "Anonymous"}
          </p>
        </div>
      </div>

      {/* Comments Section */}
      <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg shadow-md mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
          Comments
        </h2>

        {/* Add New Comment */}
        <form onSubmit={handleCommentSubmit} className="mb-4">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white resize-none mb-2"
            rows={3}
          ></textarea>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition duration-300"
          >
            Submit Comment
          </button>
        </form>

        {/* Comments List */}
        {commentsStatus === "pending" ? (
          <Spinner />
        ) : commentsStatus === "error" ? (
          <p>Error loading comments: {JSON.stringify(commentsError)}</p>
        ) : (
          <div className="space-y-4">
            {comments?.map((comment: { id: string; content: string; email: string | undefined; created_at: string | number | Date; }) => (
              <div
                key={comment.id}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow relative"
              >
                {editingCommentId === comment.id ? (
                  <>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      placeholder="Edit your comment..."
                      className="w-full p-2 mb-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:text-white"
                      rows={3}
                    ></textarea>
                    <button
                      onClick={() => handleSaveEdit(comment.id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-500 transition duration-300 mr-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingCommentId(null)}
                      className="bg-gray-600 text-white px-3 py-1 rounded-lg hover:bg-gray-500 transition duration-300"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-gray-700 dark:text-gray-300">
                      {comment.content}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Commented by {comment.email || "Anonymous"} on{" "}
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                    {user?.email === comment.email && (
                      <div className="absolute top-2 right-2 flex space-x-2">
                        <button
                          onClick={() =>
                            handleEditComment(comment.id, comment.content)
                          }
                          className="text-blue-500 hover:text-blue-700"
                          title="Edit"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="h-5 w-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="h-5 w-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetail;
