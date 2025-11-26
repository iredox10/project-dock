import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSend, FiUser, FiCheckCircle, FiClock, FiShield, FiPenTool, FiBookOpen, FiAward } from 'react-icons/fi';

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
    { icon: FiAward, title: 'Expert Writers', desc: 'Field specialists with advanced degrees' },
    { icon: FiCheckCircle, title: '100% Original', desc: 'Plagiarism-free with report' },
    { icon: FiClock, title: 'On-Time', desc: 'Guaranteed deadline delivery' },
    { icon: FiShield, title: 'Confidential', desc: 'Secure & private' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gray-50 border-b border-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-4">Need a Custom Project?</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Get expert academic writers to craft your project from scratch. High quality, original content, delivered on time.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Info */}
          <div className="space-y-10">
            {/* Process Steps */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FiBookOpen className="text-gray-900" />
                How It Works
              </h2>

              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 bg-gray-900 rounded-md flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                      {step.num}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{step.title}</h3>
                      <p className="text-sm text-gray-600 mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Guarantees Grid */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <FiAward className="text-gray-900" />
                Our Guarantees
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {guarantees.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                      <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center mb-3">
                        <Icon className="text-gray-700" />
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">{item.title}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Trust Badge */}
            <div className="bg-gray-900 text-white rounded-lg p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiCheckCircle className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">Trusted by 1,000+ Students</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Join successful students who've achieved academic excellence with our writing service.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm sticky top-24">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <FiPenTool className="text-gray-900" />
                Request Free Quote
              </h2>
              <p className="text-sm text-gray-500 mt-1">Fill out the form below to get started</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="topic" className="block text-xs font-medium text-gray-700 uppercase mb-1.5">
                  Project Topic
                </label>
                <input
                  type="text"
                  id="topic"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  placeholder="e.g., The Impact of AI on Modern Banking"
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-gray-700 uppercase mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-gray-700 uppercase mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-xs font-medium text-gray-700 uppercase mb-1.5">
                    Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="08012345678"
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="level" className="block text-xs font-medium text-gray-700 uppercase mb-1.5">
                    Level
                  </label>
                  <select
                    id="level"
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all"
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
                <label htmlFor="requirements" className="block text-xs font-medium text-gray-700 uppercase mb-1.5">
                  Requirements
                </label>
                <textarea
                  id="requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Include deadline, page count, case study details, and any specific instructions..."
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:bg-white transition-all resize-y"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white font-medium py-3 px-4 rounded-md hover:bg-black transition-all shadow-sm text-sm"
              >
                <FiSend className="text-sm" />
                <span>Send via WhatsApp</span>
              </button>

              <p className="text-xs text-center text-gray-400 mt-4">
                By submitting, you'll be redirected to WhatsApp to complete your request securely.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleanHireWriterPage;
