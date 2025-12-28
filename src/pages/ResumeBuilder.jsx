import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaFilePdf, 
  FaSave, 
  FaDownload, 
  FaEdit, 
  FaTrash, 
  FaPlus, 
  FaUser, 
  FaBriefcase,
  FaGraduationCap,
  FaCode,
  FaProjectDiagram,
  FaLanguage
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const ResumeBuilder = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [editingResumeId, setEditingResumeId] = useState(null);

  // Initial resume data structure
  const initialResumeData = {
    personal: {
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      github: '',
      summary: ''
    },
    skills: [],
    experience: [],
    education: [],
    projects: [],
    languages: []
  };

  const [resumeData, setResumeData] = useState(initialResumeData);

  // Fetch user's resumes
  const fetchResumes = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/resumes/user/${user.uid}`);
      const data = await response.json();
      setResumes(data);
    } catch (error) {
      toast.error('Failed to fetch resumes');
      console.error('Error fetching resumes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchResumes();
    }
  }, [user]);

  // Handle input changes
  const handleInputChange = (section, field, value) => {
    setResumeData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Handle array field changes
  const handleArrayFieldChange = (section, index, field, value) => {
    setResumeData(prev => {
      const newArray = [...prev[section]];
      newArray[index] = {
        ...newArray[index],
        [field]: value
      };
      return {
        ...prev,
        [section]: newArray
      };
    });
  };

  // Add new item to array
  const addArrayItem = (section) => {
    setResumeData(prev => ({
      ...prev,
      [section]: [...prev[section], {}]
    }));
  };

  // Remove item from array
  const removeArrayItem = (section, index) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  // Save resume
  const saveResume = async () => {
    if (!user) {
      toast.error('Please login to save resume');
      return;
    }

    try {
      setSaving(true);
      
      const url = editingResumeId 
        ? `http://localhost:5000/api/resumes/${editingResumeId}`
        : 'http://localhost:5000/api/resumes';
      
      const method = editingResumeId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...resumeData,
          userId: user.uid,
          title: `${resumeData.personal.name}'s Resume - ${new Date().toLocaleDateString()}`
        })
      });

      const result = await response.json();

      if (result.success) {
        toast.success(editingResumeId ? 'Resume updated!' : 'Resume saved!');
        fetchResumes();
        if (!editingResumeId) {
          setResumeData(initialResumeData);
        }
        setEditingResumeId(null);
      } else {
        toast.error('Failed to save resume');
      }
    } catch (error) {
      toast.error('Error saving resume');
      console.error('Error:', error);
    } finally {
      setSaving(false);
    }
  };

  // Load resume for editing
  const loadResumeForEdit = (resume) => {
    setResumeData(resume);
    setEditingResumeId(resume._id);
    setActiveTab('personal');
    toast.success('Resume loaded for editing');
  };

  // Delete resume
  const deleteResume = async (id) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/resumes/${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Resume deleted');
        fetchResumes();
      }
    } catch (error) {
      toast.error('Failed to delete resume');
    }
  };

  // Generate PDF
  const generatePDF = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/resumes/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resumeData)
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Create blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resumeData.personal.name.replace(/\s+/g, '_')}_Resume.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('PDF generated successfully!');
    } catch (error) {
      toast.error('Failed to generate PDF');
      console.error('Error generating PDF:', error);
    }
  };

  // Resume sections configuration
  const sections = [
    { id: 'personal', label: 'Personal Info', icon: FaUser },
    { id: 'skills', label: 'Skills', icon: FaCode },
    { id: 'experience', label: 'Experience', icon: FaBriefcase },
    { id: 'education', label: 'Education', icon: FaGraduationCap },
    { id: 'projects', label: 'Projects', icon: FaProjectDiagram },
    { id: 'languages', label: 'Languages', icon: FaLanguage }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            AI-Powered Resume Builder
          </h1>
          <p className="text-gray-600">
            Create professional resumes that stand out to employers and ATS systems
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Resume List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FaFilePdf className="text-blue-500" />
                Your Resumes
              </h2>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-gray-500 mt-2">Loading resumes...</p>
                </div>
              ) : resumes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No resumes yet. Create your first one!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {resumes.map((resume) => (
                    <div
                      key={resume._id}
                      className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors"
                    >
                      <h3 className="font-medium text-gray-900 truncate">
                        {resume.personal?.name || 'Untitled Resume'}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(resume.updatedAt).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => loadResumeForEdit(resume)}
                          className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 py-1.5 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                        >
                          <FaEdit size={12} />
                          Edit
                        </button>
                        <button
                          onClick={() => deleteResume(resume._id)}
                          className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 py-1.5 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                        >
                          <FaTrash size={12} />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={saveResume}
                disabled={saving}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <FaSave />
                {saving ? 'Saving...' : editingResumeId ? 'Update Resume' : 'Save Resume'}
              </button>
              
              <button
                onClick={generatePDF}
                disabled={!resumeData.personal.name}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <FaDownload />
                Download PDF
              </button>
              
              <button
                onClick={() => {
                  setResumeData(initialResumeData);
                  setEditingResumeId(null);
                }}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <FaPlus />
                New Resume
              </button>
            </div>
          </motion.div>

          {/* Right Column - Resume Builder */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <div className="flex overflow-x-auto">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveTab(section.id)}
                      className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                        activeTab === section.id
                          ? 'border-b-2 border-blue-500 text-blue-600'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <section.icon />
                      {section.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6">
                {/* Personal Info */}
                {activeTab === 'personal' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={resumeData.personal.name}
                          onChange={(e) => handleInputChange('personal', 'name', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="John Doe"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Professional Title
                        </label>
                        <input
                          type="text"
                          value={resumeData.personal.title}
                          onChange={(e) => handleInputChange('personal', 'title', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Software Engineer"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          value={resumeData.personal.email}
                          onChange={(e) => handleInputChange('personal', 'email', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="john@example.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={resumeData.personal.phone}
                          onChange={(e) => handleInputChange('personal', 'phone', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="+1 (123) 456-7890"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          value={resumeData.personal.location}
                          onChange={(e) => handleInputChange('personal', 'location', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="San Francisco, CA"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Website/Portfolio
                        </label>
                        <input
                          type="url"
                          value={resumeData.personal.website}
                          onChange={(e) => handleInputChange('personal', 'website', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="https://yourportfolio.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        GitHub Profile
                      </label>
                      <input
                        type="url"
                        value={resumeData.personal.github}
                        onChange={(e) => handleInputChange('personal', 'github', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://github.com/username"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Professional Summary / Career Objective
                      </label>
                      <textarea
                        value={resumeData.personal.summary}
                        onChange={(e) => handleInputChange('personal', 'summary', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                        placeholder="Passionate software engineer with 5+ years of experience..."
                        rows={4}
                      />
                    </div>
                  </div>
                )}

                {/* Skills */}
                {activeTab === 'skills' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900">Technical Skills</h3>
                      <button
                        onClick={() => addArrayItem('skills')}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                      >
                        <FaPlus /> Add Skill
                      </button>
                    </div>
                    
                    {resumeData.skills.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No skills added yet. Click "Add Skill" to get started.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {resumeData.skills.map((skill, index) => (
                          <div key={index} className="border border-gray-200 rounded-xl p-4">
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="font-medium text-gray-900">Skill {index + 1}</h4>
                              <button
                                onClick={() => removeArrayItem('skills', index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <FaTrash />
                              </button>
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Skill Name *
                              </label>
                              <input
                                type="text"
                                value={skill.name || ''}
                                onChange={(e) => handleArrayFieldChange('skills', index, 'name', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="JavaScript, React, Node.js, etc."
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Experience */}
                {activeTab === 'experience' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
                      <button
                        onClick={() => addArrayItem('experience')}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                      >
                        <FaPlus /> Add Experience
                      </button>
                    </div>
                    
                    {resumeData.experience.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No experience added yet. Click "Add Experience" to get started.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {resumeData.experience.map((exp, index) => (
                          <div key={index} className="border border-gray-200 rounded-xl p-4">
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="font-medium text-gray-900">Experience {index + 1}</h4>
                              <button
                                onClick={() => removeArrayItem('experience', index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <FaTrash />
                              </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Job Title *
                                </label>
                                <input
                                  type="text"
                                  value={exp.position || ''}
                                  onChange={(e) => handleArrayFieldChange('experience', index, 'position', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Senior Software Engineer"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Company *
                                </label>
                                <input
                                  type="text"
                                  value={exp.company || ''}
                                  onChange={(e) => handleArrayFieldChange('experience', index, 'company', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Google Inc."
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Location
                                </label>
                                <input
                                  type="text"
                                  value={exp.location || ''}
                                  onChange={(e) => handleArrayFieldChange('experience', index, 'location', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Mountain View, CA"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Duration
                                </label>
                                <input
                                  type="text"
                                  value={exp.duration || ''}
                                  onChange={(e) => handleArrayFieldChange('experience', index, 'duration', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Jan 2020 - Present"
                                />
                              </div>
                            </div>
                            
                            <div className="mt-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description *
                              </label>
                              <textarea
                                value={exp.description || ''}
                                onChange={(e) => handleArrayFieldChange('experience', index, 'description', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                                placeholder="Describe your responsibilities and achievements..."
                                rows={4}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Education */}
                {activeTab === 'education' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900">Education</h3>
                      <button
                        onClick={() => addArrayItem('education')}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                      >
                        <FaPlus /> Add Education
                      </button>
                    </div>
                    
                    {resumeData.education.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No education added yet. Click "Add Education" to get started.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {resumeData.education.map((edu, index) => (
                          <div key={index} className="border border-gray-200 rounded-xl p-4">
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="font-medium text-gray-900">Education {index + 1}</h4>
                              <button
                                onClick={() => removeArrayItem('education', index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <FaTrash />
                              </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Institution *
                                </label>
                                <input
                                  type="text"
                                  value={edu.institution || ''}
                                  onChange={(e) => handleArrayFieldChange('education', index, 'institution', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Stanford University"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Degree *
                                </label>
                                <input
                                  type="text"
                                  value={edu.degree || ''}
                                  onChange={(e) => handleArrayFieldChange('education', index, 'degree', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Bachelor of Science"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Field of Study
                                </label>
                                <input
                                  type="text"
                                  value={edu.field || ''}
                                  onChange={(e) => handleArrayFieldChange('education', index, 'field', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Computer Science"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Duration
                                </label>
                                <input
                                  type="text"
                                  value={edu.duration || ''}
                                  onChange={(e) => handleArrayFieldChange('education', index, 'duration', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="2016 - 2020"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Projects */}
                {activeTab === 'projects' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900">Projects</h3>
                      <button
                        onClick={() => addArrayItem('projects')}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                      >
                        <FaPlus /> Add Project
                      </button>
                    </div>
                    
                    {resumeData.projects.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No projects added yet. Click "Add Project" to get started.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {resumeData.projects.map((project, index) => (
                          <div key={index} className="border border-gray-200 rounded-xl p-4">
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="font-medium text-gray-900">Project {index + 1}</h4>
                              <button
                                onClick={() => removeArrayItem('projects', index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <FaTrash />
                              </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Project Name *
                                </label>
                                <input
                                  type="text"
                                  value={project.name || ''}
                                  onChange={(e) => handleArrayFieldChange('projects', index, 'name', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="E-commerce Platform"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Technologies
                                </label>
                                <input
                                  type="text"
                                  value={project.technologies || ''}
                                  onChange={(e) => handleArrayFieldChange('projects', index, 'technologies', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="React, Node.js, MongoDB"
                                />
                              </div>
                            </div>
                            
                            <div className="mt-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description *
                              </label>
                              <textarea
                                value={project.description || ''}
                                onChange={(e) => handleArrayFieldChange('projects', index, 'description', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                                placeholder="Describe the project, your role, and key features..."
                                rows={4}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Languages */}
                {activeTab === 'languages' && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900">Languages</h3>
                      <button
                        onClick={() => addArrayItem('languages')}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                      >
                        <FaPlus /> Add Language
                      </button>
                    </div>
                    
                    {resumeData.languages.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-500">No languages added yet. Click "Add Language" to get started.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {resumeData.languages.map((language, index) => (
                          <div key={index} className="border border-gray-200 rounded-xl p-4">
                            <div className="flex justify-between items-start mb-3">
                              <h4 className="font-medium text-gray-900">Language {index + 1}</h4>
                              <button
                                onClick={() => removeArrayItem('languages', index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <FaTrash />
                              </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Language *
                                </label>
                                <input
                                  type="text"
                                  value={language.name || ''}
                                  onChange={(e) => handleArrayFieldChange('languages', index, 'name', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="English"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Proficiency Level
                                </label>
                                <select
                                  value={language.proficiency || ''}
                                  onChange={(e) => handleArrayFieldChange('languages', index, 'proficiency', e.target.value)}
                                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                  <option value="">Select proficiency</option>
                                  <option value="Native">Native</option>
                                  <option value="Fluent">Fluent</option>
                                  <option value="Advanced">Advanced</option>
                                  <option value="Intermediate">Intermediate</option>
                                  <option value="Basic">Basic</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;