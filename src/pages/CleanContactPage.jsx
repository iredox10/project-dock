import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, FaWhatsapp, FaInstagram, FaTwitter } from 'react-icons/fa';

const CleanContactPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
  };

  const contactMethods = [
    {
      icon: FaEnvelope,
      title: 'Email',
      value: 'iredoxtech@gmail.com',
      href: 'mailto:iredoxtech@gmail.com',
      color: 'indigo'
    },
    {
      icon: FaPhone,
      title: 'Phone',
      value: '+234 811 258 0260',
      href: 'tel:+2348112580260',
      color: 'blue'
    },
    {
      icon: FaWhatsapp,
      title: 'WhatsApp',
      value: 'Chat with us',
      href: 'https://wa.me/2348112580260',
      color: 'green'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Header */}
      <div className="bg-white border-b border-gray-200 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Get In Touch</h1>
            <p className="text-lg text-gray-600">
              Have questions? We'd love to hear from you.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Methods */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact Methods</h2>

              <div className="space-y-3">
                {contactMethods.map((method, index) => {
                  const Icon = method.icon;
                  return (
                    <a
                      key={index}
                      href={method.href}
                      target={method.href.startsWith('http') ? '_blank' : undefined}
                      rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-gray-50 transition-colors"
                    >
                      <div className={`w-10 h-10 bg-${method.color}-100 rounded-lg flex items-center justify-center`}>
                        <Icon className={`text-${method.color}-600`} />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500">{method.title}</div>
                        <div className="font-medium text-gray-900">{method.value}</div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Location */}
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FaMapMarkerAlt className="text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Location</h3>
                  <p className="text-gray-600">Kano, Nigeria</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-4">Follow Us</h3>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-indigo-100 transition-colors"
                >
                  <FaInstagram className="text-gray-600" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-indigo-100 transition-colors"
                >
                  <FaTwitter className="text-gray-600" />
                </a>
                <a
                  href="https://wa.me/2348112580260"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-indigo-100 transition-colors"
                >
                  <FaWhatsapp className="text-gray-600" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Send a Message</h2>
            <p className="text-gray-600 mb-6">We'll get back to you soon</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Your name"
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
                    placeholder="you@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  placeholder="What is this about?"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows="5"
                  placeholder="Your message..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-medium py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors"
              >
                <FaPaperPlane className="text-sm" />
                <span>Send Message</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CleanContactPage;
