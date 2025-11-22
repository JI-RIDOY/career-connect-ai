import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaHeart,
    FaRegHeart,
    FaComment,
    FaShare,
    FaEllipsisH,
    FaTimes,
    FaImage,
    FaSmile,
    FaPaperPlane,
    FaTrash,
    FaSpinner,
    FaExclamationCircle,
    FaUser,
    FaGlobeAmericas
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const FeedContent = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [commentText, setCommentText] = useState('');
    const [newPost, setNewPost] = useState({
        content: '',
        imageUrl: ''
    });
    const [uploading, setUploading] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const { user, userProfile } = useAuth();

    // Cloudinary configuration
    const cloudName = 'dohhfubsa';
    const uploadPreset = 'react_unsigned';

    // Fetch posts from backend
    const fetchPosts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch('http://localhost:5000/api/posts');
            
            if (!response.ok) {
                throw new Error(`Failed to fetch posts: ${response.status}`);
            }
            
            const result = await response.json();

            if (result.success) {
                setPosts(result.posts || []);
            } else {
                throw new Error(result.message || 'Failed to load posts');
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
            setError(error.message);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // Upload image to Cloudinary
    const uploadToCloudinary = async (file) => {
        try {
            setUploading(true);

            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', uploadPreset);
            formData.append('cloud_name', cloudName);

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error('Image upload failed');
            }

            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error('Error uploading image to Cloudinary:', error);
            throw new Error('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    // Handle image upload for new post
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }

            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should be less than 5MB');
                return;
            }

            try {
                // Create preview
                const reader = new FileReader();
                reader.onload = (e) => {
                    setImagePreview(e.target.result);
                };
                reader.readAsDataURL(file);

                const imageUrl = await uploadToCloudinary(file);
                setNewPost(prev => ({ ...prev, imageUrl }));
            } catch (error) {
                console.error('Upload failed:', error);
                setError('Failed to upload image. Please try again.');
                setImagePreview(null);
            }
        }
    };

    // Reset new post form
    const resetNewPost = () => {
        setNewPost({ content: '', imageUrl: '' });
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Create new post
    const handleCreatePost = async () => {
        if (!newPost.content.trim()) {
            setError('Please write something to post');
            return;
        }

        if (!user) {
            setError('Please login to create posts');
            return;
        }

        try {
            setActionLoading('creating');
            const postData = {
                content: newPost.content.trim(),
                imageUrl: newPost.imageUrl,
                userId: user.uid,
                userEmail: user.email,
                userProfile: {
                    displayName: userProfile?.displayName || user.displayName || 'User',
                    photoURL: userProfile?.photoURL || user.photoURL,
                    profession: userProfile?.profession || 'Professional'
                }
            };

            const response = await fetch('http://localhost:5000/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            const result = await response.json();

            if (result.success) {
                setPosts(prev => [result.post, ...prev]);
                resetNewPost();
                setShowCreateModal(false);
                setError(null);
            } else {
                throw new Error(result.message || 'Failed to create post');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            setError(error.message);
        } finally {
            setActionLoading(null);
        }
    };

    // Like/unlike post
    const handleLike = async (postId) => {
        if (!user) {
            setError('Please login to like posts');
            return;
        }

        try {
            setActionLoading(`like-${postId}`);
            const response = await fetch(`http://localhost:5000/api/posts/${postId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.uid,
                    userEmail: user.email
                }),
            });

            const result = await response.json();

            if (result.success) {
                setPosts(prev =>
                    prev.map(post =>
                        post._id === postId ? result.post : post
                    )
                );
            } else {
                throw new Error(result.message || 'Failed to like post');
            }
        } catch (error) {
            console.error('Error liking post:', error);
            setError(error.message);
        } finally {
            setActionLoading(null);
        }
    };

    // Add comment
    const handleAddComment = async (postId) => {
        if (!commentText.trim() || !user) {
            if (!user) setError('Please login to comment');
            return;
        }

        try {
            setActionLoading(`comment-${postId}`);
            const response = await fetch(`http://localhost:5000/api/posts/${postId}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.uid,
                    userEmail: user.email,
                    content: commentText.trim(),
                    userProfile: {
                        displayName: userProfile?.displayName || user.displayName || 'User',
                        photoURL: userProfile?.photoURL || user.photoURL,
                        profession: userProfile?.profession || 'User'
                    }
                }),
            });

            const result = await response.json();

            if (result.success) {
                setPosts(prev =>
                    prev.map(post =>
                        post._id === postId ? result.post : post
                    )
                );
                setCommentText('');
                setSelectedPost(null);
                setError(null);
            } else {
                throw new Error(result.message || 'Failed to add comment');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            setError(error.message);
        } finally {
            setActionLoading(null);
        }
    };

    // Delete post
    const handleDeletePost = async (postId) => {
        if (!window.confirm('Are you sure you want to delete this post?')) {
            return;
        }

        try {
            setActionLoading(`delete-${postId}`);
            const response = await fetch(`http://localhost:5000/api/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user?.uid }),
            });

            const result = await response.json();

            if (result.success) {
                setPosts(prev => prev.filter(post => post._id !== postId));
                setError(null);
            } else {
                throw new Error(result.message || 'Failed to delete post');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            setError(error.message);
        } finally {
            setActionLoading(null);
        }
    };

    // Check if user liked the post
    const isLiked = (post) => {
        if (!post || !post.likes || !Array.isArray(post.likes) || !user) {
            return false;
        }
        return post.likes.some(like => like.userId === user.uid);
    };

    // Get likes count with validation
    const getLikesCount = (post) => {
        if (!post || !post.likes || !Array.isArray(post.likes)) {
            return 0;
        }
        return post.likes.length;
    };

    // Get comments count with validation
    const getCommentsCount = (post) => {
        if (!post || !post.comments || !Array.isArray(post.comments)) {
            return 0;
        }
        return post.comments.length;
    };

    // Format date
    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            const now = new Date();
            const diffInHours = (now - date) / (1000 * 60 * 60);

            if (diffInHours < 1) {
                const minutes = Math.floor(diffInHours * 60);
                return `${minutes}m ago`;
            } else if (diffInHours < 24) {
                return `${Math.floor(diffInHours)}h ago`;
            } else if (diffInHours < 168) {
                return `${Math.floor(diffInHours / 24)}d ago`;
            } else {
                return date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
                });
            }
        } catch (error) {
            return 'Recently';
        }
    };

    // Handle Enter key press for comment
    const handleCommentKeyPress = (e, postId) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAddComment(postId);
        }
    };

    // Error Display Component
    const ErrorAlert = () => (
        <AnimatePresence>
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start space-x-3"
                >
                    <FaExclamationCircle className="text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                        <p className="text-red-800 text-sm">{error}</p>
                    </div>
                    <button
                        onClick={() => setError(null)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                    >
                        <FaTimes />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );

    // Loading Skeleton
    const PostSkeleton = () => (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 mb-6 overflow-hidden">
            <div className="p-6 pb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse"></div>
                    <div className="space-y-2">
                        <div className="w-32 h-4 bg-gray-300 rounded animate-pulse"></div>
                        <div className="w-24 h-3 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                </div>
            </div>
            <div className="px-6 pb-4 space-y-3">
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="px-6 pb-6">
                <div className="w-full h-64 bg-gray-300 rounded-xl animate-pulse"></div>
            </div>
            <div className="px-6 py-3 border-t border-gray-200">
                <div className="flex justify-around">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="w-16 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                    ))}
                </div>
            </div>
        </div>
    );

    // Create Post Modal
    const CreatePostModal = () => (
        <AnimatePresence>
            {showCreateModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setShowCreateModal(false)}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
                            <h3 className="text-xl font-bold text-gray-900">Create Post</h3>
                            <button
                                onClick={() => {
                                    setShowCreateModal(false);
                                    resetNewPost();
                                }}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                                <FaTimes className="text-gray-500 text-lg" />
                            </button>
                        </div>

                        {/* User Info */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <img
                                        src={userProfile?.photoURL || user?.photoURL || '/default-avatar.png'}
                                        alt="Profile"
                                        className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/20"
                                        onError={(e) => {
                                            e.target.src = '/default-avatar.png';
                                        }}
                                    />
                                    <div className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-white rounded-full p-1">
                                        <FaGlobeAmericas className="text-white text-xs" />
                                    </div>
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900">
                                        {userProfile?.displayName || user?.displayName || 'User'}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {userProfile?.profession || 'Professional'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            <textarea
                                value={newPost.content}
                                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                                placeholder="What's on your mind?"
                                className="w-full h-32 resize-none border-none focus:outline-none text-lg placeholder-gray-500 text-gray-900 bg-transparent"
                                maxLength={500}
                            />
                            <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
                                <span>{newPost.content.length}/500</span>
                            </div>

                            {(imagePreview || newPost.imageUrl) && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mt-4 relative"
                                >
                                    <img
                                        src={imagePreview || newPost.imageUrl}
                                        alt="Post preview"
                                        className="w-full rounded-xl max-h-96 object-cover border border-gray-200"
                                    />
                                    <button
                                        onClick={() => {
                                            setNewPost(prev => ({ ...prev, imageUrl: '' }));
                                            setImagePreview(null);
                                            if (fileInputRef.current) {
                                                fileInputRef.current.value = '';
                                            }
                                        }}
                                        className="absolute top-3 right-3 bg-black/70 text-white p-2 rounded-full hover:bg-black/90 transition-all duration-200 backdrop-blur-sm"
                                    >
                                        <FaTimes className="text-sm" />
                                    </button>
                                </motion.div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="p-6 border-t border-gray-200 space-y-4 flex-shrink-0">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">Add to your post</span>
                                <div className="flex items-center space-x-3">
                                    <label className="flex items-center space-x-2 text-green-600 hover:text-green-700 cursor-pointer transition-colors duration-200 p-2 rounded-lg hover:bg-green-50">
                                        <FaImage className="text-lg" />
                                        <span className="text-sm font-medium">Photo</span>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>

                                    <button className="flex items-center space-x-2 text-yellow-600 hover:text-yellow-700 cursor-pointer transition-colors duration-200 p-2 rounded-lg hover:bg-yellow-50">
                                        <FaSmile className="text-lg" />
                                        <span className="text-sm font-medium">Feeling</span>
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleCreatePost}
                                disabled={!newPost.content.trim() || uploading || actionLoading === 'creating'}
                                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3.5 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2"
                            >
                                {actionLoading === 'creating' ? (
                                    <>
                                        <FaSpinner className="animate-spin" />
                                        <span>Posting...</span>
                                    </>
                                ) : uploading ? (
                                    <>
                                        <FaSpinner className="animate-spin" />
                                        <span>Uploading Image...</span>
                                    </>
                                ) : (
                                    <span>Post</span>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    // Comments Modal
    const CommentsModal = () => (
        <AnimatePresence>
            {selectedPost && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedPost(null)}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Comments</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {getCommentsCount(selectedPost)} comments
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedPost(null)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                            >
                                <FaTimes className="text-gray-500 text-lg" />
                            </button>
                        </div>

                        {/* Comments List */}
                        <div className="overflow-y-auto flex-1 p-6 space-y-4">
                            {!selectedPost.comments || !Array.isArray(selectedPost.comments) || selectedPost.comments.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-gray-300 text-6xl mb-4">💬</div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No comments yet</h3>
                                    <p className="text-gray-600">Be the first to share your thoughts!</p>
                                </div>
                            ) : (
                                selectedPost.comments.map((comment) => (
                                    <motion.div
                                        key={comment._id || comment.userId}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="flex space-x-3"
                                    >
                                        <img
                                            src={comment.userProfile?.photoURL || '/default-avatar.png'}
                                            alt="Profile"
                                            className="w-10 h-10 rounded-full object-cover border-2 border-blue-500/20 flex-shrink-0"
                                            onError={(e) => {
                                                e.target.src = '/default-avatar.png';
                                            }}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <div className="bg-gray-50 rounded-2xl p-4 hover:bg-gray-100 transition-colors duration-200">
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="font-semibold text-gray-900 text-sm">
                                                        {comment.userProfile?.displayName || 'User'}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {formatDate(comment.createdAt)}
                                                    </p>
                                                </div>
                                                <p className="text-gray-800 text-sm leading-relaxed">{comment.content}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Add Comment */}
                        <div className="p-6 border-t border-gray-200 flex-shrink-0 bg-gray-50/50">
                            <div className="flex space-x-3">
                                <img
                                    src={userProfile?.photoURL || user?.photoURL || '/default-avatar.png'}
                                    alt="Profile"
                                    className="w-10 h-10 rounded-full object-cover border-2 border-blue-500/20 flex-shrink-0"
                                    onError={(e) => {
                                        e.target.src = '/default-avatar.png';
                                    }}
                                />
                                <div className="flex-1 flex space-x-2">
                                    <input
                                        type="text"
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        onKeyPress={(e) => handleCommentKeyPress(e, selectedPost._id)}
                                        placeholder="Write a comment..."
                                        className="flex-1 border border-gray-300 rounded-full px-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 bg-white"
                                        maxLength={200}
                                    />
                                    <button
                                        onClick={() => handleAddComment(selectedPost._id)}
                                        disabled={!commentText.trim() || actionLoading === `comment-${selectedPost._id}`}
                                        className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/25 flex items-center justify-center"
                                    >
                                        {actionLoading === `comment-${selectedPost._id}` ? (
                                            <FaSpinner className="animate-spin text-sm" />
                                        ) : (
                                            <FaPaperPlane className="text-sm" />
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-between items-center text-xs text-gray-500 mt-2 px-4">
                                <span>Press Enter to post</span>
                                <span>{commentText.length}/200</span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    // Post Component
    const Post = ({ post }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200/80 mb-6 overflow-hidden hover:shadow-md transition-all duration-300"
        >
            {/* Post Header */}
            <div className="p-6 pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="relative">
                            <img
                                src={post.userProfile?.photoURL || '/default-avatar.png'}
                                alt="Profile"
                                className="w-12 h-12 rounded-full object-cover border-2 border-blue-500/20"
                                onError={(e) => {
                                    e.target.src = '/default-avatar.png';
                                }}
                            />
                            <div className="absolute -bottom-1 -right-1 bg-blue-500 border-2 border-white rounded-full p-1">
                                <FaUser className="text-white text-xs" />
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate">
                                {post.userProfile?.displayName || 'User'}
                            </p>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <span>{post.userProfile?.profession || 'Professional'}</span>
                                <span>•</span>
                                <span>{formatDate(post.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Post Content */}
            <div className="px-6 pb-4">
                <p className="text-gray-800 whitespace-pre-line leading-relaxed">{post.content}</p>
            </div>

            {/* Post Image */}
            {post.imageUrl && (
                <div className="px-6 pb-4">
                    <motion.img
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        src={post.imageUrl}
                        alt="Post content"
                        className="w-full rounded-xl max-h-96 object-cover border border-gray-200 cursor-pointer hover:shadow-md transition-all duration-300"
                        onClick={() => window.open(post.imageUrl, '_blank')}
                    />
                </div>
            )}

            {/* Post Stats */}
            <div className="px-6 py-3 border-t border-gray-200 bg-gray-50/50">
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                            <FaHeart className="text-red-500" />
                            <span>{getLikesCount(post)}</span>
                        </span>
                        <span className="flex items-center space-x-1 cursor-pointer hover:text-blue-600 transition-colors"
                              onClick={() => setSelectedPost(post)}>
                            <FaComment className="text-blue-500" />
                            <span>{getCommentsCount(post)}</span>
                        </span>
                    </div>
                    <span>{post.shares || 0} shares</span>
                </div>
            </div>

            {/* Post Actions */}
            <div className="px-6 py-2 border-t border-gray-200">
                <div className="flex justify-around">
                    <button
                        onClick={() => handleLike(post._id)}
                        disabled={actionLoading === `like-${post._id}`}
                        className={`flex items-center space-x-2 py-3 px-6 rounded-xl transition-all duration-200 flex-1 justify-center mx-1 ${
                            isLiked(post) 
                                ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                                : 'text-gray-600 hover:bg-gray-100'
                        } ${actionLoading === `like-${post._id}` ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {actionLoading === `like-${post._id}` ? (
                            <FaSpinner className="animate-spin" />
                        ) : isLiked(post) ? (
                            <FaHeart className="text-red-500" />
                        ) : (
                            <FaRegHeart />
                        )}
                        <span className="font-medium">Like</span>
                    </button>

                    <button
                        onClick={() => setSelectedPost(post)}
                        className="flex items-center space-x-2 py-3 px-6 rounded-xl text-gray-600 hover:bg-gray-100 transition-all duration-200 flex-1 justify-center mx-1"
                    >
                        <FaComment />
                        <span className="font-medium">Comment</span>
                    </button>

                    <button className="flex items-center space-x-2 py-3 px-6 rounded-xl text-gray-600 hover:bg-gray-100 transition-all duration-200 flex-1 justify-center mx-1">
                        <FaShare />
                        <span className="font-medium">Share</span>
                    </button>
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
            <div className="max-w-2xl mx-auto px-4">
                {/* Error Display */}
                <ErrorAlert />

                {/* Create Post Card */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-6 mb-6 hover:shadow-md transition-all duration-300"
                >
                    <div className="flex items-center space-x-4">
                        <img
                            src={userProfile?.photoURL || user?.photoURL || '/default-avatar.png'}
                            alt="Profile"
                            className="w-14 h-14 rounded-full object-cover border-2 border-blue-500/20"
                            onError={(e) => {
                                e.target.src = '/default-avatar.png';
                            }}
                        />
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="flex-1 text-left px-6 py-4 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all duration-200 text-gray-500 hover:text-gray-700 font-medium"
                        >
                            What's on your mind?
                        </button>
                    </div>
                </motion.div>

                {/* Posts List */}
                {loading ? (
                    <div className="space-y-6">
                        {[1, 2, 3].map((n) => (
                            <PostSkeleton key={n} />
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200/80"
                    >
                        <div className="text-gray-300 text-8xl mb-6">📝</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">No posts yet</h3>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
                            Be the first to share your thoughts and start meaningful conversations in the community!
                        </p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
                        >
                            Create First Post
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ staggerChildren: 0.1 }}
                    >
                        {posts.map((post) => (
                            <Post key={post._id} post={post} />
                        ))}
                    </motion.div>
                )}

                {/* Load More Button */}
                {posts.length > 0 && !loading && (
                    <div className="text-center mt-8">
                        <button
                            onClick={fetchPosts}
                            disabled={loading}
                            className="bg-white text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 border border-gray-200/80 hover:border-gray-300 shadow-sm hover:shadow-md disabled:opacity-50"
                        >
                            {loading ? 'Loading...' : 'Load New Posts'}
                        </button>
                    </div>
                )}
            </div>

            {/* Modals */}
            <CreatePostModal />
            <CommentsModal />
        </div>
    );
};

export default FeedContent;