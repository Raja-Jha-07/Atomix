# Google OAuth2 Setup Instructions

This guide will help you set up Google OAuth2 authentication for the Atomix Cafeteria application.

## Prerequisites

- Google Cloud Console account
- Atomix Cafeteria backend and frontend running locally

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on "Select a project" dropdown at the top
3. Click "New Project"
4. Enter project name: `atomix-cafeteria`  
5. Click "Create"

## Step 2: Enable Google+ API

1. In the Google Cloud Console, navigate to "APIs & Services" > "Library"
2. Search for "Google+ API" 
3. Click on it and press "Enable"

## Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type (unless you have a Google Workspace)
3. Fill in the required information:
   - **App name**: Atomix Cafeteria
   - **User support email**: Your email address
   - **Developer contact information**: Your email address
4. Click "Save and Continue"
5. On the "Scopes" page, click "Save and Continue" (default scopes are sufficient)
6. On the "Test users" page, add your email address if in testing mode
7. Click "Save and Continue"

## Step 4: Create OAuth2 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Choose "Web application" as the application type
4. Enter name: `Atomix Cafeteria Web Client`
5. Add Authorized JavaScript origins:
   - `http://localhost:3000`
   - `http://localhost:8080`
6. Add Authorized redirect URIs:
   - `http://localhost:8080/api/v1/login/oauth2/code/google`
   - `http://localhost:3000/auth/oauth2/redirect`
7. Click "Create"
8. Copy the **Client ID** and **Client Secret**

## Step 5: Configure Backend

1. Copy the `.env.example` file to `.env` in the backend directory:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your Google OAuth2 credentials:
   ```env
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   ```

## Step 6: Test the Integration

1. Start the backend server:
   ```bash
   ./mvnw spring-boot:run
   ```

2. Start the frontend server:
   ```bash
   npm start
   ```

3. Navigate to `http://localhost:3000/login`
4. Click the "Sign in with Google" button
5. You should be redirected to Google's OAuth consent screen
6. After authorization, you should be redirected back to the application dashboard

## Troubleshooting

### Common Issues

1. **"redirect_uri_mismatch" error**
   - Ensure the redirect URI in Google Console matches exactly: `http://localhost:8080/api/v1/login/oauth2/code/google`

2. **"OAuth2 authentication failed" error**  
   - Check that the Google Client ID and Client Secret are correctly set in the `.env` file
   - Verify that the Google+ API is enabled in your Google Cloud project

3. **User creation fails**
   - Ensure your database is running and properly configured
   - Check the backend logs for any database-related errors

4. **Token parsing errors**
   - Verify that the JWT secret is set in the `.env` file
   - Check that the token is being properly generated in the OAuth success handler

### Debug Steps

1. Check backend logs for any OAuth2-related errors
2. Use browser developer tools to inspect network requests
3. Verify that the OAuth2 redirect is reaching the correct endpoint
4. Test the `/api/v1/auth/me` endpoint to ensure user authentication is working

## Security Notes

- Never commit your `.env` file to version control
- Use strong, unique Client Secrets
- In production, update the authorized origins and redirect URIs to match your production URLs
- Consider implementing additional security measures like CSRF protection

## Production Deployment

When deploying to production:

1. Update the authorized origins in Google Console to your production domain
2. Update the redirect URIs to your production URLs
3. Use environment variables or secure secret management for credentials
4. Enable HTTPS for all OAuth2 redirects
