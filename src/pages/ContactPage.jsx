
import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane, FaWhatsapp, FaInstagram, FaTwitter } from 'react-icons/fa';

const ContactPage = () => {
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

  const gradients = {
    indigo: 'from-indigo-500 to-blue-600',
    blue: 'from-blue-500 to-cyan-600',
    green: 'from-green-500 to-emerald-600',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="contact-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="white"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#contact-pattern)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
            Get In Touch
          </h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            Have questions? We'd love to hear from you.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Methods */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-lg p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Contact Methods</h2>
              
              <div className="space-y-4">
                {contactMethods.map((method, index) => {
                  const Icon = method.icon;
                  return (
                    <a
                      key={index}
                      href={method.href}
                      target={method.href.startsWith('http') ? '_blank' : undefined}
                      rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="flex items-center gap-4 p-4 rounded-xl border-2 border-slate-100 hover:border-indigo-300 hover:shadow-md transition-all group"
                    >
                      <div className={`w-14 h-14 bg-gradient-to-br ${gradients[method.color]} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <Icon className="text-white text-xl" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-500">{method.title}</div>
                        <div className="font-bold text-slate-900">{method.value}</div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-lg p-8">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FaMapMarkerAlt className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">Location</h3>
                  <p className="text-slate-600">Kano, Nigeria</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-100 rounded-2xl p-6">
              <h3 className="font-bold text-slate-900 mb-4">Follow Us</h3>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <FaInstagram className="text-white text-xl" />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <FaTwitter className="text-white text-xl" />
                </a>
                <a
                  href="https://wa.me/2348112580260"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center hover:scale-110 transition-transform"
                >
                  <FaWhatsapp className="text-white text-xl" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-2xl border-2 border-slate-100 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6">
                <h2 className="text-2xl font-bold text-white">Send a Message</h2>
                <p className="text-indigo-100 mt-1">We'll get back to you soon</p>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Your name"
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
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-bold text-slate-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    placeholder="What is this about?"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-bold text-slate-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    rows="5"
                    placeholder="Your message..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold py-4 px-6 rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  <FaPaperPlane />
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
