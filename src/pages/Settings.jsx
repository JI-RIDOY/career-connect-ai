// src/pages/Settings.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUser, 
  FaBriefcase, 
  FaGraduationCap, 
  FaCog, 
  FaSave,
  FaUpload,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaLinkedin,
  FaGithub,
  FaGlobe,
  FaCheck,
  FaSpinner,
  FaExclamationTriangle,
  FaTrash,
  FaPlus,
  FaEdit
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Settings = () => {
  const { user, userProfile, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [uploading, setUploading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    // Personal Information
    personal: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      bio: '',
      profilePhoto: '',
      coverPhoto: ''
    },
    // Professional Information
    professional: {
      currentPosition: '',
      company: '',
      industry: '',
      yearsOfExperience: '',
      skills: [],
      newSkill: '',
      resume: '',
      coverLetter: ''
    },
    // Education
    education: {
      highestDegree: '',
      institution: '',
      fieldOfStudy: '',
      graduationYear: '',
      gpa: '',
      certifications: []
    },
    // Preferences
    preferences: {
      jobTypes: [],
      locations: [],
      remotePreference: 'hybrid',
      salaryExpectation: '',
      noticePeriod: '',
      visibility: 'public'
    },
    // Social Links
    social: {
      linkedin: '',
      github: '',
      portfolio: '',
      twitter: ''
    }
  });

  // Initialize form data when user profile loads
  useEffect(() => {
    if (userProfile) {
      setFormData(prev => ({
        personal: {
          fullName: userProfile.displayName || '',
          email: userProfile.email || '',
          phone: userProfile.phone || '',
          location: userProfile.location || '',
          bio: userProfile.bio || '',
          profilePhoto: userProfile.photoURL || '',
          coverPhoto: userProfile.coverPhoto || ''
        },
        professional: {
          currentPosition: userProfile.currentPosition || '',
          company: userProfile.company || '',
          industry: userProfile.industry || '',
          yearsOfExperience: userProfile.yearsOfExperience || '',
          skills: userProfile.skills || [],
          newSkill: '',
          resume: userProfile.resume || '',
          coverLetter: userProfile.coverLetter || ''
        },
        education: {
          highestDegree: userProfile.highestDegree || '',
          institution: userProfile.institution || '',
          fieldOfStudy: userProfile.fieldOfStudy || '',
          graduationYear: userProfile.graduationYear || '',
          gpa: userProfile.gpa || '',
          certifications: userProfile.certifications || []
        },
        preferences: {
          jobTypes: userProfile.jobTypes || [],
          locations: userProfile.preferredLocations || [],
          remotePreference: userProfile.remotePreference || 'hybrid',
          salaryExpectation: userProfile.salaryExpectation || '',
          noticePeriod: userProfile.noticePeriod || '',
          visibility: userProfile.visibility || 'public'
        },
        social: {
          linkedin: userProfile.linkedin || '',
          github: userProfile.github || '',
          portfolio: userProfile.portfolio || '',
          twitter: userProfile.twitter || ''
        }
      }));
    }
  }, [userProfile]);

  const tabs = [
    { id: 'personal', label: 'Personal', icon: FaUser },
    { id: 'professional', label: 'Professional', icon: FaBriefcase },
    { id: 'education', label: 'Education', icon: FaGraduationCap },
    { id: 'preferences', label: 'Preferences', icon: FaCog },
    { id: 'social', label: 'Social', icon: FaGlobe }
  ];

  const jobTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Freelance',
    'Internship',
    'Remote'
  ];

  const experienceLevels = [
    'Entry Level (0-2 years)',
    'Mid Level (2-5 years)',
    'Senior Level (5-8 years)',
    'Executive (8+ years)'
  ];

  const degrees = [
    'High School',
    'Associate Degree',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'PhD',
    'Other'
  ];

  // Cloudinary upload function
  const uploadToCloudinary = async (file, type) => {
    try {
      setUploading(true);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'react_unsigned');
      formData.append('cloud_name', 'dohhfubsa');

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dohhfubsa/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return data.secure_url;

    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw new Error('Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleFileUpload = async (event, field, section) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const url = await uploadToCloudinary(file, field);
      handleInputChange(section, field, url);
      setSaveStatus('File uploaded successfully!');
    } catch (error) {
      setSaveStatus('Error uploading file');
    }
  };

  const addSkill = () => {
    if (formData.professional.newSkill.trim()) {
      setFormData(prev => ({
        ...prev,
        professional: {
          ...prev.professional,
          skills: [...prev.professional.skills, prev.professional.newSkill.trim()],
          newSkill: ''
        }
      }));
    }
  };

  const removeSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      professional: {
        ...prev.professional,
        skills: prev.professional.skills.filter((_, i) => i !== index)
      }
    }));
  };

  const addCertification = () => {
    setFormData(prev => ({
      ...prev,
      education: {
        ...prev.education,
        certifications: [...prev.education.certifications, { name: '', issuer: '', date: '' }]
      }
    }));
  };

  const updateCertification = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      education: {
        ...prev.education,
        certifications: prev.education.certifications.map((cert, i) => 
          i === index ? { ...cert, [field]: value } : cert
        )
      }
    }));
  };

  const removeCertification = (index) => {
    setFormData(prev => ({
      ...prev,
      education: {
        ...prev.education,
        certifications: prev.education.certifications.filter((_, i) => i !== index)
      }
    }));
  };

  const toggleJobType = (type) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        jobTypes: prev.preferences.jobTypes.includes(type)
          ? prev.preferences.jobTypes.filter(t => t !== type)
          : [...prev.preferences.jobTypes, type]
      }
    }));
  };

  const addLocation = () => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        locations: [...prev.preferences.locations, '']
      }
    }));
  };

  const updateLocation = (index, value) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        locations: prev.preferences.locations.map((loc, i) => i === index ? value : loc)
      }
    }));
  };

  const removeLocation = (index) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        locations: prev.preferences.locations.filter((_, i) => i !== index)
      }
    }));
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    setSaveStatus('');

    try {
      // Combine all form data into a single update object
      const updateData = {
        // Personal
        displayName: formData.personal.fullName,
        phone: formData.personal.phone,
        location: formData.personal.location,
        bio: formData.personal.bio,
        photoURL: formData.personal.profilePhoto,
        coverPhoto: formData.personal.coverPhoto,

        // Professional
        currentPosition: formData.professional.currentPosition,
        company: formData.professional.company,
        industry: formData.professional.industry,
        yearsOfExperience: formData.professional.yearsOfExperience,
        skills: formData.professional.skills,
        resume: formData.professional.resume,
        coverLetter: formData.professional.coverLetter,

        // Education
        highestDegree: formData.education.highestDegree,
        institution: formData.education.institution,
        fieldOfStudy: formData.education.fieldOfStudy,
        graduationYear: formData.education.graduationYear,
        gpa: formData.education.gpa,
        certifications: formData.education.certifications,

        // Preferences
        jobTypes: formData.preferences.jobTypes,
        preferredLocations: formData.preferences.locations,
        remotePreference: formData.preferences.remotePreference,
        salaryExpectation: formData.preferences.salaryExpectation,
        noticePeriod: formData.preferences.noticePeriod,
        visibility: formData.preferences.visibility,

        // Social
        linkedin: formData.social.linkedin,
        github: formData.social.github,
        portfolio: formData.social.portfolio,
        twitter: formData.social.twitter,

        updatedAt: new Date().toISOString()
      };

      await updateUserProfile(user.uid, updateData);
      setSaveStatus('success');
      
      // Clear status after 3 seconds
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setSaveStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const renderPersonalTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Photo Upload */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Profile Photos
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture
              </label>
              <div className="relative inline-block">
                <img
                  src={formData.personal.profilePhoto || '/default-avatar.png'}
                  alt="Profile"
                  className="w-32 h-32 rounded-2xl object-cover border-2 border-gray-200"
                />
                <label className="absolute bottom-2 right-2 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
                  <FaUpload className="text-sm" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'profilePhoto', 'personal')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Photo
              </label>
              <div className="relative">
                <div className="w-full h-32 bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                  {formData.personal.coverPhoto ? (
                    <img
                      src={formData.personal.coverPhoto}
                      alt="Cover"
                      className="w-full h-32 rounded-2xl object-cover"
                    />
                  ) : (
                    <span className="text-gray-400">Upload Cover Photo</span>
                  )}
                </div>
                <label className="absolute bottom-2 right-2 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
                  <FaUpload className="text-sm" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'coverPhoto', 'personal')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={formData.personal.fullName}
            onChange={(e) => handleInputChange('personal', 'fullName', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            value={formData.personal.email}
            disabled
            className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-2xl text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <div className="relative">
            <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              value={formData.personal.phone}
              onChange={(e) => handleInputChange('personal', 'phone', e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={formData.personal.location}
              onChange={(e) => handleInputChange('personal', 'location', e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="City, Country"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Professional Bio
          </label>
          <textarea
            value={formData.personal.bio}
            onChange={(e) => handleInputChange('personal', 'bio', e.target.value)}
            rows={4}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Tell us about yourself, your experience, and what you're looking for..."
          />
        </div>
      </div>
    </motion.div>
  );

  const renderProfessionalTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Position *
          </label>
          <input
            type="text"
            value={formData.professional.currentPosition}
            onChange={(e) => handleInputChange('professional', 'currentPosition', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Senior Frontend Developer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company
          </label>
          <input
            type="text"
            value={formData.professional.company}
            onChange={(e) => handleInputChange('professional', 'company', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Current company"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Industry
          </label>
          <input
            type="text"
            value={formData.professional.industry}
            onChange={(e) => handleInputChange('professional', 'industry', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Technology, Healthcare, Finance"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Years of Experience
          </label>
          <select
            value={formData.professional.yearsOfExperience}
            onChange={(e) => handleInputChange('professional', 'yearsOfExperience', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select experience level</option>
            {experienceLevels.map(level => (
              <option key={level} value={level}>{level}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Skills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Skills & Technologies
        </label>
        <div className="flex flex-wrap gap-2 mb-4">
          {formData.professional.skills.map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(index)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <FaTrash className="text-xs" />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={formData.professional.newSkill}
            onChange={(e) => handleInputChange('professional', 'newSkill', e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Add a skill (press Enter)"
          />
          <button
            type="button"
            onClick={addSkill}
            className="px-6 py-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors"
          >
            <FaPlus />
          </button>
        </div>
      </div>

      {/* Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Resume
          </label>
          <div className="flex items-center gap-4">
            {formData.professional.resume ? (
              <span className="text-green-600 flex items-center">
                <FaCheck className="mr-2" />
                Resume uploaded
              </span>
            ) : (
              <span className="text-gray-500">No resume uploaded</span>
            )}
            <label className="px-4 py-2 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors cursor-pointer">
              <FaUpload className="inline mr-2" />
              Upload Resume
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileUpload(e, 'resume', 'professional')}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cover Letter Template
          </label>
          <div className="flex items-center gap-4">
            {formData.professional.coverLetter ? (
              <span className="text-green-600 flex items-center">
                <FaCheck className="mr-2" />
                Cover letter uploaded
              </span>
            ) : (
              <span className="text-gray-500">No cover letter</span>
            )}
            <label className="px-4 py-2 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors cursor-pointer">
              <FaUpload className="inline mr-2" />
              Upload Cover Letter
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileUpload(e, 'coverLetter', 'professional')}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderEducationTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Highest Degree
          </label>
          <select
            value={formData.education.highestDegree}
            onChange={(e) => handleInputChange('education', 'highestDegree', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select highest degree</option>
            {degrees.map(degree => (
              <option key={degree} value={degree}>{degree}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Institution
          </label>
          <input
            type="text"
            value={formData.education.institution}
            onChange={(e) => handleInputChange('education', 'institution', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="University or College"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Field of Study
          </label>
          <input
            type="text"
            value={formData.education.fieldOfStudy}
            onChange={(e) => handleInputChange('education', 'fieldOfStudy', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Computer Science"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Graduation Year
          </label>
          <input
            type="number"
            value={formData.education.graduationYear}
            onChange={(e) => handleInputChange('education', 'graduationYear', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="YYYY"
            min="1950"
            max="2030"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            GPA
          </label>
          <input
            type="text"
            value={formData.education.gpa}
            onChange={(e) => handleInputChange('education', 'gpa', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 3.8/4.0"
          />
        </div>
      </div>

      {/* Certifications */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Certifications
          </label>
          <button
            type="button"
            onClick={addCertification}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors"
          >
            <FaPlus className="mr-2" />
            Add Certification
          </button>
        </div>
        
        <div className="space-y-4">
          {formData.education.certifications.map((cert, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Certification Name
                </label>
                <input
                  type="text"
                  value={cert.name}
                  onChange={(e) => updateCertification(index, 'name', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., AWS Certified Solutions Architect"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Issuing Organization
                </label>
                <input
                  type="text"
                  value={cert.issuer}
                  onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Amazon Web Services"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Obtained
                  </label>
                  <input
                    type="month"
                    value={cert.date}
                    onChange={(e) => updateCertification(index, 'date', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeCertification(index)}
                  className="px-4 py-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-colors"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderPreferencesTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Job Types */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Preferred Job Types
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {jobTypes.map(type => (
            <label
              key={type}
              className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                formData.preferences.jobTypes.includes(type)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={formData.preferences.jobTypes.includes(type)}
                onChange={() => toggleJobType(type)}
                className="sr-only"
              />
              <div className={`w-5 h-5 border-2 rounded mr-3 flex items-center justify-center ${
                formData.preferences.jobTypes.includes(type)
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300'
              }`}>
                {formData.preferences.jobTypes.includes(type) && (
                  <FaCheck className="text-white text-xs" />
                )}
              </div>
              <span className="font-medium">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Remote Preference */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Remote Work Preference
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { value: 'onsite', label: 'On-site Only' },
            { value: 'hybrid', label: 'Hybrid' },
            { value: 'remote', label: 'Fully Remote' }
          ].map(option => (
            <label
              key={option.value}
              className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                formData.preferences.remotePreference === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="remotePreference"
                value={option.value}
                checked={formData.preferences.remotePreference === option.value}
                onChange={(e) => handleInputChange('preferences', 'remotePreference', e.target.value)}
                className="sr-only"
              />
              <div className={`w-5 h-5 border-2 rounded-full mr-3 flex items-center justify-center ${
                formData.preferences.remotePreference === option.value
                  ? 'border-blue-500 bg-blue-500'
                  : 'border-gray-300'
              }`}>
                {formData.preferences.remotePreference === option.value && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </div>
              <span className="font-medium">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Preferred Locations */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Preferred Locations
          </label>
          <button
            type="button"
            onClick={addLocation}
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors"
          >
            <FaPlus className="mr-2" />
            Add Location
          </button>
        </div>
        
        <div className="space-y-3">
          {formData.preferences.locations.map((location, index) => (
            <div key={index} className="flex gap-3">
              <input
                type="text"
                value={location}
                onChange={(e) => updateLocation(index, e.target.value)}
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="City, State, Country"
              />
              <button
                type="button"
                onClick={() => removeLocation(index)}
                className="px-4 py-3 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-colors"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Salary and Notice Period */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Salary Expectation (Annual)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
            <input
              type="number"
              value={formData.preferences.salaryExpectation}
              onChange={(e) => handleInputChange('preferences', 'salaryExpectation', e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 75000"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notice Period
          </label>
          <select
            value={formData.preferences.noticePeriod}
            onChange={(e) => handleInputChange('preferences', 'noticePeriod', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select notice period</option>
            <option value="immediately">Immediately</option>
            <option value="1_week">1 Week</option>
            <option value="2_weeks">2 Weeks</option>
            <option value="1_month">1 Month</option>
            <option value="2_months">2 Months</option>
            <option value="3_months">3 Months</option>
          </select>
        </div>
      </div>

      {/* Profile Visibility */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Profile Visibility
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { value: 'public', label: 'Public', description: 'Visible to all employers' },
            { value: 'recruiters', label: 'Recruiters Only', description: 'Visible only to verified recruiters' },
            { value: 'private', label: 'Private', description: 'Only visible to you' }
          ].map(option => (
            <label
              key={option.value}
              className={`flex flex-col p-4 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
                formData.preferences.visibility === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-gray-50 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center mb-2">
                <input
                  type="radio"
                  name="visibility"
                  value={option.value}
                  checked={formData.preferences.visibility === option.value}
                  onChange={(e) => handleInputChange('preferences', 'visibility', e.target.value)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 border-2 rounded-full mr-3 flex items-center justify-center ${
                  formData.preferences.visibility === option.value
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {formData.preferences.visibility === option.value && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="font-medium">{option.label}</span>
              </div>
              <span className="text-sm text-gray-600 ml-8">{option.description}</span>
            </label>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderSocialTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FaLinkedin className="inline mr-2 text-blue-700" />
            LinkedIn Profile
          </label>
          <input
            type="url"
            value={formData.social.linkedin}
            onChange={(e) => handleInputChange('social', 'linkedin', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FaGithub className="inline mr-2 text-gray-900" />
            GitHub Profile
          </label>
          <input
            type="url"
            value={formData.social.github}
            onChange={(e) => handleInputChange('social', 'github', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://github.com/yourusername"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FaGlobe className="inline mr-2 text-green-600" />
            Portfolio Website
          </label>
          <input
            type="url"
            value={formData.social.portfolio}
            onChange={(e) => handleInputChange('social', 'portfolio', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://yourportfolio.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FaEnvelope className="inline mr-2 text-blue-400" />
            Twitter/X Profile
          </label>
          <input
            type="url"
            value={formData.social.twitter}
            onChange={(e) => handleInputChange('social', 'twitter', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://twitter.com/yourusername"
          />
        </div>
      </div>
    </motion.div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return renderPersonalTab();
      case 'professional':
        return renderProfessionalTab();
      case 'education':
        return renderEducationTab();
      case 'preferences':
        return renderPreferencesTab();
      case 'social':
        return renderSocialTab();
      default:
        return renderPersonalTab();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
          <p className="text-gray-600">
            Manage your profile information, preferences, and career details
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/80 p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 rounded-2xl text-left transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className={`mr-3 text-lg ${
                        activeTab === tab.id ? 'text-white' : 'text-gray-400'
                      }`} />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  disabled={loading || uploading}
                  className="w-full flex items-center justify-center px-6 py-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/25 font-semibold"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" />
                      Save Changes
                    </>
                  )}
                </button>

                {/* Status Messages */}
                <AnimatePresence>
                  {saveStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 p-3 bg-green-50 border border-green-200 rounded-2xl text-green-700 text-sm flex items-center"
                    >
                      <FaCheck className="mr-2" />
                      Changes saved successfully!
                    </motion.div>
                  )}
                  
                  {saveStatus === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-4 p-3 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm flex items-center"
                    >
                      <FaExclamationTriangle className="mr-2" />
                      Error saving changes. Please try again.
                    </motion.div>
                  )}

                  {uploading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-2xl text-blue-700 text-sm flex items-center"
                    >
                      <FaSpinner className="animate-spin mr-2" />
                      Uploading file...
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/80 p-6">
              <AnimatePresence mode="wait">
                {renderTabContent()}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;