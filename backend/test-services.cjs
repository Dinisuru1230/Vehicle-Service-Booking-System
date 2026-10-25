/**
 * ApexDrive Vehicle Service Booking System
 * Service Catalog Backend API Test Suite
 * Tests all Public Service Endpoints:
 *   1. GET /api/services
 *   2. GET /api/services?category=...
 *   3. GET /api/services?search=...
 *   4. GET /api/services?popular=true
 *   5. GET /api/services?sortBy=price_desc
 *   6. GET /api/services/categories
 *   7. GET /api/services/:id (by serviceCode)
 *   8. GET /api/services/:id (by UUID)
 *   9. GET /api/services/:id (404 error handling)
 */

const BASE_URL = 'http://localhost:5000/api';

const logSection = (title) => {
  console.log('\n' + '='.repeat(60));
  console.log(`🧪 ${title}`);
  console.log('='.repeat(60));
};

const runTests = async () => {
  try {
    logSection('RUNNING PUBLIC SERVICE CATALOG BACKEND TEST SUITE');

    // TEST 1: Health Check
    console.log('\n--- TEST 1: Backend Health Check ---');
    const healthRes = await fetch(`${BASE_URL}/health`);
    const healthData = await healthRes.json();
    console.log(`Status: ${healthRes.status} | API State: ${healthData.status}`);
    if (healthRes.status !== 200) throw new Error('Backend health check failed');

    // TEST 2: List All Active Services
    console.log('\n--- TEST 2: List All Active Services (GET /api/services) ---');
    const allServicesRes = await fetch(`${BASE_URL}/services`);
    const allServicesData = await allServicesRes.json();
    console.log(`Status: ${allServicesRes.status} | Success: ${allServicesData.success}`);
    console.log(`Total Services Count: ${allServicesData.count}`);
    allServicesData.services.forEach((s, idx) => {
      console.log(
        `  [${idx + 1}] ${s.serviceCode} - ${s.title} ($${s.price}) | Category: ${s.category} | Duration: ${s.duration}`
      );
    });

    if (allServicesData.count < 6) {
      throw new Error(`Expected at least 6 services, found ${allServicesData.count}`);
    }

    const firstService = allServicesData.services[0];

    // TEST 3: Filter by Category (Maintenance)
    console.log('\n--- TEST 3: Filter by Category: Maintenance ---');
    const maintRes = await fetch(`${BASE_URL}/services?category=Maintenance`);
    const maintData = await maintRes.json();
    console.log(`Status: ${maintRes.status} | Found: ${maintData.count} Maintenance services`);
    maintData.services.forEach((s) => {
      console.log(`  • ${s.serviceCode}: ${s.title} ($${s.price})`);
      if (s.category !== 'Maintenance') throw new Error(`Category mismatch: ${s.category}`);
    });

    // TEST 4: Filter by Category (Brakes & Chassis)
    console.log('\n--- TEST 4: Filter by Category: Brakes & Chassis ---');
    const brakesRes = await fetch(`${BASE_URL}/services?category=${encodeURIComponent('Brakes & Chassis')}`);
    const brakesData = await brakesRes.json();
    console.log(`Status: ${brakesRes.status} | Found: ${brakesData.count} Brakes & Chassis services`);
    brakesData.services.forEach((s) => {
      console.log(`  • ${s.serviceCode}: ${s.title} ($${s.price})`);
      if (s.category !== 'Brakes & Chassis') throw new Error(`Category mismatch: ${s.category}`);
    });

    // TEST 5: Search Query
    console.log('\n--- TEST 5: Search Filter: "Brake" ---');
    const searchRes = await fetch(`${BASE_URL}/services?search=Brake`);
    const searchData = await searchRes.json();
    console.log(`Status: ${searchRes.status} | Search matches count: ${searchData.count}`);
    searchData.services.forEach((s) => {
      console.log(`  • Matched: ${s.serviceCode} - ${s.title}`);
    });
    if (searchData.count === 0) throw new Error('Search for "Brake" returned 0 results');

    // TEST 6: Popular Services Filter
    console.log('\n--- TEST 6: Popular Services Filter (popular=true) ---');
    const popRes = await fetch(`${BASE_URL}/services?popular=true`);
    const popData = await popRes.json();
    console.log(`Status: ${popRes.status} | Popular Services: ${popData.count}`);
    popData.services.forEach((s) => {
      console.log(`  • Popular: ${s.serviceCode} - ${s.title} (${s.badge})`);
      if (!s.isPopular) throw new Error(`Expected service ${s.serviceCode} to be popular`);
    });

    // TEST 7: Sort By Price Descending
    console.log('\n--- TEST 7: Sort by Price Descending (sortBy=price_desc) ---');
    const sortRes = await fetch(`${BASE_URL}/services?sortBy=price_desc`);
    const sortData = await sortRes.json();
    console.log(`Status: ${sortRes.status}`);
    console.log(`  Highest priced service: ${sortData.services[0].title} ($${sortData.services[0].price})`);
    console.log(
      `  Lowest priced service:  ${sortData.services[sortData.services.length - 1].title} ($${
        sortData.services[sortData.services.length - 1].price
      })`
    );
    if (sortData.services[0].price < sortData.services[1].price) {
      throw new Error('Sorting price_desc failed');
    }

    // TEST 8: Get Service Categories & Icon Mappings
    console.log('\n--- TEST 8: Get Service Categories (GET /api/services/categories) ---');
    const catRes = await fetch(`${BASE_URL}/services/categories`);
    const catData = await catRes.json();
    console.log(`Status: ${catRes.status} | Total Categories: ${catData.categories.length}`);
    catData.categories.forEach((c) => {
      console.log(
        `  [Category] ${c.name.padEnd(18)} | Services: ${c.count} | Icon: ${c.iconType.padEnd(8)} | Class: ${c.badgeClass}`
      );
    });
    if (!catData.categories || catData.categories.length < 4) {
      throw new Error('Expected at least 4 service categories');
    }

    // TEST 9: Get Single Service by ServiceCode (e.g. SVC-101)
    console.log('\n--- TEST 9: Get Service by Code (GET /api/services/SVC-101) ---');
    const svcCodeRes = await fetch(`${BASE_URL}/services/SVC-101`);
    const svcCodeData = await svcCodeRes.json();
    console.log(`Status: ${svcCodeRes.status} | Title: ${svcCodeData.service.title}`);
    console.log(`Badge: ${svcCodeData.service.badge}`);
    console.log(`Checklist Items (${svcCodeData.service.checklist.length}):`);
    svcCodeData.service.checklist.forEach((item, i) => {
      console.log(`    ${i + 1}. ${item}`);
    });
    console.log(`Tags: [${svcCodeData.service.tags.join(', ')}]`);
    if (!svcCodeData.service.checklist || svcCodeData.service.checklist.length === 0) {
      throw new Error('Expected checklist items for SVC-101');
    }

    // TEST 10: Get Single Service by UUID
    console.log(`\n--- TEST 10: Get Service by UUID (GET /api/services/${firstService.id}) ---`);
    const uuidRes = await fetch(`${BASE_URL}/services/${firstService.id}`);
    const uuidData = await uuidRes.json();
    console.log(`Status: ${uuidRes.status} | Found: ${uuidData.service.serviceCode} - ${uuidData.service.title}`);
    if (uuidData.service.id !== firstService.id) {
      throw new Error('UUID mismatch on getServiceById');
    }

    // TEST 11: 404 Error Handling for Non-Existent Service
    console.log('\n--- TEST 11: Non-Existent Service (404 Check) ---');
    const notFoundRes = await fetch(`${BASE_URL}/services/NON_EXISTENT_999`);
    const notFoundData = await notFoundRes.json();
    console.log(`Status: ${notFoundRes.status} | Message: ${notFoundData.message}`);
    if (notFoundRes.status !== 404) {
      throw new Error(`Expected status 404, got ${notFoundRes.status}`);
    }

    logSection('🎉 ALL 11 SERVICE CATALOG BACKEND TESTS PASSED WITH 100% SUCCESS!');
  } catch (err) {
    console.error('\n❌ TEST FAILED:', err.message);
    process.exit(1);
  }
};

runTests();
