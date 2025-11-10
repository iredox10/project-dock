# AI Project Extraction Feature - Implementation Guide

## Overview
This feature allows administrators to automatically extract structured project data from PDF and DOCX files using Google's Gemini AI.

## Setup Instructions

### 1. Get Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Configure Environment Variable
Create a `.env` file in the project root (if it doesn't exist):
```bash
VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
```

⚠️ **Important**: Restart your development server after adding the API key!

## Features

### Single File Mode
- Upload one PDF or DOCX file at a time
- AI extracts project information
- Review and edit extracted data before saving
- Perfect for careful data verification

### Batch Mode
- Upload multiple files at once
- Processes each file automatically
- Shows progress and results for each file
- Save all successful extractions at once
- Great for bulk data import

## Extracted Data Fields

The AI automatically extracts:
- **Title**: Project title
- **Author**: Author name(s)
- **Department**: Academic department
- **Level**: Academic level (BSc, MSc, HND, ND, PhD)
- **Year**: Publication year
- **Abstract**: Full project abstract
- **Chapter One**: Introduction/first chapter content
- **Pages**: Estimated page count
- **Chapters**: List of chapter titles

## How to Use

### Accessing the Feature
1. Log in to admin panel
2. Navigate to **Projects** section
3. Click **"AI Extract from PDF/DOCX"** button

Or directly: `/admin/projects/ai-upload`

### Single File Workflow
1. Select "Single File Mode"
2. Click to upload a PDF or `DOCX` file
3. Click "Extract with AI"
4. Wait for processing (usually 5-15 seconds)
5. Review the extracted data
6. Edit any fields if needed
7. Add a price (required)
8. Click "Save Project to Database"

### Batch Processing Workflow
1. Select "Batch Mode"
2. Upload multiple PDF/DOCX files
3. Click "Process Batch"
4. Monitor progress as files are processed
5. Review results (success/failure for each file)
6. Click "Save All Successful" to save all extracted projects

## File Requirements

### Supported Formats
- ✅ PDF (.pdf)
- ✅ DOCX (.docx)
- ❌ DOC (old Word format - not supported)
- ❌ Images, scanned PDFs (needs OCR first)

### Best Results
- Text-based documents (not scanned images)
- Well-structured academic projects
- Clear section headings (Title, Abstract, Chapter One, etc.)
- English or well-formatted text

## Pricing

**Gemini API Costs** (as of 2024):
- Free tier: 15 requests per minute
- Very affordable: ~$0.00025 per request
- Typically free for most small to medium projects

## Technical Details

### Dependencies Installed
```json
{
  "@google/generative-ai": "^0.24.1",
  "pdf-parse": "^2.4.5",
  "mammoth": "^1.11.0"
}
```

### Files Created
1. **`src/api/aiExtractionService.js`** - AI extraction service with all logic
2. **`src/admin/pages/AIProjectUploadPage.jsx`** - UI component for the feature
3. **`.env.example`** - Environment variable template

### Files Modified
1. **`src/App.jsx`** - Added route for AI upload page
2. **`src/admin/pages/AddProjectPage.jsx`** - Added link to AI extraction
3. **`src/admin/pages/ProjectsAdminPage.jsx`** - Added AI Extract button
4. **`README.md`** - Updated with feature documentation

## Workflow Diagram

```
User uploads PDF/DOCX
        ↓
Extract text from file (pdf-parse/mammoth)
        ↓
Send to Gemini AI with structured prompt
        ↓
AI returns JSON with project data
        ↓
Parse and validate response
        ↓
Display in editable form
        ↓
User reviews/edits data
        ↓
Save to Firebase Firestore
```

## Troubleshooting

### "API key not set" error
- Make sure `.env` file exists in project root
- Verify `VITE_GEMINI_API_KEY` is set correctly
- Restart the dev server (`bun run dev`)

### "Failed to extract text" error
- Check if file is a valid PDF/DOCX (not scanned image)
- Try with a different file
- Ensure file is not corrupted

### "AI did not return valid JSON" error
- The document might be poorly formatted
- Try extracting manually or editing the document
- Very long documents might need summarization first

### Extraction seems inaccurate
- Review and manually correct the extracted data
- The AI does its best but may need human verification
- Complex or non-standard document formats may confuse the AI

## Best Practices

1. **Always Review**: AI extraction is good but not perfect - always review extracted data
2. **Add Pricing**: The AI doesn't extract pricing - add this manually
3. **Batch Small Groups**: Process 5-10 files at a time for easier management
4. **Check Formatting**: Ensure abstracts and chapter text are properly formatted
5. **Backup**: Keep original files as backup

## Future Enhancements

Possible improvements:
- Support for more file formats (DOC, RTF)
- OCR support for scanned PDFs
- Automatic price suggestion based on page count
- Support for extracting all chapters
- Language detection and translation
- Duplicate detection
- Auto-categorization by department

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your API key is valid
3. Try with a simpler/smaller document first
4. Check that the document is text-based (not scanned)

---

**Note**: This feature uses AI and may not be 100% accurate. Always verify extracted data before saving to the database.
