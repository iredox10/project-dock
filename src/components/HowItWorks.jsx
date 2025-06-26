
import React from 'react';
import { FaSearch, FaMousePointer, FaCloudDownloadAlt } from 'react-icons/fa';

const HowItWorks = () => {
  const steps = [
    {
      icon: <FaSearch className="h-10 w-10 text-indigo-600" />,
      title: "Search & Discover",
      description: "Use our powerful search bar to find projects by title, keyword, or department. Our smart filters help you narrow down the perfect match."
    },
    {
      icon: <FaMousePointer className="h-10 w-10 text-blue-600" />,
      title: "Preview & Select",
      description: "Dive deep into any project. Read the full abstract, preview the first chapter, and check all document details before you commit."
    },
    {
      icon: <FaCloudDownloadAlt className="h-10 w-10 text-purple-600" />,
      title: "Download Instantly",
      description: "Choose your preferred payment method. Once confirmed, you'll get instant access to download all the project files securely."
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-indigo-600 tracking-wider uppercase">How It Works</h2>
          <p className="mt-2 text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Your Project Journey in 3 Simple Steps
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
            From searching to downloading, we've made the process seamless.
          </p>
        </div>

        <div className="relative mt-20">
          {/* The vertical connecting line */}
          <div className="hidden md:block absolute top-12 bottom-12 left-1/2 w-0.5 bg-gray-200" aria-hidden="true"></div>

          {steps.map((step, index) => (
            <div key={index} className="relative mb-12 md:mb-20">
              <div className="md:flex items-center justify-center">
                {/* Step Circle */}
                <div className="md:absolute flex items-center justify-center w-24 h-24 bg-white border-4 border-indigo-200 rounded-full z-10 mx-auto">
                  <span className="text-4xl font-bold text-indigo-600">{index + 1}</span>
                </div>
              </div>

              {/* Content Card */}
              <div className={`mt-6 md:mt-0 md:w-2/5 ${index % 2 === 0 ? 'md:ml-auto md:pl-16' : 'md:mr-auto md:pr-16 md:text-right'}`}>
                <div className="p-8 bg-gray-50 rounded-2xl shadow-lg border border-gray-100">
                  <div className={`flex items-center justify-center md:justify-start ${index % 2 !== 0 && 'md:justify-end'}`}>
                    {step.icon}
                  </div>
                  <h3 className="mt-4 text-2xl font-bold text-gray-900">{step.title}</h3>
                  <p className="mt-2 text-gray-600">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
