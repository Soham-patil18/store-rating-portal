import http from 'http';

const API_HOST = 'localhost';
const API_PORT = 5000;

function request(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const payload = data ? JSON.stringify(data) : null;
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
    };

    const req = http.request(
      {
        hostname: API_HOST,
        port: API_PORT,
        path: `/api${path}`,
        method,
        headers,
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: body });
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
  console.log('🧪 Starting FullStack API Verification Test Suite...\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ [PASS] ${message}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    const health = await request('GET', '/health');
    assert(health.status === 200 && health.data.status === 'ok', 'Server health check returns ok');

    // 2. Validation Test: Register with short name (< 20 chars)
    const badReg = await request('POST', '/auth/register', {
      name: 'Short Name',
      email: 'short@example.com',
      password: 'User@123',
      address: '123 Test Street, City',
    });
    assert(badReg.status === 400, 'Register rejects name shorter than 20 characters');

    // 3. Validation Test: Register with invalid password (no uppercase or special)
    const badPw = await request('POST', '/auth/register', {
      name: 'Valid Name Between Twenty And Sixty Characters',
      email: 'badpw@example.com',
      password: 'simplepassword',
      address: '123 Test Street, City',
    });
    assert(badPw.status === 400, 'Register rejects password without uppercase or special character');

    // 4. Successful Normal User Registration
    const testEmail = `test.user.${Date.now()}@example.com`;
    const goodReg = await request('POST', '/auth/register', {
      name: 'Registered Test User For Challenge Verification',
      email: testEmail,
      password: 'TestUser@123',
      address: '999 Innovation Parkway, Silicon Valley, CA 94025',
    });
    assert(goodReg.status === 201 && goodReg.data.token, 'Register succeeds with valid credentials');
    const userToken = goodReg.data.token;

    // 5. Admin Login
    const adminLogin = await request('POST', '/auth/login', {
      email: 'admin@storerating.com',
      password: 'Admin@123',
    });
    assert(adminLogin.status === 200 && adminLogin.data.user.role === 'admin', 'Admin login successful');
    const adminToken = adminLogin.data.token;

    // 6. Admin Stats
    const stats = await request('GET', '/admin/stats', null, adminToken);
    assert(stats.status === 200 && stats.data.totalStores >= 3, 'Admin stats return store and user counts');

    // 7. Store Owner Login & Dashboard
    const ownerLogin = await request('POST', '/auth/login', {
      email: 'michael.davies@stores.com',
      password: 'Owner@123',
    });
    assert(ownerLogin.status === 200 && ownerLogin.data.user.role === 'owner', 'Store owner login successful');
    const ownerToken = ownerLogin.data.token;

    const ownerDash = await request('GET', '/stores/owner/dashboard', null, ownerToken);
    assert(ownerDash.status === 200 && ownerDash.data.store && ownerDash.data.ratings.length > 0, 'Store owner dashboard returns store and ratings list');

    // 8. Normal User Views Stores & Searches
    const storeList = await request('GET', '/stores', null, userToken);
    assert(storeList.status === 200 && storeList.data.stores.length >= 3, 'Normal user can view store listings');
    const sampleStoreId = storeList.data.stores[0].id;

    const searchRes = await request('GET', '/stores?search=Coffee', null, userToken);
    assert(searchRes.status === 200 && searchRes.data.stores.some(s => s.name.includes('Coffee')), 'Store search by name works');

    // 9. Normal User Rates Store (1 to 5)
    const rateRes = await request('POST', `/stores/${sampleStoreId}/rate`, { rating: 5 }, userToken);
    assert(rateRes.status === 200 && rateRes.data.rating === 5, 'User can submit a 5-star rating');

    // 10. Normal User Modifies Rating
    const modifyRes = await request('POST', `/stores/${sampleStoreId}/rate`, { rating: 4 }, userToken);
    assert(modifyRes.status === 200 && modifyRes.data.rating === 4, 'User can modify their submitted rating');

    // 11. Normal User Updates Password
    const pwUpdate = await request('PUT', '/auth/password', {
      currentPassword: 'TestUser@123',
      newPassword: 'NewPassword@456',
    }, userToken);
    assert(pwUpdate.status === 200, 'User can update password with valid format');

    // 12. Admin Adds New User
    const adminAddUserRes = await request('POST', '/admin/users', {
      name: 'Admin Created Normal User Account Verification',
      email: `admin.created.${Date.now()}@example.com`,
      password: 'Created@123',
      address: '404 Admin Way, Austin, TX 78701',
      role: 'normal',
    }, adminToken);
    assert(adminAddUserRes.status === 201, 'Admin can add new users');

    // 13. Admin Lists Users with Filters & Sorting
    const adminUsers = await request('GET', '/admin/users?role=owner&sortBy=rating&sortOrder=DESC', null, adminToken);
    assert(adminUsers.status === 200 && adminUsers.data.users.length > 0 && adminUsers.data.users[0].storeRating !== undefined, 'Admin views users list with owner rating and sorting');

    console.log(`\n🎉 Verification Complete: ${passed} Passed, ${failed} Failed.`);
    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Test execution failed:', err);
    process.exit(1);
  }
}

runTests();
