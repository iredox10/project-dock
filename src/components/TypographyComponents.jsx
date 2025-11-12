import React from 'react';
import { Link } from 'react-router-dom';

// Typography component for consistent headings
const Typography = {
  H1: ({ children, className = "" }) => (
    <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 ${className}`}>
      {children}
    </h1>
  ),
  H2: ({ children, className = "" }) => (
    <h2 className={`text-3xl md:text-4xl font-bold text-gray-900 ${className}`}>
      {children}
    </h2>
  ),
  H3: ({ children, className = "" }) => (
    <h3 className={`text-2xl md:text-3xl font-semibold text-gray-900 ${className}`}>
      {children}
    </h3>
  ),
  Body: ({ children, className = "" }) => (
    <p className={`text-base md:text-lg text-gray-700 ${className}`}>
      {children}
    </p>
  ),
  Caption: ({ children, className = "" }) => (
    <p className={`text-sm text-gray-600 ${className}`}>
      {children}
    </p>
  )
};

// Section wrapper for consistent spacing
const Section = ({ children, className = "", id }) => (
  <section className={`py-12 md:py-16 lg:py-20 ${className}`} id={id}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  </section>
);

// Card component for project listings and feature sections
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl border border-gray-200 hover:shadow-md transition-shadow ${className}`}>
    {children}
  </div>
);

// Button component for consistent styling
const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const baseClasses = "px-6 py-3 rounded-lg font-semibold transition-colors text-center";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
    outline: "border border-indigo-600 text-indigo-600 hover:bg-indigo-50"
  };
  
  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Link Button component
const LinkButton = ({ children, to, variant = "primary", className = "", ...props }) => {
  const baseClasses = "px-6 py-3 rounded-lg font-semibold transition-colors text-center inline-block";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
    outline: "border border-indigo-600 text-indigo-600 hover:bg-indigo-50"
  };
  
  return (
    <Link 
      to={to} 
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
};

export { Typography, Section, Card, Button, LinkButton };