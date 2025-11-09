
import React from 'react';
import { FaQuoteLeft, FaStar, FaGraduationCap, FaUniversity, FaCheckCircle, FaAward } from 'react-icons/fa';

const Testimonials = () => {

  const featuredTestimonial = {
    quote: "Project Dock transformed my final year experience. The comprehensive library and quality materials in Computer Science saved me countless hours of research. The platform's reliability and instant access made all the difference in meeting my deadlines.",
    name: "Aminu Abubakar",
    details: "B.Sc. Computer Science",
    university: "Ahmadu Bello University, Zaria",
    avatar: "https://placehold.co/128x128/4F46E5/FFFFFF?text=AA",
    rating: 5,
    year: "Class of 2024"
  };

  const otherTestimonials = [
    {
      quote: "The extensive Economics collection provided invaluable insights for my research. The search functionality made finding relevant projects incredibly easy.",
      name: "Chiamaka Igwe",
      details: "B.Sc. Economics",
      university: "University of Lagos",
      avatar: "https://placehold.co/100x100/2563EB/FFFFFF?text=CI",
      rating: 5,
      year: "2024"
    },
    {
      quote: "As an HND student, finding quality engineering projects was always challenging. Project Dock's collection exceeded my expectations.",
      name: "David Ojo",
      details: "HND Mechanical Engineering",
      university: "Yaba College of Technology",
      avatar: "https://placehold.co/100x100/7C3AED/FFFFFF?text=DO",
      rating: 5,
      year: "2024"
    },
    {
      quote: "The peer-reviewed quality and instant downloads made my Mass Communication project research seamless. Highly recommend!",
      name: "Fatima Bello",
      details: "B.Sc. Mass Communication",
      university: "University of Ibadan",
      avatar: "https://placehold.co/100x100/DB2777/FFFFFF?text=FB",
      rating: 5,
      year: "2023"
    },
    {
      quote: "Outstanding platform! The Business Administration section had exactly what I needed. The quality assurance is evident in every project.",
      name: "Chinedu Okafor",
      details: "B.Sc. Business Administration",
      university: "University of Nigeria, Nsukka",
      avatar: "https://placehold.co/100x100/059669/FFFFFF?text=CO",
      rating: 5,
      year: "2023"
    },
  ];

  return (
    <section id="testimonials" className="py-20 md:py-28 bg-gradient-to-b from-white via-blue-50/30 to-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
        
        {/* Academic pattern */}
        <div className="absolute inset-0 opacity-[0.015]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="testimonial-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <circle cx="30" cy="30" r="1.5" fill="#1e40af"/>
                <path d="M 15 30 L 30 20 L 45 30 L 30 40 Z" fill="none" stroke="#1e40af" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#testimonial-pattern)" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <div className="text-center mb-16 md:mb-20 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-white border-2 border-indigo-100 rounded-full px-5 py-2 mb-6 shadow-sm">
            <FaGraduationCap className="text-indigo-600 text-sm" />
            <span className="text-indigo-900 text-sm font-bold uppercase tracking-wide">Student Success Stories</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6">
            Trusted by{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Thousands
              </span>
              <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 200 12" fill="none">
                <path d="M2 6 Q100 2, 198 6" stroke="url(#trusted-gradient)" strokeWidth="2.5" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="trusted-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="50%" stopColor="#2563eb" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h2>
          
          <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-slate-600 leading-relaxed">
            Join thousands of successful students who have achieved academic excellence with Project Dock. 
            Here's what they have to say about their experience.
          </p>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 mt-8">
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} className="w-5 h-5" />
                ))}
              </div>
              <span className="text-slate-900 font-bold text-lg">4.9/5.0</span>
            </div>
            <div className="w-px h-8 bg-slate-300"></div>
            <div className="flex items-center gap-2 text-slate-700">
              <FaCheckCircle className="text-green-500 w-5 h-5" />
              <span className="font-semibold">5,000+ Happy Students</span>
            </div>
            <div className="w-px h-8 bg-slate-300 hidden sm:block"></div>
            <div className="flex items-center gap-2 text-slate-700 hidden sm:flex">
              <FaAward className="text-indigo-600 w-5 h-5" />
              <span className="font-semibold">Verified Reviews</span>
            </div>
          </div>
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Featured Testimonial - Large card */}
          <div className="lg:col-span-2 relative group animate-fade-in-up">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
            
            <div className="relative bg-white rounded-3xl border-2 border-indigo-100 p-8 md:p-12 shadow-xl hover:shadow-2xl hover:border-indigo-200 transition-all duration-500">
              {/* Quote icon */}
              <div className="absolute top-8 right-8 text-indigo-100">
                <FaQuoteLeft className="w-16 h-16 md:w-20 md:h-20" />
              </div>

              {/* Rating stars */}
              <div className="flex text-yellow-400 mb-6">
                {[...Array(featuredTestimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="w-6 h-6" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-xl md:text-2xl font-medium text-slate-800 leading-relaxed mb-8 relative z-10">
                "{featuredTestimonial.quote}"
              </p>

              {/* Author info */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-full blur-md opacity-50"></div>
                  <img 
                    className="relative w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white shadow-lg" 
                    src={featuredTestimonial.avatar} 
                    alt={featuredTestimonial.name} 
                  />
                </div>
                <div>
                  <p className="font-bold text-xl text-slate-900">{featuredTestimonial.name}</p>
                  <p className="text-indigo-600 font-semibold text-base">{featuredTestimonial.details}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <FaUniversity className="text-slate-400 w-3 h-3" />
                    <p className="text-sm text-slate-600">{featuredTestimonial.university}</p>
                  </div>
                </div>
                <div className="ml-auto hidden md:block">
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-100 rounded-xl px-4 py-2 text-center">
                    <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wide">Graduate</p>
                    <p className="text-sm text-slate-900 font-bold">{featuredTestimonial.year}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Side testimonials - Stacked cards */}
          <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
            {otherTestimonials.slice(0, 2).map((testimonial, index) => (
              <div 
                key={index} 
                className="relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  index === 0 ? 'from-blue-600 to-cyan-600' : 'from-purple-600 to-fuchsia-600'
                } rounded-2xl blur-lg opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>
                
                <div className="relative bg-white rounded-2xl border-2 border-slate-100 p-6 hover:border-indigo-200 hover:shadow-xl transition-all duration-500">
                  {/* Rating */}
                  <div className="flex text-yellow-400 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="w-4 h-4" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-slate-700 leading-relaxed mb-4 text-sm md:text-base">
                    "{testimonial.quote}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <img 
                      className="w-12 h-12 rounded-full border-2 border-slate-100 shadow-md" 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                    />
                    <div className="flex-1">
                      <p className="font-bold text-slate-900 text-sm">{testimonial.name}</p>
                      <p className="text-xs text-slate-600">{testimonial.details}</p>
                      <p className="text-xs text-indigo-600 font-medium">{testimonial.university}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional testimonials - Bottom row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          {otherTestimonials.slice(2).map((testimonial, index) => (
            <div 
              key={index} 
              className="relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${
                index === 0 ? 'from-pink-600 to-rose-600' : 'from-emerald-600 to-green-600'
              } rounded-2xl blur-lg opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>
              
              <div className="relative bg-white rounded-2xl border-2 border-slate-100 p-6 hover:border-indigo-200 hover:shadow-xl transition-all duration-500">
                {/* Rating */}
                <div className="flex text-yellow-400 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="w-4 h-4" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-slate-700 leading-relaxed mb-4">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <img 
                    className="w-12 h-12 rounded-full border-2 border-slate-100 shadow-md" 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                  />
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 text-sm">{testimonial.name}</p>
                    <p className="text-xs text-slate-600">{testimonial.details}</p>
                    <p className="text-xs text-indigo-600 font-medium">{testimonial.university}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">{testimonial.year}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center animate-fade-in-up" style={{ animationDelay: '450ms' }}>
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-100 rounded-2xl px-8 py-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <FaGraduationCap className="text-white text-xl" />
              </div>
              <div className="text-left">
                <p className="text-slate-900 font-bold text-lg">Ready to join them?</p>
                <p className="text-slate-600 text-sm">Start your success story today</p>
              </div>
            </div>
            <a 
              href="/signup"
              className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 whitespace-nowrap"
            >
              Get Started Free
            </a>
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

export default Testimonials;
