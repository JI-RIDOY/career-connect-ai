import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaTimes, FaCrown, FaStar, FaRocket, FaGem, FaCalendarAlt, FaCreditCard, FaShieldAlt, FaSync } from 'react-icons/fa';
// import { Link } from 'react-router-dom';

const Payment = () => {
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [selectedPlan, setSelectedPlan] = useState('basic');

    const plans = {
        basic: {
            name: "Basic",
            icon: FaStar,
            description: "Perfect for getting started",
            monthlyPrice: 0,
            yearlyPrice: 0,
            features: {
                included: [
                    "AI Resume Analysis (Basic)",
                    "ATS Score Check (Limited)",
                    "5 Mock Interview Questions",
                    "Basic CV Templates",
                    "Email Support"
                ],
                excluded: [
                    "Advanced AI Recommendations",
                    "Unlimited ATS Analysis",
                    "Full Mock Interviews",
                    "Priority Support",
                    "Custom CV Designs"
                ]
            },
            popular: false,
            color: "gray"
        },
        standard: {
            name: "Standard",
            icon: FaRocket,
            description: "For serious job seekers",
            monthlyPrice: 9.99,
            yearlyPrice: 99.99,
            features: {
                included: [
                    "AI Resume Analysis (Advanced)",
                    "Unlimited ATS Score Checks",
                    "Full Mock Interviews (3 per month)",
                    "Professional CV Templates",
                    "AI-powered Cover Letters",
                    "Career Insights Dashboard"
                ],
                excluded: [
                    "Custom Career Coaching",
                    "1-on-1 Expert Sessions",
                    "LinkedIn Optimization",
                    "Interview Performance Analytics"
                ]
            },
            popular: true,
            color: "blue"
        },
        premium: {
            name: "Premium",
            icon: FaCrown,
            description: "Complete career transformation",
            monthlyPrice: 19.99,
            yearlyPrice: 199.99,
            features: {
                included: [
                    "Everything in Standard",
                    "Unlimited Mock Interviews",
                    "AI Career Path Planning",
                    "1-on-1 Career Coaching Sessions",
                    "LinkedIn Profile Optimization",
                    "Interview Performance Analytics",
                    "Custom Resume & CV Designs",
                    "Priority Phone & Chat Support",
                    "Job Application Tracker",
                    "Salary Negotiation Guide"
                ],
                excluded: []
            },
            popular: false,
            color: "purple"
        }
    };

    const featuresComparison = [
        {
            feature: "AI Resume Analysis",
            basic: "Basic",
            standard: "Advanced",
            premium: "Premium"
        },
        {
            feature: "ATS Score Checks",
            basic: "5 per month",
            standard: "Unlimited",
            premium: "Unlimited + AI Tips"
        },
        {
            feature: "Mock Interviews",
            basic: "5 Questions",
            standard: "3 Full Interviews",
            premium: "Unlimited"
        },
        {
            feature: "CV Templates",
            basic: "Basic Templates",
            standard: "Professional Templates",
            premium: "Custom Designs"
        },
        {
            feature: "AI Cover Letters",
            basic: "❌",
            standard: "✅",
            premium: "✅ Advanced"
        },
        {
            feature: "Career Coaching",
            basic: "❌",
            standard: "❌",
            premium: "1-on-1 Sessions"
        },
        {
            feature: "Support",
            basic: "Email",
            standard: "Priority Email",
            premium: "24/7 Priority"
        }
    ];

    const calculateSavings = (monthlyPrice, yearlyPrice) => {
        const yearlyFromMonthly = monthlyPrice * 12;
        return yearlyFromMonthly - yearlyPrice;
    };

    const handleSubscribe = (plan) => {
        // Handle subscription logic here
        console.log(`Subscribing to ${plan} plan - ${billingCycle}`);
        // Integrate with your payment gateway
    };

    // Helper function to get color classes
    const getColorClasses = (color, type) => {
        const colorMap = {
            gray: {
                bg: 'bg-gray-100',
                text: 'text-gray-500',
                bgLight: 'bg-gray-100',
                button: 'bg-gray-500 hover:bg-gray-600'
            },
            blue: {
                bg: 'bg-blue-100',
                text: 'text-blue-500',
                bgLight: 'bg-blue-100',
                button: 'bg-blue-500 hover:bg-blue-600'
            },
            purple: {
                bg: 'bg-purple-100',
                text: 'text-purple-500',
                bgLight: 'bg-purple-100',
                button: 'bg-purple-500 hover:bg-purple-600'
            }
        };
        return colorMap[color]?.[type] || colorMap.gray[type];
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12">
            <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Choose Your Career Success Plan
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Unlock your potential with AI-powered career tools. Start free, upgrade as you grow.
                    </p>
                </motion.div>

                {/* Billing Toggle */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex justify-center mb-12"
                >
                    <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-200">
                        <div className="flex items-center">
                            <button
                                onClick={() => setBillingCycle('monthly')}
                                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${billingCycle === 'monthly'
                                    ? 'bg-blue-500 text-white shadow-md'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Monthly
                            </button>
                            <button
                                onClick={() => setBillingCycle('yearly')}
                                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 relative ${billingCycle === 'yearly'
                                    ? 'bg-blue-500 text-white shadow-md'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Yearly
                                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                    Save 17%
                                </span>
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Pricing Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 my-16"
                >
                    {Object.entries(plans).map(([key, plan]) => {
                        const IconComponent = plan.icon;
                        const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
                        const savings = calculateSavings(plan.monthlyPrice, plan.yearlyPrice);

                        return (
                            <motion.div
                                key={key}
                                whileHover={{ scale: 1.02, y: -5 }}
                                className={`relative bg-white rounded-3xl my-3 shadow-xl border-2 transition-all duration-300 ${selectedPlan === key ? 'border-blue-500' : 'border-transparent'
                                    } ${plan.popular ? 'transform scale-105' : ''}`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <div className="bg-blue-500 text-white px-6 py-2 rounded-full shadow-lg">
                                            <span className="font-semibold text-xs md:text-sm">MOST POPULAR</span>
                                        </div>
                                    </div>
                                )}

                                <div className="p-8">
                                    {/* Plan Header */}
                                    <div className="text-center mb-8">
                                        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${getColorClasses(plan.color, 'bg')} ${getColorClasses(plan.color, 'text')} mb-4`}>
                                            <IconComponent className="text-2xl" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                                        <p className="text-gray-600">{plan.description}</p>
                                    </div>

                                    {/* Price */}
                                    <div className="text-center mb-6">
                                        <div className="flex items-baseline justify-center">
                                            <span className="text-4xl font-bold text-gray-900">${price}</span>
                                            {price > 0 && (
                                                <span className="text-gray-600 ml-2">
                                                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                                                </span>
                                            )}
                                        </div>
                                        {billingCycle === 'yearly' && price > 0 && (
                                            <p className="text-green-600 font-semibold mt-2">
                                                Save ${savings.toFixed(2)} yearly
                                            </p>
                                        )}
                                    </div>

                                    {/* Features */}
                                    <div className="space-y-4 mb-8">
                                        <h4 className="font-semibold text-gray-900 mb-4">What's included:</h4>
                                        {plan.features.included.map((feature, index) => (
                                            <div key={index} className="flex items-center">
                                                <FaCheck className="text-green-500 mr-3 flex-shrink-0" />
                                                <span className="text-gray-700">{feature}</span>
                                            </div>
                                        ))}
                                        {plan.features.excluded.map((feature, index) => (
                                            <div key={index} className="flex items-center opacity-50">
                                                <FaTimes className="text-gray-400 mr-3 flex-shrink-0" />
                                                <span className="text-gray-600">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* CTA Button */}
                                    <button
                                        onClick={() => {
                                            setSelectedPlan(key);
                                            if (key === 'basic') {
                                                // Redirect to signup for free plan
                                                window.location.href = '/auth/sign-up';
                                            } else {
                                                handleSubscribe(key);
                                            }
                                        }}
                                        className={`w-full py-4 rounded-2xl font-semibold transition-all duration-200 ${key === 'basic'
                                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            : `${getColorClasses(plan.color, 'button')} text-white shadow-md hover:shadow-lg`
                                            }`}
                                    >
                                        {key === 'basic' ? 'Get Started Free' : `Choose ${plan.name}`}
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Feature Comparison Table */}
                {/* <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden mb-16"
                >
                    <div className="px-8 py-6 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-900">Compare Features</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50">
                                    <th className="px-6 py-4 text-left font-semibold text-gray-900">Features</th>
                                    <th className="px-6 py-4 text-center font-semibold text-gray-900">Basic</th>
                                    <th className="px-6 py-4 text-center font-semibold text-gray-900">Standard</th>
                                    <th className="px-6 py-4 text-center font-semibold text-gray-900">Premium</th>
                                </tr>
                            </thead>
                            <tbody>
                                {featuresComparison.map((row, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                        <td className="px-6 py-4 font-medium text-gray-900">{row.feature}</td>
                                        <td className="px-6 py-4 text-center text-gray-700">{row.basic}</td>
                                        <td className="px-6 py-4 text-center text-gray-700">{row.standard}</td>
                                        <td className="px-6 py-4 text-center text-gray-700">{row.premium}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div> */}

                {/* FAQ Section */}
                {/* <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8"
                >
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                        Frequently Asked Questions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Can I change plans later?</h3>
                            <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Is the Basic plan really free?</h3>
                            <p className="text-gray-600">Yes! The Basic plan is completely free forever with no credit card required.</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
                            <p className="text-gray-600">We accept all major credit cards, PayPal, and bank transfers for annual plans.</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
                            <p className="text-gray-600">Absolutely! You can cancel your subscription at any time with no cancellation fees.</p>
                        </div>
                    </div>
                </motion.div> */}

                {/* Security Badge */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-12"
                >
                    <div className="flex items-center justify-center space-x-4 text-gray-600 flex-wrap gap-4">
                        <div className="flex items-center space-x-2">
                            <FaShieldAlt className="text-2xl" />
                            <span className="font-semibold">Secure Payment · 256-bit SSL Encryption</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <FaSync className="text-2xl" />
                            <span className="font-semibold">Cancel Anytime · No Questions Asked</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Payment;