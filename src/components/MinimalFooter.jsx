const MinimalFooter = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center">
              <span className="text-xl font-bold text-gray-900">Project Dock</span>
            </div>
            <p className="mt-4 text-gray-600 max-w-md">
              Nigeria's premier academic resource hub, trusted by thousands of students for quality research materials.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Resources</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="/projects" className="text-gray-600 hover:text-gray-900">Projects</a></li>
              <li><a href="/departments" className="text-gray-600 hover:text-gray-900">Departments</a></li>
              <li><a href="/about" className="text-gray-600 hover:text-gray-900">About</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><a href="/terms" className="text-gray-600 hover:text-gray-900">Terms</a></li>
              <li><a href="/privacy" className="text-gray-600 hover:text-gray-900">Privacy</a></li>
              <li><a href="/refund" className="text-gray-600 hover:text-gray-900">Refund</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Project Dock. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            {/* Social links */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MinimalFooter;