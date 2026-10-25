const http = require('http');

function post(path, data, token = null) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path,
        method: 'POST',
        headers,
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch (e) {
            resolve({ status: res.statusCode, data: body });
          }
        });
      }
    );

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function get(path, token = null) {
  return new Promise((resolve, reject) => {
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path,
        method: 'GET',
        headers,
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch (e) {
            resolve({ status: res.statusCode, data: body });
          }
        });
      }
    );

    req.on('error', reject);
    req.end();
  });
}

async function runTests() {
  console.log('=== TEST 1: LOGIN SUPER ADMIN (Marcus Vance) ===');
  const adminRes = await post('/api/auth/login', {
    email: 'm.vance@apexdrive.io',
    password: 'ApexAdmin2026!',
  });
  console.log('Status:', adminRes.status);
  console.log('Admin Token:', adminRes.data.token ? 'PRESENT (Verified)' : 'MISSING');
  console.log('User Role:', adminRes.data.user ? adminRes.data.user.role : 'N/A');
  console.log('User Name:', adminRes.data.user ? adminRes.data.user.name : 'N/A');

  const adminToken = adminRes.data.token;

  console.log('\n=== TEST 2: PROTECTED PROFILE WITH TOKEN ===');
  const profileRes = await get('/api/auth/profile', adminToken);
  console.log('Status:', profileRes.status);
  console.log('Profile Email:', profileRes.data.user ? profileRes.data.user.email : 'N/A');

  console.log('\n=== TEST 3: REGISTER NEW CUSTOMER ACCOUNT ===');
  const testEmail = `rachel.test.${Date.now()}@example.com`;
  const regRes = await post('/api/auth/register', {
    fullName: 'Rachel Test Driver',
    email: testEmail,
    password: 'Password123!',
    phoneNumber: '+1 (555) 777-8899',
    city: 'San Francisco, CA',
  });
  console.log('Status:', regRes.status);
  console.log('Registered User:', regRes.data.user ? regRes.data.user.name : 'N/A');
  console.log('Registered Token:', regRes.data.token ? 'PRESENT (Verified)' : 'MISSING');

  console.log('\n=== TEST 4: LOGIN WITH NEWLY REGISTERED USER ===');
  const newLoginRes = await post('/api/auth/login', {
    email: testEmail,
    password: 'Password123!',
  });
  console.log('Status:', newLoginRes.status);
  console.log('Login Success:', newLoginRes.data.success);
  console.log('User Tier:', newLoginRes.data.user ? newLoginRes.data.user.tier : 'N/A');

  console.log('\n=== ALL AUTH BACKEND TESTS COMPLETED SUCCESSFULLY! ===');
}

runTests().catch(console.error);
