import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FaRobot,
    FaPaperPlane,
    FaCalendarAlt,
    FaBook,
    FaTasks,
    FaGraduationCap,
    FaClock,
    FaCheckCircle
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const LearningPathGenerator = () => {
    const { user } = useAuth();
    const [step, setStep] = useState(1); // 1: topic, 2: duration, 3: result
    const [selectedTopic, setSelectedTopic] = useState('');
    const [selectedDuration, setSelectedDuration] = useState('');
    const [learningPath, setLearningPath] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [customTopic, setCustomTopic] = useState('');
    const pathContainerRef = useRef(null);

    const popularTopics = [
        'Web Development',
        'Data Science',
        'Machine Learning',
        'Mobile Development',
        'UI/UX Design',
        'Digital Marketing',
        'Cloud Computing',
        'Cybersecurity',
        'Blockchain',
        'Artificial Intelligence'
    ];

    const durationOptions = [
        { weeks: 4, label: '1 Month' },
        { weeks: 8, label: '2 Months' },
        { weeks: 12, label: '3 Months' },
        { weeks: 16, label: '4 Months' },
        { weeks: 24, label: '6 Months' },
        { weeks: 52, label: '1 Year' }
    ];

    // Scroll to top when path is generated
    useEffect(() => {
        if (step === 3 && pathContainerRef.current) {
            pathContainerRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [step]);

    const handleTopicSelect = (topic) => {
        setSelectedTopic(topic);
        setCustomTopic('');
    };

    const handleCustomTopic = () => {
        if (customTopic.trim()) {
            setSelectedTopic(customTopic);
        }
    };

    const handleDurationSelect = (weeks) => {
        setSelectedDuration(weeks);
    };

    const generateLearningPath = async () => {
        if (!selectedTopic || !selectedDuration) return;

        setIsGenerating(true);
        try {
            const path = await queryGroqAI(selectedTopic, selectedDuration);
            setLearningPath(path);
            setStep(3);
        } catch (error) {
            console.error('Error generating learning path:', error);
            // Fallback path
            setLearningPath(generateFallbackPath());
            setStep(3);
        } finally {
            setIsGenerating(false);
        }
    };

    const generateFallbackPath = () => {
        const weeks = parseInt(selectedDuration);
        const path = [];
        
        for (let i = 1; i <= weeks; i++) {
            path.push({
                week: i,
                title: `Week ${i}: Core Concepts`,
                topics: [
                    `Introduction to key concepts for week ${i}`,
                    `Practical exercises and projects`,
                    `Review and assessment`
                ],
                resources: [
                    'Online tutorials',
                    'Practice projects',
                    'Community forums'
                ]
            });
        }
        
        return path;
    };

    const queryGroqAI = async (topic, durationWeeks) => {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: [
                    {
                        role: "system",
                        content: `You are an AI learning path generator. Create a detailed, structured learning path for the given topic and duration.

                        Requirements:
                        - Create a week-by-week learning plan
                        - Each week should have:
                          * Week number
                          * Title/theme for the week
                          * 3-5 specific learning topics or tasks
                          * 2-3 recommended resources or activities
                        
                        - Make it practical and actionable
                        - Include progressive difficulty
                        - Focus on hands-on learning
                        - Suggest real-world projects
                        
                        Format the response as a JSON array where each object has:
                        {
                            "week": number,
                            "title": string,
                            "topics": string[],
                            "resources": string[]
                        }
                        
                        Return ONLY the JSON array, no additional text.`
                    },
                    {
                        role: "user",
                        content: `Create a ${durationWeeks}-week learning path for: ${topic}`
                    }
                ],
                model: "llama-3.1-8b-instant",
                temperature: 0.7,
                max_tokens: 2048,
                stream: false
            })
        });

        const data = await response.json();
        const content = data.choices[0].message.content;
        
        try {
            return JSON.parse(content);
        } catch (error) {
            console.error('Error parsing AI response:', error);
            return generateFallbackPath();
        }
    };

    const resetGenerator = () => {
        setStep(1);
        setSelectedTopic('');
        setSelectedDuration('');
        setLearningPath([]);
        setCustomTopic('');
    };

    return (
        <section className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-16">
            <div className="w-11/12 mx-auto px-4 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                        AI Learning Path Generator
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Get a personalized learning roadmap tailored to your goals and timeline
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Side - Generator Steps */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
                        {/* Progress Steps */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-8">
                                {[1, 2, 3].map((stepNumber) => (
                                    <div key={stepNumber} className="flex items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                                            step >= stepNumber 
                                                ? 'bg-blue-500 border-blue-500 text-white' 
                                                : 'border-gray-300 text-gray-300'
                                        }`}>
                                            {stepNumber}
                                        </div>
                                        {stepNumber < 3 && (
                                            <div className={`w-16 h-1 ${
                                                step > stepNumber ? 'bg-blue-500' : 'bg-gray-300'
                                            }`} />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="text-sm text-gray-600 flex justify-between">
                                <span>Choose Topic</span>
                                <span>Select Duration</span>
                                <span>Get Path</span>
                            </div>
                        </div>

                        {/* Step 1: Topic Selection */}
                        {step === 1 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl shadow-lg p-6"
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                    <FaBook className="text-blue-500 mr-3" />
                                    What do you want to learn?
                                </h2>

                                {/* Popular Topics Grid */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    {popularTopics.map((topic) => (
                                        <motion.button
                                            key={topic}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleTopicSelect(topic)}
                                            className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                                                selectedTopic === topic
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-25'
                                            }`}
                                        >
                                            <span className="font-medium">{topic}</span>
                                        </motion.button>
                                    ))}
                                </div>

                                {/* Custom Topic Input */}
                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                        Or enter custom topic:
                                    </h3>
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            value={customTopic}
                                            onChange={(e) => setCustomTopic(e.target.value)}
                                            placeholder="Enter your learning goal..."
                                            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                        <button
                                            onClick={handleCustomTopic}
                                            disabled={!customTopic.trim()}
                                            className="bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Select
                                        </button>
                                    </div>
                                </div>

                                {selectedTopic && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl"
                                    >
                                        <p className="text-green-700 font-medium">
                                            Selected: <span className="font-bold">{selectedTopic}</span>
                                        </p>
                                        <button
                                            onClick={() => setStep(2)}
                                            className="mt-3 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                                        >
                                            Continue to Duration
                                        </button>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}

                        {/* Step 2: Duration Selection */}
                        {step === 2 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl shadow-lg p-6"
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                    <FaClock className="text-purple-500 mr-3" />
                                    How long do you want to study?
                                </h2>

                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                    {durationOptions.map((option) => (
                                        <motion.button
                                            key={option.weeks}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleDurationSelect(option.weeks)}
                                            className={`p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                                                selectedDuration === option.weeks
                                                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                                                    : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                                            }`}
                                        >
                                            <div className="font-bold text-lg">{option.label}</div>
                                            <div className="text-sm text-gray-600 mt-1">
                                                {option.weeks} weeks
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>

                                {selectedDuration && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-xl"
                                    >
                                        <p className="text-purple-700 font-medium">
                                            Duration: <span className="font-bold">
                                                {durationOptions.find(d => d.weeks === parseInt(selectedDuration))?.label}
                                            </span>
                                        </p>
                                        <div className="flex gap-3 mt-3">
                                            <button
                                                onClick={() => setStep(1)}
                                                className="flex-1 bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                                            >
                                                Back
                                            </button>
                                            <button
                                                onClick={generateLearningPath}
                                                disabled={isGenerating}
                                                className="flex-1 bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                {isGenerating ? 'Generating...' : 'Generate Learning Path'}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Right Side - AI Assistant & Results */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        {/* AI Assistant Chat */}
                        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200/80 overflow-hidden mb-8">
                            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-white/20 p-2 rounded-2xl">
                                        <FaRobot className="text-white text-2xl" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold text-lg">Learning Path AI</h3>
                                        <p className="text-purple-100 text-sm">Ready to create your roadmap</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-4 bg-gray-50/50">
                                <div className="text-sm text-gray-600 space-y-2">
                                    <p>💡 <strong>How it works:</strong></p>
                                    <p>1. Choose your learning topic</p>
                                    <p>2. Select your preferred timeline</p>
                                    <p>3. Get a detailed week-by-week plan</p>
                                    <p>4. Start learning with clear milestones</p>
                                </div>

                                {selectedTopic && selectedDuration && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-blue-50 border border-blue-200 rounded-xl p-4"
                                    >
                                        <p className="text-blue-700 text-sm">
                                            <strong>Selected:</strong> {selectedTopic}<br />
                                            <strong>Duration:</strong> {durationOptions.find(d => d.weeks === parseInt(selectedDuration))?.label}
                                        </p>
                                    </motion.div>
                                )}
                            </div>
                        </div>

                        {/* Learning Path Results */}
                        {step === 3 && learningPath.length > 0 && (
                            <motion.div
                                ref={pathContainerRef}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-3xl shadow-2xl border border-gray-200/80 overflow-hidden"
                            >
                                <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <FaGraduationCap className="text-white text-2xl" />
                                            <div>
                                                <h3 className="text-white font-bold text-lg">Your Learning Path</h3>
                                                <p className="text-green-100 text-sm">
                                                    {selectedTopic} • {durationOptions.find(d => d.weeks === parseInt(selectedDuration))?.label}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={resetGenerator}
                                            className="bg-white/20 text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-colors"
                                        >
                                            Create New
                                        </button>
                                    </div>
                                </div>

                                <div className="max-h-96 overflow-y-auto p-6 space-y-6">
                                    {learningPath.map((week, index) => (
                                        <motion.div
                                            key={week.week}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="border-l-4 border-green-500 pl-6 pb-6"
                                        >
                                            <div className="flex items-center mb-3">
                                                <div className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                                                    {week.week}
                                                </div>
                                                <h4 className="text-lg font-bold text-gray-900">{week.title}</h4>
                                            </div>

                                            <div className="space-y-3">
                                                <div>
                                                    <h5 className="font-semibold text-gray-700 mb-2 flex items-center">
                                                        <FaTasks className="text-blue-500 mr-2" />
                                                        Learning Topics:
                                                    </h5>
                                                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                                        {week.topics?.map((topic, i) => (
                                                            <li key={i}>{topic}</li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div>
                                                    <h5 className="font-semibold text-gray-700 mb-2 flex items-center">
                                                        <FaBook className="text-purple-500 mr-2" />
                                                        Resources & Activities:
                                                    </h5>
                                                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                                                        {week.resources?.map((resource, i) => (
                                                            <li key={i}>{resource}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-200 p-6 bg-gray-50">
                                    <div className="flex items-center justify-center space-x-2 text-green-600">
                                        <FaCheckCircle />
                                        <span className="font-semibold">Your learning path is ready!</span>
                                    </div>
                                    <p className="text-center text-gray-600 text-sm mt-2">
                                        Start with Week 1 and track your progress each week
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default LearningPathGenerator;