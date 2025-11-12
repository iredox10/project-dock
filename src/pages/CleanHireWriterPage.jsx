import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaPaperPlane, FaUserGraduate, FaClipboardCheck, FaClock, FaShieldAlt, FaCheckCircle, FaPenFancy } from 'react-icons/fa';

const CleanHireWriterPage = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    topic: '',
    name: '',
    email: '',
    phone: '',
    level: 'BSc',
    requirements: ''
  });

  useEffect(() => {
    // Update form data when URL parameters change
    const topic = searchParams.get('topic') || '';
    const department = searchParams.get('department') || '';
    const level = searchParams.get('level') || 'BSc';

    setFormData(prev => ({
      ...prev,
      topic: topic,
      level: level,
      requirements: department
        ? `Project requested from ${department} department`
        : prev.requirements
    }));
  }, [searchParams]);

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

    const whatsappNumber = "2348112580260";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
  };

  const steps = [
    { num: '01', title: 'Submit Topic', desc: 'Share your project requirements' },
    { num: '02', title: 'Get Quote', desc: 'Receive pricing within hours' },
    { num: '03', title: 'Assignment', desc: 'Expert writer begins work' },
    { num: '04', title: 'Delivery', desc: 'Complete project on deadline' },
  ];

  const guarantees = [
    { icon: FaUserGraduate, title: 'Expert Writers', desc: 'Field specialists with advanced degrees', color: 'indigo' },
    { icon: FaClipboardCheck, title: '100% Original', desc: 'Plagiarism-free with report', color: 'emerald' },
    { icon: FaClock, title: 'On-Time', desc: 'Guaranteed deadline delivery', color: 'blue' },
    { icon: FaShieldAlt, title: 'Confidential', desc: 'Secure & private', color: 'purple' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Header */}
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Need a Custom Project?</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Get expert academic writers to craft your project from scratch
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column - Info */}
          <div className="space-y-8">
            {/* Process Steps */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <FaClipboardCheck className="text-indigo-600" />
                </div>
                How It Works
              </h2>

              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-indigo-600 font-bold">{step.num}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{step.title}</h3>
                      <p className="text-sm text-gray-600">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Guarantees Grid */}
            <div className="grid grid-cols-2 gap-4">
              {guarantees.map((item, index) => {
                const Icon = item.icon;
                const colors = {
                  indigo: 'bg-indigo-100 text-indigo-600',
                  emerald: 'bg-emerald-100 text-emerald-600',
                  blue: 'bg-blue-100 text-blue-600',
                  purple: 'bg-purple-100 text-purple-600',
                };

                return (
                  <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
                    <div className={`${colors[item.color]} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
                      <Icon className="text-lg" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Trust Badge */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaCheckCircle className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Trusted by 1,000+ Students</h3>
                  <p className="text-sm text-gray-700">
                    Join successful students who've achieved academic excellence with our writing service.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Request Free Quote</h2>
            <p className="text-gray-600 mb-6">Fill out the form below to get started</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
                  Project Topic
                </label>
                <input
                  type="text"
                  id="topic"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  placeholder="e.g., The Impact of AI on Modern Banking"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="08012345678"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                    Level
                  </label>
                  <select
                    id="level"
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option>BSc</option>
                    <option>MSc</option>
                    <option>HND</option>
                    <option>ND</option>
                    <option>PhD</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-1">
                  Requirements
                </label>
                <textarea
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Include deadline, page count, case study details, and any specific instructions..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-medium py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
              >
                <FaPaperPlane className="text-sm" />
                <span>Send via WhatsApp</span>
              </button>

              <p className="text-xs text-center text-gray-500">
                By submitting, you'll be redirected to WhatsApp to complete your request
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleanHireWriterPage;