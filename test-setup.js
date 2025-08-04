#!/usr/bin/env node

console.log('🔍 Checking Nobody App Setup...\n');

// Check for required environment variables
const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_KEY'
];

const optional = [
  'OPENAI_API_KEY'
];

let hasErrors = false;

console.log('Required Keys:');
required.forEach(key => {
  const value = process.env[key];
  if (!value) {
    console.log(`❌ ${key}: Missing`);
    hasErrors = true;
  } else if (key === 'NEXT_PUBLIC_SUPABASE_URL' && !value.includes('supabase.co')) {
    console.log(`⚠️  ${key}: Set but doesn't look like a Supabase URL`);
  } else if (key.includes('KEY') && value.length < 20) {
    console.log(`⚠️  ${key}: Set but seems too short`);
  } else {
    console.log(`✅ ${key}: Set (${value.substring(0, 20)}...)`);
  }
});

console.log('\nOptional Keys:');
optional.forEach(key => {
  const value = process.env[key];
  if (!value) {
    console.log(`⚠️  ${key}: Not set (AI features won't work)`);
  } else {
    console.log(`✅ ${key}: Set (${value.substring(0, 20)}...)`);
  }
});

if (hasErrors) {
  console.log('\n❌ Setup incomplete! Add missing keys to .env.local');
  process.exit(1);
} else {
  console.log('\n✅ Basic setup looks good!');
  console.log('\nNext steps:');
  console.log('1. Run: npm run dev');
  console.log('2. Open: http://localhost:3000');
  console.log('3. Create a test account');
}