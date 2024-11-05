import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { fetchCommentsByPostId, createComment } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Spinner from "./Spinner";

interface Comment {
  id: string;
  content: string;
}

interface CommentSectionProps {
  postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
  const { accessToken } = useAuth();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");

  const {
    data: comments,
    isLoading,
    error,
  } = useQuery<Comment[]>({
    queryKey: ["comments", postId],
    queryFn: () => fetchCommentsByPostId(postId),
    enabled: !!postId && !!accessToken,
  });

  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);

  const { mutate: addComment } = useMutation({
      mutationFn: async (newComment: string) => {
        if (postId && accessToken) {
          await createComment(postId, newComment, accessToken);
        } else {
          throw new Error("Post ID or access token missing");
        }
      },
      onSuccess: () => {
        setComment("");
        queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      },
    });

  const handleCommentSubmit = () => {
      setIsCommentSubmitting(true);
      addComment(comment, {
        onSettled: () => {
          setIsCommentSubmitting(false);
        },
      });
    if (comment.trim()) {
      addComment(comment);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Comments</h2>

      {isLoading ? (
        <Spinner />
      ) : error ? (
        <p>Error loading comments: {(error as Error).message}</p>
      ) : (
        <div className="space-y-4 mb-8">
          {comments?.map((comment) => (
            <div key={comment.id} className="p-4 bg-gray-100 rounded">
              <p>{comment.content}</p>
            </div>
          ))}
        </div>
      )}

      <form
        onSubmit={handleCommentSubmit}
        className="flex items-center space-x-4"
      >
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-grow p-2 border rounded"
          disabled={isCommentSubmitting}
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded"
          disabled={isCommentSubmitting}
        >
          {isCommentSubmitting ? "Submitting..." : "Post Comment"}
        </button>
      </form>
    </div>
  );
};

export default CommentSection;
