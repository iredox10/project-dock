import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaBook, FaGraduationCap, FaArrowLeft, FaUniversity, FaSpinner, FaLaptopCode, FaFlask, FaChartLine, FaBriefcase, FaNewspaper, FaHeart, FaBuilding, FaCalculator, FaPen } from 'react-icons/fa';
import { getProjectTopicsByDepartment, getProjectTopicsDepartments } from '../api/projectTopicService';
import ProjectTopicsByDepartment from '../components/ProjectTopicsByDepartment';

// Department icon mapping (same as other pages)
const departmentIcons = {
  'Computer Science': FaLaptopCode,
  'Electrical Engineering': FaFlask,
  'Mechanical Engineering': FaFlask,
  'Civil Engineering': FaBuilding,
  'Economics': FaChartLine,
  'Business Administration': FaBriefcase,
  'Mass Communication': FaNewspaper,
  'Nursing': FaHeart,
  'Mathematics': FaCalculator,
};

const ProjectTopicsPage = () => {
  const { departmentName } = useParams();
  const decodedDeptName = decodeURIComponent(departmentName);
  const [topics, setTopics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch project topics for the selected department
  useEffect(() => {
    const fetchTopicData = async () => {
      setIsLoading(true);
      try {
        // Get topics for this department
        const departmentTopics = await getProjectTopicsByDepartment(decodedDeptName);
        setTopics(departmentTopics);
      } catch (error) {
        console.error("Error fetching project topics: ", error);
        setTopics([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopicData();
  }, [decodedDeptName]);

  const DeptIcon = departmentIcons[decodedDeptName] || FaUniversity;

  // Calculate department stats
  const departmentStats = useMemo(() => {
    if (!topics.length) return { totalTopics: 0, levels: [], available: 0, requested: 0 };
    
    const levels = [...new Set(topics.map(t => t.level).filter(Boolean))];
    const available = topics.filter(t => t.isAvailable).length;
    const requested = topics.filter(t => !t.isAvailable).length;
    
    return {
      totalTopics: topics.length,
      levels,
      available,
      requested
    };
  }, [topics]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="topics-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="white"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#topics-pattern)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 relative">
          {/* Back button */}
          <Link
            to="/departments"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white font-semibold mb-8 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/20 transition-all"
          >
            <FaArrowLeft />
            <span>Back to Departments</span>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2">
              {/* Department icon and name */}
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center border-2 border-white/30">
                  <DeptIcon className="text-white text-4xl md:text-5xl" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-3 py-1 mb-3">
                    <FaUniversity className="text-white text-xs" />
                    <span className="text-white text-xs font-bold uppercase tracking-wide">Project Topics</span>
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
                    {decodedDeptName} Topics
                  </h1>
                </div>
              </div>

              <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl">
                Browse project topics in {decodedDeptName}. Find inspiration for your next academic project or request a custom-written project.
              </p>
            </div>

            {/* Stats Card */}
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4 text-lg">Department Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-sm">Total Topics:</span>
                  <span className="text-white font-bold text-xl">{departmentStats.totalTopics}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-sm">Available Projects:</span>
                  <span className="text-white font-bold text-xl">{departmentStats.available}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-sm">Levels Available:</span>
                  <span className="text-white font-bold text-xl">{departmentStats.levels.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80 text-sm">Requestable:</span>
                  <span className="text-white font-bold text-xl">{departmentStats.requested}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProjectTopicsByDepartment departmentName={decodedDeptName} />
      </div>
      
      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl p-8 md:p-12 text-center border border-indigo-200">
          <h3 className="text-3xl font-bold text-slate-900 mb-4">
            Can't Find Your Desired Topic?
          </h3>
          <p className="text-lg text-slate-700 mb-8 max-w-2xl mx-auto">
            We can write custom academic projects tailored to your specific requirements. 
            Get high-quality, plagiarism-free content delivered on time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/hire-writer"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              <FaPen />
              <span>Request Custom Project</span>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white text-indigo-600 font-bold px-8 py-4 rounded-xl border-2 border-indigo-200 shadow-sm hover:shadow-md hover:scale-105 transition-all"
            >
              <span>Contact Us</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTopicsPage;