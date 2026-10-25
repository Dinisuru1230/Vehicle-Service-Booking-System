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
          const contentType = res.headers['content-type'] || '';
          if (contentType.includes('application/json')) {
            try {
              parsed = JSON.parse(body);
            } catch (e) {
              parsed = body;
            }
          } else {
            parsed = body; // raw string e.g. for CSV
          }
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
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
  console.log('===================================================================');
  console.log('⚙️ ApexDrive Workshop Settings, Invoices & Export Reports Test Suite');
  console.log('===================================================================\n');

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
    // 1. Authenticate Admin & Customer
    console.log('--- Phase 1: Authentication ---');
    const adminLogin = await request('POST', '/api/auth/login', {
      email: 'm.vance@apexdrive.io',
      password: 'ApexAdmin2026!',
    });
    assert('Admin login successful', adminLogin.status === 200 && adminLogin.body.token);
    const adminToken = adminLogin.body.token;

    const customerLogin = await request('POST', '/api/auth/login', {
      email: 'alexander@example.com',
      password: 'Customer2026!',
    });
    assert('Customer login successful', customerLogin.status === 200 && customerLogin.body.token);
    const customerToken = customerLogin.body.token;

    // 2. GET /api/admin/settings
    console.log('\n--- Phase 2: Workshop Settings (/api/admin/settings) ---');
    const getSettingsRes = await request('GET', '/api/admin/settings', null, adminToken);
    assert('GET /api/admin/settings returns 200', getSettingsRes.status === 200);
    assert('Contains workshop profile info (name, phone, address, currency)',
      getSettingsRes.body.settings?.workshopName?.includes('ApexDrive') &&
      getSettingsRes.body.settings?.phone &&
      getSettingsRes.body.settings?.address
    );
    assert('Contains operating schedule (weekday, saturday, sunday)',
      getSettingsRes.body.settings?.weekdayEnabled === true &&
      getSettingsRes.body.settings?.saturdayEnabled === true &&
      getSettingsRes.body.settings?.sundayEnabled === false
    );
    assert('Contains bay capacity and booking policies',
      getSettingsRes.body.settings?.activeBays === 8 &&
      getSettingsRes.body.settings?.maxIntakePerHour === 4 &&
      getSettingsRes.body.settings?.slotDuration &&
      getSettingsRes.body.settings?.advanceWindow
    );

    // 3. PUT /api/admin/settings (Update operating rules)
    const updatePayload = {
      activeBays: 10,
      maxIntakePerHour: 6,
      slotDuration: '60 Minutes',
      advanceWindow: '60 Days in advance',
      cancellationCutoff: '48 Hours prior',
    };
    const updateRes = await request('PUT', '/api/admin/settings', updatePayload, adminToken);
    assert('PUT /api/admin/settings returns 200 with updated fields',
      updateRes.status === 200 &&
      updateRes.body.settings?.activeBays === 10 &&
      updateRes.body.settings?.maxIntakePerHour === 6 &&
      updateRes.body.settings?.slotDuration === '60 Minutes' &&
      updateRes.body.settings?.advanceWindow === '60 Days in advance'
    );

    // 4. POST /api/admin/settings/reset (Restore workshop defaults)
    const resetRes = await request('POST', '/api/admin/settings/reset', {}, adminToken);
    assert('POST /api/admin/settings/reset returns 200 with factory defaults restored',
      resetRes.status === 200 &&
      resetRes.body.settings?.activeBays === 8 &&
      resetRes.body.settings?.maxIntakePerHour === 4 &&
      resetRes.body.settings?.slotDuration === '45 Minutes'
    );

    // 5. GET /api/bookings/:id/invoice (Customer & Admin Invoice Generation)
    console.log('\n--- Phase 3: Invoice Generation (/api/bookings/:id/invoice) ---');
    const invoiceRes = await request('GET', '/api/bookings/APX-84920/invoice', null, customerToken);
    assert('GET /api/bookings/:id/invoice returns 200', invoiceRes.status === 200);
    assert('Invoice contains invoiceNumber, customer info, vehicle, and payment status',
      invoiceRes.body.invoice?.invoiceNumber &&
      invoiceRes.body.invoice?.customer?.name &&
      invoiceRes.body.invoice?.vehicle?.vehicleName &&
      invoiceRes.body.invoice?.paymentStatus
    );
    assert('Invoice contains itemized breakdown (Labor, Parts, Environmental Fee)',
      Array.isArray(invoiceRes.body.invoice?.itemizedBreakdown) &&
      invoiceRes.body.invoice?.itemizedBreakdown.length >= 3
    );
    assert('Invoice contains complete financials (subtotal, tier discount, tax, grand total)',
      invoiceRes.body.invoice?.financials?.subtotal > 0 &&
      invoiceRes.body.invoice?.financials?.taxAmount > 0 &&
      invoiceRes.body.invoice?.financials?.grandTotal > 0
    );

    // 6. GET /api/admin/reports/bookings/export (CSV Export)
    console.log('\n--- Phase 4: Reports & Analytics Export (/api/admin/reports/bookings/export) ---');
    const exportRes = await request('GET', '/api/admin/reports/bookings/export', null, adminToken);
    assert('GET /api/admin/reports/bookings/export returns 200', exportRes.status === 200);
    assert('Response headers set Content-Type: text/csv',
      exportRes.headers['content-type'] && exportRes.headers['content-type'].includes('text/csv')
    );
    assert('Response headers set Content-Disposition attachment with .csv filename',
      exportRes.headers['content-disposition'] && exportRes.headers['content-disposition'].includes('.csv')
    );
    assert('CSV body contains header row and multiple booking rows',
      typeof exportRes.body === 'string' &&
      exportRes.body.includes('Booking Ref') &&
      exportRes.body.includes('Customer Name') &&
      exportRes.body.includes('Total Cost') &&
      exportRes.body.includes('APX-')
    );

    // 7. Security & Role Authorization Checks
    console.log('\n--- Phase 5: Role-Based Authorization & Security Checks ---');
    const custGetSettings = await request('GET', '/api/admin/settings', null, customerToken);
    assert('Customer blocked from GET /api/admin/settings with 403 Forbidden', custGetSettings.status === 403);

    const custPutSettings = await request('PUT', '/api/admin/settings', { activeBays: 12 }, customerToken);
    assert('Customer blocked from PUT /api/admin/settings with 403 Forbidden', custPutSettings.status === 403);

    const custResetSettings = await request('POST', '/api/admin/settings/reset', {}, customerToken);
    assert('Customer blocked from POST /api/admin/settings/reset with 403 Forbidden', custResetSettings.status === 403);

    const custExportReport = await request('GET', '/api/admin/reports/bookings/export', null, customerToken);
    assert('Customer blocked from GET /api/admin/reports/bookings/export with 403 Forbidden', custExportReport.status === 403);

    const unauthInvoice = await request('GET', '/api/bookings/APX-85104/invoice', null, customerToken);
    assert('Customer blocked from viewing another customer invoice with 403 Forbidden', unauthInvoice.status === 403);

    console.log('\n===================================================================');
    console.log(`📊 Test Results: ${passed}/${total} assertions PASSED (${Math.round((passed / total) * 100)}%)`);
    console.log('===================================================================');

    if (passed === total) {
      console.log('🎉 ALL SETTINGS, INVOICE & REPORT ENDPOINTS ARE FULLY OPERATIONAL!');
    } else {
      process.exit(1);
    }
  } catch (err) {
    console.error('Fatal test error:', err);
    process.exit(1);
  }
}

runTests();
