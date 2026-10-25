/**
 * ApexDrive Vehicle Service Booking System
 * Staff & Certified Technicians Backend API Test Suite
 * Tests all endpoints under /api/admin/staff:
 *   1. Health Check
 *   2. Auth Protection & Role Access (Admin vs Customer vs Guest)
 *   3. GET /api/admin/staff/metrics
 *   4. GET /api/admin/staff (all staff & pagination)
 *   5. GET /api/admin/staff?role=... (filter by role)
 *   6. GET /api/admin/staff?status=In-Bay (filter by status)
 *   7. GET /api/admin/staff?bay=Bay+1 (filter by bay)
 *   8. GET /api/admin/staff?search=... (search query)
 *   9. GET /api/admin/staff/:id (by staffCode)
 *  10. GET /api/admin/staff/:id (by UUID)
 *  11. POST /api/admin/staff (create new master technician)
 *  12. PUT /api/admin/staff/:id (update details & certifications)
 *  13. PUT /api/admin/staff/:id/status (update availability status)
 *  14. DELETE /api/admin/staff/:id (remove technician from roster)
 *  15. 404 Check for deleted technician
 */

const BASE_URL = 'http://localhost:5000/api';

const logSection = (title) => {
  console.log('\n' + '='.repeat(60));
  console.log(`🧪 ${title}`);
  console.log('='.repeat(60));
};

