import fs from 'fs';
import path from 'path';

console.log('\n🔍 SECURITY VERIFICATION\n');
console.log('='.repeat(60));

let issues = 0;

// Check if .env files exist
const envFiles = [
  'backend/.env',
  'frontend/.env'
];

console.log('\n1. Checking .env files...');
envFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file} exists`);
  } else {
    console.log(`   ❌ ${file} missing - copy from .env.example`);
    issues++;
  }
});

// Check if .env.example files exist
const exampleFiles = [
  'backend/.env.example',
  'frontend/.env.example'
];

console.log('\n2. Checking .env.example templates...');
exampleFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file} exists`);
  } else {
    console.log(`   ❌ ${file} missing`);
    issues++;
  }
});

// Check .gitignore
console.log('\n3. Checking .gitignore...');
if (fs.existsSync('.gitignore')) {
  const gitignore = fs.readFileSync('.gitignore', 'utf8');
  const requiredEntries = ['.env', 'backend/.env', 'frontend/.env'];
  
  requiredEntries.forEach(entry => {
    if (gitignore.includes(entry)) {
      console.log(`   ✅ .gitignore contains "${entry}"`);
    } else {
      console.log(`   ⚠️  .gitignore missing "${entry}"`);
      issues++;
    }
  });
} else {
  console.log('   ❌ .gitignore not found');
  issues++;
}

// Check JWT secret strength
console.log('\n4. Checking JWT secret strength...');
if (fs.existsSync('backend/.env')) {
  const envContent = fs.readFileSync('backend/.env', 'utf8');
  
  const webSecretMatch = envContent.match(/JWT_WEB_SECRET=(.+)/);
  const mobileSecretMatch = envContent.match(/JWT_MOBILE_SECRET=(.+)/);
  
  if (webSecretMatch) {
    const secret = webSecretMatch[1].trim();
    if (secret.length >= 32 && !secret.includes('secure_key')) {
      console.log('   ✅ JWT_WEB_SECRET is strong');
    } else {
      console.log('   ❌ JWT_WEB_SECRET is weak or default - generate new one');
      issues++;
    }
  }
  
  if (mobileSecretMatch) {
    const secret = mobileSecretMatch[1].trim();
    if (secret.length >= 32 && !secret.includes('secure_key')) {
      console.log('   ✅ JWT_MOBILE_SECRET is strong');
    } else {
      console.log('   ❌ JWT_MOBILE_SECRET is weak or default - generate new one');
      issues++;
    }
  }
}

console.log('\n' + '='.repeat(60));

if (issues === 0) {
  console.log('\n✅ All security checks passed!\n');
} else {
  console.log(`\n⚠️  Found ${issues} security issue(s) - please fix them\n`);
  console.log('Run: node generate-secrets.js to generate new secrets\n');
}
