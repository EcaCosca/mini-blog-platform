import { useState, useEffect } from 'react';
import { createPost, updatePost } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface PostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (title: string, content: string) => void;
    initialTitle?: string;
    initialContent?: string;
    isEditMode?: boolean;
    postId?: string; 
}

const PostModal: React.FC<PostModalProps> = ({ isOpen, onClose, onSave, initialTitle = '', initialContent = '', isEditMode = false, postId }) => {
    const [title, setTitle] = useState(initialTitle);
    const [content, setContent] = useState(initialContent);
    const { user } = useAuth();

    useEffect(() => {
        if (isOpen) {
            setTitle(initialTitle);
            setContent(initialContent);
        }
    }, [isOpen, initialTitle, initialContent]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditMode && postId) {
            await updatePost(postId, title, content);
        } else {
            await createPost(title, content, user?.user_metadata.email );
        }
        onSave(title, content);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-dark-accent p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-semibold mb-4 text-primary dark:text-dark-primary">
                    {isEditMode ? 'Edit Post' : 'Create New Post'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Title"
                        className="mb-4 p-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary"
                        required
                    />
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Content"
                        className="mb-4 p-2 border rounded w-full h-32 resize-none focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-dark-primary"
                        required
                    />
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-secondary dark:text-dark-secondary hover:text-hover dark:hover:text-dark-hover transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary dark:bg-dark-primary text-white font-semibold rounded hover:bg-hover dark:hover:bg-dark-hover transition"
                        >
                            {isEditMode ? 'Update Post' : 'Create Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostModal;