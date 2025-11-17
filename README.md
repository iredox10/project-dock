# Project Dock

A comprehensive platform for managing and distributing academic research projects with AI-powered data extraction.

## Features

- 📚 **Project Management**: Full CRUD operations for academic projects
- 🤖 **AI-Powered Extraction**: Automatically extract project data from PDF and DOCX files using Google Gemini AI
- 📤 **Bulk Upload**: Support for CSV/Excel bulk imports
- 🔍 **Smart Search**: Filter and search projects by department, level, and keywords
- 👥 **User Management**: Admin dashboard for managing users and orders
- 💳 **Paystack Payment Integration**: Accept payments via Card, Bank Transfer, OPay, Kuda, Moniepoint, and other microfinance banks
- 📦 **Order Processing**: Track and manage project downloads
- ⭐ **Review System**: User reviews and ratings

## AI Project Extraction

The platform includes an AI-powered feature that can automatically extract structured data from project PDF and DOCX files using Google Gemini AI:

### Extracted Fields:
- Project Title
- Author Name(s)
- Department
- Academic Level (BSc, MSc, HND, ND, PhD)
- Year
- Abstract
- Chapter One Content
- Number of Pages
- Chapter Titles

### How to Use:
1. Navigate to Admin Panel → Projects → AI Extract
2. Select single or batch mode
3. Upload PDF/DOCX files
4. AI automatically extracts and structures the data
5. Review and edit extracted information
6. Save to database

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Configure your environment variables in `.env`:
   ```env
   # Gemini AI
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   
   # Appwrite
   VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   VITE_APPWRITE_PROJECT_ID=your_project_id
   VITE_APPWRITE_DATABASE_ID=your_database_id
   
      # Paystack Payment
      VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_paystack_key_here
   ```
   
   **Get your keys:**
   - Gemini: [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Appwrite: [Appwrite Console](https://console.appwrite.io)
   - Paystack: [Paystack Dashboard](https://dashboard.paystack.com/settings/developer)

5. Start the development server:
   ```bash
   bun run dev
   ```

## Tech Stack

- **Frontend**: React 19, Tailwind CSS
- **Backend**: Appwrite (Database, Authentication, Storage)
- **Payment**: Paystack (Card, Bank Transfer, OPay, Microfinance Banks)
- **AI**: Google Gemini API
- **AI**: Google Gemini API
- **Build Tool**: Vite
- **Package Manager**: Bun
- **Document Processing**: pdfjs-dist, mammoth

## Project Structure

```
src/
├── admin/           # Admin dashboard components
├── api/             # API services and utilities
├── components/      # Reusable components
├── dashboard/       # User dashboard
├── firebase/        # Firebase configuration
└── pages/           # Public pages
```

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
