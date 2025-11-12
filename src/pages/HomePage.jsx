
import React from 'react';
import { Link } from 'react-router-dom';

// Minimal academic hero section
const MinimalHero = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Academic Projects
            <span className="block text-indigo-600">Repository</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Access thousands of verified academic projects from Nigerian institutions. 
            Research made simple and accessible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/projects"
              className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Browse Projects
            </Link>
            <Link
              to="/departments"
              className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Explore Departments
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

// Clean features section
const MinimalFeatures = () => {
  const features = [
    {
      title: "Verified Content",
      description: "All projects are peer-reviewed and verified for quality by academic experts.",
      icon: (
        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Easy Access",
      description: "Instant downloads after verification. No waiting, no delays.",
      icon: (
        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    {
      title: "Wide Selection",
      description: "10,000+ projects across 50+ departments from top Nigerian institutions.",
      icon: (
        <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Project Dock?</h2>
          <p className="text-lg text-gray-600">Trusted by thousands of students across Nigeria</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-base">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Minimal how it works section
const MinimalHowItWorks = () => {
  const steps = [
    { number: "1", title: "Browse", description: "Search and browse our extensive collection" },
    { number: "2", title: "Select", description: "Choose the project that fits your needs" },
    { number: "3", title: "Download", description: "Instant access after verification" }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-lg text-gray-600">Simple process to get the resources you need</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-indigo-600 font-bold text-lg">{step.number}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600 text-base">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Clean testimonials section
const MinimalTestimonials = () => {
  const testimonials = [
    {
      quote: "Project Dock has been invaluable for my research. The quality and variety of projects are exceptional.",
      author: "Sarah Johnson",
      role: "Computer Science Student"
    },
    {
      quote: "Finally found a reliable source for academic projects. Highly recommend to fellow students.",
      author: "Michael Chen",
      role: "Engineering Student"
    },
    {
      quote: "The verification process ensures quality content. A must-have resource for academic success.",
      author: "Amina Yusuf",
      role: "Economics Student"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Students Say</h2>
          <p className="text-lg text-gray-600">Join thousands of satisfied students</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="text-yellow-400 mb-4">★★★★★</div>
              <p className="text-gray-700 text-base mb-4">"{testimonial.quote}"</p>
              <div>
                <div className="font-semibold text-gray-900">{testimonial.author}</div>
                <div className="text-sm text-gray-600">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Main homepage component
const HomePage = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <MinimalHero />
      <MinimalFeatures />
      <MinimalHowItWorks />
      <MinimalTestimonials />
    </div>
  );
};

export default HomePage;
