# Appwrite Setup Instructions

## Option 1: Appwrite Cloud (Recommended)
1. Go to https://console.appwrite.io
2. Create an account
3. Create a new project
4. Get your Project ID from the project settings
5. Update your `.env` file:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your-actual-project-id
VITE_APPWRITE_DATABASE_ID=projectdock_db
```

## Option 2: Local Appwrite (Using Docker)
1. Make sure Docker is installed
2. Run:
```bash
docker run -it --rm \
  --name appwrite \
  -p 3000:3000 \
  -p 9615:80 \
  -v /path/to/your/local/folder:/storage \
  -v /path/to/your/local/folder:/dumps \
  -e APPWRITE_RESPONSE_LIMIT=10000000 \
  appwrite/appwrite:1.6.2
```
3. Access the console at `http://localhost:3000`
4. Create a project and update your `.env` with the local endpoint and project ID

## Once Appwrite is Set Up:
Run the initialization script to create collections:
```bash
node init-appwrite.js
```

## Run the Application:
```bash
bun dev
```

## Environment Variables Template:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Appwrite Configuration
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id_here
VITE_APPWRITE_DATABASE_ID=projectdock_db

# OPay Payment Configuration
VITE_OPAY_MERCHANT_ID=your_opay_merchant_id
VITE_OPAY_PUBLIC_KEY=your_opay_public_key
VITE_OPAY_PRIVATE_KEY=your_opay_private_key
VITE_OPAY_ENV=sandbox

# Demo Mode for testing payment without OPay credentials
VITE_OPAY_DEMO_MODE=true
```