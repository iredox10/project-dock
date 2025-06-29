
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

// Import regular page components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ContactPage from './pages/ContactPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import DepartmentPage from './pages/DepartmentPage';
import AllDepartmentsPage from './pages/AllDepartmentsPage';
import DownloadPage from './pages/DownloadPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HireWriterPage from './pages/HireWriterPage'

// Import admin components
import AdminLayout from './admin/components/AdminLayout';
import DashboardHomePage from './admin/pages/DashboardHomePage';
import { ProjectsAdminPage } from './admin/pages/ProjectsAdminPage';
import { UsersAdminPage } from './admin/pages/UsersAdminPage';
import { AddProjectPage } from './admin/pages/AddProjectPage'; // Import AddProjectPage
import { BulkUploadPage } from './admin/pages/BulkUploadPage'

// A placeholder for the Edit page. You would build this similar to AddProjectPage.
import { useParams } from 'react-router-dom';
import AboutPage from './pages/AboutPage';
import { OrdersAdminPage } from './admin/pages/OrdersAdminPage';
import { ReviewsAdminPage } from './admin/pages/ReviewsAdminPage';
import { EditProjectPage } from './admin/pages/EditProjectPage';


// Import user dashboard components
import UserDashboardLayout from './dashboard/components/UserDashboardLayout';
import { UserDashboardHomePage } from './dashboard/pages/DashboardHomePage';
import { MyProjectsPage } from './dashboard/pages/MyProjectsPage';
import { ProfilePage } from './dashboard/pages/ProfilePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';


function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardHomePage />} />
          <Route path="projects" element={<ProjectsAdminPage />} />
          <Route path="projects/add" element={<AddProjectPage />} />
          <Route path="projects/edit/:projectId" element={<EditProjectPage />} /> {/* Placeholder route */}
          <Route path="projects/bulk-upload" element={<BulkUploadPage />} />
          <Route path="users" element={<UsersAdminPage />} />
          <Route path="orders" element={<OrdersAdminPage />} />
          <Route path="reviews" element={<ReviewsAdminPage />} />
        </Route>

        {/* User Dashboard Routes */}
        <Route path="/dashboard" element={<UserDashboardLayout />}>
          <Route index element={<UserDashboardHomePage />} />
          <Route path="my-projects" element={<MyProjectsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        {/* Public/User-Facing Routes */}
        <Route path="/*" element={<MainApp />} />
      </Routes>
    </Router>
  );
}

// A component to group all non-admin routes under the main layout
const MainApp = () => {
  return (
    <div className="bg-gray-50 text-gray-800" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
          <Route path="/projects/:projectId/download" element={<DownloadPage />} />
          <Route path="/departments" element={<AllDepartmentsPage />} />
          <Route path="/department/:departmentName" element={<DepartmentPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/get-started" element={<SignupPage />} />
          <Route path="/about-us" element={<AboutPage />} />
          <Route path="/hire-writer" element={<HireWriterPage />} />

          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};


export default App;
