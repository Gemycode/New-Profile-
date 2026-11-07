# Firebase Setup Guide

This portfolio website uses Firebase as a Content Management System (CMS) to enable dynamic content management through the admin dashboard.

## Prerequisites

- A Google account
- Node.js installed on your computer

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "my-portfolio")
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Set Up Authentication

1. In your Firebase project console, click "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication
5. Click "Save"

### Create an Admin User
1. Go to the "Users" tab in Authentication
2. Click "Add user"
3. Enter your email and a secure password
4. Click "Add user"

## Step 3: Set Up Firestore Database

1. Click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (you can secure it later)
4. Select a location for your database
5. Click "Done"

## Step 4: Get Firebase Configuration

1. Click the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>) to add a web app
5. Enter an app nickname (e.g., "Portfolio Website")
6. Click "Register app"
7. Copy the configuration object

## Step 5: Configure Environment Variables

1. In your project root, copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open the `.env` file and replace the placeholder values with your Firebase config:
   ```env
   VITE_FIREBASE_API_KEY=your-actual-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

3. Save the file and restart your development server:
   ```bash
   npm run dev
   ```

## Step 6: Access the Admin Dashboard

1. Open your website in the browser
2. Add `#admin` to the URL (e.g., `http://localhost:3002/#admin`)
3. Log in with the email and password you created in Step 2

## Security Setup (Production)

### Firestore Security Rules
1. Go to Firestore Database → Rules
2. Replace the default rules with:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Allow read access to all documents
       match /{document=**} {
         allow read: if true;
       }
       
       // Allow write access only to authenticated users
       match /{document=**} {
         allow write: if request.auth != null;
       }
     }
   }
   ```

### Firebase Storage Rules (if using file uploads)
1. Go to Storage → Rules
2. Update rules to require authentication for uploads:
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```

## Collections Structure

The application expects these Firestore collections:

- `projects` - Portfolio projects
- `testimonials` - Client testimonials
- `education` - Education background
- `services` - Services offered
- `about` - About section content
- `contactMessages` - Contact form submissions
- `settings` - Site-wide settings

These collections will be created automatically when you add content through the admin dashboard.

## Troubleshooting

### "Firebase not configured" Error
- Make sure your `.env` file exists and has the correct variable names
- Verify all environment variables start with `VITE_`
- Restart your development server after adding environment variables

### Authentication Errors
- Verify Email/Password authentication is enabled in Firebase Console
- Check that you've created a user in the Authentication section
- Ensure your email and password are correct

### Permission Errors
- Check your Firestore security rules
- Make sure you're authenticated before trying to write data

## Need Help?

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Authentication](https://firebase.google.com/docs/auth)