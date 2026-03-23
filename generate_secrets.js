// Generate secure secrets for OAuth setup
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

console.log('\n🔐 MOOYAM - Secret Generator\n');

// Generate NextAuth Secret (32 bytes base64)
const nextAuthSecret = crypto.randomBytes(32).toString('base64');
console.log('✅ NEXTAUTH_SECRET:');
console.log(`   ${nextAuthSecret}\n`);

// Generate Admin Password Hash
async function generateAdminHash() {
    const adminPassword = 'Admin@123'; // Default admin password
    const saltRounds = 10;
    
    try {
        const hash = await bcrypt.hash(adminPassword, saltRounds);
        console.log('✅ ADMIN_PASSWORD_HASH:');
        console.log(`   ${hash}`);
        console.log(`   (Password: "${adminPassword}")\n`);
        
        console.log('📝 Copy these values to your .env file!\n');
        console.log('⚠️  IMPORTANT: Change the admin password in production!\n');
    } catch (error) {
        console.error('Error generating hash:', error);
    }
}

generateAdminHash();
