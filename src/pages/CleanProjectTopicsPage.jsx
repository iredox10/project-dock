import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft, FaUniversity, FaSpinner, FaBook, FaChevronRight } from 'react-icons/fa';
import { getProjectTopicsByDepartment } from '../api/projectTopicService';

const CleanProjectTopicsPage = () => {
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

  // Calculate department stats
  const departmentStats = useMemo(() => {
    if (!topics.length) return { totalTopics: 0, available: 0, requested: 0 };

    const available = topics.filter(t => t.isAvailable).length;
    const requested = topics.filter(t => !t.isAvailable).length;

    return {
      totalTopics: topics.length,
      available,
      requested
    };
  }, [topics]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Header */}
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link
              to="/departments"
              className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors mr-4"
            >
              <FaArrowLeft className="mr-2" />
              Back to Departments
            </Link>
          </div>

          <div>
            <div className="flex items-center mb-2">
              <FaUniversity className="text-gray-400 mr-2" />
              <h1 className="text-3xl font-bold text-gray-900">{decodedDeptName} Topics</h1>
            </div>
            <p className="text-lg text-gray-600">
              Browse project topics in {decodedDeptName}. Find inspiration for your next academic project.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Topics</h3>
            <p className="text-3xl font-bold text-indigo-600">{departmentStats.totalTopics}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Available Projects</h3>
            <p className="text-3xl font-bold text-indigo-600">{departmentStats.available}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Requestable Topics</h3>
            <p className="text-3xl font-bold text-indigo-600">{departmentStats.requested}</p>
          </div>
        </div>

        {/* Topics List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <FaSpinner className="animate-spin text-3xl text-indigo-600" />
          </div>
        ) : topics.length > 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {topics.map((topic, index) => (
                <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{topic.topic}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Level: {topic.level || 'N/A'}</span>
                        <span>Year: {topic.year || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {topic.isAvailable ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                          Requestable
                        </span>
                      )}
                      <FaChevronRight className="ml-3 text-gray-400" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FaBook className="text-gray-400 text-xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No topics found</h3>
            <p className="text-gray-600 mb-6">
              No project topics are available for {decodedDeptName} at this time.
            </p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-indigo-50 rounded-lg p-8 text-center border border-indigo-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Can't Find Your Desired Topic?
          </h3>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            We can write custom academic projects tailored to your specific requirements.
            Get high-quality, plagiarism-free content delivered on time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/hire-writer"
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Request Custom Project
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white text-indigo-600 font-bold px-6 py-3 rounded-md border border-indigo-200 hover:bg-gray-50 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleanProjectTopicsPage;