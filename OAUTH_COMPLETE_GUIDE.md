# 🎯 OAuth 2.0 Complete Setup - FINAL GUIDE

This is your **one-stop shop** for getting OAuth 2.0 working perfectly in MOOYAM e-commerce website.

---

## ⚡ SUPER QUICK START (3 Minutes)

If you want OAuth working **NOW**, follow these exact steps:

### Step 1: Generate Secrets (30 seconds)
```bash
npm run generate-secrets
```
Copy the output values!

### Step 2: Create .env File (30 seconds)
```bash
notepad .env
```

Paste this and fill in the blanks:
```env
DATABASE_URL="mongodb://localhost:27017/ecommerce"
NEXTAUTH_SECRET="PASTE_GENERATED_SECRET_HERE"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@mooyam.com"
ADMIN_PASSWORD_HASH="PASTE_GENERATED_HASH_HERE"

# Google OAuth (Get from https://console.cloud.google.com/apis/credentials)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# GitHub OAuth (Get from https://github.com/settings/developers)
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

NEXT_PUBLIC_CURRENCY_SYMBOL='$'
```

### Step 3: Quick OAuth Setup (2 minutes)

#### For Google:
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click "Create Credentials" → "OAuth client ID"
3. Application type: **Web application**
4. Name: `MOOYAM`
5. Authorized JavaScript origins: `http://localhost:3000`
6. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
7. Click "Create"
8. Copy Client ID and Client Secret to `.env`

#### For GitHub:
1. Go to: https://github.com/settings/developers
2. Click "New OAuth App"
3. Application name: `MOOYAM`
4. Homepage URL: `http://localhost:3000`
5. Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
6. Click "Register application"
7. Copy Client ID to `.env`
8. Click "Generate a new client secret"
9. Copy Client Secret to `.env` **IMMEDIATELY!**

### Step 4: Update Database (30 seconds)
```bash
npm run prisma:generate
npm run prisma:push
```

### Step 5: Test Configuration (Optional)
```bash
npm run test-oauth-config
```

Should show: ✅ All checks passed!

### Step 6: Start Server
```bash
npm run dev
```

Visit: http://localhost:3000/login

**You should see OAuth buttons! 🎉**

---

## 📋 DETAILED SETUP

If you prefer step-by-step with explanations, use these files instead:

1. **[QUICK_OAUTH_CHECKLIST.md](./QUICK_OAUTH_CHECKLIST.md)** - Checklist format with time estimates
2. **[OAUTH_SETUP.md](./OAUTH_SETUP.md)** - Comprehensive tutorial with screenshots description
3. **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Technical details of what was implemented

---

## 🔍 What Was Implemented?

### ✅ Core Features:
- **Google OAuth 2.0** - Users sign in with Google account
- **GitHub OAuth 2.0** - Users sign in with GitHub account  
- **Automatic User Creation** - New users auto-created in database
- **Profile Picture Sync** - Avatars from Google/GitHub
- **Email Verification** - OAuth emails marked as verified
- **JWT Sessions** - Secure, scalable authentication
- **Proper Redirects** - Callback URLs work correctly
- **Error Handling** - Graceful error messages
- **Loading States** - UX-friendly loading indicators

### ✅ Security Features:
- **Rate Limiting** - Prevents brute force attacks
- **Password Hashing** - bcrypt for credentials login
- **Secure Secrets** - Cryptographically secure NEXTAUTH_SECRET
- **JWT Strategy** - Stateless authentication tokens
- **Environment Protection** - Secrets never committed to git

### ✅ User Experience:
- **Beautiful OAuth Buttons** - Official brand colors and icons
- **Responsive Design** - Works on mobile and desktop
- **Toast Notifications** - Success/error feedback
- **Loading Spinners** - Visual feedback during auth
- **Consistent Styling** - Matches MOOYAM branding

---

## 🎯 Testing Your OAuth Setup

### Test Scenarios:

