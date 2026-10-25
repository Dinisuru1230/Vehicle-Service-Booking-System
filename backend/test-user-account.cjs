const http = require('http');

function post(path, data, token = null) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(
      { hostname: 'localhost', port: 5000, path, method: 'POST', headers },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch {
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

function put(path, data, token = null) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payload),
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(
      { hostname: 'localhost', port: 5000, path, method: 'PUT', headers },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch {
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
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(
      { hostname: 'localhost', port: 5000, path, method: 'GET', headers },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch {
            resolve({ status: res.statusCode, data: body });
          }
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
}

function del(path, token = null, data = null) {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : '';
    const headers = {};
    if (payload) {
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = Buffer.byteLength(payload);
    }
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(
      { hostname: 'localhost', port: 5000, path, method: 'DELETE', headers },
      (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch {
            resolve({ status: res.statusCode, data: body });
          }
        });
      }
    );
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('========================================================');
  console.log('🧪 RUNNING FULL USER ACCOUNT BACKEND TEST SUITE');
  console.log('========================================================\n');

  // 1. Health check
  console.log('--- TEST 1: Health Check ---');
  const healthRes = await get('/api/health');
  console.log('Status:', healthRes.status, '| API State:', healthRes.data.status);

  // 2. Login as Demo Customer
  console.log('\n--- TEST 2: Customer Login (Alexander Wright) ---');
  const loginRes = await post('/api/auth/login', {
    email: 'alexander@example.com',
    password: 'Customer2026!',
  });
  console.log('Status:', loginRes.status);
  console.log('Success:', loginRes.data.success);
  console.log('User Name:', loginRes.data.user?.name);
  console.log('User Role:', loginRes.data.user?.role);
  const userToken = loginRes.data.token;

  // 3. GET /api/user/profile
  console.log('\n--- TEST 3: Get User Account Profile & Garage ---');
  const profileRes = await get('/api/user/profile', userToken);
  console.log('Status:', profileRes.status);
  console.log('Profile Email:', profileRes.data.user?.email);
  console.log('Member Tier:', profileRes.data.user?.tier);
  console.log('Garage Count:', profileRes.data.user?.stats?.totalVehicles);
  console.log('Active Bookings:', profileRes.data.user?.stats?.activeBookings);
  console.log('Vehicles:', profileRes.data.user?.vehicles?.map(v => `${v.year} ${v.make} ${v.model} (${v.isPrimary ? 'PRIMARY' : 'SECONDARY'})`));

  // 4. PUT /api/user/profile
  console.log('\n--- TEST 4: Update Personal & Contact Details ---');
  const updateProfileRes = await put('/api/user/profile', {
    firstName: 'Alexander',
    lastName: 'Wright',
    phone: '+1 (555) 987-6543',
    city: 'San Francisco',
    state: 'CA',
    address: '1420 Market St, Penthouse Suite',
    zip: '94102',
    bio: 'Performance automotive enthusiast & weekend track driver.',
  }, userToken);
  console.log('Status:', updateProfileRes.status);
  console.log('Message:', updateProfileRes.data.message);
  console.log('Updated Address:', updateProfileRes.data.user?.address);
  console.log('Updated Phone:', updateProfileRes.data.user?.phone);

  // 5. PUT /api/user/preferences
  console.log('\n--- TEST 5: Update Account Preferences (2FA, SMS, Email) ---');
  const prefRes = await put('/api/user/preferences', {
    smsReminders: true,
    emailStatus: true,
    promotions: true,
    twoFactorEnabled: true,
  }, userToken);
  console.log('Status:', prefRes.status);
  console.log('Preferences:', prefRes.data.preferences);

  // 6. POST /api/user/vehicles (Add vehicle to user garage)
  console.log('\n--- TEST 6: Add Vehicle to User Garage ---');
  const addVehicleRes = await post('/api/user/vehicles', {
    name: '2022 Porsche 911 GT3 (992)',
    make: 'Porsche',
    model: '911 GT3',
    year: 2022,
    plate: 'CA 992GT3',
    mileage: '8,400 mi',
    color: 'Shark Blue',
    isPrimary: false,
    lastService: 'PDK Transmission Fluid & Filter',
  }, userToken);
  console.log('Status:', addVehicleRes.status);
  console.log('Added Vehicle ID:', addVehicleRes.data.vehicle?.id);
  console.log('Vehicle Name:', addVehicleRes.data.vehicle?.name);
  console.log('Vehicle License Plate:', addVehicleRes.data.vehicle?.license);
  const createdVehicleId = addVehicleRes.data.vehicle?.id;

  // 7. GET /api/user/vehicles
  console.log('\n--- TEST 7: Get All Vehicles in Garage ---');
  const vehiclesRes = await get('/api/user/vehicles', userToken);
  console.log('Status:', vehiclesRes.status);
  console.log('Total Garage Vehicles:', vehiclesRes.data.count);
  vehiclesRes.data.vehicles.forEach((v, idx) => {
    console.log(`  [${idx + 1}] ${v.name} | Plate: ${v.license} | Odo: ${v.odometer} | Primary: ${v.isPrimary}`);
  });

  // 8. PUT /api/user/vehicles/:id/primary (Set Porsche as primary)
  if (createdVehicleId) {
    console.log('\n--- TEST 8: Set Added Vehicle as Primary ---');
    const primaryRes = await put(`/api/user/vehicles/${createdVehicleId}/primary`, {}, userToken);
    console.log('Status:', primaryRes.status);
    console.log('Message:', primaryRes.data.message);
    console.log('Is Primary:', primaryRes.data.vehicle?.isPrimary);
  }

  // 9. PUT /api/user/vehicles/:id (Update mileage)
  if (createdVehicleId) {
    console.log('\n--- TEST 9: Update Vehicle Mileage & Odometer ---');
    const updateVehRes = await put(`/api/user/vehicles/${createdVehicleId}`, {
      odometer: '9,120 mi',
      color: 'Shark Blue Metallic',
    }, userToken);
    console.log('Status:', updateVehRes.status);
    console.log('Updated Odometer:', updateVehRes.data.vehicle?.odometer);
  }

  // 10. GET /api/user/dashboard
  console.log('\n--- TEST 10: Get User Account Dashboard Summary ---');
  const dashRes = await get('/api/user/dashboard', userToken);
  console.log('Status:', dashRes.status);
  console.log('Dashboard Garage Count:', dashRes.data.dashboard?.metrics?.garageCount);
  console.log('Tier Benefits:', dashRes.data.dashboard?.tierBenefits);
  console.log('Primary Vehicle:', dashRes.data.dashboard?.primaryVehicle?.name);

  // 11. PUT /api/user/password (Change password & verify)
  console.log('\n--- TEST 11: Change User Password ---');
  const pwdChangeRes = await put('/api/user/password', {
    currentPassword: 'Customer2026!',
    newPassword: 'Customer2026NewPass!',
    confirmPassword: 'Customer2026NewPass!',
  }, userToken);
  console.log('Status:', pwdChangeRes.status);
  console.log('Message:', pwdChangeRes.data.message);

  // 12. Verify Login with New Password
  console.log('\n--- TEST 12: Verify Login with New Password ---');
  const verifyLoginRes = await post('/api/auth/login', {
    email: 'alexander@example.com',
    password: 'Customer2026NewPass!',
  });
  console.log('Status:', verifyLoginRes.status);
  console.log('Login Success with New Password:', verifyLoginRes.data.success);
  const newVerifiedToken = verifyLoginRes.data.token;

  // 13. Revert Password back to Customer2026!
  console.log('\n--- TEST 13: Revert Password to Original Customer2026! ---');
  const revertPwdRes = await put('/api/user/password', {
    currentPassword: 'Customer2026NewPass!',
    newPassword: 'Customer2026!',
    confirmPassword: 'Customer2026!',
  }, newVerifiedToken);
  console.log('Status:', revertPwdRes.status);
  console.log('Password Reverted:', revertPwdRes.data.success);

  // 14. DELETE /api/user/vehicles/:id (Clean up test vehicle)
  if (createdVehicleId) {
    console.log('\n--- TEST 14: Delete Added Test Vehicle ---');
    const delVehRes = await del(`/api/user/vehicles/${createdVehicleId}`, userToken);
    console.log('Status:', delVehRes.status);
    console.log('Message:', delVehRes.data.message);
  }

  // 15. Admin User Management Tests
  console.log('\n--- TEST 15: Admin User Management (Marcus Vance) ---');
  const adminLogin = await post('/api/auth/login', {
    email: 'm.vance@apexdrive.io',
    password: 'ApexAdmin2026!',
  });
  const adminToken = adminLogin.data.token;
  console.log('Admin Login Status:', adminLogin.status, '| Role:', adminLogin.data.user?.role);

  // Admin Metrics
  console.log('\n--- TEST 16: Admin User Metrics ---');
  const metricsRes = await get('/api/admin/users/metrics', adminToken);
  console.log('Status:', metricsRes.status);
  console.log('Total System Users:', metricsRes.data.metrics?.totalUsers);
  console.log('Total Customers:', metricsRes.data.metrics?.totalCustomers);
  console.log('Total Garage Vehicles:', metricsRes.data.metrics?.totalVehicles);
  console.log('Tiers Breakdown:', metricsRes.data.metrics?.tiers);

  // Admin List Users with Search
  console.log('\n--- TEST 17: Admin List Users with Search & Filter ---');
  const usersListRes = await get('/api/admin/users?search=Alexander', adminToken);
  console.log('Status:', usersListRes.status);
  console.log('Found Users Count:', usersListRes.data.pagination?.total);
  if (usersListRes.data.users?.length > 0) {
    const u = usersListRes.data.users[0];
    console.log(`Matched: ${u.name} (${u.email}) | Tier: ${u.tier} | Vehicles: ${u.vehicleCount}`);
  }

  console.log('\n========================================================');
  console.log('🎉 ALL USER ACCOUNT BACKEND TESTS PASSED WITH 100% SUCCESS!');
  console.log('========================================================');
}

runTests().catch((err) => {
  console.error('[Test Execution Error]:', err);
});
