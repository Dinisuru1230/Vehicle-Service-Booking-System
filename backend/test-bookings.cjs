const http = require('http');

function request(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : '';
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (postData) {
      headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path,
        method,
        headers,
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          let parsed;
          try {
            parsed = JSON.parse(body);
          } catch (e) {
            parsed = body;
          }
          resolve({ status: res.statusCode, body: parsed });
        });
      }
    );

    req.on('error', reject);
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

async function runTests() {
  console.log('===============================================================');
  console.log('🚀 ApexDrive Bookings & Appointments Integration Test Suite');
  console.log('===============================================================\n');

  let passed = 0;
  let total = 0;

  function assert(desc, condition, details = '') {
    total++;
    if (condition) {
      console.log(`  ✅ [PASS] ${desc}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${desc} ${details ? '- ' + details : ''}`);
    }
  }

  try {
    // 1. Authenticate Customer
    console.log('--- Phase 1: Authentication ---');
    const customerLogin = await request('POST', '/api/auth/login', {
      email: 'alexander@example.com',
      password: 'Customer2026!',
    });
    assert('Customer Alexander Wright login successful', customerLogin.status === 200 && customerLogin.body.token);
    const customerToken = customerLogin.body.token;

    // 2. Authenticate Admin
    const adminLogin = await request('POST', '/api/auth/login', {
      email: 'm.vance@apexdrive.io',
      password: 'ApexAdmin2026!',
    });
    assert('Admin Marcus Vance login successful', adminLogin.status === 200 && adminLogin.body.token);
    const adminToken = adminLogin.body.token;

    // 3. Customer: GET /api/bookings/my
    console.log('\n--- Phase 2: Customer Endpoints (/api/bookings) ---');
    const myBookingsRes = await request('GET', '/api/bookings/my', null, customerToken);
    assert('GET /api/bookings/my returns 200', myBookingsRes.status === 200);
    assert('GET /api/bookings/my contains stats & bookings array', 
      myBookingsRes.body.stats && Array.isArray(myBookingsRes.body.bookings) && myBookingsRes.body.bookings.length >= 1
    );

    // 4. Customer: Filter bookings by tab status
    const activeBookingsRes = await request('GET', '/api/bookings/my?status=active', null, customerToken);
    assert('GET /api/bookings/my?status=active returns only active bookings',
      activeBookingsRes.status === 200 && activeBookingsRes.body.bookings.every(b => b.statusGroup === 'active')
    );

    // 5. Customer: POST /api/bookings (Book appointment)
    const newBookingPayload = {
      vehicleMake: '2023 BMW M3 Competition',
      licensePlate: 'CA 8XYZ901',
      fullName: 'Alexander Wright',
      phoneNumber: '+1 (555) 234-5678',
      selectedServices: ['brake-pads', 'diagnostics'],
      serviceTitle: 'Brake Inspection & Full Diagnostics',
      scheduledDate: 'NOV 20, 2025',
      scheduledTime: '01:30 PM',
      hub: 'Apex Central Hub',
      notes: 'Please check high-speed vibration under hard braking.',
      totalCost: 228.0,
    };
    const createBookingRes = await request('POST', '/api/bookings', newBookingPayload, customerToken);
    assert('POST /api/bookings returns 201 Created', createBookingRes.status === 201);
    assert('POST /api/bookings returns valid bookingRef (#APX-...)', 
      createBookingRes.body.booking && createBookingRes.body.booking.bookingRef.startsWith('#APX-')
    );
    const createdBookingRef = createBookingRes.body.booking?.bookingRef;
    const createdBookingId = createBookingRes.body.booking?.id;

    // 6. Customer: GET /api/bookings/:id (telemetry and details)
    const targetRef = createdBookingId || encodeURIComponent(createdBookingRef);
    const getSingleRes = await request('GET', `/api/bookings/${targetRef}`, null, customerToken);
    assert('GET /api/bookings/:id returns 200 with telemetry milestones',
      getSingleRes.status === 200 && 
      getSingleRes.body.booking && 
      getSingleRes.body.booking.telemetry && 
      Array.isArray(getSingleRes.body.booking.telemetry.milestones)
    );

    // 7. Customer: PUT /api/bookings/:id/reschedule
    const rescheduleRes = await request(
      'PUT',
      `/api/bookings/${targetRef}/reschedule`,
      { scheduledDate: 'NOV 22, 2025', scheduledTime: '03:00 PM' },
      customerToken
    );
    assert('PUT /api/bookings/:id/reschedule returns 200 with updated date/time',
      rescheduleRes.status === 200 &&
      rescheduleRes.body.booking &&
      rescheduleRes.body.booking.scheduledDate === 'NOV 22, 2025' &&
      rescheduleRes.body.booking.scheduledTime === '03:00 PM'
    );

    // 8. Customer: PUT /api/bookings/:id/cancel
    const cancelRes = await request(
      'PUT',
      `/api/bookings/${targetRef}/cancel`,
      { reason: 'Customer schedule change' },
      customerToken
    );
    assert('PUT /api/bookings/:id/cancel returns 200 with status Cancelled',
      cancelRes.status === 200 && cancelRes.body.booking && cancelRes.body.booking.status === 'Cancelled'
    );

    // 9. Admin: GET /api/admin/bookings/metrics
    console.log('\n--- Phase 3: Admin Endpoints (/api/admin/bookings) ---');
    const metricsRes = await request('GET', '/api/admin/bookings/metrics', null, adminToken);
    assert('GET /api/admin/bookings/metrics returns 200 with KPI stats',
      metricsRes.status === 200 &&
      metricsRes.body.metrics &&
      metricsRes.body.metrics.totalBookings &&
      metricsRes.body.metrics.bayUtilizationRate
    );

    // 10. Admin: GET /api/admin/bookings
    const adminBookingsRes = await request('GET', '/api/admin/bookings', null, adminToken);
    assert('GET /api/admin/bookings returns 200 with list of workshop bookings',
      adminBookingsRes.status === 200 &&
      Array.isArray(adminBookingsRes.body.bookings) &&
      adminBookingsRes.body.bookings.length >= 5
    );

    // 11. Admin: GET /api/admin/bookings?status=In-Bay
    const inBayFilterRes = await request('GET', '/api/admin/bookings?status=In-Bay', null, adminToken);
    assert('GET /api/admin/bookings?status=In-Bay filters correctly',
      inBayFilterRes.status === 200 &&
      inBayFilterRes.body.bookings.every(b => b.status === 'In-Bay')
    );

    // 12. Admin: GET /api/admin/bookings?bay=Bay%201
    const bayFilterRes = await request('GET', `/api/admin/bookings?bay=${encodeURIComponent('Bay 1')}`, null, adminToken);
    assert('GET /api/admin/bookings?bay=Bay 1 filters by workshop bay',
      bayFilterRes.status === 200 &&
      bayFilterRes.body.bookings.every(b => b.bay.includes('Bay 1'))
    );

    // 13. Admin: GET /api/admin/bookings?search=Elena
    const searchRes = await request('GET', `/api/admin/bookings?search=${encodeURIComponent('Elena')}`, null, adminToken);
    assert('GET /api/admin/bookings?search=Elena finds Elena Rostova booking',
      searchRes.status === 200 &&
      searchRes.body.bookings.some(b => b.customer.includes('Elena'))
    );

    // 14. Admin: POST /api/admin/bookings (Manual phone/walk-in intake)
    const adminIntakePayload = {
      customer: 'Sterling Archer',
      phone: '+1 (555) 789-0123',
      vehicle: '2024 Aston Martin Vantage',
      plate: 'NV 007-GT',
      serviceTitle: 'Supercharger Pulley & Dyno Map',
      serviceDetail: 'High-Boost Calibration & Thermal Log',
      time: 'Today, 04:30 PM',
      bay: 'Bay 1 (Dyno Rack)',
      technician: 'Marcus Vance',
      totalCost: 890.0,
      notes: 'Customer phone intake. Track day preparation.',
    };
    const adminCreateRes = await request('POST', '/api/admin/bookings', adminIntakePayload, adminToken);
    assert('POST /api/admin/bookings returns 201 for manual walk-in intake',
      adminCreateRes.status === 201 && adminCreateRes.body.booking.customer === 'Sterling Archer'
    );
    const walkinRef = adminCreateRes.body.booking?.id || encodeURIComponent(adminCreateRes.body.booking?.bookingRef);

    // 15. Admin: PUT /api/admin/bookings/:id/assign
    const assignRes = await request(
      'PUT',
      `/api/admin/bookings/${walkinRef}/assign`,
      { technician: 'Dave Miller', bay: 'Bay 3 (Lift Heavy)' },
      adminToken
    );
    assert('PUT /api/admin/bookings/:id/assign reassigns technician & bay',
      assignRes.status === 200 &&
      assignRes.body.booking.technician === 'Dave Miller' &&
      assignRes.body.booking.bay === 'Bay 3 (Lift Heavy)'
    );

    // 16. Admin: PUT /api/admin/bookings/:id/status
    const statusRes = await request(
      'PUT',
      `/api/admin/bookings/${walkinRef}/status`,
      { status: 'In-Bay' },
      adminToken
    );
    assert('PUT /api/admin/bookings/:id/status updates status to In-Bay',
      statusRes.status === 200 && statusRes.body.booking.status === 'In-Bay'
    );

    // 17. Security Check: Customer accessing Admin Bookings
    console.log('\n--- Phase 4: Role-Based Authorization Security Checks ---');
    const unauthorizedRes = await request('GET', '/api/admin/bookings', null, customerToken);
    assert('Customer accessing /api/admin/bookings is blocked with 403 Forbidden', unauthorizedRes.status === 403);

    console.log('\n===============================================================');
    console.log(`📊 Test Results: ${passed}/${total} assertions PASSED (${Math.round((passed / total) * 100)}%)`);
    console.log('===============================================================');

    if (passed === total) {
      console.log('🎉 ALL BOOKING BACKEND ENDPOINTS ARE FULLY OPERATIONAL!');
    } else {
      process.exit(1);
    }
  } catch (err) {
    console.error('Fatal test error:', err);
    process.exit(1);
  }
}

runTests();
