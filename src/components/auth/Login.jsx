// src/components/auth/Login.jsx
import React, { useState } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaGithub, 
  FaGoogle, 
  FaFacebook, 
  FaApple,
  FaPhone,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowLeft
} from 'react-icons/fa';

const Login = () => {
  const [loginMethod, setLoginMethod] = useState('email');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    password: ''
  });

  const loginMethods = [
    { id: 'email', name: 'Email', icon: FaEnvelope },
    { id: 'phone', name: 'Phone', icon: FaPhone },
  ];

  const socialLogins = [
    { name: 'Google', icon: FaGoogle, color: 'border border-gray-200 text-gray-700 hover:shadow-lg' },
    { name: 'GitHub', icon: FaGithub, color: 'border border-gray-200 text-gray-700 hover:shadow-lg' },
    { name: 'Facebook', icon: FaFacebook, color: 'border border-gray-200 text-gray-700 hover:shadow-lg' },
    { name: 'Apple', icon: FaApple, color: 'border border-gray-200 text-gray-700 hover:shadow-lg' },
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login data:', formData);
    // Handle login logic here
  };

  return (
    <div className="w-full">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-6"
      >
        <Link
          to="/"
          className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200 group"
        >
          <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Home
        </Link>
      </motion.div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-blue-500/10 border border-gray-100/80 p-8"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25"
          >
            <FaLock className="text-white text-2xl" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600">
            Sign in to continue your career journey
          </p>
        </div>

        {/* Login Method Tabs */}
        <div className="flex space-x-2 p-1 bg-gray-100/50 rounded-2xl mb-6">
          {loginMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setLoginMethod(method.id)}
              className={`flex-1 flex items-center justify-center py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                loginMethod === method.id
                  ? 'bg-white text-blue-600 shadow-lg shadow-blue-500/10'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <method.icon className="mr-2 text-base" />
              {method.name}
            </button>
          ))}
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence mode="wait">
            {loginMethod === 'phone' && (
              <motion.div
                key="phone"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative group">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50/70 border border-gray-200/80 rounded-2xl focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300 text-sm font-medium placeholder-gray-400 group-hover:bg-white/80"
                      required
                    />
                    <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm transition-colors duration-200 group-focus-within:text-blue-500" />
                  </div>
                </div>
              </motion.div>
            )}

            {loginMethod === 'email' && (
              <motion.div
                key="email"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative group">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="you@example.com"
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50/70 border border-gray-200/80 rounded-2xl focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300 text-sm font-medium placeholder-gray-400 group-hover:bg-white/80"
                      required
                    />
                    <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm transition-colors duration-200 group-focus-within:text-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative group">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      className="w-full pl-12 pr-12 py-3.5 bg-gray-50/70 border border-gray-200/80 rounded-2xl focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all duration-300 text-sm font-medium placeholder-gray-400 group-hover:bg-white/80"
                      required
                    />
                    <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm transition-colors duration-200 group-focus-within:text-blue-500" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Remember Me & Forgot Password */}
          {loginMethod === 'email' && (
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
                Forgot password?
              </a>
            </div>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ 
              scale: 1.02, 
              boxShadow: "0 20px 40px -10px rgba(59, 130, 246, 0.4)" 
            }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-blue-500 text-white py-4 px-6 rounded-2xl text-base font-semibold hover:shadow-xl transition-all duration-200 shadow-lg shadow-blue-500/25"
          >
            Sign In
          </motion.button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300/50"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white/90 text-gray-500">Or continue with</span>
          </div>
        </div>

        {/* Social Logins */}
        <div className="grid grid-cols-2 gap-3">
          {socialLogins.map((social) => (
            <motion.button
              key={social.name}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`${social.color} py-3 px-4 rounded-2xl text-sm font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 bg-white/50 backdrop-blur-sm`}
            >
              <social.icon className="text-base" />
              <span>{social.name}</span>
            </motion.button>
          ))}
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-8 pt-6 border-t border-gray-200/50">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/auth/sign-up"
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;