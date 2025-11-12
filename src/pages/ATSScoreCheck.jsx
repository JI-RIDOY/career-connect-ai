import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUpload, FaChartBar, FaLightbulb, FaStar, FaArrowLeft } from 'react-icons/fa';
import { Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

const ATSScoreCheck = () => {
    const { user } = useAuth();
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [jobTitle, setJobTitle] = useState('');
    const [company, setCompany] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
        } else {
            alert('Please upload a PDF file');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            alert('Please select a PDF file');
            return;
        }

        if (!user?.email) {
            alert('Please log in to use this feature');
            return;
        }

        setUploading(true);

        const formData = new FormData();
        formData.append('resume', file);
        formData.append('email', user.email);
        if (jobTitle) formData.append('jobTitle', jobTitle);
        if (company) formData.append('company', company);

        try {
            const response = await fetch('http://localhost:5000/api/ats/check-score', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                setAnalysis(data.data);
            } else {
                throw new Error(data.error || 'Analysis failed');
            }
        } catch (error) {
            console.error('Error analyzing resume:', error);
            alert('Failed to analyze resume. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 70) return 'text-yellow-600';
        if (score >= 60) return 'text-orange-600';
        return 'text-red-600';
    };

    const getScoreBgColor = (score) => {
        if (score >= 80) return 'bg-green-500';
        if (score >= 70) return 'bg-yellow-500';
        if (score >= 60) return 'bg-orange-500';
        return 'bg-red-500';
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center">
                    <FaChartBar className="text-6xl text-blue-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
                    <p className="text-gray-600 mb-6">Please log in to use the ATS Score Check feature.</p>
                    <Link
                        to="/auth/login"
                        className="bg-blue-500 text-white px-6 py-3 rounded-2xl hover:bg-blue-600 transition-colors duration-200 font-semibold"
                    >
                        Login Now
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <Link
                        to="/"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
                    >
                        <FaArrowLeft className="mr-2" />
                        Back to Home
                    </Link>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        ATS Resume Score Check
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Upload your resume to get an instant ATS compatibility score and personalized 
                        suggestions to improve your chances of getting noticed by employers.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Upload Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-white rounded-3xl shadow-2xl p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Job Information */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Target Job Title (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={jobTitle}
                                            onChange={(e) => setJobTitle(e.target.value)}
                                            placeholder="e.g., Frontend Developer"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Target Company (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={company}
                                            onChange={(e) => setCompany(e.target.value)}
                                            placeholder="e.g., Google, Microsoft"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {/* File Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Upload Your Resume (PDF only)
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors duration-200">
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                            className="hidden"
                                            id="resume-upload"
                                        />
                                        <label
                                            htmlFor="resume-upload"
                                            className="cursor-pointer"
                                        >
                                            <FaUpload className="text-4xl text-gray-400 mx-auto mb-4" />
                                            <p className="text-lg font-semibold text-gray-700 mb-2">
                                                {file ? file.name : 'Choose PDF file'}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {file ? 'Click to change file' : 'Drag & drop or click to upload'}
                                            </p>
                                        </label>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={uploading || !file}
                                    className="w-full bg-blue-500 text-white py-4 rounded-2xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-semibold text-lg flex items-center justify-center"
                                >
                                    {uploading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                                            Analyzing Resume...
                                        </>
                                    ) : (
                                        <>
                                            <FaChartBar className="mr-3" />
                                            Check ATS Score
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Results Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        {analysis ? (
                            <>
                                {/* Score Card */}
                                <div className="bg-white rounded-3xl shadow-2xl p-6">
                                    <div className="text-center">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                            Your ATS Score
                                        </h3>
                                        <div className="relative inline-block">
                                            <div className="w-32 h-32 rounded-full border-8 border-gray-100 flex items-center justify-center">
                                                <span className={`text-3xl font-bold ${getScoreColor(analysis.score)}`}>
                                                    {analysis.score}
                                                </span>
                                            </div>
                                            <div className={`absolute bottom-0 right-0 w-8 h-8 rounded-full ${getScoreBgColor(analysis.score)}`}>
                                                <FaStar className="text-white text-sm m-2" />
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-4">
                                            {analysis.score >= 80 ? 'Excellent! Your resume is well optimized for ATS.' :
                                             analysis.score >= 70 ? 'Good! Minor improvements can boost your score.' :
                                             analysis.score >= 60 ? 'Fair. Consider implementing the suggestions below.' :
                                             'Needs significant improvement to pass ATS screening.'}
                                        </p>
                                    </div>
                                </div>

                                {/* Strengths */}
                                {analysis.strengths && analysis.strengths.length > 0 && (
                                    <div className="bg-white rounded-3xl shadow-2xl p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                            <FaStar className="text-green-500 mr-2" />
                                            Strengths
                                        </h3>
                                        <ul className="space-y-2">
                                            {analysis.strengths.map((strength, index) => (
                                                <li key={index} className="flex items-start">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                                                    <span className="text-gray-700">{strength}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Improvements */}
                                {analysis.improvements && analysis.improvements.length > 0 && (
                                    <div className="bg-white rounded-3xl shadow-2xl p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                            <FaLightbulb className="text-yellow-500 mr-2" />
                                            Suggested Improvements
                                        </h3>
                                        <ul className="space-y-2">
                                            {analysis.improvements.map((improvement, index) => (
                                                <li key={index} className="flex items-start">
                                                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3"></div>
                                                    <span className="text-gray-700">{improvement}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Missing Keywords */}
                                {analysis.missingKeywords && analysis.missingKeywords.length > 0 && (
                                    <div className="bg-white rounded-3xl shadow-2xl p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                            Recommended Keywords
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {analysis.missingKeywords.map((keyword, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                                                >
                                                    {keyword}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            /* Placeholder when no analysis */
                            <div className="bg-white rounded-3xl shadow-2xl p-6 text-center">
                                <FaChartBar className="text-4xl text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                                    No Analysis Yet
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Upload your resume to see your ATS score and personalized recommendations.
                                </p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ATSScoreCheck;