#### 1. Google OAuth Test
```
1. Visit: http://localhost:3000/login
2. Click "Continue with Google"
3. Should redirect to Google login
4. Select your Google account
5. Should redirect back to site
6. Check if logged in
7. Verify user in database
```

#### 2. GitHub OAuth Test
```
1. Visit: http://localhost:3000/login
2. Click "Continue with GitHub"
3. Should redirect to GitHub login
4. Authorize the application
5. Should redirect back to site
6. Check if logged in
7. Verify user in database
```

#### 3. Credentials Login Test
```
1. Visit: http://localhost:3000/login
2. Enter email/password
3. Click "Sign In"
4. Should log in successfully
5. Admin can access /admin panel
```

#### 4. Protected Routes Test
```
1. Logout (if logged in)
2. Visit: http://localhost:3000/cart
3. Should redirect to login page
4. Log in with any method
5. Should redirect back to /cart
```

---

## ❌ Common Issues & Solutions

### Issue: "Missing NEXTAUTH_SECRET"
**Solution:**
```bash
npm run generate-secrets
# Copy the secret to .env file
```

### Issue: OAuth buttons not showing
**Diagnosis:**
```bash
npm run test-oauth-config
```
**Solution:** Check browser console for errors, verify .env variables are set

### Issue: "Invalid callback URL"
**Solution:** Verify redirect URIs match EXACTLY:
- Google: `http://localhost:3000/api/auth/callback/google`
- GitHub: `http://localhost:3000/api/auth/callback/github`

### Issue: "User not found" error
**This is normal for first-time OAuth users!** OAuth automatically creates users in the database. Just try again - the user will be created.

### Issue: Google says "App not verified"
**This is normal for development!** Click "Continue" or "Go to MOOYAM (unsafe)" - it's safe because it's your own app.

### Issue: GitHub secret disappeared
**Solution:** You need to regenerate it:
1. Go to GitHub OAuth app settings
2. Click "Generate a new client secret"
3. Copy IMMEDIATELY - can't view again!

### Issue: MongoDB connection error
**Solution:**
1. Make sure MongoDB is running
2. Check DATABASE_URL in .env
3. For local: `mongodb://localhost:27017/ecommerce`

---

## 🔧 Environment Variables Reference

Here's EVERY variable you might need:

```env
# ==================== REQUIRED ====================

# Database Connection
DATABASE_URL="mongodb://localhost:27017/ecommerce"

# NextAuth Secret (use npm run generate-secrets)
NEXTAUTH_SECRET="your-32-byte-base64-secret-here"

# NextAuth URL (change domain in production)
NEXTAUTH_URL="http://localhost:3000"

# ==================== RECOMMENDED ====================

# Admin Credentials (for admin panel access)
ADMIN_EMAIL="admin@mooyam.com"
ADMIN_PASSWORD_HASH="$2b$10$hashed-password-here"

# Google OAuth (get from Google Cloud Console)
GOOGLE_CLIENT_ID="123456789-abc.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-your-secret"

# GitHub OAuth (get from GitHub Settings)
GITHUB_CLIENT_ID="Iv1.abcdef123456"
GITHUB_CLIENT_SECRET="your-github-secret"

# ==================== OPTIONAL ====================

# Currency Symbol (displayed throughout site)
NEXT_PUBLIC_CURRENCY_SYMBOL='$'
```

---

## 📊 Database Schema Changes

The OAuth implementation added one field to the User model:

```prisma
model User {
    id            String    @id @default(auto()) @map("_id") @db.ObjectId
    name          String
    email         String    @unique
    password      String?   // Null for OAuth users
    image         String?   // Profile picture from OAuth provider
    emailVerified DateTime? // Auto-set for OAuth users
    cart          Json      @default("{}")
    savedItems    String[]  @default([])
    // ... other fields
}
```

---

## 🎨 UI Components Added

### Login Page (`/login`)
- Traditional login form (unchanged)
- **NEW:** "Or continue with" divider
- **NEW:** Google OAuth button with icon
- **NEW:** GitHub OAuth button with icon
- Toast notifications for errors/success

