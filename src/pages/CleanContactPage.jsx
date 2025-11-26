import React from 'react';
import { FiMail, FiPhone, FiMapPin, FiSend, FiInstagram, FiTwitter, FiMessageCircle } from 'react-icons/fi';

const CleanContactPage = () => {
  const contactMethods = [
    {
      icon: FiMail,
      title: 'Email',
      value: 'iredoxtech@gmail.com',
      href: 'mailto:iredoxtech@gmail.com',
    },
    {
      icon: FiPhone,
      title: 'Phone',
      value: '+234 811 258 0260',
      href: 'tel:+2348112580260',
    },
    {
      icon: FiMessageCircle,
      title: 'WhatsApp',
      value: 'Chat with us',
      href: 'https://wa.me/2348112580260',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">

        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-3xl font-semibold tracking-tight mb-4">Get in Touch</h1>
          <p className="text-gray-500 max-w-lg mx-auto">
            Have a question or need assistance? We're here to help. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Contact Info */}
          <div className="md:col-span-1 space-y-8">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-6">Contact Info</h3>
              <div className="space-y-6">
                {contactMethods.map((method, index) => {
                  const Icon = method.icon;
                  return (
                    <a
                      key={index}
                      href={method.href}
                      target={method.href.startsWith('http') ? '_blank' : undefined}
                      rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="flex items-start gap-4 group"
                    >
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-900 group-hover:bg-gray-100 transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{method.title}</div>
                        <div className="text-sm text-gray-500 group-hover:text-gray-900 transition-colors">{method.value}</div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-6">Socials</h3>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  <FiInstagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  <FiTwitter className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 mb-6">Location</h3>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-900">
                  <FiMapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">Office</div>
                  <div className="text-sm text-gray-500">Kano, Nigeria</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <div className="bg-gray-50 p-8 rounded-xl border border-gray-100">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Send Message</h3>

              <form
                action="https://formsubmit.co/iredoxtech@gmail.com"
                method="POST"
                className="space-y-5"
              >
                {/* FormSubmit Configuration */}
                <input type="hidden" name="_captcha" value="false" />
                <input type="hidden" name="_next" value={window.location.href} />
                <input type="hidden" name="_subject" value="New Submission from Project Dock Contact Form" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Your name"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="you@example.com"
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    placeholder="How can we help?"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    placeholder="Your message..."
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors resize-none"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white font-medium py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <FiSend className="w-4 h-4" />
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

export default CleanContactPage;
