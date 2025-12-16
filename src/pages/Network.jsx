import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  FaUser, 
  FaBriefcase, 
  FaMapMarkerAlt, 
  FaEnvelope, 
  FaCheck, 
  FaTimes, 
  FaUserPlus, 
  FaUserCheck, 
  FaClock, 
  FaUsers,
  FaSearch,
  FaFilter,
  FaSpinner,
  FaArrowLeft,
  FaTrash
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router';

const Network = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [connections, setConnections] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalConnections: 0,
    pendingRequests: 0,
    sentRequests: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProfession, setFilterProfession] = useState('');

  useEffect(() => {
    if (user) {
      loadNetworkData();
    }
  }, [user, activeTab]);

  const loadNetworkData = async () => {
    try {
      setLoading(true);
      
      // Load based on active tab
      switch (activeTab) {
        case 'all':
          await loadAllUsers();
          break;
        case 'connections':
          await loadConnections();
          break;
        case 'pending':
          await loadPendingRequests();
          break;
        case 'sent':
          await loadSentRequests();
          break;
        case 'suggestions':
          await loadSuggestions();
          break;
      }
      
      await loadStats();
    } catch (error) {
      console.error('Error loading network data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users');
      const data = await response.json();
      
      if (data.success) {
        // Filter out current user and check connection status
        const usersWithStatus = await Promise.all(
          data.users
            .filter(u => u.uid !== user.uid)
            .map(async (userItem) => {
              const statusResponse = await fetch(
                `http://localhost:5000/api/connections/status/${user.uid}/${userItem.uid}`
              );
              const statusData = await statusResponse.json();
              
              return {
                ...userItem,
                connectionStatus: statusData.status || null,
                connectionId: statusData.connectionId
              };
            })
        );
        
        setConnections(usersWithStatus);
      }
    } catch (error) {
      console.error('Error loading all users:', error);
    }
  };

  const loadConnections = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/connections/user/${user.uid}?status=accepted`);
      const data = await response.json();
      
      if (data.success) {
        setConnections(data.connections.map(conn => ({
          ...conn.otherUser,
          connectionId: conn._id,
          connectionStatus: 'accepted',
          connectedSince: conn.respondedAt
        })));
      }
    } catch (error) {
      console.error('Error loading connections:', error);
    }
  };

  const loadPendingRequests = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/connections/pending/${user.uid}`);
      const data = await response.json();
      
      if (data.success) {
        setPendingRequests(data.requests);
      }
    } catch (error) {
      console.error('Error loading pending requests:', error);
    }
  };

  const loadSentRequests = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/connections/sent/${user.uid}`);
      const data = await response.json();
      
      if (data.success) {
        setSentRequests(data.requests);
      }
    } catch (error) {
      console.error('Error loading sent requests:', error);
    }
  };

  const loadSuggestions = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/connections/suggestions/${user.uid}`);
      const data = await response.json();
      
      if (data.success) {
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error('Error loading suggestions:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/connections/stats/${user.uid}`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const sendConnectionRequest = async (receiverId) => {
    try {
      const response = await fetch('http://localhost:5000/api/connections/send-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderId: user.uid,
          receiverId,
          message: `Hi, I'd like to connect with you on Career Connect AI!`
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        await loadNetworkData();
        await loadStats();
      }
    } catch (error) {
      console.error('Error sending connection request:', error);
    }
  };

  const acceptConnectionRequest = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/connections/accept-request/${requestId}`, {
        method: 'POST',
      });

      const data = await response.json();
      
      if (data.success) {
        await loadNetworkData();
        await loadStats();
      }
    } catch (error) {
      console.error('Error accepting connection request:', error);
    }
  };

  const rejectConnectionRequest = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/connections/reject-request/${requestId}`, {
        method: 'POST',
      });

      const data = await response.json();
      
      if (data.success) {
        await loadNetworkData();
        await loadStats();
      }
    } catch (error) {
      console.error('Error rejecting connection request:', error);
    }
  };

  const withdrawConnectionRequest = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/connections/withdraw-request/${requestId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        await loadNetworkData();
        await loadStats();
      }
    } catch (error) {
      console.error('Error withdrawing connection request:', error);
    }
  };

  const removeConnection = async (connectionId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/connections/remove-connection/${connectionId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        await loadNetworkData();
        await loadStats();
      }
    } catch (error) {
      console.error('Error removing connection:', error);
    }
  };

  const filteredConnections = connections.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.profession?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesProfession = filterProfession === '' || 
      user.profession === filterProfession;
    
    return matchesSearch && matchesProfession;
  });

  const tabs = [
    { id: 'all', label: 'All', icon: FaUsers, count: connections.length },
    { id: 'connections', label: 'Connections', icon: FaUserCheck, count: stats.totalConnections },
    { id: 'pending', label: 'Pending', icon: FaClock, count: stats.pendingRequests },
    { id: 'sent', label: 'Sent', icon: FaEnvelope, count: stats.sentRequests },
    { id: 'suggestions', label: 'Suggestions', icon: FaUserPlus, count: suggestions.length }
  ];

  const ConnectionCard = ({ user, isRequest = false, request = null }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg"
    >
      <div className="flex flex-col space-x-4">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-blue-50">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FaUser className="text-blue-400 text-xl" />
              </div>
            )}
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 truncate">
            {user.displayName || 'Anonymous User'}
          </h3>
          <div className="flex items-center space-x-4 mt-2">
            {user.profession && (
              <div className="flex items-center text-sm text-gray-600">
                <FaBriefcase className="mr-2 text-gray-400" />
                <span>{user?.profession}</span>
              </div>
            )}
            {user.location && (
              <div className="flex items-center text-sm text-gray-600">
                <FaMapMarkerAlt className="mr-2 text-gray-400" />
                <span>{user?.location}</span>
              </div>
            )}
          </div>
          
          {isRequest && request?.message && (
            <p className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              "{request.message}"
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-2">
          {!isRequest && user.connectionStatus === 'accepted' && (
            <>
              <button
                onClick={() => window.open(`mailto:${user.email}`, '_blank')}
                className="flex items-center justify-center px-4 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-semibold hover:bg-blue-100 transition-colors"
              >
                <FaEnvelope className="mr-2" />
                Message
              </button>
              <button
                onClick={() => removeConnection(user.connectionId)}
                className="flex items-center justify-center px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors"
              >
                <FaTrash className="mr-2" />
                Remove
              </button>
            </>
          )}

          {!isRequest && user.connectionStatus === 'pending' && user.senderId === user.uid && (
            <button
              onClick={() => withdrawConnectionRequest(user.connectionId)}
              className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
            >
              <FaTimes className="mr-2" />
              Withdraw
            </button>
          )}

          {!isRequest && !user.connectionStatus && (
            <button
              onClick={() => sendConnectionRequest(user.uid)}
              className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors hover:shadow-lg hover:shadow-blue-500/25 max-w-xs"
            >
              <FaUserPlus className="mr-2" />
              Connect
            </button>
          )}

          {isRequest && (
            <div className="flex space-x-2">
              <button
                onClick={() => acceptConnectionRequest(request._id)}
                className="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors hover:shadow-lg hover:shadow-green-500/25"
              >
                <FaCheck className="mr-2" />
                Accept
              </button>
              <button
                onClick={() => rejectConnectionRequest(request._id)}
                className="flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors hover:shadow-lg hover:shadow-red-500/25"
              >
                <FaTimes className="mr-2" />
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  const ProfessionFilter = () => {
  };

  if (loading && activeTab === 'all') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <FaSpinner className="animate-spin text-4xl text-blue-500" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8">
      <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Network</h1>
              <p className="text-gray-600 mt-2">
                Connect with professionals and grow your career network
              </p>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-2xl overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex-1 justify-center ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="mr-2" />
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6 flex flex-col space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by name or profession..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          {activeTab === 'all' && <ProfessionFilter />}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <FaSpinner className="animate-spin text-4xl text-blue-500" />
            </div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6"
            >
              {activeTab === 'pending' && (
                pendingRequests.length > 0 ? (
                  pendingRequests.map((request) => (
                    <ConnectionCard
                      key={request._id}
                      user={request.sender}
                      isRequest={true}
                      request={request}
                    />
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12 flex flex-col items-center">
                    <div className="text-gray-400 text-4xl mb-4">
                      <FaClock />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      No pending requests
                    </h3>
                    <p className="text-gray-500">
                      When someone sends you a connection request, it will appear here.
                    </p>
                  </div>
                )
              )}

              {activeTab === 'sent' && (
                sentRequests.length > 0 ? (
                  sentRequests.map((request) => (
                    <ConnectionCard
                      key={request._id}
                      user={request.receiver}
                      isRequest={false}
                    />
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12 flex flex-col items-center">
                    <div className="text-gray-400 text-4xl mb-4">
                      <FaEnvelope />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      No sent requests
                    </h3>
                    <p className="text-gray-500">
                      Connection requests you send will appear here.
                    </p>
                  </div>
                )
              )}

              {activeTab === 'suggestions' && (
                suggestions.length > 0 ? (
                  suggestions.map((user) => (
                    <ConnectionCard
                      key={user.uid}
                      user={user}
                      isRequest={false}
                    />
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12 flex flex-col items-center">
                    <div className="text-gray-400 text-4xl mb-4">
                      <FaUserPlus />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      No suggestions available
                    </h3>
                    <p className="text-gray-500">
                      We'll suggest connections based on your profile.
                    </p>
                  </div>
                )
              )}

              {(activeTab === 'all' || activeTab === 'connections') && (
                filteredConnections.length > 0 ? (
                  filteredConnections.map((user) => (
                    <ConnectionCard
                      key={user.uid}
                      user={user}
                      isRequest={false}
                    />
                  ))
                ) : (
                  <div className="col-span-2 text-center py-12 flex flex-col items-center">
                    <div className="text-gray-400 text-4xl mb-4">
                      {activeTab === 'connections' ? <FaUserCheck /> : <FaUsers />}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                      {activeTab === 'connections' ? 'No connections yet' : 'No users found'}
                    </h3>
                    <p className="text-gray-500">
                      {activeTab === 'connections' 
                        ? 'Start connecting with other professionals!' 
                        : 'Try adjusting your search or filter.'}
                    </p>
                  </div>
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Network;