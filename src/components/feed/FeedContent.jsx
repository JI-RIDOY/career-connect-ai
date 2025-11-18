import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaComment, FaShare, FaEllipsisH, FaBookmark } from 'react-icons/fa';
import PostCard from '../ui/PostCard';

const FeedContent = () => {
    const [posts, setPosts] = useState([
        {
            id: 1,
            user: {
                name: "Sarah Johnson",
                title: "Senior Product Manager at TechCorp",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
            },
            content: "Just wrapped up an amazing project using React and Node.js! The team did incredible work implementing microservices architecture. 🚀",
            timestamp: "2 hours ago",
            likes: 42,
            comments: 8,
            shares: 3,
            isLiked: false,
            isSaved: false
        },
        {
            id: 2,
            user: {
                name: "Mike Chen",
                title: "Lead Data Scientist at DataInsights",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
            },
            content: "The future of AI in healthcare is incredibly promising. Just attended a conference where they discussed AI-powered diagnostics that could revolutionize patient care.",
            timestamp: "4 hours ago",
            likes: 28,
            comments: 12,
            shares: 5,
            isLiked: true,
            isSaved: true
        },
        {
            id: 3,
            user: {
                name: "Emily Rodriguez",
                title: "Frontend Developer at DesignHub",
                avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
            },
            content: "Looking for recommendations on the best state management solutions for large-scale React applications. Currently considering Redux Toolkit vs Zustand. Any thoughts?",
            timestamp: "6 hours ago",
            likes: 15,
            comments: 24,
            shares: 2,
            isLiked: false,
            isSaved: false
        },
        {
            id: 4,
            user: {
                name: "Alex Thompson",
                title: "DevOps Engineer at CloudScale",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
            },
            content: "Just achieved 99.9% uptime for our Kubernetes cluster this quarter! 🎉 Continuous monitoring and proactive scaling made it possible.",
            timestamp: "1 day ago",
            likes: 56,
            comments: 7,
            shares: 4,
            isLiked: true,
            isSaved: false
        }
    ]);

    const handleLike = (postId) => {
        setPosts(posts.map(post => 
            post.id === postId 
                ? { 
                    ...post, 
                    isLiked: !post.isLiked,
                    likes: post.isLiked ? post.likes - 1 : post.likes + 1
                } 
                : post
        ));
    };

    const handleSave = (postId) => {
        setPosts(posts.map(post => 
            post.id === postId 
                ? { ...post, isSaved: !post.isSaved } 
                : post
        ));
    };

    const handleComment = (postId) => {
        // Implement comment functionality
        console.log('Comment on post:', postId);
    };

    const handleShare = (postId) => {
        // Implement share functionality
        console.log('Share post:', postId);
    };

    return (
        <div className="space-y-6">
            {/* Create Post Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
            >
                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        Y
                    </div>
                    <button className="flex-1 bg-gray-50 hover:bg-gray-100 border text-xs md:text-sm border-gray-200 rounded-full px-3 py-2 text-left text-gray-500 transition-colors">
                        Share your career update
                    </button>
                </div>
                <div className="flex justify-between mt-4 px-4">
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-500 text-sm">📷</span>
                        </div>
                        <span className="text-sm font-medium">Photo</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <span className="text-green-500 text-sm">📊</span>
                        </div>
                        <span className="text-sm font-medium">Poll</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-purple-500 transition-colors">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                            <span className="text-purple-500 text-sm">🎯</span>
                        </div>
                        <span className="text-sm font-medium">Achievement</span>
                    </button>
                </div>
            </motion.div>

            {/* Posts */}
            {posts.map((post, index) => (
                <PostCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    onSave={handleSave}
                    onComment={handleComment}
                    onShare={handleShare}
                    index={index}
                />
            ))}
        </div>
    );
};

export default FeedContent;