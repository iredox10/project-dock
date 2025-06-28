
import React, { useState } from 'react';
import { FaPaperPlane, FaUserGraduate, FaClipboardCheck, FaClock, FaShieldAlt } from 'react-icons/fa';

const HireWriterPage = () => {
  const [formData, setFormData] = useState({
    topic: '',
    name: '',
    email: '',
    phone: '',
    level: 'BSc',
    requirements: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const message = `
*Custom Project Request*

*Topic:* ${formData.topic}
*Name:* ${formData.name}
*Email:* ${formData.email}
*Phone Number:* ${formData.phone}
*Level of Education:* ${formData.level}

*Project Requirements:*
${formData.requirements}
        `;

    const whatsappNumber = "2348112580260"; // Replace with your WhatsApp number
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 pt-24 pb-32 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900">
          Need a Custom Project? <br />
          <span className="text-blue-600">Hire an Expert Writer.</span>
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-xl text-gray-600">
          Get a well-researched, plagiarism-free project written from scratch by our team of professional academic writers.
        </p>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wider uppercase">Our Process</h2>
            <p className="mt-2 text-4xl font-extrabold text-gray-900">Get Your Project in 4 Simple Steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="p-6"><div className="text-5xl text-indigo-500 mb-4 mx-auto font-extrabold">01</div><h3 className="text-2xl font-bold mb-2">Submit Your Topic</h3><p className="text-gray-600">Fill out the request form with your project topic and all necessary requirements.</p></div>
            <div className="p-6"><div className="text-5xl text-blue-500 mb-4 mx-auto font-extrabold">02</div><h3 className="text-2xl font-bold mb-2">Get a Quote</h3><p className="text-gray-600">We'll review your request and send you a no-obligation price quote within hours.</p></div>
            <div className="p-6"><div className="text-5xl text-purple-500 mb-4 mx-auto font-extrabold">03</div><h3 className="text-2xl font-bold mb-2">Work With a Writer</h3><p className="text-gray-600">Once approved, we'll assign a specialist in your field to begin work on your project.</p></div>
            <div className="p-6"><div className="text-5xl text-green-500 mb-4 mx-auto font-extrabold">04</div><h3 className="text-2xl font-bold mb-2">Receive Your Project</h3><p className="text-gray-600">Get your complete, well-written project delivered to your inbox on or before your deadline.</p></div>
          </div>
        </div>
      </div>

      {/* Guarantees Section */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="p-8 bg-blue-50 rounded-2xl"><FaUserGraduate className="text-4xl text-blue-600 mb-3" /><h3 className="text-xl font-bold">Expert Writers</h3><p className="text-gray-600 mt-1">Our writers are graduates and specialists in their respective fields.</p></div>
          <div className="p-8 bg-green-50 rounded-2xl"><FaClipboardCheck className="text-4xl text-green-600 mb-3" /><h3 className="text-xl font-bold">100% Plagiarism-Free</h3><p className="text-gray-600 mt-1">Every project is written from scratch and comes with a free plagiarism report.</p></div>
          <div className="p-8 bg-yellow-50 rounded-2xl"><FaClock className="text-4xl text-yellow-600 mb-3" /><h3 className="text-xl font-bold">On-Time Delivery</h3><p className="text-gray-600 mt-1">We guarantee to meet your deadline, no matter how tight it is.</p></div>
          <div className="p-8 bg-red-50 rounded-2xl"><FaShieldAlt className="text-4xl text-red-600 mb-3" /><h3 className="text-xl font-bold">Confidential & Secure</h3><p className="text-gray-600 mt-1">Your personal information and order details are always kept private.</p></div>
        </div>
      </div>

      {/* Request Form Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-gray-900">Request a Free Quote</h2>
            <p className="mt-4 text-lg text-gray-600">Let's get started on your custom project today. Fill out the form below.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl shadow-2xl">
            <div>
              <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">Project Topic</label>
              <input type="text" id="topic" name="topic" value={formData.topic} onChange={handleChange} placeholder="e.g., The Impact of AI on Modern Banking" className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Your Email</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="e.g., 08012345678" className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
              </div>
              <div>
                <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">Level of Education</label>
                <select id="level" name="level" value={formData.level} onChange={handleChange} className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
                  <option>BSc</option>
                  <option>MSc</option>
                  <option>HND</option>
                  <option>ND</option>
                  <option>PhD</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">Project Requirements</label>
              <textarea id="requirements" name="requirements" value={formData.requirements} onChange={handleChange} rows="6" placeholder="Include case study, deadline, number of pages, and any other specific instructions..." className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" required></textarea>
            </div>
            <button type="submit" className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-blue-700 transition-all duration-300 text-lg">
              <FaPaperPlane />
              <span>Submit Request via WhatsApp</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HireWriterPage;
