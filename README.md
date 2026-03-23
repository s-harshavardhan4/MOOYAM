<div align="center">
  <h1><img src="https://gocartshop.in/favicon.ico" width="20" height="20" alt="GoCart Favicon">
   MOOYAM - Premium E-Commerce Platform</h1>
  <p>
    A modern multi-vendor e-commerce platform with OAuth 2.0 authentication, built with Next.js 15 and Tailwind CSS.
  </p>
  <p>
    <a href="https://github.com/GreatStackDev/goCart/blob/main/LICENSE.md"><img src="https://img.shields.io/github/license/GreatStackDev/goCart?style=for-the-badge" alt="License"></a>
    <a href="https://github.com/GreatStackDev/goCart/pulls"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge" alt="PRs Welcome"></a>
    <a href="https://github.com/GreatStackDev/goCart/issues"><img src="https://img.shields.io/github/issues/GreatStackDev/goCart?style=for-the-badge" alt="GitHub issues"></a>
  </p>
</div>

---

## 📖 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#-tech-stack)
- [🚀 Getting Started](#-getting-started)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)

---

## ✨ Features

### 🔐 Authentication & Security
- **OAuth 2.0 Support**: Sign in with Google or GitHub
- **Traditional Login**: Email/password authentication with bcrypt hashing
- **Admin Panel**: Secure admin dashboard with role-based access
- **Rate Limiting**: Protection against brute force attacks
- **JWT Sessions**: Secure, scalable session management

### 🛍️ E-Commerce Features
- **Multi-Vendor Architecture**: Multiple vendors can sell on one platform
- **Product Management**: Add, edit, and manage products with categories
- **Shopping Cart**: Redux-powered cart with persistent storage
- **Wishlist**: Save favorite products for later
- **Order Tracking**: Real-time order status updates
- **Coupon System**: Discount codes and promotional offers
- **Product Reviews**: Rating and review system
- **Address Management**: Multiple shipping addresses per user

### 🎨 User Experience
- **Responsive Design**: Mobile-first, works on all devices
- **Modern UI**: Built with Tailwind CSS and Framer Motion
- **Smooth Animations**: Delightful micro-interactions
- **Search & Filters**: Advanced product filtering options

## 🛠️ Tech Stack <a name="-tech-stack"></a>

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4
- **UI Components:** Lucide React icons, Framer Motion
- **State Management:** Redux Toolkit
- **Charts:** Recharts

### Backend
- **Database:** MongoDB
- **ORM:** Prisma
- **Authentication:** NextAuth.js with OAuth 2.0
- **Password Hashing:** bcryptjs

### Development
- **Testing:** Jest, React Testing Library
- **Build Tool:** Turbopack
- **Package Manager:** npm

## 🚀 Getting Started <a name="-getting-started"></a>

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ECOMMERWEBSITE_Cream
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in the required values in `.env` (see Configuration below)

4. **Generate secrets**
   ```bash
   npm run generate-secrets
   ```

5. **Set up the database**
   ```bash
   npm run prisma:generate
   npm run prisma:push
   ```

6. **Test your configuration** (Optional)
   ```bash
   npm run test-oauth-config
   ```

7. **Run the development server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to see your application.

---

## ⚙️ Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# Database
DATABASE_URL="mongodb://localhost:27017/ecommerce"

# NextAuth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Admin
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD_HASH="$2b$10$your-hash"

# OAuth Providers (Optional but recommended)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-secret"
```

### Setting Up OAuth 2.0

For detailed OAuth setup instructions, see:
- 📄 [Complete OAuth Setup Guide](./OAUTH_SETUP.md)
- ✅ [Quick Setup Checklist](./QUICK_OAUTH_CHECKLIST.md)

**Quick Start:**
1. Run `npm run generate-secrets` to create secure keys
2. Configure Google OAuth at https://console.cloud.google.com/apis/credentials
3. Configure GitHub OAuth at https://github.com/settings/developers
4. Add your credentials to `.env`
5. Run `npm run test-oauth-config` to verify

---

## 🤝 Contributing <a name="-contributing"></a>

We welcome contributions! Please see our [CONTRIBUTING.md](./CONTRIBUTING.md) for more details on how to get started.

---

## 📜 License <a name="-license"></a>

This project is licensed under the MIT License. See the [LICENSE.md](./LICENSE.md) file for details.

---

## 📚 Additional Resources

- [OAuth 2.0 Setup Guide](./OAUTH_SETUP.md) - Complete OAuth configuration tutorial
- [Quick Setup Checklist](./QUICK_OAUTH_CHECKLIST.md) - 5-minute OAuth setup guide
- [Next.js Documentation](https://nextjs.org/docs) - Next.js features and API
- [Learn Next.js](https://nextjs.org/learn) - Interactive Next.js tutorial
- [Prisma Docs](https://www.prisma.io/docs/) - Database ORM reference
- [Tailwind CSS](https://tailwindcss.com/docs) - Utility-first CSS framework

---

## 👥 Support

For questions, issues, or feature requests, please:
- Open an issue on GitHub
- Check existing documentation
- Review the FAQ section

---

**Built with ❤️ using Next.js and Tailwind CSS**