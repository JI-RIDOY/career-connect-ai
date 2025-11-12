import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FaChartLine,
    FaUserTie,
    FaBriefcase,
    FaBell,
    FaEnvelope,
    FaCog,
    FaSearch,
    FaFilter,
    FaCalendar,
    FaCheckCircle,
    FaClock,
    FaUsers,
    FaStar,
    FaEye,
    FaDownload,
    FaBars
} from 'react-icons/fa';
import { Link } from 'react-router';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({
        applications: 0,
        interviews: 0,
        profileViews: 0,
        recommendations: 0
    });

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Mock data - replace with actual API calls
    useEffect(() => {
        // Simulate loading data
        setTimeout(() => {
            setStats({
                applications: 24,
                interviews: 8,
                profileViews: 156,
                recommendations: 12
            });
        }, 1000);
    }, []);

    const tabs = [
        { id: 'overview', label: 'Overview', icon: FaChartLine },
        { id: 'jobs', label: 'Job Matches', icon: FaBriefcase },
        { id: 'applications', label: 'Applications', icon: FaUserTie },
        { id: 'interviews', label: 'Interviews', icon: FaCalendar },
    ];

    const recentApplications = [
        {
            id: 1,
            company: 'TechCorp Inc.',
            position: 'Senior Frontend Developer',
            status: 'Applied',
            date: '2024-01-15',
            matchScore: 92,
            statusColor: 'blue'
        },
        {
            id: 2,
            company: 'DataSystems LLC',
            position: 'Full Stack Engineer',
            status: 'Interview',
            date: '2024-01-12',
            matchScore: 88,
            statusColor: 'green'
        },
        {
            id: 3,
            company: 'StartUpXYZ',
            position: 'React Developer',
            status: 'Under Review',
            date: '2024-01-10',
            matchScore: 85,
            statusColor: 'yellow'
        },
        {
            id: 4,
            company: 'Enterprise Solutions',
            position: 'UI/UX Developer',
            status: 'Rejected',
            date: '2024-01-08',
            matchScore: 78,
            statusColor: 'red'
        }
    ];

    const upcomingInterviews = [
        {
            id: 1,
            company: 'TechCorp Inc.',
            position: 'Senior Frontend Developer',
            date: '2024-01-20',
            time: '10:00 AM',
            type: 'Technical Interview',
            participants: ['John Smith (Tech Lead)', 'Sarah Chen (HR)']
        },
        {
            id: 2,
            company: 'DataSystems LLC',
            position: 'Full Stack Engineer',
            date: '2024-01-22',
            time: '2:30 PM',
            type: 'Cultural Fit Interview',
            participants: ['Mike Johnson (Manager)']
        }
    ];

    const jobRecommendations = [
        {
            id: 1,
            title: 'Senior React Developer',
            company: 'Innovation Labs',
            location: 'Remote',
            salary: '$120k - $140k',
            match: 95,
            skills: ['React', 'TypeScript', 'Node.js'],
            posted: '2 days ago'
        },
        {
            id: 2,
            title: 'Frontend Architect',
            company: 'Digital Solutions',
            location: 'New York, NY',
            salary: '$140k - $160k',
            match: 88,
            skills: ['React', 'Architecture', 'Leadership'],
            posted: '1 day ago'
        },
        {
            id: 3,
            title: 'Full Stack Developer',
            company: 'StartUp Ventures',
            location: 'San Francisco, CA',
            salary: '$100k - $130k',
            match: 82,
            skills: ['React', 'Python', 'AWS'],
            posted: '3 days ago'
        }
    ];

    const statCards = [
        {
            title: 'Applications',
            value: stats.applications,
            change: '+12%',
            trend: 'up',
            icon: FaUserTie,
            color: 'blue'
        },
        {
            title: 'Interviews',
            value: stats.interviews,
            change: '+5%',
            trend: 'up',
            icon: FaCalendar,
            color: 'green'
        },
        {
            title: 'Profile Views',
            value: stats.profileViews,
            change: '+23%',
            trend: 'up',
            icon: FaEye,
            color: 'purple'
        },
        {
            title: 'Recommendations',
            value: stats.recommendations,
            change: '+8%',
            trend: 'up',
            icon: FaStar,
            color: 'orange'
        }
    ];

    const getStatusColorClass = (color) => {
        const colorMap = {
            blue: 'bg-blue-100 text-blue-800',
            green: 'bg-green-100 text-green-800',
            yellow: 'bg-yellow-100 text-yellow-800',
            red: 'bg-red-100 text-red-800'
        };
        return colorMap[color] || 'bg-gray-100 text-gray-800';
    };

    const getStatColorClass = (color) => {
        const colorMap = {
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600',
            purple: 'bg-purple-100 text-purple-600',
            orange: 'bg-orange-100 text-orange-600'
        };
        return colorMap[color] || 'bg-gray-100 text-gray-600';
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="space-y-4 md:space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                            {statCards.map((stat, index) => (
                                <motion.div
                                    key={stat.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{stat.title}</p>
                                            <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 sm:mt-2">{stat.value}</p>
                                        </div>
                                        <div className={`p-2 sm:p-3 rounded-xl md:rounded-2xl ${getStatColorClass(stat.color).split(' ')[0]} ml-3 flex-shrink-0`}>
                                            <stat.icon className={`text-lg sm:text-xl md:text-2xl ${getStatColorClass(stat.color).split(' ')[1]}`} />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
                            {/* Recent Applications */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100"
                            >
                                <div className="flex items-center justify-between mb-4 md:mb-6">
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Applications</h3>
                                    <Link to="/applications" className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium">
                                        View All
                                    </Link>
                                </div>
                                <div className="space-y-3 md:space-y-4">
                                    {recentApplications.map((app) => (
                                        <div key={app.id} className="flex items-center justify-between p-3 md:p-4 border border-gray-200 rounded-xl md:rounded-2xl hover:border-blue-300 transition-colors">
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{app.position}</h4>
                                                <p className="text-xs sm:text-sm text-gray-600 truncate">{app.company}</p>
                                                <div className="flex items-center space-x-2 sm:space-x-4 mt-1 sm:mt-2 flex-wrap gap-y-1">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColorClass(app.statusColor)}`}>
                                                        {app.status}
                                                    </span>
                                                    <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">{app.date}</span>
                                                </div>
                                            </div>
                                            <div className="text-right ml-2 flex-shrink-0">
                                                <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-600">
                                                    <FaStar className="text-yellow-500 flex-shrink-0" />
                                                    <span className="whitespace-nowrap">{app.matchScore}% Match</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Upcoming Interviews */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100"
                            >
                                <div className="flex items-center justify-between mb-4 md:mb-6">
                                    <h3 className="text-base sm:text-lg font-semibold text-gray-900">Upcoming Interviews</h3>
                                    <Link to="/interviews" className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium">
                                        View All
                                    </Link>
                                </div>
                                <div className="space-y-3 md:space-y-4">
                                    {upcomingInterviews.map((interview) => (
                                        <div key={interview.id} className="p-3 md:p-4 border border-gray-200 rounded-xl md:rounded-2xl hover:border-green-300 transition-colors">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{interview.position}</h4>
                                                    <p className="text-xs sm:text-sm text-gray-600 truncate">{interview.company}</p>
                                                    <div className="flex items-center space-x-2 sm:space-x-4 mt-1 sm:mt-2 flex-wrap gap-y-1">
                                                        <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-500">
                                                            <FaCalendar className="text-blue-500 flex-shrink-0" />
                                                            <span className="whitespace-nowrap">{interview.date}</span>
                                                        </div>
                                                        <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-500">
                                                            <FaClock className="text-green-500 flex-shrink-0" />
                                                            <span className="whitespace-nowrap">{interview.time}</span>
                                                        </div>
                                                    </div>
                                                    <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2 truncate">{interview.type}</p>
                                                    <div className="mt-1 sm:mt-2">
                                                        <p className="text-xs text-gray-500">Participants:</p>
                                                        <p className="text-xs sm:text-sm text-gray-700 truncate">{interview.participants.join(', ')}</p>
                                                    </div>
                                                </div>
                                                <button className="ml-2 sm:ml-4 px-3 sm:px-4 py-2 bg-blue-500 text-white rounded-xl md:rounded-2xl text-xs sm:text-sm font-medium hover:bg-blue-600 transition-colors whitespace-nowrap flex-shrink-0">
                                                    Join
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>

                        {/* Job Recommendations */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100"
                        >
                            <div className="flex items-center justify-between mb-4 md:mb-6">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900">AI Job Recommendations</h3>
                                <Link to="/jobs" className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium">
                                    View All
                                </Link>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                {jobRecommendations.map((job) => (
                                    <div key={job.id} className="border border-gray-200 rounded-xl md:rounded-2xl p-3 md:p-4 hover:border-blue-300 transition-colors group">
                                        <div className="flex justify-between items-start mb-2 sm:mb-3">
                                            <div className="flex-1 min-w-0 mr-2">
                                                <h4 className="font-semibold text-gray-900 text-sm sm:text-base group-hover:text-blue-600 transition-colors truncate">
                                                    {job.title}
                                                </h4>
                                                <p className="text-xs sm:text-sm text-gray-600 truncate">{job.company}</p>
                                            </div>
                                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex-shrink-0">
                                                {job.match}% Match
                                            </span>
                                        </div>
                                        <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                                            <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-600">
                                                <FaBriefcase className="text-gray-400 flex-shrink-0" />
                                                <span className="truncate">{job.location}</span>
                                            </div>
                                            <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-600">
                                                <FaChartLine className="text-gray-400 flex-shrink-0" />
                                                <span className="truncate">{job.salary}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-1 mb-3 sm:mb-4">
                                            {job.skills.map((skill, index) => (
                                                <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full truncate max-w-[100px]">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500 whitespace-nowrap">{job.posted}</span>
                                            <button className="px-3 sm:px-4 py-2 bg-blue-500 text-white text-xs sm:text-sm font-medium rounded-xl md:rounded-2xl hover:bg-blue-600 transition-colors whitespace-nowrap">
                                                Apply Now
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                );

            case 'jobs':
                return (
                    <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 md:mb-6">Job Matches</h3>
                        <p className="text-gray-600 text-sm sm:text-base">Job matches content coming soon...</p>
                    </div>
                );

            case 'applications':
                return (
                    <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 md:mb-6">Applications</h3>
                        <p className="text-gray-600 text-sm sm:text-base">Applications content coming soon...</p>
                    </div>
                );

            case 'interviews':
                return (
                    <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 md:mb-6">Interviews</h3>
                        <p className="text-gray-600 text-sm sm:text-base">Interviews content coming soon...</p>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-4 sm:py-6 md:py-8">
            <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 md:mb-8"
                >
                    <div className="flex items-center justify-between w-full lg:w-auto">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
                            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Welcome back! Here's your career overview.</p>
                        </div>
                        <button
                            className="lg:hidden p-2 rounded-lg bg-white border border-gray-200 shadow-sm"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <FaSearch className="text-gray-600" />
                        </button>
                    </div>
                    <div className={`mt-4 lg:mt-0 w-full lg:w-auto ${isMobileMenuOpen ? 'block' : 'hidden'} lg:block`}>
                        <div className="relative max-w-md lg:max-w-xs xl:max-w-md">
                            <input
                                type="text"
                                placeholder="Search jobs, companies..."
                                className="w-full bg-white border border-gray-300 rounded-xl md:rounded-2xl pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                </motion.div>

                {/* Tab Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100 mb-4 md:mb-6"
                >
                    {/* Tab container */}
                    <div className="flex  overflow-x-auto">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex flex-col lg:flex-row items-center justify-center gap-1 lg:gap-5 lg:mx-5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm md:text-base whitespace-nowrap flex-1 md:flex-none rounded-lg transition-all duration-200 ${activeTab === tab.id
                                            ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                                            : 'border-b-2 border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                >
                                    <Icon className="text-sm sm:text-base md:text-lg" />
                                    <span className="font-medium">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </motion.div>


                {/* Tab Content */}
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {renderTabContent()}
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;