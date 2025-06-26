
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import DepartmentPage from './pages/DepartmentPage';
import AllDepartmentsPage from './pages/AllDepartmentsPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DownloadPage from './pages/DownloadPage';

function App() {
  return (
    <Router>
      <div className="bg-gray-50 text-gray-800" style={{ fontFamily: "'Inter', sans-serif" }}>
        <Navbar />
        <main>
          <Routes>
            {/* Main Pages */}
            <Route path="/" element={<HomePage />} />

            {/* Project & Department Browsing Pages */}
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
            <Route path="/departments" element={<AllDepartmentsPage />} />
            <Route path="/department/:departmentName" element={<DepartmentPage />} />

            {/* Authentication Pages */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Action-based route that directs to a page */}
            <Route path="/get-started" element={<SignupPage />} />

            <Route path="/download/:projectId" element={<DownloadPage />} />

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
