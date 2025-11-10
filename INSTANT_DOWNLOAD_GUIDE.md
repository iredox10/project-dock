# Instant Download Setup Guide

## Overview
This guide explains how to set up instant downloads for purchased projects using Firebase Storage.

## Step 1: Enable Firebase Storage

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `project-dock-803ba`
3. Click on **Storage** in the left menu
4. Click **Get Started**
5. Choose **Start in production mode** (we'll set rules later)
6. Select your region and click **Done**

## Step 2: Configure Storage Security Rules

In Firebase Console > Storage > Rules, add these rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow anyone to read files
    match /{allPaths=**} {
      allow read: if true;
    }
    
    // Only authenticated admins can write/delete
    match /projects/{projectId}/{fileName} {
      allow write, delete: if request.auth != null && 
        request.auth.token.admin == true;
    }
  }
}
```

## Step 3: Upload Project Files

### Option A: Manual Upload via Firebase Console
1. Go to Firebase Console > Storage
2. Click "Upload file"
3. Navigate to `projects/{projectId}/` folder
4. Upload your PDF and DOCX files
5. Copy the file paths (e.g., `projects/proj123/proj123_pdf_123456.pdf`)

### Option B: Upload via Admin Panel (Recommended)

I've created a `FileUploader` component. To use it in your admin pages:

```jsx
import { FileUploader } from '../components/FileUploader';

// In your AddProjectPage or EditProjectPage:
<FileUploader 
  projectId={projectId}
  fileType="pdf"
  label="Upload PDF File"
  onUploadComplete={(result) => {
    // Save the file path to Firestore
    updateDoc(projectRef, {
      pdfFilePath: result.path,
      pdfFileUrl: result.url
    });
  }}
/>

<FileUploader 
  projectId={projectId}
  fileType="docx"
  label="Upload DOCX File"
  onUploadComplete={(result) => {
    updateDoc(projectRef, {
      docxFilePath: result.path,
      docxFileUrl: result.url
    });
  }}
/>
```

## Step 4: Update Project Schema

Add these fields to your projects in Firestore:

```javascript
{
  // ... existing fields
  pdfFilePath: "projects/proj123/proj123_pdf_123456.pdf",
  pdfFileUrl: "https://firebasestorage.googleapis.com/...",
  docxFilePath: "projects/proj123/proj123_docx_123456.docx",
  docxFileUrl: "https://firebasestorage.googleapis.com/..."
}
```

## Step 5: How It Works

### User Journey:
1. **User visits project page** → Clicks "Download Now"
2. **Redirected to payment page** → Completes OPay payment
3. **Payment verified** → Order created in Firestore
4. **User's purchasedProjects updated** → Project ID added to array
5. **Redirected to download page** → `/projects/:id/download-file`
6. **Access verified** → Checks if user purchased project
7. **Downloads enabled** → User clicks PDF or DOCX button
8. **Instant download** → File downloaded from Firebase Storage

### Security:
- ✅ Only authenticated users can access download page
- ✅ Only users who purchased can download
- ✅ Download URLs are signed and temporary
- ✅ Direct storage access is prevented

## Step 6: File Storage Structure

```
firebase-storage/
└── projects/
    ├── projectId1/
    │   ├── projectId1_pdf_1234567.pdf
    │   └── projectId1_docx_1234567.docx
    ├── projectId2/
    │   ├── projectId2_pdf_7654321.pdf
    │   └── projectId2_docx_7654321.docx
    └── ...
```

## Step 7: Adding File Upload to Existing Pages

### For AddProjectPage.jsx:

Add after saving project to Firestore:

```jsx
const [projectId, setProjectId] = useState(null);

// After creating project
const docRef = await addDoc(collection(db, 'projects'), projectData);
setProjectId(docRef.id);

// Then show file uploaders
{projectId && (
  <div className="mt-8 space-y-6">
    <h3 className="text-xl font-bold">Upload Project Files</h3>
    <FileUploader projectId={projectId} fileType="pdf" />
    <FileUploader projectId={projectId} fileType="docx" />
  </div>
)}
```

### For EditProjectPage.jsx:

Add in the form:

```jsx
<div className="space-y-6">
  <h3 className="text-xl font-bold">Project Files</h3>
  <FileUploader 
    projectId={projectId} 
    fileType="pdf"
    onUploadComplete={(result) => {
      updateDoc(doc(db, 'projects', projectId), {
        pdfFilePath: result.path
      });
    }}
  />
  <FileUploader 
    projectId={projectId} 
    fileType="docx"
    onUploadComplete={(result) => {
      updateDoc(doc(db, 'projects', projectId), {
        docxFilePath: result.path
      });
    }}
  />
</div>
```

## Step 8: Testing

1. **Upload a test file** using Firebase Console or FileUploader
2. **Add file paths** to a project document in Firestore
3. **Make a test purchase** (using sandbox OPay)
4. **Go to download page**: `/projects/{projectId}/download-file`
5. **Click download button** → File should download instantly

## Troubleshooting

### Files not downloading:
- Check Firebase Storage rules
- Verify file paths are correct in Firestore
- Check browser console for errors
- Ensure user has purchased the project

### Upload failing:
- Check Firebase Storage is enabled
- Verify user is authenticated
- Check file size (Firebase has limits)
- Check internet connection

### Permission denied:
- Update Storage security rules
- Ensure user is authenticated
- Check Firestore security rules for users collection

## Storage Pricing

Firebase Storage costs:
- **Free tier**: 5GB storage, 1GB/day downloads
- **Paid**: $0.026/GB storage, $0.12/GB downloads

**Tip**: Compress PDF/DOCX files to save storage and bandwidth.

## Alternative: External Storage

If you prefer, you can use:
- **Google Drive**: Store files and share links
- **Dropbox**: Similar to Google Drive
- **AWS S3**: More control but more complex
- **Your own server**: Full control but requires maintenance

With external storage, just save the shareable link in Firestore instead of uploading to Firebase Storage.

## Files Created

1. `src/firebase/config.js` - Added Storage export
2. `src/api/fileStorageService.js` - File upload/download service
3. `src/components/FileUploader.jsx` - File upload component
4. `src/pages/DownloadFilePage.jsx` - Download page with access control
5. `INSTANT_DOWNLOAD_GUIDE.md` - This guide

## Next Steps

1. Enable Firebase Storage in console
2. Set up security rules
3. Upload test files
4. Test complete purchase → download flow
5. Add FileUploader to admin pages
6. Go live!

---

Your users can now purchase and download projects instantly! 🎉
