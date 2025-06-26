
import React from 'react';
import { FaQuoteLeft } from 'react-icons/fa';

const Testimonials = () => {

  const featuredTestimonial = {
    quote: "This platform was a game-changer for my final year project. The quality of the materials is top-notch, and finding a relevant case study in the Computer Science department saved me weeks of work. I honestly couldn't have finished on time without it.",
    name: "Aminu Abubakar",
    details: "B.Sc. Computer Science, ABU Zaria",
    avatar: "https://placehold.co/128x128/E2E8F0/4A5568?text=AA",
  };

  const otherTestimonials = [
    {
      quote: "The sheer variety of projects is incredible. I was stuck on my topic selection, but browsing through the Economics section gave me so many great ideas.",
      name: "Chiamaka Igwe",
      details: "B.Sc. Economics, UNILAG",
      avatar: "https://placehold.co/100x100/E2E8F0/4A5568?text=CI",
    },
    {
      quote: "As an HND student, finding relevant materials can be tough. Project Dock had a huge selection for Mechanical Engineering that was perfect for my level.",
      name: "David Ojo",
      details: "HND Mechanical Engineering, Yabatech",
      avatar: "https://placehold.co/100x100/E2E8F0/4A5568?text=DO",
    },
  ];

  return (
    <section id="testimonials" className="py-24 bg-gradient-to-br from-indigo-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-indigo-600 tracking-wider uppercase">Testimonials</h2>
          <p className="mt-2 text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            What Our Users Are Saying
          </p>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
            Success stories from students just like you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Featured Testimonial */}
          <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-2xl relative border border-gray-100">
            <FaQuoteLeft className="absolute top-8 left-8 text-7xl text-indigo-100 -z-0" />
            <div className="relative z-10">
              <p className="text-2xl font-medium text-gray-800 mb-6">
                {featuredTestimonial.quote}
              </p>
              <div className="flex items-center">
                <img className="w-16 h-16 rounded-full" src={featuredTestimonial.avatar} alt={`Avatar of ${featuredTestimonial.name}`} />
                <div className="ml-4">
                  <p className="font-bold text-lg text-gray-900">{featuredTestimonial.name}</p>
                  <p className="text-indigo-600 font-semibold">{featuredTestimonial.details}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Other Testimonials */}
          <div className="space-y-8">
            {otherTestimonials.map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <p className="text-gray-700 mb-4">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <img className="w-12 h-12 rounded-full" src={testimonial.avatar} alt={`Avatar of ${testimonial.name}`} />
                  <div className="ml-4">
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.details}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
