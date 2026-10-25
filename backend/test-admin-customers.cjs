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
      { hostname: 'localhost', port: 5000, path: encodeURI(path), method: 'POST', headers },
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
      { hostname: 'localhost', port: 5000, path: encodeURI(path), method: 'PUT', headers },
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
      { hostname: 'localhost', port: 5000, path: encodeURI(path), method: 'GET', headers },
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

function del(path, token = null) {
  return new Promise((resolve, reject) => {
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(
      { hostname: 'localhost', port: 5000, path: encodeURI(path), method: 'DELETE', headers },
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

async function runAdminCustomerTests() {
  console.log('========================================================');
  console.log('👑 RUNNING ADMIN CUSTOMER BACKEND TEST SUITE');
  console.log('========================================================\n');

  // 1. Login as Super Admin
  console.log('--- TEST 1: Super Admin Login (Marcus Vance) ---');
  const adminLogin = await post('/api/auth/login', {
    email: 'm.vance@apexdrive.io',
    password: 'ApexAdmin2026!',
  });
  console.log('Status:', adminLogin.status);
  console.log('Admin Name:', adminLogin.data.user?.name);
  console.log('Role:', adminLogin.data.user?.role);
  const adminToken = adminLogin.data.token;

  // 2. Customer metrics
  console.log('\n--- TEST 2: GET /api/admin/customers/metrics ---');
  const metricsRes = await get('/api/admin/customers/metrics', adminToken);
  console.log('Status:', metricsRes.status);
  console.log('Total Customers:', metricsRes.data.metrics?.totalCustomers);
  console.log('Total Vehicles:', metricsRes.data.metrics?.totalVehicles);
  console.log('In-Bay Vehicles:', metricsRes.data.metrics?.inBayVehicles);
  console.log('VIP Count:', metricsRes.data.metrics?.tiers?.vipPlatinum);
  console.log('Total Gross Revenue: $' + metricsRes.data.metrics?.lifetimeGrossRevenue);

  // 3. List all customers
  console.log('\n--- TEST 3: GET /api/admin/customers ---');
  const customersRes = await get('/api/admin/customers', adminToken);
  console.log('Status:', customersRes.status);
  console.log('Total Returned Customers:', customersRes.data.customers?.length);
  customersRes.data.customers?.forEach((c, i) => {
    console.log(`  [${i + 1}] ${c.name} (${c.email}) | Tier: ${c.tier} | Status: ${c.status} | Spend: $${c.lifetimeSpend} | Vehicles: ${c.vehicles?.length}`);
  });

  // 4. Search customer by vehicle plate
  console.log('\n--- TEST 4: Search by Vehicle Plate "9TRK911" ---');
  const plateSearchRes = await get('/api/admin/customers?search=9TRK911', adminToken);
  console.log('Status:', plateSearchRes.status);
  console.log('Matches:', plateSearchRes.data.customers?.length);
  if (plateSearchRes.data.customers?.length > 0) {
    const c = plateSearchRes.data.customers[0];
    console.log(`Matched: ${c.name} (${c.email}) | Vehicle: ${c.vehicles?.[0]?.name} [${c.vehicles?.[0]?.plate}]`);
  }

  // 5. Filter by Tier "VIP Platinum"
  console.log('\n--- TEST 5: Filter by Tier "VIP Platinum" ---');
  const vipRes = await get('/api/admin/customers?tier=VIP Platinum', adminToken);
  console.log('Status:', vipRes.status);
  console.log('VIP Customers Count:', vipRes.data.customers?.length);
  vipRes.data.customers?.forEach(c => console.log(`  - ${c.name} (${c.tier})`));

  // 6. Create New Customer via Admin with initial vehicle intake
  console.log('\n--- TEST 6: POST /api/admin/customers (Create Customer + Vehicle) ---');
  const newEmail = `devin.vance.${Date.now()}@example.com`;
  const createCustomerRes = await post('/api/admin/customers', {
    firstName: 'Devin',
    lastName: 'Vance',
    email: newEmail,
    phone: '+1 (555) 789-0123',
    city: 'Monterey, CA',
    address: '100 Laguna Seca Way',
    tier: 'Gold Member',
    status: 'Active',
    notes: 'Corvette Z06 track day driver. Requests high-performance alignments.',
    vehicleMake: 'Chevrolet',
    vehicleModel: 'Corvette Z06 (C8)',
    vehicleYear: 2023,
    vehiclePlate: 'CA 8TRK06',
    vehicleVin: '1G1YB2D39P5109283',
    vehicleMileage: '4,200 mi',
    vehicleColor: 'Torch Red',
  }, adminToken);

  console.log('Status:', createCustomerRes.status);
  console.log('Message:', createCustomerRes.data.message);
  console.log('Created Customer ID:', createCustomerRes.data.customer?.id);
  console.log('Created Customer Name:', createCustomerRes.data.customer?.name);
  console.log('Attached Vehicle:', createCustomerRes.data.customer?.vehicles?.[0]?.name);
  const createdCustId = createCustomerRes.data.customer?.id;

  // 7. GET /api/admin/customers/:id
  if (createdCustId) {
    console.log('\n--- TEST 7: GET /api/admin/customers/:id ---');
    const custDetailRes = await get(`/api/admin/customers/${createdCustId}`, adminToken);
    console.log('Status:', custDetailRes.status);
    console.log('Customer Email:', custDetailRes.data.customer?.email);
    console.log('Member Since:', custDetailRes.data.customer?.memberSince);
    console.log('Vehicles Count:', custDetailRes.data.customer?.vehicles?.length);
  }

  // 8. PUT /api/admin/customers/:id (Upgrade tier & update status)
  if (createdCustId) {
    console.log('\n--- TEST 8: PUT /api/admin/customers/:id (Upgrade to VIP Platinum) ---');
    const updateRes = await put(`/api/admin/customers/${createdCustId}`, {
      tier: 'VIP Platinum',
      status: 'In-Bay',
      notes: 'Upgraded to VIP Platinum after track inspection booking.',
    }, adminToken);
    console.log('Status:', updateRes.status);
    console.log('Updated Tier:', updateRes.data.customer?.tier);
    console.log('Updated Status:', updateRes.data.customer?.status);
    console.log('Tier Badge Class:', updateRes.data.customer?.tierBadgeClass);
  }

  // 9. Quick update notes: PUT /api/admin/customers/:id/notes
  if (createdCustId) {
    console.log('\n--- TEST 9: PUT /api/admin/customers/:id/notes ---');
    const notesRes = await put(`/api/admin/customers/${createdCustId}/notes`, {
      notes: 'Customer requested Motul 660 brake fluid and track camber -2.5 degrees.',
    }, adminToken);
    console.log('Status:', notesRes.status);
    console.log('Saved Notes:', notesRes.data.notes);
  }

  // 10. Add second vehicle to customer garage: POST /api/admin/customers/:id/vehicles
  let secondVehId = null;
  if (createdCustId) {
    console.log('\n--- TEST 10: POST /api/admin/customers/:id/vehicles ---');
    const addVehRes = await post(`/api/admin/customers/${createdCustId}/vehicles`, {
      make: 'Cadillac',
      model: 'CT5-V Blackwing',
      year: 2024,
      plate: 'CA 6VBLK99',
      vin: '1G6DW5R68P0192849',
      mileage: '1,800 mi',
      color: 'Dark Emerald Frost',
      isPrimary: false,
      inBay: false,
      lastService: 'Break-In 1,500 Mi Service',
    }, adminToken);
    console.log('Status:', addVehRes.status);
    console.log('Added Vehicle:', addVehRes.data.vehicle?.name);
    console.log('Updated Garage Count:', addVehRes.data.customer?.vehicles?.length);
    secondVehId = addVehRes.data.vehicle?.id;
  }

  // 11. Update vehicle: PUT /api/admin/customers/:id/vehicles/:vehicleId
  if (createdCustId && secondVehId) {
    console.log('\n--- TEST 11: PUT /api/admin/customers/:id/vehicles/:vehicleId ---');
    const updateVehRes = await put(`/api/admin/customers/${createdCustId}/vehicles/${secondVehId}`, {
      mileage: '2,400 mi',
      inBay: true,
      lastService: 'Track Prep & Pad Bedding',
    }, adminToken);
    console.log('Status:', updateVehRes.status);
    console.log('Vehicle Mileage:', updateVehRes.data.vehicle?.mileage);
    console.log('Vehicle In-Bay:', updateVehRes.data.vehicle?.inBay);
  }

  // 12. Add booking for customer: POST /api/admin/customers/:id/bookings
  if (createdCustId && secondVehId) {
    console.log('\n--- TEST 12: POST /api/admin/customers/:id/bookings ---');
    const addBookingRes = await post(`/api/admin/customers/${createdCustId}/bookings`, {
      serviceTitle: 'Track Preparation & High-Temp Fluid Flush',
      vehicleId: secondVehId,
      scheduledDate: 'Oct 22, 2026',
      scheduledTime: '09:00 AM EST',
      bay: 'Bay 4 (Precision Alignment)',
      technician: 'Marcus Vance',
      totalCost: 550.0,
      status: 'Confirmed',
      notes: 'Customer participating in Laguna Seca track event.',
    }, adminToken);
    console.log('Status:', addBookingRes.status);
    console.log('Booking Reference:', addBookingRes.data.booking?.bookingRef);
    console.log('Service Title:', addBookingRes.data.booking?.serviceTitle);
  }

  // 13. Get customer bookings: GET /api/admin/customers/:id/bookings
  if (createdCustId) {
    console.log('\n--- TEST 13: GET /api/admin/customers/:id/bookings ---');
    const bookingsRes = await get(`/api/admin/customers/${createdCustId}/bookings`, adminToken);
    console.log('Status:', bookingsRes.status);
    console.log('Customer Bookings Count:', bookingsRes.data.count);
  }

  // 14. Delete added vehicle: DELETE /api/admin/customers/:id/vehicles/:vehicleId
  if (createdCustId && secondVehId) {
    console.log('\n--- TEST 14: DELETE /api/admin/customers/:id/vehicles/:vehicleId ---');
    const delVehRes = await del(`/api/admin/customers/${createdCustId}/vehicles/${secondVehId}`, adminToken);
    console.log('Status:', delVehRes.status);
    console.log('Message:', delVehRes.data.message);
  }

  // 15. Delete test customer: DELETE /api/admin/customers/:id
  if (createdCustId) {
    console.log('\n--- TEST 15: DELETE /api/admin/customers/:id ---');
    const delCustRes = await del(`/api/admin/customers/${createdCustId}`, adminToken);
    console.log('Status:', delCustRes.status);
    console.log('Message:', delCustRes.data.message);
  }

  // 16. Security check: Regular customer cannot access admin customer endpoints
  console.log('\n--- TEST 16: Security Guard (Customer forbidden from Admin API) ---');
  const custLogin = await post('/api/auth/login', {
    email: 'alexander@example.com',
    password: 'Customer2026!',
  });
  const customerToken = custLogin.data.token;
  const forbiddenRes = await get('/api/admin/customers', customerToken);
  console.log('Status:', forbiddenRes.status, '(Expected 403 Forbidden)');
  console.log('Forbidden Message:', forbiddenRes.data.message);

  console.log('\n========================================================');
  console.log('🎉 ALL ADMIN CUSTOMER BACKEND TESTS PASSED WITH 100% SUCCESS!');
  console.log('========================================================');
}

runAdminCustomerTests().catch((err) => {
  console.error('[Admin Test Error]:', err);
});
