import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
            Academic Excellence
            <span className="block text-indigo-600 mt-2">Simplified</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Discover thousands of verified academic projects from top Nigerian institutions. Your research journey starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/projects"
              className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all duration-200"
            >
              Explore Projects
            </Link>
            <Link
              to="/departments"
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
            >
              View Departments
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-indigo-600 mb-2">10,000+</div>
              <div className="text-gray-600">Verified Projects</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-indigo-600 mb-2">50+</div>
              <div className="text-gray-600">Departments</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-indigo-600 mb-2">100%</div>
              <div className="text-gray-600">Quality Assured</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why Project Dock</h2>
            <p className="text-gray-600 text-lg">Everything you need for academic success</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-xl bg-white border border-gray-200 hover:border-indigo-200 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Verified Quality</h3>
              <p className="text-gray-600 leading-relaxed">
                Every project is carefully reviewed and verified by academic experts to ensure top quality.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-white border border-gray-200 hover:border-indigo-200 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Instant Access</h3>
              <p className="text-gray-600 leading-relaxed">
                Download projects instantly after verification. No waiting periods or unnecessary delays.
              </p>
            </div>

            <div className="p-8 rounded-xl bg-white border border-gray-200 hover:border-indigo-200 hover:shadow-lg transition-all duration-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Vast Collection</h3>
              <p className="text-gray-600 leading-relaxed">
                Browse through thousands of projects across all major academic departments and fields.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Simple Process</h2>
            <p className="text-gray-600 text-lg">Get started in three easy steps</p>
          </div>

          <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Search & Browse</h3>
                <p className="text-gray-600 leading-relaxed">
                  Use our powerful search to find projects by department, topic, or keyword. Filter results to match your exact needs.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Review Details</h3>
                <p className="text-gray-600 leading-relaxed">
                  Preview project abstracts, methodologies, and complete details before making your selection.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Download & Access</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get instant access to complete project files including documentation and all supplementary materials.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Join thousands of students who trust Project Dock for their academic research needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/projects"
              className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all duration-200"
            >
              Browse Projects
            </Link>
            <Link
              to="/signup"
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
