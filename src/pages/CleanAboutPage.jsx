import React from 'react';
import { FaBullseye, FaLightbulb, FaHeart } from 'react-icons/fa';

const CleanAboutPage = () => {
  // Placeholder for team members - you would replace this with real data
  const teamMembers = [
    { name: 'John Doe', role: 'Founder & CEO', avatar: 'https://placehold.co/200x200/e2e8f0/4a5568?text=JD' },
    { name: 'Jane Smith', role: 'Lead Developer', avatar: 'https://placehold.co/200x200/e2e8f0/4a5568?text=JS' },
    { name: 'David Lee', role: 'Head of Content', avatar: 'https://placehold.co/200x200/e2e8f0/4a5568?text=DL' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Header */}
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Empowering the Next Generation of Innovators
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We believe that access to quality academic resources is the key to unlocking potential and driving progress. That's our mission at Project Dock.
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4">
              Project Dock was born from a simple observation: countless brilliant students struggle to find high-quality, relevant materials for their final year projects. We saw a need for a centralized, reliable, and easy-to-use platform that bridges this gap.
            </p>
            <p className="text-gray-600">
              Founded by a team of passionate developers and academics, our goal is to provide a comprehensive library of projects that not only serve as a reference but also inspire new ideas and foster academic excellence across Nigeria.
            </p>
          </div>
          <div>
            <img
              src="https://placehold.co/800x600/e0e7ff/4338ca?text=Our+Journey"
              alt="Team working on a project"
              className="rounded-lg shadow-md w-full"
            />
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBullseye className="text-indigo-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Excellence</h3>
              <p className="text-gray-600">
                We are committed to providing high-quality, verified, and well-structured academic materials.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaLightbulb className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600">
                We aim to inspire new ideas and support the next wave of innovators and problem-solvers.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHeart className="text-pink-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Integrity</h3>
              <p className="text-gray-600">
                We operate with transparency and a strong commitment to academic honesty and originality.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Meet the Team Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet the Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map(member => (
              <div key={member.name} className="text-center">
                <img 
                  src={member.avatar} 
                  alt={`Avatar of ${member.name}`} 
                  className="w-32 h-32 mx-auto rounded-full mb-4 border-4 border-white shadow-md" 
                />
                <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                <p className="text-indigo-600 font-medium">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleanAboutPage;