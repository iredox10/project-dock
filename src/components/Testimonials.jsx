
import React from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      quote: `"Project Dock was a lifesaver! I found a project that was the perfect starting point for my research. The documentation was clean and easy to follow."`,
      name: "Aminu Abubakar",
      details: "Computer Science, ABU Zaria",
      avatar: "https://placehold.co/100x100/E2E8F0/4A5568?text=AA",
    },
    {
      quote: `"The variety of projects is incredible. I was stuck on my topic selection, but browsing through Project Dock gave me so many great ideas."`,
      name: "Chiamaka Igwe",
      details: "Electrical Engineering, UNILAG",
      avatar: "https://placehold.co/100x100/E2E8F0/4A5568?text=CI",
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Loved by Students Nationwide</h2>
          <p className="mt-4 text-lg text-gray-600">Don't just take our word for it. Here's what students are saying.</p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-100 p-8 rounded-lg">
              <p className="text-gray-700">{testimonial.quote}</p>
              <div className="flex items-center mt-4">
                <img className="w-12 h-12 rounded-full" src={testimonial.avatar} alt={`Avatar of ${testimonial.name}`} />
                <div className="ml-4">
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-gray-600">{testimonial.details}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
