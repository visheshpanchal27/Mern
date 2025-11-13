import crypto from 'crypto';

console.log('\n🔐 GENERATING STRONG JWT SECRETS\n');
console.log('=' .repeat(60));

console.log('\n📝 Copy these to your .env files:\n');

console.log('JWT_WEB_SECRET=' + crypto.randomBytes(32).toString('hex'));
console.log('JWT_MOBILE_SECRET=' + crypto.randomBytes(32).toString('hex'));

console.log('\n' + '='.repeat(60));
console.log('\n⚠️  IMPORTANT:');
console.log('1. Update backend/.env with these new secrets');
console.log('2. Update Render environment variables');
console.log('3. Restart your backend server');
console.log('4. All users will need to login again\n');
