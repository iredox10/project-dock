
import React, { useState } from 'react';
import { FaPaperPlane, FaUserGraduate, FaClipboardCheck, FaClock, FaShieldAlt, FaCheckCircle, FaPenFancy } from 'react-icons/fa';

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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="writer-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="white"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#writer-pattern)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <FaPenFancy className="text-white" />
            <span className="text-white text-sm font-bold">Professional Writing Service</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
            Need a Custom Project?
          </h1>
          <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto">
            Get expert academic writers to craft your project from scratch
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Info */}
          <div className="space-y-8">
            {/* Process Steps */}
            <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-lg p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center">
                  <FaClipboardCheck className="text-white" />
                </div>
                How It Works
              </h2>
              
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-black text-lg">{step.num}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{step.title}</h3>
                      <p className="text-sm text-slate-600">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Guarantees Grid */}
            <div className="grid grid-cols-2 gap-4">
              {guarantees.map((item, index) => {
                const Icon = item.icon;
                const gradients = {
                  indigo: 'from-indigo-500 to-blue-600',
                  emerald: 'from-emerald-500 to-green-600',
                  blue: 'from-blue-500 to-cyan-600',
                  purple: 'from-purple-500 to-fuchsia-600',
                };
                
                return (
                  <div key={index} className="bg-white rounded-2xl border-2 border-slate-100 shadow-lg p-6 hover:shadow-xl transition-all">
                    <div className={`w-12 h-12 bg-gradient-to-br ${gradients[item.color]} rounded-xl flex items-center justify-center mb-4`}>
                      <Icon className="text-white text-xl" />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-600">{item.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Trust Badge */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaCheckCircle className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2">Trusted by 1,000+ Students</h3>
                  <p className="text-sm text-slate-700">
                    Join successful students who've achieved academic excellence with our writing service.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6">
                <h2 className="text-2xl font-bold text-white">Request Free Quote</h2>
                <p className="text-indigo-100 mt-1">Fill out the form below to get started</p>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div>
                  <label htmlFor="topic" className="block text-sm font-bold text-slate-700 mb-2">
                    Project Topic *
                  </label>
                  <input 
                    type="text" 
                    id="topic" 
                    name="topic" 
                    value={formData.topic} 
                    onChange={handleChange} 
                    placeholder="e.g., The Impact of AI on Modern Banking" 
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" 
                    required 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">
                      Your Name *
                    </label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      placeholder="John Doe" 
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" 
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">
                      Email *
                    </label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      placeholder="you@example.com" 
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" 
                      required 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-bold text-slate-700 mb-2">
                      Phone *
                    </label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      placeholder="08012345678" 
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" 
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="level" className="block text-sm font-bold text-slate-700 mb-2">
                      Level *
                    </label>
                    <select 
                      id="level" 
                      name="level" 
                      value={formData.level} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent" 
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
                  <label htmlFor="requirements" className="block text-sm font-bold text-slate-700 mb-2">
                    Requirements *
                  </label>
                  <textarea 
                    id="requirements" 
                    name="requirements" 
                    value={formData.requirements} 
                    onChange={handleChange} 
                    rows="5" 
                    placeholder="Include deadline, page count, case study details, and any specific instructions..." 
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none" 
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
                >
                  <FaPaperPlane />
                  <span>Send via WhatsApp</span>
                </button>

                <p className="text-xs text-center text-slate-500">
                  By submitting, you'll be redirected to WhatsApp to complete your request
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HireWriterPage;
