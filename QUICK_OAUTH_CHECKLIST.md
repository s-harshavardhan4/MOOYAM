# ⚡ Quick OAuth Setup Checklist

Follow these steps to get OAuth 2.0 working in 5 minutes!

---

## ✅ Pre-Setup Checklist

- [ ] MongoDB is running
- [ ] Node.js and npm installed
- [ ] Project dependencies installed (`npm install`)

---

## 🚀 Step-by-Step Setup (5 Minutes)

### **Step 1: Create .env File** (30 seconds)

```bash
cp .env.example .env
```

---

### **Step 2: Generate Secrets** (30 seconds)

Run this command:

```bash
node generate_secrets.js
```

Copy the output values to your `.env` file:
- [ ] `NEXTAUTH_SECRET` = (paste generated value)
- [ ] `ADMIN_PASSWORD_HASH` = (paste generated hash)

---

### **Step 3: Set Up Google OAuth** (2 minutes)

1. Go to: https://console.cloud.google.com/apis/credentials

2. Create new project → Name it "MOOYAM"

3. Click "OAuth consent screen":
   - [ ] App name: MOOYAM
   - [ ] User type: External
   - [ ] Email: your-email@gmail.com
   - [ ] Save and Continue (skip scopes)
   - [ ] Save and Continue (skip test users)

4. Click "Create Credentials" → "OAuth client ID":
   - [ ] Application type: Web application
   - [ ] Name: MOOYAM
   - [ ] Authorized JavaScript origins: `http://localhost:3000`
   - [ ] Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
   - [ ] Click "Create"

5. Copy credentials to `.env`:
   - [ ] `GOOGLE_CLIENT_ID` = (paste from Google)
   - [ ] `GOOGLE_CLIENT_SECRET` = (paste from Google)

---

### **Step 4: Set Up GitHub OAuth** (1 minute)

1. Go to: https://github.com/settings/developers

2. Click "New OAuth App":
   - [ ] Application name: MOOYAM
   - [ ] Homepage URL: `http://localhost:3000`
   - [ ] Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
   - [ ] Click "Register application"

3. Copy credentials to `.env`:
   - [ ] `GITHUB_CLIENT_ID` = (paste from GitHub)
   - [ ] Click "Generate a new client secret"
   - [ ] `GITHUB_CLIENT_SECRET` = (paste immediately!)

⚠️ **Save GitHub secret immediately - you can't see it again!**

---

### **Step 5: Update Database** (30 seconds)

Run these commands:

```bash
npx prisma generate
npx prisma db push
```

---

### **Step 6: Test It!** (30 seconds)

1. Start the server:
   ```bash
   npm run dev
   ```

2. Go to: http://localhost:3000/login

3. You should see:
   - ✅ Login form
   - ✅ "Continue with Google" button
   - ✅ "Continue with GitHub" button

4. Click "Continue with Google" or "Continue with GitHub"

5. Complete authentication

6. ✅ You should be redirected to your account page!

---

## 🎉 Success Indicators

You know OAuth is working when:

- ✅ Login page shows OAuth buttons
- ✅ Clicking Google button redirects to Google login
- ✅ Clicking GitHub button redirects to GitHub login
- ✅ After authentication, you're redirected back to the site
- ✅ User appears in database with OAuth provider info
- ✅ Session is created successfully

---

## ❌ Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| "Invalid callback URL" | Check redirect URI matches exactly in provider settings |
| "Missing NEXTAUTH_SECRET" | Run `node generate_secrets.js` and copy to `.env` |
| "User not found" | OAuth creates new users automatically - this is normal for first login |
| Google error about "unverified app" | Normal for development - click "Continue" anyway |
| GitHub 404 error | Check callback URL is exact: `/api/auth/callback/github` |

---

## 🔧 Environment Variables Checklist

Make sure ALL of these are in your `.env` file:

```env
DATABASE_URL="mongodb://localhost:27017/ecommerce"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD_HASH="$2b$10$your-hash-here"
GOOGLE_CLIENT_ID="your-google-id"
GOOGLE_CLIENT_SECRET="your-google-secret"
GITHUB_CLIENT_ID="your-github-id"
GITHUB_CLIENT_SECRET="your-github-secret"
NEXT_PUBLIC_CURRENCY_SYMBOL='$'
```

---

## 📞 Need Help?

1. Check `OAUTH_SETUP.md` for detailed instructions
2. Review Next.js console for errors
3. Verify all environment variables are set
4. Check OAuth provider settings match exactly

---

**That's it! Your OAuth 2.0 setup is complete! 🎊**
