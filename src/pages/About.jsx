import React from 'react';
import { motion } from 'framer-motion';
import {
    FaUsers,
    FaLightbulb,
    FaRocket,
    FaChartLine,
    FaAward,
    FaHeart,
    FaGlobeAmericas,
    FaHandshake,
    FaUserTie,
    FaStar,
    FaShieldAlt,
    FaCode
} from 'react-icons/fa';
import { Link } from 'react-router';

const About = () => {
    const stats = [
        { number: "10K+", label: "Job Seekers Helped", icon: <FaUsers className="text-blue-500" /> },
        { number: "95%", label: "Satisfaction Rate", icon: <FaStar className="text-yellow-500" /> },
        { number: "50K+", label: "Jobs Analyzed", icon: <FaChartLine className="text-green-500" /> },
        { number: "24/7", label: "AI Support", icon: <FaShieldAlt className="text-purple-500" /> },
    ];

    const team = [
        {
            name: "Alex Johnson",
            role: "CEO & Founder",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
            bio: "Former HR Director with 10+ years in recruitment tech"
        },
        {
            name: "Sarah Chen",
            role: "AI Research Lead",
            image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w-400&h=400&fit=crop&crop=face",
            bio: "PhD in Computer Science, specializing in NLP"
        },
        {
            name: "Marcus Rivera",
            role: "Product Designer",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
            bio: "UX expert focused on career development platforms"
        },
        {
            name: "Priya Sharma",
            role: "Career Strategist",
            image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
            bio: "15+ years as career coach and recruiter"
        },
    ];

    const values = [
        {
            icon: <FaLightbulb className="text-3xl" />,
            title: "Innovation",
            description: "Pioneering AI solutions for modern career challenges",
            color: "from-yellow-400 to-orange-500"
        },
        {
            icon: <FaHeart className="text-3xl" />,
            title: "Empathy",
            description: "Understanding the human side of career transitions",
            color: "from-pink-500 to-rose-600"
        },
        {
            icon: <FaHandshake className="text-3xl" />,
            title: "Integrity",
            description: "Transparent, ethical AI with human oversight",
            color: "from-blue-500 to-cyan-600"
        },
        {
            icon: <FaGlobeAmericas className="text-3xl" />,
            title: "Accessibility",
            description: "Making career advancement available to all",
            color: "from-green-500 to-emerald-600"
        },
    ];

    const features = [
        {
            title: "AI-Powered Matching",
            description: "Advanced algorithms that understand your skills, experience, and career aspirations to match you with perfect opportunities.",
            icon: <FaCode className="text-xl" />
        },
        {
            title: "Resume Intelligence",
            description: "Our AI analyzes your resume against job descriptions and provides actionable insights to improve your chances.",
            icon: <FaUserTie className="text-xl" />
        },
        {
            title: "Interview Simulation",
            description: "Practice with AI-powered mock interviews that adapt to your responses and provide real-time feedback.",
            icon: <FaRocket className="text-xl" />
        },
        {
            title: "Career Growth Path",
            description: "Personalized roadmap showing the skills and experiences needed to reach your career goals.",
            icon: <FaChartLine className="text-xl" />
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            {/* Hero Section */}
            <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center justify-center px-6 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-6">
                            <FaRocket className="mr-2" />
                            Transforming Career Journeys
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                            We're <span className="text-blue-600">Reimagining</span> Career Success
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
                            CareerConnect AI combines artificial intelligence with human insight to create 
                            the most effective career advancement platform ever built.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/auth/sign-up">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-semibold hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
                                >
                                    Start Your Journey
                                </motion.button>
                            </Link>
                            <Link to="/">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-white text-gray-800 px-8 py-3 rounded-2xl font-semibold border border-gray-200 hover:border-gray-300 transition-colors duration-300 shadow-lg hover:shadow-xl"
                                >
                                    Explore Features
                                </motion.button>
                            </Link>
                        </div>
                    </motion.div>

                    {/* Stats Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20"
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.1 * index }}
                                whileHover={{ y: -5, scale: 1.02 }}
                                className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 text-center"
                            >
                                <div className="flex justify-center mb-4">
                                    {stat.icon}
                                </div>
                                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                                <div className="text-gray-600 text-sm font-medium">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-700">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-white"
                        >
                            <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
                            <p className="text-lg text-blue-100 mb-6 leading-relaxed">
                                To democratize career advancement by making professional growth accessible, 
                                personalized, and data-driven for everyone, regardless of background or starting point.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <FaAward className="text-yellow-300 mt-1 mr-3 flex-shrink-0" />
                                    <p className="text-blue-100">Eliminate bias in hiring through objective AI analysis</p>
                                </div>
                                <div className="flex items-start">
                                    <FaChartLine className="text-yellow-300 mt-1 mr-3 flex-shrink-0" />
                                    <p className="text-blue-100">Provide real-time market insights and skill gap analysis</p>
                                </div>
                                <div className="flex items-start">
                                    <FaUsers className="text-yellow-300 mt-1 mr-3 flex-shrink-0" />
                                    <p className="text-blue-100">Create meaningful connections between talent and opportunity</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/20"
                        >
                            <h3 className="text-2xl font-bold text-white mb-6">Our Vision</h3>
                            <p className="text-blue-100 text-lg leading-relaxed">
                                We envision a world where career success is not determined by connections or 
                                circumstance, but by merit, potential, and ambition. A future where AI serves 
                                as a trusted career companion, helping individuals navigate their professional 
                                journey with confidence and clarity.
                            </p>
                            <div className="mt-8 p-4 bg-white/10 rounded-2xl">
                                <p className="text-white font-semibold italic">
                                    "The best way to predict the future is to create it."
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
                        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                            These principles guide every decision we make and every feature we build
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -10 }}
                                className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center group hover:shadow-2xl transition-all duration-300"
                            >
                                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${value.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    {value.icon}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Showcase */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">How We Help You Succeed</h2>
                        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                            Powered by cutting-edge AI technology and career expertise
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300"
                            >
                                <div className="flex items-start space-x-4">
                                    <div className="bg-blue-100 text-blue-600 p-3 rounded-2xl flex-shrink-0">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                        <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Leadership</h2>
                        <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                            A diverse team of innovators, researchers, and career experts
                        </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ y: -10 }}
                                className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden group hover:shadow-xl transition-all duration-300"
                            >
                                <div className="h-48 overflow-hidden">
                                    <img 
                                        src={member.image} 
                                        alt={member.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-6 text-center">
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
                                    <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                                    <p className="text-gray-600 text-sm">{member.bio}</p>
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <div className="flex justify-center space-x-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <FaStar key={star} className="text-yellow-400 text-sm" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-12 text-center text-white shadow-2xl"
                    >
                        <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Career?</h2>
                        <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
                            Join thousands of professionals who have accelerated their career growth with AI-powered guidance
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/auth/sign-up">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl"
                                >
                                    Get Started Free
                                </motion.button>
                            </Link>
                            <Link to="/">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-colors duration-300"
                                >
                                    Schedule Demo
                                </motion.button>
                            </Link>
                        </div>
                        
                        <p className="text-blue-200 text-sm mt-8">
                            No credit card required • 14-day free trial • Cancel anytime
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Footer Note */}
            <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-gray-600 text-sm">
                        © {new Date().getFullYear()} CareerConnect AI. All rights reserved.
                        <span className="mx-2">•</span>
                        Making career dreams a reality through AI innovation.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default About;