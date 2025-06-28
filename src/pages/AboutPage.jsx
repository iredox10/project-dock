
import React from 'react';
import { FaBullseye, FaLightbulb, FaHeart } from 'react-icons/fa';

const AboutPage = () => {
  // Placeholder for team members - you would replace this with real data
  const teamMembers = [
    { name: 'John Doe', role: 'Founder & CEO', avatar: 'https://placehold.co/200x200/e2e8f0/4a5568?text=JD' },
    { name: 'Jane Smith', role: 'Lead Developer', avatar: 'https://placehold.co/200x200/e2e8f0/4a5568?text=JS' },
    { name: 'David Lee', role: 'Head of Content', avatar: 'https://placehold.co/200x200/e2e8f0/4a5568?text=DL' },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-indigo-50 via-white to-blue-50 pt-24 pb-32 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900">
          Empowering the Next Generation of <span className="text-indigo-600">Innovators</span>.
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600">
          We believe that access to quality academic resources is the key to unlocking potential and driving progress. That's our mission at Project Dock.
        </p>
      </div>

      {/* Our Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="https://placehold.co/800x600/e0e7ff/4338ca?text=Our+Journey"
              alt="Team working on a project"
              className="rounded-2xl shadow-2xl"
            />
          </div>
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Our Story</h2>
            <p className="text-lg text-gray-600 mb-4">
              Project Dock was born from a simple observation: countless brilliant students struggle to find high-quality, relevant materials for their final year projects. We saw a need for a centralized, reliable, and easy-to-use platform that bridges this gap.
            </p>
            <p className="text-lg text-gray-600">
              Founded in Abuja by a team of passionate developers and academics, our goal is to provide a comprehensive library of projects that not only serve as a reference but also inspire new ideas and foster academic excellence across Nigeria.
            </p>
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="p-8 bg-white rounded-2xl shadow-lg">
              <FaBullseye className="mx-auto text-5xl text-indigo-600 mb-4" />
              <h3 className="text-2xl font-bold">Excellence</h3>
              <p className="mt-2 text-gray-600">We are committed to providing high-quality, verified, and well-structured academic materials.</p>
            </div>
            <div className="p-8 bg-white rounded-2xl shadow-lg">
              <FaLightbulb className="mx-auto text-5xl text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold">Innovation</h3>
              <p className="mt-2 text-gray-600">We aim to inspire new ideas and support the next wave of innovators and problem-solvers.</p>
            </div>
            <div className="p-8 bg-white rounded-2xl shadow-lg">
              <FaHeart className="mx-auto text-5xl text-pink-600 mb-4" />
              <h3 className="text-2xl font-bold">Integrity</h3>
              <p className="mt-2 text-gray-600">We operate with transparency and a strong commitment to academic honesty and originality.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Meet the Team Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-12">Meet the Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {teamMembers.map(member => (
              <div key={member.name} className="text-center">
                <img src={member.avatar} alt={`Avatar of ${member.name}`} className="w-40 h-40 mx-auto rounded-full shadow-xl mb-4" />
                <h3 className="text-2xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-indigo-600 font-semibold">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default AboutPage;
