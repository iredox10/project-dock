
import React from 'react';
import { FaSearch, FaMousePointer, FaCloudDownloadAlt, FaCheckCircle, FaArrowRight, FaBook, FaEye, FaDownload, FaRocket } from 'react-icons/fa';

const HowItWorks = () => {
  const steps = [
    {
      icon: <FaSearch className="h-12 w-12" />,
      title: "Search & Discover",
      description: "Use our intelligent search engine to find projects by title, keyword, department, or topic. Advanced filters help you discover the perfect academic resource in seconds.",
      features: ["Smart filters", "50+ departments", "Instant results"],
      gradient: "from-indigo-500 to-blue-600",
      color: "indigo"
    },
    {
      icon: <FaEye className="h-12 w-12" />,
      title: "Preview & Evaluate",
      description: "Review comprehensive project details including abstracts, chapters, methodologies, and references. Make informed decisions with complete transparency.",
      features: ["Full preview", "Detailed info", "Quality verified"],
      gradient: "from-blue-500 to-cyan-600",
      color: "blue"
    },
    {
      icon: <FaDownload className="h-12 w-12" />,
      title: "Download & Access",
      description: "Secure instant access to complete project materials including documentation, source code, and all supplementary files. Available 24/7.",
      features: ["Instant access", "Complete files", "Lifetime access"],
      gradient: "from-purple-500 to-fuchsia-600",
      color: "purple"
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-gradient-to-b from-white via-indigo-50/30 to-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
        
        {/* Academic pattern overlay */}
        <div className="absolute inset-0 opacity-[0.015]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="works-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="1.5" fill="#1e40af"/>
                <path d="M 15 30 L 30 20 L 45 30 L 30 40 Z" fill="none" stroke="#1e40af" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#works-pattern)" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <div className="text-center mb-16 md:mb-24 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-white border-2 border-indigo-100 rounded-full px-5 py-2 mb-6 shadow-sm">
            <FaRocket className="text-indigo-600 text-sm" />
            <span className="text-indigo-900 text-sm font-bold uppercase tracking-wide">How It Works</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6">
            Your Journey to{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Academic Excellence
              </span>
              <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 300 12" fill="none">
                <path d="M2 6 Q100 2, 200 6 T298 6" stroke="url(#journey-gradient)" strokeWidth="2.5" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="journey-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="50%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h2>
          
          <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-slate-600 leading-relaxed">
            Getting started is simple. Follow these three easy steps to access premium academic projects and elevate your research.
          </p>
        </div>

        {/* Desktop: Horizontal timeline layout */}
        <div className="hidden lg:block relative mb-20">
          {/* Connecting line with gradient */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-200 via-blue-200 to-purple-200 -translate-y-1/2" style={{ top: '80px' }}></div>
          
          <div className="grid grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="relative animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Step number badge */}
                <div className="relative mx-auto w-40 h-40 mb-8">
                  {/* Glow effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-20 rounded-full blur-2xl`}></div>
                  
                  {/* Main circle */}
                  <div className={`relative w-full h-full bg-gradient-to-br ${step.gradient} rounded-full shadow-2xl flex items-center justify-center group hover:scale-110 transition-transform duration-500`}>
                    <div className="text-white">
                      {step.icon}
                    </div>
                  </div>
                  
                  {/* Step number */}
                  <div className="absolute -top-3 -right-3 w-12 h-12 bg-white border-4 border-indigo-100 rounded-full flex items-center justify-center shadow-lg">
                    <span className={`text-2xl font-black bg-gradient-to-br ${step.gradient} bg-clip-text text-transparent`}>
                      {index + 1}
                    </span>
                  </div>
                </div>

                {/* Content card */}
                <div className="bg-white rounded-2xl border-2 border-slate-100 p-8 hover:border-indigo-200 hover:shadow-xl transition-all duration-500 group">
                  <h3 className={`text-2xl font-bold text-slate-900 mb-4 bg-gradient-to-r ${step.gradient} bg-clip-text group-hover:text-transparent transition-all`}>
                    {step.title}
                  </h3>
                  
                  <p className="text-slate-600 leading-relaxed mb-6">
                    {step.description}
                  </p>

                  {/* Feature list */}
                  <div className="space-y-2">
                    {step.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <FaCheckCircle className={`text-${step.color}-600 flex-shrink-0`} />
                        <span className="text-slate-700 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Arrow connector (except for last item) */}
                {index < steps.length - 1 && (
                  <div className="absolute top-20 -right-8 text-indigo-300 hidden xl:block">
                    <FaArrowRight className="w-12 h-12" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile & Tablet: Vertical timeline layout */}
        <div className="lg:hidden relative">
          {/* Vertical connecting line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-200 via-blue-200 to-purple-200 md:left-12"></div>
          
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="relative pl-20 md:pl-28 animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Step circle */}
                <div className="absolute left-0 md:left-4 top-0">
                  <div className="relative w-16 h-16">
                    {/* Glow */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-20 rounded-full blur-xl`}></div>
                    
                    {/* Main circle */}
                    <div className={`relative w-full h-full bg-gradient-to-br ${step.gradient} rounded-full shadow-xl flex items-center justify-center`}>
                      <div className="text-white scale-75">
                        {step.icon}
                      </div>
                    </div>
                    
                    {/* Step number */}
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white border-2 border-indigo-100 rounded-full flex items-center justify-center shadow-md">
                      <span className={`text-sm font-black bg-gradient-to-br ${step.gradient} bg-clip-text text-transparent`}>
                        {index + 1}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content card */}
                <div className="bg-white rounded-2xl border-2 border-slate-100 p-6 md:p-8 hover:border-indigo-200 hover:shadow-xl transition-all duration-500">
                  <h3 className={`text-xl md:text-2xl font-bold text-slate-900 mb-3 bg-gradient-to-r ${step.gradient} bg-clip-text`}>
                    {step.title}
                  </h3>
                  
                  <p className="text-slate-600 leading-relaxed mb-4 text-sm md:text-base">
                    {step.description}
                  </p>

                  {/* Feature list */}
                  <div className="space-y-2">
                    {step.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs md:text-sm">
                        <FaCheckCircle className={`text-${step.color}-600 flex-shrink-0`} />
                        <span className="text-slate-700 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 md:mt-20 text-center animate-fade-in-up" style={{ animationDelay: '450ms' }}>
          <div className="bg-white rounded-3xl border-2 border-indigo-100 p-8 md:p-12 shadow-xl hover:shadow-2xl transition-all duration-500 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-indigo-50 rounded-full px-4 py-2 mb-6">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-full border-2 border-white"></div>
              </div>
              <span className="text-indigo-900 text-sm font-bold">5,000+ Students Trust Us</span>
            </div>

            <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto">
              Join thousands of successful students. Start exploring our comprehensive library today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/projects"
                className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group"
              >
                <FaBook className="group-hover:rotate-12 transition-transform" />
                <span className="text-lg">Browse Projects</span>
              </a>
              <a 
                href="/departments"
                className="inline-flex items-center justify-center gap-3 bg-white text-indigo-600 font-bold px-8 py-4 rounded-xl border-2 border-indigo-200 hover:bg-indigo-50 hover:scale-105 transition-all duration-300 group"
              >
                <span className="text-lg">View Departments</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default HowItWorks;
