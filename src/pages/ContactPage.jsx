
import React from 'react';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';

const ContactPage = () => {
  return (
    <div className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900">
            Get In <span className="text-indigo-600">Touch</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
            We'd love to hear from you. Please fill out the form below or reach out to us directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8 rounded-2xl shadow-2xl">
          {/* Contact Form */}
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Send us a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="sr-only">Your Name</label>
                  <input type="text" id="name" placeholder="Your Name" className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label htmlFor="email" className="sr-only">Your Email</label>
                  <input type="email" id="email" placeholder="Your Email" className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="sr-only">Subject</label>
                <input type="text" id="subject" placeholder="Subject" className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">Message</label>
                <textarea id="message" rows="6" placeholder="Your Message..." className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"></textarea>
              </div>
              <button type="submit" className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-all duration-300 text-lg">
                <FaPaperPlane />
                <span>Send Message</span>
              </button>
            </form>
          </div>

          {/* Contact Info & Map */}
          <div className="order-1 lg:order-2 bg-gradient-to-br from-indigo-600 to-blue-500 p-8 rounded-2xl text-white">
            <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <FaMapMarkerAlt className="text-2xl mt-1 text-indigo-200" />
                <div>
                  <h3 className="font-bold">Address</h3>
                  <p className="text-indigo-100">123 Project Dock Avenue, Abuja, Nigeria</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <FaPhone className="text-2xl mt-1 text-indigo-200" />
                <div>
                  <h3 className="font-bold">Phone</h3>
                  <p className="text-indigo-100">+234 801 234 5678</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <FaEnvelope className="text-2xl mt-1 text-indigo-200" />
                <div>
                  <h3 className="font-bold">Email</h3>
                  <p className="text-indigo-100">support@projectdock.com</p>
                </div>
              </li>
            </ul>
            <div className="mt-8 h-48 bg-indigo-500 rounded-lg overflow-hidden">
              {/* Placeholder for an interactive map like Google Maps */}
              <img src="https://placehold.co/600x400/818cf8/ffffff?text=Map+Goes+Here" alt="Map placeholder" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
