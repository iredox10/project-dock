
import React from 'react';
import { FaBook, FaDownload, FaCheckCircle, FaSearch, FaUserShield, FaBrain } from 'react-icons/fa';

const Features = () => {

  const featureList = [
    {
      icon: <FaBook className="h-8 w-8 text-white" />,
      bgColor: "bg-gradient-to-br from-indigo-500 to-indigo-700",
      title: "Vast Project Library",
      description: "Explore thousands of projects from various fields of study, all curated and reviewed for quality.",
    },
    {
      icon: <FaUserShield className="h-8 w-8 text-white" />,
      bgColor: "bg-gradient-to-br from-blue-500 to-blue-700",
      title: "Verified & Complete",
      description: "Each project is verified for completeness and quality, ensuring you get a reliable and workable resource.",
    },
    {
      icon: <FaDownload className="h-8 w-8 text-white" />,
      bgColor: "bg-gradient-to-br from-purple-500 to-purple-700",
      title: "Instant Downloads",
      description: "Get complete project materials, including source code and documentation, immediately after verification.",
    },
    {
      icon: <FaSearch className="h-8 w-8 text-white" />,
      bgColor: "bg-gradient-to-br from-green-500 to-green-700",
      title: "Advanced Search",
      description: "Our powerful search and filtering tools help you find the exact project you need in seconds.",
    },
    {
      icon: <FaBrain className="h-8 w-8 text-white" />,
      bgColor: "bg-gradient-to-br from-pink-500 to-pink-700",
      title: "Get Inspired",
      description: "Stuck on a topic? Browse our extensive library to get inspired and find unique ideas for your own project.",
    },
    {
      icon: <FaCheckCircle className="h-8 w-8 text-white" />,
      bgColor: "bg-gradient-to-br from-sky-500 to-sky-700",
      title: "Ready to Submit",
      description: "Our projects follow standard academic formats, making them excellent reference materials for your work.",
    },
  ];

  return (
    <section id="features" className="py-24 bg-gray-50 relative overflow-hidden">
      {/* Background decorative shapes */}
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2">
        <div className="w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
      </div>
      <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2">
        <div className="w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          <h2 className="text-base font-semibold text-indigo-600 tracking-wider uppercase">Why Choose Us</h2>
          <p className="mt-2 text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Everything You Need to Succeed
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
            We provide the tools and resources to help you excel in your final year.
          </p>
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featureList.map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
              <div className="p-8">
                <div className={`inline-flex items-center justify-center p-4 rounded-xl shadow-lg ${feature.bgColor}`}>
                  {feature.icon}
                </div>
                <h3 className="mt-6 text-2xl font-bold text-gray-900">{feature.title}</h3>
                <p className="mt-4 text-base text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