const runTests = async () => {
  try {
    logSection('RUNNING ADMIN STAFF & TECHNICIANS BACKEND TEST SUITE');

    // TEST 1: Health Check
    console.log('\n--- TEST 1: Backend Health Check ---');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    console.log(`Status: ${healthRes.status} | API State: ${healthData.status}`);
    if (healthRes.status !== 200) throw new Error('Health check failed');

    // TEST 2: Admin Login
    console.log('\n--- TEST 2: Admin Login (Marcus Vance) ---');
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'm.vance@apexdrive.io',
        password: 'ApexAdmin2026!',
      }),
    });
    const adminLoginData = await adminLoginRes.json();
    console.log(`Status: ${adminLoginRes.status} | Role: ${adminLoginData.user.role}`);
    const adminToken = adminLoginData.token;
    if (!adminToken) throw new Error('Admin login failed');

    // TEST 3: Customer Login & Role Protection Check (403 expected)
    console.log('\n--- TEST 3: Customer Role Security Check (Should be 403 Forbidden) ---');
    const customerLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'alexander@example.com',
        password: 'Customer2026!',
      }),
    });
    const customerLoginData = await customerLoginRes.json();
    const customerToken = customerLoginData.token;

    const forbiddenRes = await fetch(`${BASE_URL}/admin/staff`, {
      headers: { Authorization: `Bearer ${customerToken}` },
    });
    console.log(`Status: ${forbiddenRes.status} (Expected: 403)`);
    if (forbiddenRes.status !== 403) {
      throw new Error(`Expected 403 Forbidden for non-admin, got ${forbiddenRes.status}`);
    }

    // TEST 4: Guest Access Security Check (401 expected)
    console.log('\n--- TEST 4: Guest Access Security Check (Should be 401 Unauthorized) ---');
    const guestRes = await fetch(`${BASE_URL}/admin/staff`);
    console.log(`Status: ${guestRes.status} (Expected: 401)`);
    if (guestRes.status !== 401) {
      throw new Error(`Expected 401 Unauthorized for guest, got ${guestRes.status}`);
    }

    // TEST 5: Get Staff Metrics
    console.log('\n--- TEST 5: Get Staff Metrics (GET /api/admin/staff/metrics) ---');
    const metricsRes = await fetch(`${BASE_URL}/admin/staff/metrics`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const metricsData = await metricsRes.json();
    console.log(`Status: ${metricsRes.status} | Success: ${metricsData.success}`);
    const m = metricsData.metrics;
    console.log(`  Total Staff:          ${m.totalStaff}`);
    console.log(`  On-Duty Today:        ${m.onDutyCount}`);
    console.log(`  Active In-Bay:        ${m.activeInBayCount}`);
    console.log(`  Available to Dispatch:${m.availableCount}`);
    console.log(`  Average Efficiency:   ${m.efficiencyRate}%`);
    console.log(`  Master Certifications:${m.masterCertsCount}`);
    console.log(`  Active Bay Coverage:  ${m.bayCoverageText}`);
    if (!m.totalStaff || m.totalStaff < 10) {
      throw new Error(`Expected at least 10 staff members, got ${m.totalStaff}`);
    }

    // TEST 6: List All Staff
    console.log('\n--- TEST 6: List All Staff & Technicians (GET /api/admin/staff) ---');
    const listRes = await fetch(`${BASE_URL}/admin/staff`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const listData = await listRes.json();
    console.log(`Status: ${listRes.status} | Total Count: ${listData.total}`);
    listData.staff.slice(0, 6).forEach((s, idx) => {
      console.log(
        `  [${idx + 1}] ${s.staffCode.padEnd(8)} ${s.name.padEnd(18)} | ${s.role.padEnd(26)} | Bay: ${s.bay.padEnd(12)} | Status: ${s.status}`
      );
    });
    const firstStaff = listData.staff[0];

    // TEST 7: Filter by Role (Powertrain)
    console.log('\n--- TEST 7: Filter by Role: Powertrain ---');
    const roleRes = await fetch(`${BASE_URL}/admin/staff?role=Powertrain`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const roleData = await roleRes.json();
    console.log(`Status: ${roleRes.status} | Found: ${roleData.count} Powertrain techs`);
    roleData.staff.forEach((s) => {
      console.log(`  • ${s.staffCode}: ${s.name} - ${s.role}`);
      if (!s.role.toLowerCase().includes('powertrain')) {
        throw new Error(`Role mismatch: ${s.role}`);
      }
    });

    // TEST 8: Filter by Status (In-Bay)
    console.log('\n--- TEST 8: Filter by Status: In-Bay ---');
    const statusRes = await fetch(`${BASE_URL}/admin/staff?status=In-Bay`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const statusData = await statusRes.json();
    console.log(`Status: ${statusRes.status} | In-Bay Techs: ${statusData.count}`);
    statusData.staff.forEach((s) => {
      console.log(`  • ${s.staffCode} (${s.name}): In ${s.bay} servicing ${s.vehicleText}`);
      if (s.status !== 'In-Bay') throw new Error(`Status mismatch: ${s.status}`);
    });

    // TEST 9: Filter by Bay (Bay 1)
    console.log('\n--- TEST 9: Filter by Bay: Bay 1 ---');
    const bayRes = await fetch(`${BASE_URL}/admin/staff?bay=${encodeURIComponent('Bay 1')}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const bayData = await bayRes.json();
    console.log(`Status: ${bayRes.status} | Found: ${bayData.count} techs assigned to Bay 1`);
    bayData.staff.forEach((s) => {
      console.log(`  • ${s.staffCode}: ${s.name} (${s.bay})`);
      if (!s.bay.includes('Bay 1')) throw new Error(`Bay mismatch: ${s.bay}`);
    });

    // TEST 10: Search Query ("Rivera")
    console.log('\n--- TEST 10: Search Query ("Rivera") ---');
    const searchRes = await fetch(`${BASE_URL}/admin/staff?search=Rivera`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const searchData = await searchRes.json();
    console.log(`Status: ${searchRes.status} | Matches: ${searchData.count}`);
    if (searchData.count !== 1 || !searchData.staff[0].name.includes('Rivera')) {
      throw new Error('Search for Rivera failed');
    }
    console.log(`  Matched: ${searchData.staff[0].name} (${searchData.staff[0].email})`);

    // TEST 11: Get Single Technician by staffCode (TECH-01)
    console.log('\n--- TEST 11: Get Technician by Code (GET /api/admin/staff/TECH-01) ---');
    const singleCodeRes = await fetch(`${BASE_URL}/admin/staff/TECH-01`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const singleCodeData = await singleCodeRes.json();
    console.log(`Status: ${singleCodeRes.status} | Name: ${singleCodeData.technician.name}`);
    console.log(`Specialization: ${singleCodeData.technician.specialization}`);
    console.log(`Certifications: [${singleCodeData.technician.certs.map((c) => c.name).join(', ')}]`);
    console.log(`Recent Jobs Count: ${singleCodeData.technician.recentJobs.length}`);

    // TEST 12: Get Single Technician by UUID
    console.log(`\n--- TEST 12: Get Technician by UUID (GET /api/admin/staff/${firstStaff.id}) ---`);
    const singleUuidRes = await fetch(`${BASE_URL}/admin/staff/${firstStaff.id}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const singleUuidData = await singleUuidRes.json();
    console.log(`Status: ${singleUuidRes.status} | Code: ${singleUuidData.technician.staffCode}`);
    if (singleUuidData.technician.id !== firstStaff.id) {
      throw new Error('UUID mismatch on getStaffById');
    }

    // TEST 13: Add New Certified Technician (POST /api/admin/staff)
    console.log('\n--- TEST 13: Onboard New Technician (POST /api/admin/staff) ---');
    const newTechPayload = {
      name: 'Kenji Sato',
      email: 'k.sato@apexdrive.io',
      phone: '+1 (555) 999-8888',
      role: 'Chassis & Aerodynamics Lead',
      specialization: 'High-Downforce CFD & Alignment',
      bay: 'Bay 2 (Alignment Lift)',
      status: 'Available',
      vehicleText: 'Available for Dispatch',
      certs: 'HKS Pro Tuner, Öhlins Gold Certified, ASE Master',
      experience: '14 years',
      efficiency: 99,
      notes: 'Super GT veteran technician specializing in precision chassis setup.',
    };

    const createRes = await fetch(`${BASE_URL}/admin/staff`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(newTechPayload),
    });
    const createData = await createRes.json();
    console.log(`Status: ${createRes.status} | Message: ${createData.message}`);
    console.log(`Assigned Code: ${createData.staff.staffCode}`);
    console.log(`Certifications Count: ${createData.staff.certs.length}`);
    const createdTechId = createData.staff.id;
    if (createRes.status !== 201) throw new Error('Create technician failed');

    // TEST 14: Update Technician Details (PUT /api/admin/staff/:id)
    console.log('\n--- TEST 14: Update Technician Details (PUT /api/admin/staff/:id) ---');
    const updateRes = await fetch(`${BASE_URL}/admin/staff/${createdTechId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        role: 'Chief Aerodynamics & Telemetry Director',
        efficiency: 100,
        phone: '+1 (555) 999-7777',
      }),
    });
    const updateData = await updateRes.json();
    console.log(`Status: ${updateRes.status} | Message: ${updateData.message}`);
    console.log(`Updated Role: ${updateData.staff.role} | Efficiency: ${updateData.staff.efficiency}%`);
    if (updateData.staff.efficiency !== 100) throw new Error('Update efficiency failed');

    // TEST 15: Update Status & Bay Assignment (PUT /api/admin/staff/:id/status)
    console.log('\n--- TEST 15: Update Availability Status (PUT /api/admin/staff/:id/status) ---');
    const statusUpdateRes = await fetch(`${BASE_URL}/admin/staff/${createdTechId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        status: 'In-Bay',
        bay: 'Bay 2 (Laser Rig)',
        vehicleText: '2023 Porsche 911 GT3 RS (Chassis Corner Balancing)',
      }),
    });
    const statusUpdateData = await statusUpdateRes.json();
    console.log(`Status: ${statusUpdateRes.status} | Message: ${statusUpdateData.message}`);
    console.log(`New Status: ${statusUpdateData.staff.status} | In Bay: ${statusUpdateData.staff.bay}`);
    console.log(`Servicing: ${statusUpdateData.staff.vehicleText}`);
    if (statusUpdateData.staff.status !== 'In-Bay') throw new Error('Status update failed');

    // TEST 16: Remove Technician from Roster (DELETE /api/admin/staff/:id)
    console.log('\n--- TEST 16: Remove Technician from Roster (DELETE /api/admin/staff/:id) ---');
    const deleteRes = await fetch(`${BASE_URL}/admin/staff/${createdTechId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const deleteData = await deleteRes.json();
    console.log(`Status: ${deleteRes.status} | Message: ${deleteData.message}`);
    if (deleteRes.status !== 200) throw new Error('Delete technician failed');

    // TEST 17: Verify Deletion (404 Check)
    console.log('\n--- TEST 17: Verify Deleted Technician (404 Check) ---');
    const notFoundRes = await fetch(`${BASE_URL}/admin/staff/${createdTechId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const notFoundData = await notFoundRes.json();
    console.log(`Status: ${notFoundRes.status} | Message: ${notFoundData.message}`);
    if (notFoundRes.status !== 404) throw new Error('Expected 404 for deleted technician');

    logSection('🎉 ALL 17 STAFF & TECHNICIANS BACKEND TESTS PASSED WITH 100% SUCCESS!');
  } catch (err) {
    console.error('\n❌ TEST FAILED:', err.message);
    process.exit(1);
  }
};

runTests();
