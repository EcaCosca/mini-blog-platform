import { useQuery } from "@tanstack/react-query";
import { fetchPosts, createPost } from "../services/api";
import { useAuth } from "../context/AuthContext";
import PostModal from "../components/PostModal";
import { useState } from "react";

const Home = () => {
  const { user } = useAuth();
  const {
    data: posts,
    status,
    error,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: () => fetchPosts(),
  });

  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [editingPost, setEditingPost] = useState<{
    id: string;
    title: string;
    content: string;
  } | null>(null);

  const openCreateModal = () => {
    setEditMode(false);
    setEditingPost(null);
    setModalOpen(true);
  };

  const openEditModal = (post: {
    id: string;
    title: string;
    content: string;
  }) => {
    setEditMode(true);
    setEditingPost(post);
    setModalOpen(true);
  };

  if (status === "pending") return <h1>Loading...</h1>;
  if (status === "error")
    return (
      <div>
        <h2>Error loading posts</h2>
        <p>{JSON.stringify(error)}</p>
      </div>
    );

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Blog Posts</h1>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-500 transition duration-300 shadow-md hover:shadow-lg"
        >
          Create New Post
        </button>
      </div>

      {/* Responsive grid layout for posts */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {posts?.map((post: { id: string; title: string; content: string; }) => (
          <div
            key={post.id}
            className="relative group overflow-hidden rounded-lg shadow-lg transform transition duration-500 hover:scale-105"
          >
            {/* Random image from picsum */}
            <img
              src={`https://picsum.photos/400/300?random=${post.id}`}
              alt="Random post"
              className="w-full h-48 object-cover transition duration-500 group-hover:opacity-75"
            />
            <div className="p-6 bg-white dark:bg-gray-800">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                {post.title}
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                {post.content}
              </p>
              <div className="flex justify-between items-center">
                <a
                  href={`/posts/${post.id}`}
                  className="text-blue-500 hover:text-blue-700 transition-colors"
                >
                  Read more...
                </a>
                <button
                  onClick={() => openEditModal(post)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition duration-300"
                >
                  Edit Post
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <PostModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={(title, content) => createPost(title, content, user?.user_metadata.email)}
        initialTitle={editingPost?.title}
        initialContent={editingPost?.content}
        isEditMode={isEditMode}
      />
    </div>
  );
};

export default Home;