# 🔐 OAuth 2.0 Setup Guide for MOOYAM E-Commerce

This guide will walk you through setting up OAuth 2.0 authentication with Google and GitHub providers.

## 📋 Prerequisites

- Node.js installed
- MongoDB database running
- Next.js project set up

---

## 🚀 Step-by-Step Setup

### **Step 1: Generate NextAuth Secret**

You need a secure secret key for NextAuth. Run this command in your terminal:

```bash
# Windows PowerShell
openssl rand -base64 32

# Or use this online tool: https://generate-secret.vercel.app/32
```

Copy the generated string and save it in your `.env` file as `NEXTAUTH_SECRET`.

---

### **Step 2: Set Up Google OAuth Provider**

#### 2.1 Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/apis/credentials
2. Create a new project or select an existing one

#### 2.2 Configure OAuth Consent Screen
1. Click "OAuth consent screen" in the left sidebar
2. Select "External" user type (unless you have Google Workspace)
3. Fill in required fields:
   - **App name**: MOOYAM
   - **User support email**: your-email@example.com
   - **Developer contact email**: your-email@example.com
4. Click "Save and Continue"
5. Skip scopes section (click "Save and Continue")
6. Add test users if needed, then click "Save and Continue"

#### 2.3 Create OAuth Credentials
1. Click "+ CREATE CREDENTIALS" → "OAuth client ID"
2. Application type: **Web application**
3. Name: `MOOYAM Web Client`
4. **Authorized JavaScript origins**:
   ```
   http://localhost:3000
   http://localhost:3001
   ```
5. **Authorized redirect URIs**:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
6. Click "Create"

#### 2.4 Copy Your Credentials
Google will show you:
- **Client ID**: Copy this to `GOOGLE_CLIENT_ID` in `.env`
- **Client Secret**: Copy this to `GOOGLE_CLIENT_SECRET` in `.env`

---

### **Step 3: Set Up GitHub OAuth Provider**

#### 3.1 Go to GitHub Developer Settings
1. Visit: https://github.com/settings/developers
2. Click "New OAuth App" or "Register a new application"

#### 3.2 Fill Application Details
- **Application name**: MOOYAM
- **Homepage URL**: `http://localhost:3000`
- **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
- Check "Enable Device Flow" (optional)

#### 3.3 Register and Get Credentials
1. Click "Register application"
2. You'll see:
   - **Client ID**: Copy this to `GITHUB_CLIENT_ID` in `.env`
3. Click "Generate a new client secret"
4. Copy the **Client Secret** to `GITHUB_CLIENT_SECRET` in `.env`

⚠️ **Important**: Save the GitHub client secret immediately! You can't view it again without regenerating.

---

### **Step 4: Configure Environment Variables**

Create a `.env` file in your project root (copy from `.env.example`):

```bash
cp .env.example .env
```

Fill in all the values:

```env
# Database
DATABASE_URL="mongodb://localhost:27017/ecommerce"

# NextAuth Configuration
NEXTAUTH_SECRET="your-generated-secret-from-step-1"
NEXTAUTH_URL="http://localhost:3000"

# Admin Credentials
ADMIN_EMAIL="admin@mooyam.com"
ADMIN_PASSWORD_HASH="$2b$10$your-hashed-password"

# OAuth 2.0 - Google
GOOGLE_CLIENT_ID="123456789-abcdefghijklmnop.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-your-secret-here"

# OAuth 2.0 - GitHub
GITHUB_CLIENT_ID="Iv1.abcdef1234567890"
GITHUB_CLIENT_SECRET="your-github-client-secret-here"

# Currency
NEXT_PUBLIC_CURRENCY_SYMBOL='$'
```

---

### **Step 5: Install Dependencies**

Make sure all required packages are installed:

```bash
npm install next-auth @auth/prisma-adapter bcryptjs
```

---

### **Step 6: Update Database Schema**

Run Prisma migrations to update your database:

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (for development)
npx prisma db push

# Or run migration (for production)
npx prisma migrate dev --name add_oauth_support
```

---

### **Step 7: Test OAuth Login**

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit: `http://localhost:3000/login`

3. You should see:
   - ✅ Traditional login form (email/password)
   - ✅ "Continue with Google" button
   - ✅ "Continue with GitHub" button

4. Click either OAuth provider button
5. Complete the authentication flow
6. You should be redirected to your account page

---

## 🔧 Troubleshooting

### ❌ Error: "Invalid callback URL"
**Solution**: Make sure the redirect URI in your OAuth provider settings exactly matches:
- Google: `http://localhost:3000/api/auth/callback/google`
- GitHub: `http://localhost:3000/api/auth/callback/github`

### ❌ Error: "Missing NEXTAUTH_SECRET"
**Solution**: Generate a new secret and add it to your `.env` file:
```bash
openssl rand -base64 32
```

### ❌ Error: "User not found" for existing users
**Solution**: The OAuth flow creates new users automatically. If you have existing users with credentials, they can still use email/password. OAuth will create separate accounts.

### ❌ Google OAuth not working
**Common issues**:
1. OAuth consent screen not configured
2. App not verified (use test mode for development)
3. Redirect URI doesn't match exactly
4. Domain not added to authorized origins

### ❌ GitHub OAuth not working
**Common issues**:
1. Callback URL mismatch
2. Expired client secret
3. App suspended/deleted

---

## 🎯 Features Implemented

✅ **Google OAuth 2.0** - Users can sign in with their Google account
✅ **GitHub OAuth 2.0** - Users can sign in with their GitHub account
✅ **Automatic User Creation** - New OAuth users are automatically created in the database
✅ **User Image Sync** - Profile pictures are synced from OAuth providers
✅ **Email Verification** - OAuth emails are considered verified
✅ **Session Management** - JWT-based sessions with proper token handling
✅ **Redirect Handling** - Proper callback URL redirection after login
✅ **Error Handling** - Graceful error messages for failed authentications

---

## 🔒 Security Best Practices

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Use HTTPS in production** - OAuth requires HTTPS
3. **Rotate secrets regularly** - Especially if compromised
4. **Enable rate limiting** - Already implemented in your code
5. **Monitor failed logins** - Check logs for suspicious activity

---

## 📱 Production Deployment

When deploying to production:

1. **Update NEXTAUTH_URL**:
   ```env
   NEXTAUTH_URL="https://yourdomain.com"
   ```

2. **Update OAuth Providers**:
   - Add production domain to Google's authorized origins
   - Add production domain to GitHub's allowed URLs
   - Add production callback URLs

3. **Use environment variables** from your hosting provider (Vercel, Railway, etc.)

---

## 📊 Testing OAuth Flow

### Test Scenarios:
1. ✅ New user signs up with Google → Account created → Redirected to account page
2. ✅ Existing Google user signs in → Session created → Redirected properly
3. ✅ User switches between OAuth and credentials → Both work independently
4. ✅ Admin user can still access admin panel via credentials
5. ✅ Protected routes redirect to login if not authenticated
6. ✅ After login, user is redirected back to intended page

---

## 🆘 Support

If you encounter issues:

1. Check Next.js console for errors
2. Review NextAuth logs in the terminal
3. Verify all environment variables are set correctly
4. Check database connection
5. Ensure OAuth provider settings are correct

---

## 📚 Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Prisma Documentation](https://www.prisma.io/docs/)

---

**Happy Coding! 🎉**
