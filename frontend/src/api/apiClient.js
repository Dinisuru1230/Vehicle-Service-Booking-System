const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Helper to get authentication token from localStorage
 */
export const getToken = () => localStorage.getItem('apexdrive_token');

/**
 * Generic API request wrapper with automatic Authorization header
 */
async function request(endpoint, options = {}) {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error.message);
    throw error;
  }
}

/**
 * Authentication Endpoints
 */
export const authAPI = {
  // POST /api/auth/register
  register: (userData) => {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // POST /api/auth/login
  login: (credentials) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // GET /api/auth/profile
  getProfile: () => {
    return request('/auth/profile', {
      method: 'GET',
    });
  },

  // PUT /api/auth/profile
  updateProfile: (profileData) => {
    return request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Health check
  checkHealth: () => {
    return request('/health', {
      method: 'GET',
    });
  },
};

/**
 * User Account & Profile Endpoints
 */
export const userAPI = {
  // GET /api/user/profile
  getProfile: () => {
    return request('/user/profile', {
      method: 'GET',
    });
  },

  // PUT /api/user/profile
  updateProfile: (profileData) => {
    return request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // PUT /api/user/password
  changePassword: (passwordData) => {
    return request('/user/password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  },

  // PUT /api/user/preferences
  updatePreferences: (preferencesData) => {
    return request('/user/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferencesData),
    });
  },

  // GET /api/user/dashboard
  getDashboard: () => {
    return request('/user/dashboard', {
      method: 'GET',
    });
  },

  // DELETE /api/user/account
  deleteAccount: (confirmDelete = true) => {
    return request('/user/account', {
      method: 'DELETE',
      body: JSON.stringify({ confirmDelete }),
    });
  },
};

/**
 * User Garage / Vehicle Endpoints
 */
export const vehicleAPI = {
  // GET /api/user/vehicles
  getVehicles: () => {
    return request('/user/vehicles', {
      method: 'GET',
    });
  },

  // POST /api/user/vehicles
  addVehicle: (vehicleData) => {
    return request('/user/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    });
  },

  // GET /api/user/vehicles/:id
  getVehicle: (id) => {
    return request(`/user/vehicles/${id}`, {
      method: 'GET',
    });
  },

  // PUT /api/user/vehicles/:id
  updateVehicle: (id, vehicleData) => {
    return request(`/user/vehicles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(vehicleData),
    });
  },

  // PUT /api/user/vehicles/:id/primary
  setPrimary: (id) => {
    return request(`/user/vehicles/${id}/primary`, {
      method: 'PUT',
    });
  },

  // DELETE /api/user/vehicles/:id
  deleteVehicle: (id) => {
    return request(`/user/vehicles/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Admin User & Customer Management Endpoints
 */
export const adminUserAPI = {
  // GET /api/admin/users
  getUsers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/users${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  },

  // GET /api/admin/users/:id
  getUser: (id) => {
    return request(`/admin/users/${id}`, {
      method: 'GET',
    });
  },

  // POST /api/admin/users
  createUser: (userData) => {
    return request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // PUT /api/admin/users/:id
  updateUser: (id, userData) => {
    return request(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // DELETE /api/admin/users/:id
  deleteUser: (id) => {
    return request(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  },

  // Customer Aliases
  getCustomers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/users${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  },

  getCustomer: (id) => {
    return request(`/admin/users/${id}`, {
      method: 'GET',
    });
  },

  createCustomer: (customerData) => {
    return request('/admin/users', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
  },

  updateCustomer: (id, customerData) => {
    return request(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customerData),
    });
  },

  deleteCustomer: (id) => {
    return request(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  },

  // PUT /api/admin/users/:id/notes
  updateCustomerNotes: (id, notes) => {
    return request(`/admin/users/${id}/notes`, {
      method: 'PUT',
      body: JSON.stringify({ notes }),
    });
  },

  // PUT /api/admin/users/:id/status
  updateCustomerStatus: (id, status) => {
    return request(`/admin/users/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // POST /api/admin/users/:id/vehicles
  addCustomerVehicle: (id, vehicleData) => {
    return request(`/admin/users/${id}/vehicles`, {
      method: 'POST',
      body: JSON.stringify(vehicleData),
    });
  },

  // PUT /api/admin/users/:id/vehicles/:vehicleId
  updateCustomerVehicle: (id, vehicleId, vehicleData) => {
    return request(`/admin/users/${id}/vehicles/${vehicleId}`, {
      method: 'PUT',
      body: JSON.stringify(vehicleData),
    });
  },

  // DELETE /api/admin/users/:id/vehicles/:vehicleId
  deleteCustomerVehicle: (id, vehicleId) => {
    return request(`/admin/users/${id}/vehicles/${vehicleId}`, {
      method: 'DELETE',
    });
  },

  // GET /api/admin/users/:id/bookings
  getCustomerBookings: (id) => {
    return request(`/admin/users/${id}/bookings`, {
      method: 'GET',
    });
  },

  // POST /api/admin/users/:id/bookings
  addCustomerBooking: (id, bookingData) => {
    return request(`/admin/users/${id}/bookings`, {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  // GET /api/admin/users/metrics
  getMetrics: () => {
    return request('/admin/users/metrics', {
      method: 'GET',
    });
  },
};

export const adminCustomerAPI = adminUserAPI;

/**
 * Public Service Catalog Endpoints
 */
export const serviceAPI = {
  // GET /api/services (with optional category, search, popular, sortBy)
  getServices: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/services${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  },

  // GET /api/services/:id (by ID or serviceCode)
  getService: (id) => {
    return request(`/services/${id}`, {
      method: 'GET',
    });
  },

  // GET /api/services/categories
  getCategories: () => {
    return request('/services/categories', {
      method: 'GET',
    });
  },
};

/**
 * Admin Staff & Certified Technicians Endpoints
 */
export const adminStaffAPI = {
  // GET /api/admin/staff (with optional search, role, bay, status, page, limit)
  getStaff: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/staff${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  },

  // GET /api/admin/staff/:id (by UUID or staffCode)
  getStaffMember: (id) => {
    return request(`/admin/staff/${id}`, {
      method: 'GET',
    });
  },

  // POST /api/admin/staff
  createStaff: (staffData) => {
    return request('/admin/staff', {
      method: 'POST',
      body: JSON.stringify(staffData),
    });
  },

  // PUT /api/admin/staff/:id
  updateStaff: (id, staffData) => {
    return request(`/admin/staff/${id}`, {
      method: 'PUT',
      body: JSON.stringify(staffData),
    });
  },

  // PUT /api/admin/staff/:id/status
  updateStatus: (id, statusData) => {
    return request(`/admin/staff/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    });
  },

  // DELETE /api/admin/staff/:id
  deleteStaff: (id) => {
    return request(`/admin/staff/${id}`, {
      method: 'DELETE',
    });
  },

  // GET /api/admin/staff/metrics
  getMetrics: () => {
    return request('/admin/staff/metrics', {
      method: 'GET',
    });
  },
};

/**
 * Customer Bookings & Appointments Endpoints
 */
export const bookingAPI = {
  // POST /api/bookings (Book appointment)
  createBooking: (bookingData) => {
    return request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  // GET /api/bookings/my (Customer booking history with status/hub/search filter)
  getMyBookings: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/bookings/my${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  },

  // GET /api/bookings/:id (Booking details & telemetry progress)
  getBooking: (id) => {
    const cleanId = encodeURIComponent(id);
    return request(`/bookings/${cleanId}`, {
      method: 'GET',
    });
  },

  // PUT /api/bookings/:id/cancel (Cancel upcoming booking)
  cancelBooking: (id, reason) => {
    const cleanId = encodeURIComponent(id);
    return request(`/bookings/${cleanId}/cancel`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  },

  // PUT /api/bookings/:id/reschedule (Choose new date/time slot)
  rescheduleBooking: (id, rescheduleData) => {
    const cleanId = encodeURIComponent(id);
    return request(`/bookings/${cleanId}/reschedule`, {
      method: 'PUT',
      body: JSON.stringify(rescheduleData),
    });
  },

  // GET /api/bookings/:id/invoice (Generate invoice breakdown)
  getInvoice: (id) => {
    const cleanId = encodeURIComponent(id);
    return request(`/bookings/${cleanId}/invoice`, {
      method: 'GET',
    });
  },
};

/**
 * Admin Workshop Bookings Management Endpoints
 */
export const adminBookingAPI = {
  // GET /api/admin/bookings (Workshop bookings with status, bay, category, search, page, limit)
  getBookings: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/bookings${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  },

  // GET /api/admin/bookings/:id
  getBooking: (id) => {
    const cleanId = encodeURIComponent(id);
    return request(`/admin/bookings/${cleanId}`, {
      method: 'GET',
    });
  },

  // POST /api/admin/bookings (Manual phone/walk-in intake)
  createBooking: (bookingData) => {
    return request('/admin/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  // PUT /api/admin/bookings/:id/status (Update status: Pending, Confirmed, In-Bay, Completed, Cancelled)
  updateStatus: (id, status) => {
    const cleanId = encodeURIComponent(id);
    return request(`/admin/bookings/${cleanId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // PUT /api/admin/bookings/:id/assign (Assign technician & bay)
  assignTechnicianAndBay: (id, assignData) => {
    const cleanId = encodeURIComponent(id);
    return request(`/admin/bookings/${cleanId}/assign`, {
      method: 'PUT',
      body: JSON.stringify(assignData),
    });
  },

  // GET /api/admin/bookings/metrics (KPI stats: total bookings, revenue, in-bay count, pending review)
  getMetrics: () => {
    return request('/admin/bookings/metrics', {
      method: 'GET',
    });
  },
};

/**
 * Admin Dashboard & Workshop Overview Endpoints
 */
export const adminDashboardAPI = {
  // GET /api/admin/dashboard/metrics
  getMetrics: () => {
    return request('/admin/dashboard/metrics', {
      method: 'GET',
    });
  },

  // GET /api/admin/dashboard/bays
  getBays: () => {
    return request('/admin/dashboard/bays', {
      method: 'GET',
    });
  },

  // GET /api/admin/dashboard/recent-activity
  getRecentActivity: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/admin/dashboard/recent-activity${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  },
};

/**
 * Workshop Settings & Operating Rules Endpoints
 */
export const adminSettingsAPI = {
  // GET /api/admin/settings
  getSettings: () => {
    return request('/admin/settings', {
      method: 'GET',
    });
  },

  // PUT /api/admin/settings
  updateSettings: (settingsData) => {
    return request('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData),
    });
  },

  // POST /api/admin/settings/reset
  resetSettings: () => {
    return request('/admin/settings/reset', {
      method: 'POST',
    });
  },
};

/**
 * Admin Reports & Analytics Export Endpoints
 */
export const adminReportAPI = {
  // GET /api/admin/reports/bookings/export (Export CSV)
  exportBookingsCSV: async () => {
    const token = getToken();
    const res = await fetch('http://localhost:5000/api/admin/reports/bookings/export', {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    return res.text();
  },
};

export default {
  auth: authAPI,
  user: userAPI,
  vehicle: vehicleAPI,
  service: serviceAPI,
  booking: bookingAPI,
  adminUser: adminUserAPI,
  adminCustomer: adminCustomerAPI,
  adminStaff: adminStaffAPI,
  adminBooking: adminBookingAPI,
  adminDashboard: adminDashboardAPI,
  adminSettings: adminSettingsAPI,
  adminReport: adminReportAPI,
};



