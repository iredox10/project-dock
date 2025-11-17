

   Project Dock - Academic Research Platform Creation Prompt

   Project Overview

   Create a full-stack academic research project marketplace platform called
   "Project Dock" that allows students to browse, search, purchase, and download
   academic research projects. The platform includes an admin dashboard with
   AI-powered data extraction capabilities, user management, payment integration,
   and a clean, minimal UI design.

   Tech Stack

   Frontend

     - React 19.0.0 with Vite 6.2.0 build tool
     - React Router DOM 7.6.2 for navigation
     - Tailwind CSS 4.1.11 for styling
     - React Icons 5.5.0 for iconography
     - React Markdown 10.1.0 for content rendering

   Backend & Services

     - Appwrite 21.4.0 (Cloud BaaS for database, auth, storage, functions)
     - Node Appwrite 20.3.0 (server-side SDK)

   Payment Integration

     - Paystack API (Card, Bank Transfer, OPay, Kuda, Moniepoint, Microfinance)

   AI & Document Processing

     - Google Gemini AI API 0.24.1 for intelligent data extraction
     - PDF.js 5.4.394 for PDF parsing
     - Mammoth 1.11.0 for DOCX processing
     - PapaParse 5.5.3 for CSV handling
     - XLSX 0.18.5 for Excel processing
     - UUID 13.0.0 for unique identifiers

   Color Scheme & Design

     - Primary Color: Indigo-600 (#4F46E5)
     - Secondary Colors: Gray scale (50-900)
     - Accent: Indigo-50 for highlights
     - Design Style: Minimal, clean, Context7.com-inspired aesthetic
     - Typography: Inter font family, professional and readable
     - Layout: White backgrounds, subtle borders, gentle shadows

   Application Structure

   1. Public Pages (src/pages/)

     - HomePage - Minimal hero section, features, how-it-works, call-to-action
     - ProjectsPage - Grid layout (3 columns) with department filter, search, pagination (24 per page)
     - ProjectDetailPage - Full project information, download options, payment integration
     - DepartmentsPage - All academic departments listing
     - DepartmentPage - Projects filtered by specific department
     - ProjectTopicsPage - Browse by project topics/titles
     - LoginPage - User authentication
     - SignupPage - User registration
     - ContactPage - Contact form
     - AboutPage - About the platform
     - HireWriterPage - Hire academic writers service
     - PaymentPage - Paystack payment processing
     - PaymentVerificationPage - Payment confirmation
     - DownloadPage - Authenticated project downloads
     - ForgotPasswordPage - Password reset
     - NotFoundPage - 404 error page

   2. Admin Dashboard (src/admin/)

   Pages:

     - DashboardHomePage - Overview with stats (users, projects, orders, revenue)
     - ProjectsAdminPage - CRUD operations for projects
     - AddProjectPage - Manual project entry form
     - EditProjectPage - Edit existing projects
     - BulkUploadPage - CSV/Excel bulk import
     - AIProjectUploadPage - AI-powered single file extraction
     - AIDepartmentProjectGenerator - Batch AI extraction
     - UsersAdminPage - User management (view, edit roles, delete)
     - OrdersAdminPage - Order tracking and management
     - ReviewsAdminPage - Review moderation

   Components:

     - AdminLayout - Sidebar navigation, header, main content area
     - AdminSidebar - Navigation menu with dashboard, projects, users, orders, reviews

   3. User Dashboard (src/dashboard/)

   Pages:

     - DashboardHomePage - User overview, recent downloads
     - MyLibraryPage - Downloaded/purchased projects
     - MyProjectsPage - Upload and manage own projects (future feature)
     - ProfilePage - User settings, payment history

   Components:

     - UserDashboardLayout - User-specific navigation

   4. Core Components (src/components/)

     - CleanNavbar - Responsive navigation with mobile menu, user dropdown
     - CleanFooter - Links, social media, copyright
     - ProtectedRoute - Route guard for authentication/authorization
     - Modal - Reusable modal dialogs
     - FileUploader - Drag-and-drop file upload
     - ProjectCard - Minimal card design showing title, department, year, pages

   5. Services & APIs (src/api/ & src/appwrite/)

   Appwrite Services:

     - auth.js - Login, signup, logout, password reset, session management
     - database.js - CRUD operations for projects, users, orders, reviews
     - storage.js - File upload/download, URL generation
     - departmentService.js - Department management
     - aiExtractionService.js - AI-powered PDF/DOCX parsing

   Payment Services:

     - paystackService.js - Initialize transactions, verify payments

   Project Services:

     - projectServices.js - Fetch, search, filter projects
     - projectTopicService.js - Topic/title management

   Database Schema (Appwrite Collections)

   Projects Collection

     {
       title: String (required),
       author: String,
       department: String (required),
       level: String (BSc, MSc, HND, ND, PhD),
       year: Number,
       abstract: String (long text),
       chapterOne: String (long text),
       pages: Number,
       formats: Array [PDF, DOCX],
       price: Number,
       fileId: String (Appwrite storage ID),
       fileUrl: String,
       thumbnailUrl: String,
       chapterTitles: Array of strings,
       downloads: Number,
       rating: Number,
       createdAt: DateTime,
       updatedAt: DateTime
     }

   Users Collection

     {
       name: String,
       email: String (unique),
       role: String (user, admin),
       phoneNumber: String,
       createdAt: DateTime,
       lastLogin: DateTime
     }

   Orders Collection

     {
       userId: String,
       projectId: String,
       amount: Number,
       paymentMethod: String,
       paymentStatus: String (pending, completed, failed),
       transactionId: String,
       createdAt: DateTime
     }

   Reviews Collection

     {
       userId: String,
       projectId: String,
       rating: Number (1-5),
       comment: String,
       createdAt: DateTime
     }

   Key Features Implementation

   1. AI Data Extraction

     - Upload PDF/DOCX files
     - Gemini AI extracts: title, author, department, level, year, abstract, chapter one, pages, chapter titles
     - Review and edit extracted data before saving
     - Batch processing for multiple files
     - Progress tracking with loading states

   2. Project Search & Filter

     - Real-time search by title, author, department
     - Department filter dropdown with search
     - Pagination with First, Previous, Next, Last buttons
     - Show 24 projects per page
     - Results counter

   3. Payment Processing

     - Paystack integration with multiple payment methods
     - Payment verification via webhooks
     - Order tracking and download access control
     - Demo mode for testing

   4. Authentication & Authorization

     - Protected routes for admin and user dashboards
     - Role-based access control (admin, user)
     - Session management with Appwrite
     - Password reset functionality

   5. File Management

     - Secure file upload to Appwrite Storage
     - Generate download URLs with expiration
     - Track download counts
     - Support PDF and DOCX formats

   Environment Variables

     # Gemini AI
     VITE_GEMINI_API_KEY=your_api_key

     # Appwrite
     VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
     VITE_APPWRITE_PROJECT_ID=your_project_id
     VITE_APPWRITE_DATABASE_ID=your_database_id

     # Paystack
     VITE_PAYSTACK_PUBLIC_KEY=pk_test_xxx
     VITE_PAYSTACK_DEMO_MODE=false


   UI/UX Requirements

   Mobile-First Design

     - Responsive grid layouts
     - Touch-friendly buttons and tap targets
     - Mobile dropdown filters with backdrop overlay
     - Hamburger menu navigation
     - Bottom-fixed filter modal on mobile

   Typography

     - Inter font family throughout
     - Clear hierarchy with size scale (xs to 7xl)
     - Proper line-height for readability

   Interactions

     - Hover effects on cards (border color change, shadow)
     - Smooth transitions (200-300ms)
     - Loading spinners for async operations
     - Toast notifications for success/error states

   Accessibility

     - Semantic HTML
     - ARIA labels where needed
     - Keyboard navigation support
     - Focus states on interactive elements

   Routing Structure

     / - HomePage
     /projects - ProjectsPage
     /projects/:id - ProjectDetailPage
     /departments - DepartmentsPage
     /department/:name - DepartmentPage
     /department/:name/topics - ProjectTopicsPage
     /login - LoginPage
     /signup - SignupPage
     /contact - ContactPage
     /about-us - AboutPage
     /hire-writer - HireWriterPage

     /dashboard - UserDashboardLayout
       /dashboard - UserDashboardHomePage
       /dashboard/my-library - MyLibraryPage
       /dashboard/my-projects - MyProjectsPage
       /dashboard/profile - ProfilePage

     /admin - AdminLayout (Protected: admin role)
       /admin - DashboardHomePage
       /admin/projects - ProjectsAdminPage
       /admin/projects/add - AddProjectPage
       /admin/projects/edit/:id - EditProjectPage
       /admin/projects/bulk-upload - BulkUploadPage
       /admin/projects/ai-upload - AIProjectUploadPage
       /admin/projects/ai-generate - AIDepartmentProjectGenerator
       /admin/users - UsersAdminPage
       /admin/orders - OrdersAdminPage
       /admin/reviews - ReviewsAdminPage

   Build & Deployment

     - Development: npm run dev
     - Production Build: npm run build
     - Preview: npm run preview
     - Lint: npm run lint

