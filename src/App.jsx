import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

// Import regular page components
import CleanNavbar from './components/CleanNavbar';
import CleanFooter from './components/CleanFooter';
import HomePage from './pages/HomePage';
import CleanContactPage from './pages/CleanContactPage';
import CleanProjectsPage from './pages/CleanProjectsPage';
import CleanProjectDetailPage from './pages/CleanProjectDetailPage';
import CleanDepartmentPage from './pages/CleanDepartmentPage';
import CleanDepartmentsPage from './pages/CleanDepartmentsPage';
import DownloadPage from './pages/DownloadPage';
import DownloadFilePage from './pages/DownloadFilePage';
import PaymentPage from './pages/PaymentPage';
import PaymentVerificationPage from './pages/PaymentVerificationPage';
import DemoPaymentPage from './pages/DemoPaymentPage';
import CleanLoginPage from './pages/CleanLoginPage';
import CleanSignupPage from './pages/CleanSignupPage';
import CleanHireWriterPage from './pages/CleanHireWriterPage';
import CleanProjectTopicsPage from './pages/CleanProjectTopicsPage';

// Import admin components
import AdminLayout from './admin/components/AdminLayout';
import DashboardHomePage from './admin/pages/DashboardHomePage';
import { ProjectsAdminPage } from './admin/pages/ProjectsAdminPage';
import { UsersAdminPage } from './admin/pages/UsersAdminPage';
import { AddProjectPage } from './admin/pages/AddProjectPage'; // Import AddProjectPage
import { BulkUploadPage } from './admin/pages/BulkUploadPage'
import { AIProjectUploadPage } from './admin/pages/AIProjectUploadPage';
import AIDepartmentProjectGenerator from './admin/pages/AIDepartmentProjectGenerator';

// A placeholder for the Edit page. You would build this similar to AddProjectPage.
import CleanAboutPage from './pages/CleanAboutPage';
import { OrdersAdminPage } from './admin/pages/OrdersAdminPage';
import { ReviewsAdminPage } from './admin/pages/ReviewsAdminPage';
import { EditProjectPage } from './admin/pages/EditProjectPage';

// Import protected route component
import ProtectedRoute from './components/ProtectedRoute';

// Import additional pages
import ResetPasswordPage from './pages/ResetPasswordPage';
import CleanNotFoundPage from './pages/NotFoundPage';

// Import user dashboard components
import UserDashboardLayout from './dashboard/components/UserDashboardLayout';
import { UserDashboardHomePage } from './dashboard/pages/DashboardHomePage';
import { MyProjectsPage } from './dashboard/pages/MyProjectsPage';
import MyLibraryPage from './dashboard/pages/MyLibraryPage';
import { ProfilePage } from './dashboard/pages/ProfilePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';


function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminLayout /></ProtectedRoute>}>
          <Route index element={<DashboardHomePage />} />
          <Route path="projects" element={<ProjectsAdminPage />} />
          <Route path="projects/add" element={<AddProjectPage />} />
          <Route path="projects/edit/:projectId" element={<EditProjectPage />} /> {/* Placeholder route */}
          <Route path="projects/bulk-upload" element={<BulkUploadPage />} />
          <Route path="projects/ai-upload" element={<AIProjectUploadPage />} />
          <Route path="projects/ai-generate" element={<AIDepartmentProjectGenerator />} />
          <Route path="users" element={<UsersAdminPage />} />
          <Route path="orders" element={<OrdersAdminPage />} />
          <Route path="reviews" element={<ReviewsAdminPage />} />
        </Route>

        {/* User Dashboard Routes */}
        <Route path="/dashboard" element={<UserDashboardLayout />}>
          <Route index element={<UserDashboardHomePage />} />
          <Route path="my-library" element={<MyLibraryPage />} />
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
    <div className="bg-gray-50 text-gray-800">
      <CleanNavbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<CleanContactPage />} />
          <Route path="/projects" element={<CleanProjectsPage />} />
          <Route path="/projects/:projectId" element={<CleanProjectDetailPage />} />
          <Route path="/projects/:projectId/download" element={<DownloadPage />} />
          <Route path="/projects/:projectId/download-file" element={<DownloadFilePage />} />
          <Route path="/projects/:projectId/payment" element={<PaymentPage />} />
          <Route path="/payment/verify" element={<PaymentVerificationPage />} />
          <Route path="/payment/demo" element={<DemoPaymentPage />} />
          <Route path="/departments" element={<CleanDepartmentsPage />} />
          <Route path="/department/:departmentName" element={<CleanDepartmentPage />} />
          <Route path="/department/:departmentName/topics" element={<CleanProjectTopicsPage />} />
          <Route path="/login" element={<CleanLoginPage />} />
          <Route path="/signup" element={<CleanSignupPage />} />
          <Route path="/get-started" element={<CleanSignupPage />} />
          <Route path="/about-us" element={<CleanAboutPage />} />
          <Route path="/hire-writer" element={<CleanHireWriterPage />} />

          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Catch-all route for 404 - should be the last route */}
          <Route path="*" element={<CleanNotFoundPage />} />
        </Routes>
      </main>
      <CleanFooter />
    </div>
  );
};


export default App;
