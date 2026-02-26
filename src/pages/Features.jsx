import React from 'react';
import { motion } from 'framer-motion';
import {
    FaRobot,
    FaChartLine,
    FaUserCheck,
    FaFileAlt,
    FaComments,
    FaBullseye,
    FaShieldAlt,
    FaLightbulb,
    FaRocket,
    FaGlobe,
    FaUsers,
    FaCogs,
    FaMobileAlt,
    FaLock,
    FaBell,
    FaSync,
    FaCloud
} from 'react-icons/fa';
import { Link } from 'react-router';

const Features = () => {
    const features = [
        {
            icon: FaRobot,
            title: "AI-Powered Job Matching",
            description: "Our advanced AI algorithm analyzes your skills, experience, and preferences to match you with the perfect job opportunities.",
            color: "from-blue-500 to-cyan-500",
            points: [
                "Intelligent skill matching",
                "Personalized job recommendations",
                "Real-time opportunity updates"
            ]
        },
        {
            icon: FaChartLine,
            title: "Smart Career Analytics",
            description: "Get insights into your career growth with detailed analytics and performance tracking.",
            color: "from-purple-500 to-pink-500",
            points: [
                "Career progression tracking",
                "Salary trend analysis",
                "Skill gap identification"
            ]
        },
        {
            icon: FaUserCheck,
            title: "Personalized Career Coach",
            description: "Your virtual career coach provides tailored advice and guidance at every step of your journey.",
            color: "from-green-500 to-emerald-500",
            points: [
                "24/7 career guidance",
                "Personalized learning paths",
                "Goal setting and tracking"
            ]
        },
        {
            icon: FaFileAlt,
            title: "Resume Optimization",
            description: "Transform your resume with AI-powered analysis and optimization for better visibility.",
            color: "from-orange-500 to-red-500",
            points: [
                "ATS-friendly formatting",
                "Keyword optimization",
                "Real-time scoring"
            ]
        },
        {
            icon: FaComments,
            title: "AI Interview Prep",
            description: "Practice with our AI interviewer that simulates real interviews and provides instant feedback.",
            color: "from-indigo-500 to-blue-500",
            points: [
                "Mock interviews",
                "Real-time feedback",
                "Common question database"
            ]
        },
        {
            icon: FaBullseye,
            title: "Smart Job Search",
            description: "Advanced search capabilities with intelligent filters and predictive job suggestions.",
            color: "from-teal-500 to-cyan-500",
            points: [
                "Advanced filtering",
                "Location-based opportunities",
                "Company culture matching"
            ]
        }
    ];

    const stats = [
        { number: "98%", label: "User Satisfaction", icon: FaUsers },
        { number: "10K+", label: "Jobs Matched", icon: FaBullseye },
        { number: "85%", label: "Interview Success", icon: FaUserCheck },
        { number: "24/7", label: "AI Support", icon: FaRobot }
    ];

    const howItWorks = [
        {
            step: "01",
            title: "Create Your Profile",
            description: "Sign up and build your comprehensive career profile with skills, experience, and preferences.",
            icon: FaUserCheck
        },
        {
            step: "02",
            title: "AI Analysis",
            description: "Our AI analyzes your profile and matches you with suitable opportunities.",
            icon: FaCogs
        },
        {
            step: "03",
            title: "Get Recommendations",
            description: "Receive personalized job recommendations and career advice.",
            icon: FaBell
        },
        {
            step: "04",
            title: "Apply & Succeed",
            description: "Apply with confidence using our optimized tools and track your progress.",
            icon: FaRocket
        }
    ];

    const testimonials = [
        {
            name: "Sarah Chen",
            role: "Software Engineer",
            company: "TechCorp Inc.",
            content: "CareerConnect AI helped me land my dream job in just 2 weeks! The AI matching was incredibly accurate.",
            avatarColor: "bg-blue-100"
        },
        {
            name: "Michael Rodriguez",
            role: "Marketing Director",
            company: "GrowthLabs",
            content: "The resume optimization feature increased my interview calls by 70%. Highly recommended!",
            avatarColor: "bg-green-100"
        },
        {
            name: "Priya Sharma",
            role: "Product Manager",
            company: "InnovateX",
            content: "The AI interview prep was a game-changer. I felt completely prepared for every question.",
            avatarColor: "bg-purple-100"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
                <div className="relative w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                            <FaRocket className="text-sm" />
                            <span>AI-Powered Career Platform</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                            Transform Your Career With
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 ml-3">
                                AI Intelligence
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
                            Discover how CareerConnect AI revolutionizes job searching with cutting-edge artificial intelligence,
                            personalized recommendations, and smart career tools.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/auth/sign-up"
                                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg"
                            >
                                <FaRocket className="mr-2" />
                                Start Free Trial
                            </Link>
                            <Link
                                to="/demo"
                                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all duration-300"
                            >
                                <FaRobot className="mr-2" />
                                See AI in Action
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white">
                <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8"
                    >
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className="text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 mb-4">
                                    <stat.icon className="text-2xl text-blue-600" />
                                </div>
                                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                                <div className="text-gray-600 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 bg-gray-50">
                <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Powerful Features That
                            <span className="text-blue-600 ml-3">Transform Careers</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Everything you need to succeed in your career journey, powered by artificial intelligence.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -10, scale: 1.02 }}
                                className="bg-white rounded-3xl shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300"
                            >
                                <div className={`h-2 bg-gradient-to-r ${feature.color}`}></div>
                                <div className="p-8">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-50 to-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                        <feature.icon className={`text-3xl bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                                    <p className="text-gray-600 mb-6">{feature.description}</p>
                                    <ul className="space-y-3">
                                        {feature.points.map((point, idx) => (
                                            <li key={idx} className="flex items-center text-gray-700">
                                                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 mr-3"></div>
                                                {point}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-white">
                <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            How It
                            <span className="text-blue-600 ml-3">Works</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Four simple steps to your dream career with AI-powered assistance.
                        </p>
                    </motion.div>

                    <div className="relative">
                        {/* Connection Line */}
                        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 transform -translate-y-1/2"></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {howItWorks.map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    className="relative"
                                >
                                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 h-full">
                                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-2xl font-bold mb-6 shadow-lg">
                                            {step.step}
                                        </div>
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 mb-6">
                                            <step.icon className="text-2xl text-blue-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-4">{step.title}</h3>
                                        <p className="text-gray-600">{step.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Success
                            <span className="text-blue-600 ml-3">Stories</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Hear from professionals who transformed their careers with CareerConnect AI.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -10 }}
                                className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
                            >
                                <div className="flex items-center mb-6">
                                    <div className={`w-16 h-16 rounded-full ${testimonial.avatarColor} flex items-center justify-center text-2xl font-bold text-gray-700 mr-4`}>
                                        {testimonial.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                                        <p className="text-gray-600">{testimonial.role}</p>
                                        <p className="text-blue-600 text-sm">{testimonial.company}</p>
                                    </div>
                                </div>
                                <p className="text-gray-700 italic mb-6">"{testimonial.content}"</p>
                                <div className="flex text-yellow-400">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <svg key={star} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
                <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Ready to Transform Your Career?
                        </h2>
                        <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
                            Join thousands of professionals who found their dream jobs with AI-powered CareerConnect.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                to="/auth/sign-up"
                                className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold text-blue-600 bg-white rounded-2xl hover:bg-gray-50 hover:scale-105 transition-all duration-300 shadow-2xl"
                            >
                                <FaRocket className="mr-3" />
                                Start Free Trial - No Credit Card
                            </Link>
                            <Link
                                to="/features"
                                className="inline-flex items-center justify-center px-10 py-5 text-lg font-semibold text-white border-2 border-white/30 rounded-2xl hover:bg-white/10 hover:scale-105 transition-all duration-300"
                            >
                                <FaChartLine className="mr-3" />
                                View All Features
                            </Link>
                        </div>
                        <p className="text-blue-200 mt-8 text-sm">
                            ✓ 14-day free trial • ✓ No credit card required • ✓ Cancel anytime
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-6">
                                <FaRobot className="text-2xl text-blue-400" />
                                <span className="text-xl font-bold">CareerConnect AI</span>
                            </div>
                            <p className="text-gray-400">
                                Revolutionizing career growth with artificial intelligence and smart technology.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-6">Features</h4>
                            <ul className="space-y-3 text-gray-400">
                                <li><Link to="/ai-matching" className="hover:text-white transition-colors">AI Job Matching</Link></li>
                                <li><Link to="/resume-optimizer" className="hover:text-white transition-colors">Resume Optimizer</Link></li>
                                <li><Link to="/interview-prep" className="hover:text-white transition-colors">Interview Prep</Link></li>
                                <li><Link to="/career-analytics" className="hover:text-white transition-colors">Career Analytics</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-6">Company</h4>
                            <ul className="space-y-3 text-gray-400">
                                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                                <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                                <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-6">Connect</h4>
                            <p className="text-gray-400 mb-4">
                                Stay updated with the latest career insights and AI advancements.
                            </p>
                            <div className="flex space-x-4">
                                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 cursor-pointer transition-colors">
                                    <FaGlobe />
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 cursor-pointer transition-colors">
                                    <FaUsers />
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 cursor-pointer transition-colors">
                                    <FaCloud />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                        <p>© {new Date().getFullYear()} CareerConnect AI. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Features;