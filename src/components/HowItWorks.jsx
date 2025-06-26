
import React from 'react';
import { FaSearch, FaMousePointer, FaCloudDownloadAlt } from 'react-icons/fa';

const HowItWorks = () => {
  const steps = [
    { icon: <FaSearch className="h-10 w-10" />, title: "Search for Project", description: "Use our powerful search to find projects by topic, department, or keywords." },
    { icon: <FaMousePointer className="h-10 w-10" />, title: "Preview & Select", description: "Review the project abstract, table of contents, and other details to ensure it fits your needs." },
    { icon: <FaCloudDownloadAlt className="h-10 w-10" />, title: "Download Instantly", description: "Download the complete project files securely and start working immediately." },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Get Your Project in 3 Easy Steps</h2>
          <p className="mt-4 text-lg text-gray-600">A seamless process from search to download.</p>
        </div>
        <div className="mt-12 grid gap-10 md:grid-cols-3 text-center">
          {steps.map((step, index) => (
            <div key={index} className="p-6">
              <div className="flex justify-center items-center h-24">
                <div className="p-5 inline-block bg-indigo-100 text-indigo-600 rounded-full">
                  {step.icon}
                </div>
              </div>
              <h3 className="mt-5 text-xl font-semibold text-gray-900">{step.title}</h3>
              <p className="mt-2 text-base text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
