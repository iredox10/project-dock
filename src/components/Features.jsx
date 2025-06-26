
import React from 'react';
import { FaBook, FaDownload, FaCheckCircle } from 'react-icons/fa';

const Features = () => {
  const featureList = [
    {
      icon: <FaBook className="h-8 w-8" />,
      title: "Vast Project Library",
      description: "Explore thousands of projects from various fields of study, all curated and reviewed for quality.",
    },
    {
      icon: <FaDownload className="h-8 w-8" />,
      title: "Instant Downloads",
      description: "Get complete project materials, including source code, documentation, and research papers, instantly.",
    },
    {
      icon: <FaCheckCircle className="h-8 w-8" />,
      title: "Verified & Complete",
      description: "Each project is verified for completeness and quality, ensuring you get a reliable resource.",
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Why Choose Project Dock?</h2>
          <p className="mt-4 text-lg text-gray-600">Everything you need to kickstart your final year project.</p>
        </div>
        <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {featureList.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 border border-gray-200 rounded-lg">
              <div className="p-4 rounded-full bg-gray-100 text-indigo-600">
                {feature.icon}
              </div>
              <h3 className="mt-5 text-xl font-semibold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-base text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