### Signup Page (`/signup`)
- Traditional signup form (unchanged)
- **NEW:** OAuth buttons (same as login)
- Redirects to `/account` after OAuth signup

---

## 🔄 Authentication Flow

### OAuth 2.0 Flow:

```
┌─────────────┐
│   User      │
│  clicks     │
│  OAuth btn  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────┐
│  Redirect to Provider   │
│  (Google/GitHub)        │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│  User authorizes app    │
│  at provider site       │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│  Provider redirects to  │
│  /api/auth/callback     │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│  NextAuth processes     │
│  the response           │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│  signIn() callback:     │
│  - Check if user exists │
│  - Create if new        │
│  - Update if existing   │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│  Generate JWT token     │
│  with user data         │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│  Create session         │
│  Set cookies            │
└──────┬──────────────────┘
       │
       ▼
┌─────────────────────────┐
│  Redirect to            │
│  callbackUrl or         │
│  /account               │
└──────┬──────────────────┘
       │
       ▼
┌─────────────┐
│   User      │
│  logged in! │
└─────────────┘
```

---

## 🚀 Production Deployment

When you're ready to go live:

### 1. Update NEXTAUTH_URL
```env
NEXTAUTH_URL="https://yourdomain.com"
```

### 2. Update OAuth Providers
Add production URLs to your OAuth apps:
- Google: Add `https://yourdomain.com` to authorized origins
- GitHub: Update homepage and callback URLs

### 3. Use Production Database
Update `DATABASE_URL` to your production MongoDB

### 4. Set Environment Variables
Use your hosting provider's env var system (Vercel, Railway, etc.)

### 5. Enable HTTPS
OAuth 2.0 requires HTTPS in production

---

## 📞 Getting Help

### Documentation Files:
- **This file** - Quick reference
- `QUICK_OAUTH_CHECKLIST.md` - Step-by-step checklist
- `OAUTH_SETUP.md` - Detailed tutorial
- `IMPLEMENTATION_SUMMARY.md` - Technical details

### External Resources:
- [NextAuth.js Docs](https://next-auth.js.org/)
- [Google OAuth Guide](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth Guide](https://docs.github.com/en/developers/apps/building-oauth-apps)

### Commands:
```bash
npm run generate-secrets      # Generate secrets
npm run test-oauth-config     # Test configuration
npm run prisma:generate       # Generate Prisma client
npm run prisma:push           # Update database schema
npm run dev                   # Start development server
```

---

## ✅ Final Checklist

Before considering OAuth "done", verify:

- [ ] Generated NEXTAUTH_SECRET and ADMIN_PASSWORD_HASH
- [ ] Created .env file with all variables
- [ ] Set up Google OAuth app and copied credentials
- [ ] Set up GitHub OAuth app and copied credentials
- [ ] Ran `npm run prisma:generate`
- [ ] Ran `npm run prisma:push`
- [ ] Tested `npm run test-oauth-config` (all green)
- [ ] Started server with `npm run dev`
- [ ] Tested Google OAuth login
- [ ] Tested GitHub OAuth login
- [ ] Tested credentials login
- [ ] Verified users appear in database
- [ ] Checked profile pictures sync
- [ ] Tested protected routes
- [ ] Tested redirect after login
- [ ] Mobile responsive works

**All checked? You're DONE! 🎉**

---

## 🌟 What You've Achieved

✅ Professional-grade OAuth 2.0 implementation
✅ Multiple authentication providers
✅ Secure session management
✅ Automatic user creation
✅ Profile picture synchronization
✅ Email verification
✅ Rate limiting protection
✅ Beautiful UI components
✅ Comprehensive documentation
✅ Production-ready code

**Congratulations! Your MOOYAM e-commerce platform now has enterprise-level authentication! 🚀**

---

*Need more help? Check the detailed guides or open an issue on GitHub.*

*Last Updated: March 22, 2026*
