import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaPaperPlane,
    FaSearch,
    FaEllipsisV,
    FaPhone,
    FaVideo,
    FaImage,
    FaPaperclip,
    FaSmile,
    FaUserCircle,
    FaCheck,
    FaCheckDouble,
    FaSpinner,
    FaArrowLeft,
    FaTimes
} from 'react-icons/fa';
import { Link, useSearchParams } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import io from 'socket.io-client';

const Messages = () => {
    const { user } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [socket, setSocket] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [typingUsers, setTypingUsers] = useState({});
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!user) return;

        // Initialize Socket.io
        const socketInstance = io('http://localhost:5000', {
            withCredentials: true,
            transports: ['websocket', 'polling']
        });

        setSocket(socketInstance);

        // Register user with socket
        socketInstance.emit('register-user', user.uid);

        // Listen for new messages
        socketInstance.on('new-message', (message) => {
            if (selectedConversation && 
                (message.senderId === selectedConversation.userId || 
                 message.receiverId === selectedConversation.userId)) {
                setMessages(prev => [...prev, message]);
                markMessagesAsRead(selectedConversation.userId);
            }
            
            // Update conversations list
            fetchConversations();
        });

        // Listen for typing indicators
        socketInstance.on('user-typing', (data) => {
            setTypingUsers(prev => ({ ...prev, [data.senderId]: true }));
        });

        socketInstance.on('user-stop-typing', (data) => {
            setTypingUsers(prev => ({ ...prev, [data.senderId]: false }));
        });

        // Fetch conversations
        fetchConversations();

        // Check for selected conversation from URL
        const selectedUserId = searchParams.get('user');
        if (selectedUserId) {
            handleSelectConversation(selectedUserId);
        }

        return () => {
            if (socketInstance) {
                socketInstance.disconnect();
            }
        };
    }, [user]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchConversations = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/messages/conversations/${user.uid}`);
            setConversations(response.data.conversations || []);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectConversation = async (userId) => {
        try {
            setLoading(true);
            
            // Find conversation
            const conversation = conversations.find(conv => conv.userId === userId);
            
            if (!conversation) {
                // Create new conversation object
                const userResponse = await axios.get(`http://localhost:5000/api/users/${userId}`);
                setSelectedConversation({
                    userId: userId,
                    user: userResponse.data.user
                });
            } else {
                setSelectedConversation(conversation);
            }

            // Fetch messages
            const messagesResponse = await axios.get('http://localhost:5000/api/messages/conversation', {
                params: { userId: user.uid, otherUserId: userId }
            });
            
            setMessages(messagesResponse.data.messages || []);
            
            // Update URL
            setSearchParams({ user: userId });
            
            // Mark messages as read
            markMessagesAsRead(userId);
            
        } catch (error) {
            console.error('Error selecting conversation:', error);
        } finally {
            setLoading(false);
        }
    };

    const markMessagesAsRead = async (otherUserId) => {
        try {
            await axios.put('/api/messages/read', {
                userId: user.uid,
                otherUserId
            });
            
            // Update conversations
            fetchConversations();
        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation || sending) return;

        try {
            setSending(true);
            
            // Create message object
            const messageData = {
                senderId: user.uid,
                receiverId: selectedConversation.userId,
                content: newMessage
            };

            // Send via socket
            socket.emit('private-message', messageData);
            
            // Add message locally immediately
            const tempMessage = {
                ...messageData,
                _id: Date.now().toString(),
                timestamp: new Date(),
                read: false
            };
            
            setMessages(prev => [...prev, tempMessage]);
            setNewMessage('');
            
            // Update conversations
            fetchConversations();
            
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const handleTyping = () => {
        if (socket && selectedConversation) {
            socket.emit('typing', {
                receiverId: selectedConversation.userId,
                senderId: user.uid
            });
        }
    };

    const handleStopTyping = () => {
        if (socket && selectedConversation) {
            socket.emit('stop-typing', {
                receiverId: selectedConversation.userId,
                senderId: user.uid
            });
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString();
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Handle file upload logic here
        console.log('File selected:', file);
        // You would typically upload to Cloudinary or similar service here
    };

    const renderMessage = (message, index) => {
        const isOwnMessage = message.senderId === user.uid;
        const showDate = index === 0 || 
            formatDate(messages[index - 1]?.timestamp) !== formatDate(message.timestamp);

        return (
            <React.Fragment key={message._id}>
                {showDate && (
                    <div className="flex justify-center my-4">
                        <span className="px-4 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {formatDate(message.timestamp)}
                        </span>
                    </div>
                )}
                
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-3`}
                >
                    <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                        <div className={`px-4 py-3 rounded-2xl ${
                            isOwnMessage
                                ? 'bg-blue-500 text-white rounded-br-none'
                                : 'bg-gray-100 text-gray-900 rounded-tl-none'
                        }`}>
                            <p className="text-sm">{message.content}</p>
                            <div className={`flex items-center justify-end space-x-1 mt-1 ${
                                isOwnMessage ? 'text-blue-200' : 'text-gray-500'
                            }`}>
                                <span className="text-xs">{formatTime(message.timestamp)}</span>
                                {isOwnMessage && (
                                    message.read ? (
                                        <FaCheckDouble className="text-xs" />
                                    ) : (
                                        <FaCheck className="text-xs" />
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </React.Fragment>
        );
    };

    const renderConversationList = () => (
        <div className="w-full lg:w-1/3 border-r border-gray-200 bg-white rounded-l-3xl overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Messages</h2>
                <div className="relative mt-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search conversations..."
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            {/* Conversations List */}
            <div className="overflow-y-auto h-[calc(100vh-180px)]">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <FaSpinner className="text-2xl text-blue-500 animate-spin" />
                    </div>
                ) : conversations.length > 0 ? (
                    conversations.map((conversation) => (
                        <motion.div
                            key={conversation.userId}
                            whileHover={{ scale: 1.01 }}
                            onClick={() => handleSelectConversation(conversation.userId)}
                            className={`p-4 border-b border-gray-100 cursor-pointer transition-colors duration-200 ${
                                selectedConversation?.userId === conversation.userId
                                    ? 'bg-blue-50'
                                    : 'hover:bg-gray-50'
                            }`}
                        >
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <img
                                        src={conversation.user?.profilePhoto || `https://ui-avatars.com/api/?name=${conversation.user?.fullName}&background=random`}
                                        alt={conversation.user?.fullName}
                                        className="w-12 h-12 rounded-2xl object-cover border-2 border-gray-200"
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-gray-900 truncate">
                                            {conversation.user?.fullName}
                                        </h3>
                                        <span className="text-xs text-gray-500">
                                            {formatTime(conversation.lastMessage?.timestamp)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-gray-600 truncate">
                                            {conversation.lastMessage?.content || 'No messages yet'}
                                        </p>
                                        {conversation.unreadCount > 0 && (
                                            <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                                                {conversation.unreadCount}
                                            </span>
                                        )}
                                    </div>
                                    {typingUsers[conversation.userId] && (
                                        <p className="text-xs text-blue-500 italic">typing...</p>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <FaUserCircle className="text-4xl text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700">No conversations yet</h3>
                        <p className="text-gray-500">Start a conversation with your connections</p>
                    </div>
                )}
            </div>
        </div>
    );

    const renderChatArea = () => (
        <div className="flex-1 flex flex-col bg-white rounded-r-3xl">
            {/* Chat Header */}
            {selectedConversation ? (
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <Link
                                to="/network"
                                className="lg:hidden text-gray-600 hover:text-gray-900"
                            >
                                <FaArrowLeft />
                            </Link>
                            <img
                                src={selectedConversation.user?.profilePhoto || `https://ui-avatars.com/api/?name=${selectedConversation.user?.fullName}&background=random`}
                                alt={selectedConversation.user?.fullName}
                                className="w-10 h-10 rounded-2xl object-cover"
                            />
                            <div>
                                <h3 className="font-bold text-gray-900">
                                    {selectedConversation.user?.fullName}
                                </h3>
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-xs text-gray-600">Online</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button className="p-2 hover:bg-gray-100 rounded-xl">
                                <FaPhone className="text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-xl">
                                <FaVideo className="text-gray-600" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-xl">
                                <FaEllipsisV className="text-gray-600" />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">Select a conversation</h3>
                    </div>
                </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {selectedConversation ? (
                    <AnimatePresence>
                        {messages.map((message, index) => renderMessage(message, index))}
                        {typingUsers[selectedConversation.userId] && (
                            <div className="flex justify-start mb-3">
                                <div className="px-4 py-3 bg-gray-100 rounded-2xl rounded-tl-none">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </AnimatePresence>
                ) : (
                    <div className="h-full flex items-center justify-center">
                        <div className="text-center">
                            <FaPaperPlane className="text-4xl text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-700">Select a conversation</h3>
                            <p className="text-gray-500">Choose a conversation from the list to start messaging</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Message Input */}
            {selectedConversation && (
                <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
                    <div className="flex items-center space-x-3">
                        <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-4">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current.click()}
                                className="p-2 text-gray-500 hover:text-gray-700"
                            >
                                <FaPaperclip />
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileUpload}
                                accept="image/*, .pdf, .doc, .docx"
                            />
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage(e)}
                                onKeyDown={handleTyping}
                                onKeyUp={handleStopTyping}
                                placeholder="Type your message..."
                                className="flex-1 py-3 px-2 bg-transparent focus:outline-none text-sm"
                            />
                            <button
                                type="button"
                                className="p-2 text-gray-500 hover:text-gray-700"
                            >
                                <FaSmile />
                            </button>
                        </div>
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={!newMessage.trim() || sending}
                            className="p-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {sending ? (
                                <FaSpinner className="animate-spin" />
                            ) : (
                                <FaPaperPlane />
                            )}
                        </motion.button>
                    </div>
                </form>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20 pb-16">
            <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200 mb-4 group"
                    >
                        <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                        Back to Dashboard
                    </Link>
                    
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">Messages</h1>
                        <p className="text-gray-600 mt-2">Connect and chat with your professional network</p>
                    </div>
                </div>

                {/* Main Chat Container */}
                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden h-[calc(100vh-180px)]">
                    <div className="flex h-full">
                        {/* Conversation List (Hidden on mobile when chat is open) */}
                        <div className={`${
                            selectedConversation ? 'hidden lg:block' : 'block'
                        } w-full lg:w-1/3`}>
                            {renderConversationList()}
                        </div>
                        
                        {/* Chat Area */}
                        <div className={`${
                            selectedConversation ? 'block' : 'hidden lg:block'
                        } flex-1`}>
                            {renderChatArea()}
                        </div>
                        
                        {/* Back button for mobile when chat is open */}
                        {selectedConversation && (
                            <button
                                onClick={() => setSelectedConversation(null)}
                                className="lg:hidden absolute top-4 left-4 p-2 bg-white rounded-xl shadow-lg"
                            >
                                <FaArrowLeft />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messages;