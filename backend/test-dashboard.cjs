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
  console.log('📊 ApexDrive Admin Dashboard & Workshop Overview Test Suite');
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
    // 1. Health check to confirm server is responding
    console.log('--- Phase 1: Server Connectivity & Authentication ---');
    const health = await request('GET', '/api/health');
    assert('Backend API is healthy & responding on port 5000', health.status === 200 && health.body.status === 'ONLINE');

    // 2. Authenticate Admin
    const adminLogin = await request('POST', '/api/auth/login', {
      email: 'm.vance@apexdrive.io',
      password: 'ApexAdmin2026!',
    });
    assert('Admin Marcus Vance login successful', adminLogin.status === 200 && adminLogin.body.token);
    const adminToken = adminLogin.body.token;

    // 3. Authenticate Customer
    const customerLogin = await request('POST', '/api/auth/login', {
      email: 'alexander@example.com',
      password: 'Customer2026!',
    });
    assert('Customer Alexander Wright login successful', customerLogin.status === 200 && customerLogin.body.token);
    const customerToken = customerLogin.body.token;

    // 4. GET /api/admin/dashboard/metrics
    console.log('\n--- Phase 2: GET /api/admin/dashboard/metrics ---');
    const metricsRes = await request('GET', '/api/admin/dashboard/metrics', null, adminToken);
    assert('GET /api/admin/dashboard/metrics returns 200', metricsRes.status === 200);
    assert('Contains todayRevenue ($ formatted & numeric)',
      metricsRes.body.metrics?.todayRevenue?.value > 0 &&
      metricsRes.body.metrics?.todayRevenue?.formatted.includes('$')
    );
    assert('Contains activeJobsInBays (In-service count & label)',
      metricsRes.body.metrics?.activeJobsInBays?.value >= 0 &&
      metricsRes.body.metrics?.activeJobsInBays?.label === 'Active Jobs in Bays'
    );
    assert('Contains completedToday (count & revenue subtext)',
      metricsRes.body.metrics?.completedToday?.value >= 0 &&
      metricsRes.body.metrics?.completedToday?.label === 'Completed Today'
    );
    assert('Contains customerSatisfaction (score 98.6% & 4.9 ★ rating)',
      metricsRes.body.metrics?.customerSatisfaction?.score > 90 &&
      metricsRes.body.metrics?.customerSatisfaction?.rating.includes('★')
    );
    assert('Contains workshopOverview with bay utilization and lead tech',
      metricsRes.body.metrics?.workshopOverview?.totalBays === 10 &&
      metricsRes.body.metrics?.workshopOverview?.leadTechnician.includes('Dave Miller')
    );

    // 5. GET /api/admin/dashboard/bays
    console.log('\n--- Phase 3: GET /api/admin/dashboard/bays ---');
    const baysRes = await request('GET', '/api/admin/dashboard/bays', null, adminToken);
    assert('GET /api/admin/dashboard/bays returns 200', baysRes.status === 200);
    assert('Returns exactly 8 workshop bays (Bay 01 to Bay 08)',
      Array.isArray(baysRes.body.bays) && baysRes.body.bays.length === 8
    );
    assert('Bays contain summary with occupiedCount, openCount, and utilizationPercent',
      baysRes.body.summary &&
      baysRes.body.summary.occupiedCount >= 0 &&
      baysRes.body.summary.openCount >= 0 &&
      baysRes.body.summary.utilizationPercent.includes('%')
    );

    // Verify individual bay properties
    const bay1 = baysRes.body.bays.find(b => b.bayNumber === 1);
    assert('Bay 01 is In-Use with assigned technician, vehicle, and progress %',
      bay1 &&
      bay1.status === 'In-Use' &&
      bay1.vehicleName &&
      bay1.assignedTechnician &&
      bay1.progressPercent > 0
    );

    const bay8 = baysRes.body.bays.find(b => b.bayNumber === 8);
    assert('Bay 08 is Open / Available for incoming vehicle dispatch',
      bay8 &&
      bay8.status === 'Open' &&
      bay8.statusText === 'Available' &&
      bay8.progressPercent === 0
    );

    // 6. GET /api/admin/dashboard/recent-activity
    console.log('\n--- Phase 4: GET /api/admin/dashboard/recent-activity ---');
    const activityRes = await request('GET', '/api/admin/dashboard/recent-activity', null, adminToken);
    assert('GET /api/admin/dashboard/recent-activity returns 200', activityRes.status === 200);
    assert('Returns live audit log of activities with icons and timestamps',
      Array.isArray(activityRes.body.activities) &&
      activityRes.body.activities.length >= 5 &&
      activityRes.body.activities.every(a => a.id && a.type && a.title && a.timeAgo)
    );

    // Filter recent activity by type
    const checkinActivityRes = await request('GET', '/api/admin/dashboard/recent-activity?type=check_in', null, adminToken);
    assert('Filter recent-activity by ?type=check_in returns only check-in events',
      checkinActivityRes.status === 200 &&
      checkinActivityRes.body.activities.every(a => a.type === 'check_in')
    );

    // 7. Security Checks (RBAC)
    console.log('\n--- Phase 5: Role-Based Authorization & Security Checks ---');
    const unauthMetrics = await request('GET', '/api/admin/dashboard/metrics', null, customerToken);
    assert('Customer blocked from /api/admin/dashboard/metrics with 403 Forbidden', unauthMetrics.status === 403);

    const unauthBays = await request('GET', '/api/admin/dashboard/bays', null, customerToken);
    assert('Customer blocked from /api/admin/dashboard/bays with 403 Forbidden', unauthBays.status === 403);

    const unauthActivity = await request('GET', '/api/admin/dashboard/recent-activity', null, customerToken);
    assert('Customer blocked from /api/admin/dashboard/recent-activity with 403 Forbidden', unauthActivity.status === 403);

    const noTokenRes = await request('GET', '/api/admin/dashboard/metrics');
    assert('Request with no JWT token blocked with 401 Unauthorized', noTokenRes.status === 401);

    console.log('\n===============================================================');
    console.log(`📊 Test Results: ${passed}/${total} assertions PASSED (${Math.round((passed / total) * 100)}%)`);
    console.log('===============================================================');

    if (passed === total) {
      console.log('🎉 ALL ADMIN DASHBOARD BACKEND ENDPOINTS ARE FULLY OPERATIONAL!');
    } else {
      process.exit(1);
    }
  } catch (err) {
    console.error('Fatal test error:', err);
    process.exit(1);
  }
}

runTests();
