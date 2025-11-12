import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaHome,
  FaUsers,
  FaComments,
  FaBell,
  FaUserPlus,
  FaTimes,
  FaBars,
  FaSearch,
  FaUser,
  FaCog,
  FaFileAlt,
  FaFilePdf,
  FaVideo,
  FaChartBar,
  FaSignOutAlt,
  FaCrown,
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, userProfile, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  const navItems = [
    { path: '/', name: 'Home', icon: FaHome },
    { path: '/network', name: 'Network', icon: FaUsers },
    { path: '/messages', name: 'Messages', icon: FaComments },
    { path: '/notification', name: 'Notification', icon: FaBell },
  ];

  const drawerItems = [
    { path: '/dashboard', name: 'Dashboard', icon: FaUser },
    { path: '/pricing', name: 'Pricing', icon: FaCrown },
    { path: '/create-resume', name: 'Create Resume', icon: FaFileAlt },
    { path: '/create-cv', name: 'Create CV', icon: FaFilePdf },
    { path: '/mock-interview', name: 'Mock Interview', icon: FaVideo },
    { path: '/ats-score', name: 'ATS Score Check', icon: FaChartBar },
    { path: '/settings', name: 'Settings', icon: FaCog },
  ];

  const menuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    },
  };

  const drawerVariants = {
    closed: {
      x: '100%',
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1]
      }
    },
    open: {
      x: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    },
  };

  const itemVariants = {
    closed: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2
      }
    },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    },
  };

  const floatingNavVariants = {
    hidden: {
      y: -20,
      opacity: 0,
      scale: 0.95
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsDrawerOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const getDisplayName = () => {
    if (userProfile?.displayName) return userProfile.displayName;
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const getProfilePhoto = () => {
    if (userProfile?.photoURL) return userProfile.photoURL;
    if (user?.photoURL) return user.photoURL;
    return '/default-avatar.png';
  };

  const getEmail = () => {
    if (userProfile?.email) return userProfile.email;
    if (user?.email) return user.email;
    return '';
  };

  return (
    <>
      {/* Main Navbar */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: 0.6,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
        className="bg-white/90 backdrop-blur-2xl shadow-sm border-b border-gray-100/80 sticky top-0 z-50"
      >
        <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center"
            >
              <NavLink to="/" className="flex items-center space-x-3">
                <div>
                  <img src="/logo.jpg" alt="LOGO" className='h-10 w-10' />
                </div>
                <div className='flex flex-col hidden lg:flex'>
                  <span className=' text-2xl font-bold text-blue-500'>Career</span>
                  <span className='text-sm font-bold text-blue-400'>Connect AI</span>
                </div>
              </NavLink>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="hidden lg:flex flex-1 max-w-2xl mx-8"
            >
              <div className="relative w-full group">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm transition-colors duration-200 group-focus-within:text-blue-500" />
                <input
                  type="text"
                  placeholder="Search jobs, companies, or skills..."
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50/70 border border-gray-200/80 rounded-2xl focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300 backdrop-blur-sm text-sm font-medium placeholder-gray-400 group-hover:bg-white/80 "
                />
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-2 px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 relative group ${isActive
                        ? 'text-blue-600 border border-blue-200/50'
                        : 'text-gray-600 hover:text-blue-600 backdrop-blur-2xl hover:shadow-lg '
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon
                          className={`text-base transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'
                            }`}
                        />
                        <span>{item.name}</span>
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 border-2 border-blue-500/30 rounded-2xl"
                            layoutId="activeNav"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                </motion.div>
              ))}
            </div>

            {/* User Profile & Auth */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="hidden md:flex items-center space-x-3"
            >
              {user ? (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center space-x-3"
                >
                  <button
                    onClick={toggleDrawer}
                    className="flex items-center space-x-3 p-2 rounded-2xl hover:bg-gray-50/80 transition-all duration-200 cursor-pointer"
                  >
                    <img
                      src={getProfilePhoto()}
                      alt="Profile"
                      className="w-10 h-10 rounded-full border-2 border-blue-200/50 object-cover"
                    />
                  </button>
                </motion.div>
              ) : (
                <motion.button
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 20px 40px -10px rgba(59, 130, 246, 0.4)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/auth/login')}
                  className="bg-blue-400 text-white ml-4 px-7 py-2.5 cursor-pointer rounded-2xl text-sm font-semibold hover:shadow-xl transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-blue-500/25"
                >
                  <FaUserPlus className="text-sm" />
                  <span>Get Started</span>
                </motion.button>
              )}
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.div
              whileHover="hover"
              whileTap="tap"
              className="md:hidden flex items-center"
            >
              <button
                onClick={toggleMenu}
                className="text-gray-600 hover:text-blue-600 focus:outline-none p-2.5 rounded-2xl hover:bg-white/80 transition-all duration-200 border border-transparent hover:border-gray-200/50"
              >
                {isMenuOpen ? (
                  <FaTimes className="text-xl" />
                ) : (
                  <FaBars className="text-xl" />
                )}
              </button>
            </motion.div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="md:hidden bg-white/95 backdrop-blur-2xl border-t border-gray-200/50 overflow-hidden"
            >
              <div className="px-4 pt-3 pb-6 space-y-2">
                {/* Mobile Search */}
                <motion.div
                  variants={itemVariants}
                  className="pb-3"
                >
                  <div className="relative group">
                    <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm group-focus-within:text-blue-500" />
                    <input
                      type="text"
                      placeholder="Search jobs, companies..."
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50/70 border border-gray-200/80 rounded-2xl focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300 text-sm font-medium placeholder-gray-400"
                    />
                  </div>
                </motion.div>

                {/* Mobile Auth */}
                {/* <motion.div
                  variants={itemVariants}
                  className="flex space-x-3 pt-4 border-t border-gray-200/50 mt-4"
                >
                  {user ? (
                    <div className="flex items-center space-x-3 w-full">
                      <img
                        src={getProfilePhoto()}
                        alt="Profile"
                        className="w-12 h-12 rounded-full border-2 border-blue-200/50 object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">{getDisplayName()}</p>
                        <p className="text-xs text-gray-500">{getEmail()}</p>
                      </div>
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate('/auth/login')}
                      className="flex-1 bg-blue-400 text-white px-4 py-3.5 rounded-2xl cursor-pointer text-base font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/25"
                    >
                      <FaUserPlus className="text-base" />
                      <span>Get Started</span>
                    </motion.button>
                  )}
                </motion.div> */}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Floating Bottom Nav (Mobile) */}
      <motion.div
        variants={floatingNavVariants}
        initial="hidden"
        animate="visible"
        className="md:hidden fixed bottom-0 w-full bg-white/95 backdrop-blur-2xl border border-gray-200/80 shadow-xl shadow-black/10 z-50"
      >
        <div className="flex justify-between items-center h-16 px-2">
          {navItems.map((item) => (
            <motion.div
              key={item.path}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex-1 relative"
            >
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center w-full h-14 rounded-xl transition-all duration-300 relative ${isActive
                    ? 'text-blue-600 bg-blue-50/80'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-white/80'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={`text-lg transition-transform duration-200 ${isActive ? 'scale-110' : ''
                        }`}
                    />
                    <span className="text-[10px] font-semibold mt-1">{item.name}</span>
                    {isActive && (
                      <motion.div
                        className="absolute -top-1 w-1.5 h-1.5 bg-blue-500 rounded-full"
                        layoutId="floatingActive"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            </motion.div>
          ))}
          {user && (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex-1 relative"
            >
              <button
                onClick={toggleDrawer}
                className="flex flex-col items-center justify-center w-full h-14 rounded-xl transition-all duration-300 text-gray-600 hover:text-blue-600 hover:bg-white/80"
              >
                <img
                  src={getProfilePhoto()}
                  alt="Profile"
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="text-[10px] font-semibold mt-1">Profile</span>
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Profile Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleDrawer}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            
            {/* Drawer */}
            <motion.div
              variants={drawerVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-2xl shadow-2xl border-l border-gray-200/50 z-50 overflow-y-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-gray-900">Profile</h2>
                  <button
                    onClick={toggleDrawer}
                    className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                  >
                    <FaTimes className="text-gray-600" />
                  </button>
                </div>

                {/* User Info */}
                <div className="flex items-center space-x-4 mb-8 pb-6 border-b border-gray-200/50">
                  <img
                    src={getProfilePhoto()}
                    alt="Profile"
                    className="w-16 h-16 rounded-full border-2 border-blue-200/50 object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{getDisplayName()}</h3>
                    <p className="text-sm text-gray-500">{getEmail()}</p>
                  </div>
                </div>

                {/* Navigation Items */}
                <nav className="space-y-2 mb-8">
                  {drawerItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={toggleDrawer}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-blue-50 text-blue-600 border border-blue-200/50'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`
                      }
                    >
                      <item.icon className="text-base" />
                      <span>{item.name}</span>
                    </NavLink>
                  ))}
                </nav>

                {/* Logout Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-red-50 text-red-600 rounded-2xl border border-red-200/50 hover:bg-red-100 transition-all duration-200 font-medium"
                >
                  <FaSignOutAlt className="text-base" />
                  <span>Logout</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;