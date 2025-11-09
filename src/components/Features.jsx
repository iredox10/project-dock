
import React from 'react';
import { FaBook, FaDownload, FaCheckCircle, FaSearch, FaUserShield, FaBrain, FaShieldAlt, FaAward, FaClock, FaUniversity, FaStar, FaLock } from 'react-icons/fa';

const Features = () => {

  const featureList = [
    {
      icon: <FaUniversity className="h-10 w-10" />,
      iconBg: "from-indigo-500 to-blue-600",
      iconColor: "text-indigo-600",
      bgPattern: "indigo",
      title: "Comprehensive Library",
      description: "Access 10,000+ verified academic projects across 50+ departments, meticulously curated by academic experts.",
      stat: "10,000+",
      statLabel: "Projects"
    },
    {
      icon: <FaShieldAlt className="h-10 w-10" />,
      iconBg: "from-blue-500 to-cyan-600",
      iconColor: "text-blue-600",
      bgPattern: "blue",
      title: "Quality Assurance",
      description: "Every project undergoes rigorous peer review and quality checks to ensure academic excellence and reliability.",
      stat: "100%",
      statLabel: "Verified"
    },
    {
      icon: <FaClock className="h-10 w-10" />,
      iconBg: "from-purple-500 to-fuchsia-600",
      iconColor: "text-purple-600",
      bgPattern: "purple",
      title: "Instant Access",
      description: "Download complete project materials including documentation, source code, and references immediately.",
      stat: "24/7",
      statLabel: "Available"
    },
    {
      icon: <FaSearch className="h-10 w-10" />,
      iconBg: "from-emerald-500 to-green-600",
      iconColor: "text-emerald-600",
      bgPattern: "emerald",
      title: "Smart Search",
      description: "Advanced filtering and search algorithms help you find exactly what you need in seconds, not hours.",
      stat: "<5s",
      statLabel: "Search Time"
    },
    {
      icon: <FaBrain className="h-10 w-10" />,
      iconBg: "from-pink-500 to-rose-600",
      iconColor: "text-pink-600",
      bgPattern: "pink",
      title: "Research Inspiration",
      description: "Discover innovative ideas and methodologies from successful projects to inspire your own research.",
      stat: "50+",
      statLabel: "Fields"
    },
    {
      icon: <FaAward className="h-10 w-10" />,
      iconBg: "from-amber-500 to-orange-600",
      iconColor: "text-amber-600",
      bgPattern: "amber",
      title: "Academic Excellence",
      description: "All projects follow standard academic formats and guidelines, perfect for reference and learning.",
      stat: "A+",
      statLabel: "Quality"
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden">
      {/* Sophisticated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle gradient orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-200/10 rounded-full blur-3xl"></div>
        
        {/* Academic pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="feature-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="1.5" fill="#1e40af"/>
                <path d="M 15 30 L 30 20 L 45 30 L 30 40 Z" fill="none" stroke="#1e40af" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#feature-pattern)" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <div className="text-center mb-16 md:mb-20 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border-2 border-indigo-100 rounded-full px-5 py-2 mb-6">
            <FaStar className="text-indigo-600 text-sm" />
            <span className="text-indigo-900 text-sm font-bold uppercase tracking-wide">Why Choose Project Dock</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6">
            Built for{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Academic Success
              </span>
              <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 300 12" fill="none">
                <path d="M2 6 Q100 2, 200 6 T298 6" stroke="url(#success-gradient)" strokeWidth="2.5" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="success-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="50%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h2>
          
          <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-slate-600 leading-relaxed">
            We provide everything you need to excel in your research and academic projects. 
            Trusted by thousands of students across Nigeria.
          </p>
        </div>

        {/* Feature cards grid */}
        <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featureList.map((feature, index) => (
            <div 
              key={index} 
              className="group relative bg-white rounded-3xl border-2 border-slate-100 hover:border-indigo-200 transition-all duration-500 overflow-hidden hover:shadow-2xl hover:shadow-indigo-100/50 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Card background gradient on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.iconBg} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              {/* Card content */}
              <div className="relative p-8 md:p-10">
                {/* Icon container with gradient */}
                <div className="relative mb-6">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.iconBg} opacity-10 rounded-2xl blur-xl group-hover:opacity-20 transition-opacity duration-500`}></div>
                  <div className={`relative inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${feature.iconBg} rounded-2xl shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-500`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  
                  {/* Stat badge */}
                  <div className="absolute -top-2 -right-2 bg-white border-2 border-slate-100 rounded-full px-3 py-1 shadow-lg">
                    <div className={`text-xs font-black ${feature.iconColor}`}>{feature.stat}</div>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-indigo-900 transition-colors">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-base text-slate-600 leading-relaxed mb-6">
                  {feature.description}
                </p>

                {/* Bottom stat label */}
                <div className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.iconBg}`}></div>
                  <span className="text-slate-500 font-medium">{feature.statLabel}</span>
                </div>

                {/* Decorative corner element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-transparent to-slate-50/50 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Bottom border accent */}
              <div className={`h-1 bg-gradient-to-r ${feature.iconBg} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA section */}
        <div className="mt-16 md:mt-20 text-center animate-fade-in-up" style={{ animationDelay: '600ms' }}>
          <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 rounded-3xl p-10 md:p-16 shadow-2xl relative overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%">
                <defs>
                  <pattern id="cta-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="20" cy="20" r="1" fill="white"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#cta-pattern)" />
              </svg>
            </div>

            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <FaLock className="text-white text-sm" />
                <span className="text-white text-sm font-bold">Trusted by 5,000+ Students</span>
              </div>

              <h3 className="text-3xl md:text-4xl font-black text-white mb-6">
                Ready to Elevate Your Research?
              </h3>
              <p className="text-lg md:text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
                Join thousands of successful students who have transformed their academic journey with Project Dock.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a 
                  href="/projects"
                  className="inline-flex items-center gap-3 bg-white text-indigo-600 font-bold px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
                >
                  <span className="text-lg">Browse Projects</span>
                  <FaBook className="group-hover:rotate-12 transition-transform" />
                </a>
                <a 
                  href="/signup"
                  className="inline-flex items-center gap-3 bg-indigo-800 text-white font-bold px-8 py-4 rounded-xl border-2 border-white/20 hover:bg-indigo-900 hover:scale-105 transition-all duration-300 group"
                >
                  <span className="text-lg">Get Started Free</span>
                  <FaAward className="group-hover:rotate-12 transition-transform" />
                </a>
              </div>
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

export default Features;
