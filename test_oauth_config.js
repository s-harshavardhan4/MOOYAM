/**
 * OAuth Configuration Test Script
 * Run this to verify your OAuth setup before starting the dev server
 */

import dotenv from 'dotenv';
dotenv.config();

console.log('\n🔍 Testing OAuth Configuration...\n');

const checks = {
    passed: 0,
    failed: 0,
    warnings: 0
};

function checkEnv(name, value, isCritical = true) {
    if (value && value.length > 0 && !value.includes('your-')) {
        console.log(`✅ ${name}: Configured`);
        checks.passed++;
        return true;
    } else {
        console.log(`${isCritical ? '❌' : '⚠️'}  ${name}: ${!value ? 'Missing' : 'Not configured properly'}`);
        if (isCritical) {
            checks.failed++;
        } else {
            checks.warnings++;
        }
        return false;
    }
}

console.log('📋 Environment Variables Check:\n');

// Critical variables
checkEnv('DATABASE_URL', process.env.DATABASE_URL);
checkEnv('NEXTAUTH_SECRET', process.env.NEXTAUTH_SECRET);
checkEnv('NEXTAUTH_URL', process.env.NEXTAUTH_URL);
checkEnv('ADMIN_EMAIL', process.env.ADMIN_EMAIL);
checkEnv('ADMIN_PASSWORD', process.env.ADMIN_PASSWORD);

console.log('\n🔐 OAuth Providers:\n');

// Google OAuth
const googleIdOk = checkEnv('GOOGLE_CLIENT_ID', process.env.GOOGLE_CLIENT_ID, false);
const googleSecretOk = checkEnv('GOOGLE_CLIENT_SECRET', process.env.GOOGLE_CLIENT_SECRET, false);

if (googleIdOk && googleSecretOk) {
    console.log('   ✅ Google OAuth: Ready to use\n');
} else if (!googleIdOk || !googleSecretOk) {
    console.log('   ⚠️  Google OAuth: Not fully configured (optional)\n');
}

// GitHub OAuth
const githubIdOk = checkEnv('GITHUB_CLIENT_ID', process.env.GITHUB_CLIENT_ID, false);
const githubSecretOk = checkEnv('GITHUB_CLIENT_SECRET', process.env.GITHUB_CLIENT_SECRET, false);

if (githubIdOk && githubSecretOk) {
    console.log('   ✅ GitHub OAuth: Ready to use\n');
} else if (!githubIdOk || !githubSecretOk) {
    console.log('   ⚠️  GitHub OAuth: Not fully configured (optional)\n');
}

console.log('💰 Other Config:\n');
checkEnv('NEXT_PUBLIC_CURRENCY_SYMBOL', process.env.NEXT_PUBLIC_CURRENCY_SYMBOL, false);

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 Summary:');
console.log(`   ✅ Passed: ${checks.passed}`);
console.log(`   ❌ Failed: ${checks.failed}`);
console.log(`   ⚠️  Warnings: ${checks.warnings}`);
console.log('='.repeat(50) + '\n');

if (checks.failed > 0) {
    console.log('⚠️  CRITICAL: Please fix the failed checks above before running the app!\n');
    process.exit(1);
} else if (checks.warnings > 0) {
    console.log('⚠️  WARNING: Some optional features may not work (OAuth providers).\n');
    console.log('💡 TIP: At least one OAuth provider is recommended for better UX.\n');
} else {
    console.log('🎉 SUCCESS: All critical configurations are set!\n');
    console.log('🚀 You\'re ready to run: npm run dev\n');
}
