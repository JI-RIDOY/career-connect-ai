import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PostCard from '../ui/PostCard';
import { useAuth } from '../../contexts/AuthContext';
import PostCreationModal from '../PostCreationModal';

const FeedContent = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch posts from backend
    const fetchPosts = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/posts');
            if (response.ok) {
                const postsData = await response.json();
                setPosts(postsData);
            } 
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        fetchPosts();
    }, []);

    const handleLike = async (postId) => {
        // Optimistic update
        setPosts(posts.map(post =>
            post._id === postId
                ? {
                    ...post,
                    isLiked: !post.isLiked,
                    likes: post.isLiked ? post.likes - 1 : post.likes + 1
                }
                : post
        ));

        // Update in backend
        try {
            await fetch(`http://localhost:5000/api/posts/${postId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user._id }),
            });
        } catch (error) {
            console.error('Error liking post:', error);
            // Revert optimistic update on error
            fetchPosts();
        }
    };

    const handleSave = async (postId) => {
        // Optimistic update
        setPosts(posts.map(post =>
            post._id === postId
                ? { ...post, isSaved: !post.isSaved }
                : post
        ));

        // Update in backend
        try {
            await fetch(`http://localhost:5000/api/posts/${postId}/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user._id }),
            });
        } catch (error) {
            console.error('Error saving post:', error);
            // Revert optimistic update on error
            fetchPosts();
        }
    };

    const handleComment = (postId) => {
        console.log('Comment on post:', postId);
    };

    const handleShare = (postId) => {
        console.log('Share post:', postId);
    };

    const handlePostCreated = (newPost) => {
        setPosts(prevPosts => [newPost, ...prevPosts]);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Create Post Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : `${user.firstName?.charAt(0)}${user.lastName?.charAt(0)}`}
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex-1 bg-gray-50 hover:bg-gray-100 border text-xs md:text-sm border-gray-200 rounded-full px-3 py-2 text-left text-gray-500 transition-colors"
                    >
                        Share your career update
                    </button>
                </div>
            </motion.div>

            {/* Posts */}
            {posts.map((post, index) => (
                <PostCard
                    key={post._id}
                    post={post}
                    onLike={handleLike}
                    onSave={handleSave}
                    onComment={handleComment}
                    onShare={handleShare}
                    index={index}
                />
            ))}

            {/* Post Creation Modal */}
            <PostCreationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onPostCreated={handlePostCreated}
            />
        </div>
    );
};

export default FeedContent;