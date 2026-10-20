import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import BookingPage from './pages/BookingPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AboutUsPage from './pages/AboutUsPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminBookingsPage from './pages/AdminBookingsPage';
import AdminServicesPage from './pages/AdminServicesPage';
import AdminStaffPage from './pages/AdminStaffPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import AdminProfilePage from './pages/AdminProfilePage';
import AdminCustomersPage from './pages/AdminCustomersPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  const [currentPage, setCurrentPage] = useState('admin_customers'); // Default to Admin Customers as requested

  return (
    <div className="app-root">
      {currentPage === 'admin_customers' && (
        <AdminCustomersPage
          onNavigateDashboard={() => setCurrentPage('admin')}
          onNavigateBookings={() => setCurrentPage('admin_bookings')}
          onNavigateServices={() => setCurrentPage('admin_services')}
          onNavigateStaff={() => setCurrentPage('admin_staff')}
          onNavigateSettings={() => setCurrentPage('admin_settings')}
          onNavigateProfile={() => setCurrentPage('admin_profile')}
          onNavigateHome={() => setCurrentPage('landing')}
        />
      )}

      {currentPage === 'admin_profile' && (
        <AdminProfilePage
          onNavigateDashboard={() => setCurrentPage('admin')}
          onNavigateBookings={() => setCurrentPage('admin_bookings')}
          onNavigateCustomers={() => setCurrentPage('admin_customers')}
          onNavigateServices={() => setCurrentPage('admin_services')}
          onNavigateStaff={() => setCurrentPage('admin_staff')}
          onNavigateSettings={() => setCurrentPage('admin_settings')}
          onNavigateHome={() => setCurrentPage('landing')}
        />
      )}

      {currentPage === 'admin_settings' && (
        <AdminSettingsPage
          onNavigateDashboard={() => setCurrentPage('admin')}
          onNavigateBookings={() => setCurrentPage('admin_bookings')}
          onNavigateCustomers={() => setCurrentPage('admin_customers')}
          onNavigateServices={() => setCurrentPage('admin_services')}
          onNavigateStaff={() => setCurrentPage('admin_staff')}
          onNavigateHome={() => setCurrentPage('landing')}
          onNavigateProfile={() => setCurrentPage('admin_profile')}
        />
      )}

      {currentPage === 'admin_staff' && (
        <AdminStaffPage
          onNavigateDashboard={() => setCurrentPage('admin')}
          onNavigateBookings={() => setCurrentPage('admin_bookings')}
          onNavigateCustomers={() => setCurrentPage('admin_customers')}
          onNavigateServices={() => setCurrentPage('admin_services')}
          onNavigateSettings={() => setCurrentPage('admin_settings')}
          onNavigateHome={() => setCurrentPage('landing')}
          onNavigateProfile={() => setCurrentPage('admin_profile')}
        />
      )}

      {currentPage === 'admin_services' && (
        <AdminServicesPage
          onNavigateDashboard={() => setCurrentPage('admin')}
          onNavigateBookings={() => setCurrentPage('admin_bookings')}
          onNavigateCustomers={() => setCurrentPage('admin_customers')}
          onNavigateStaff={() => setCurrentPage('admin_staff')}
          onNavigateSettings={() => setCurrentPage('admin_settings')}
          onNavigateHome={() => setCurrentPage('landing')}
          onNavigateProfile={() => setCurrentPage('admin_profile')}
        />
      )}

      {currentPage === 'admin_bookings' && (
        <AdminBookingsPage
          onNavigateDashboard={() => setCurrentPage('admin')}
          onNavigateCustomers={() => setCurrentPage('admin_customers')}
          onNavigateServices={() => setCurrentPage('admin_services')}
          onNavigateStaff={() => setCurrentPage('admin_staff')}
          onNavigateSettings={() => setCurrentPage('admin_settings')}
          onNavigateHome={() => setCurrentPage('landing')}
          onNavigateBook={() => setCurrentPage('book')}
          onNavigateProfile={() => setCurrentPage('admin_profile')}
        />
      )}

      {currentPage === 'admin' && (
        <AdminDashboardPage
          onNavigateHome={() => setCurrentPage('landing')}
          onNavigateBook={() => setCurrentPage('book')}
          onNavigateBookings={() => setCurrentPage('bookings')}
          onNavigateBookingsAdmin={() => setCurrentPage('admin_bookings')}
          onNavigateCustomersAdmin={() => setCurrentPage('admin_customers')}
          onNavigateServicesAdmin={() => setCurrentPage('admin_services')}
          onNavigateStaffAdmin={() => setCurrentPage('admin_staff')}
          onNavigateSettingsAdmin={() => setCurrentPage('admin_settings')}
          onNavigateProfile={() => setCurrentPage('admin_profile')}
        />
      )}

      {currentPage === 'profile' && (
        <ProfilePage
          onNavigateHome={() => setCurrentPage('landing')}
          onNavigateBook={() => setCurrentPage('book')}
          onNavigateBookings={() => setCurrentPage('bookings')}
          onNavigateAbout={() => setCurrentPage('about')}
          onNavigateProfile={() => setCurrentPage('profile')}
          onNavigateAdmin={() => setCurrentPage('admin')}
          onNavigateLogin={() => setCurrentPage('login')}
          onNavigateRegister={() => setCurrentPage('register')}
        />
      )}

      {currentPage === 'about' && (
        <AboutUsPage
          onNavigateHome={() => setCurrentPage('landing')}
          onNavigateBook={() => setCurrentPage('book')}
          onNavigateBookings={() => setCurrentPage('bookings')}
          onNavigateAbout={() => setCurrentPage('about')}
          onNavigateProfile={() => setCurrentPage('profile')}
          onNavigateLogin={() => setCurrentPage('login')}
          onNavigateRegister={() => setCurrentPage('register')}
        />
      )}

      {currentPage === 'bookings' && (
        <MyBookingsPage
          onNavigateHome={() => setCurrentPage('landing')}
          onNavigateBook={() => setCurrentPage('book')}
          onNavigateBookings={() => setCurrentPage('bookings')}
          onNavigateAbout={() => setCurrentPage('about')}
          onNavigateProfile={() => setCurrentPage('profile')}
          onNavigateLogin={() => setCurrentPage('login')}
          onNavigateRegister={() => setCurrentPage('register')}
        />
      )}

      {currentPage === 'landing' && (
        <LandingPage
          onNavigateHome={() => setCurrentPage('landing')}
          onNavigateBook={() => setCurrentPage('book')}
          onNavigateBookings={() => setCurrentPage('bookings')}
          onNavigateAbout={() => setCurrentPage('about')}
          onNavigateProfile={() => setCurrentPage('profile')}
          onNavigateLogin={() => setCurrentPage('login')}
          onNavigateRegister={() => setCurrentPage('register')}
        />
      )}

      {currentPage === 'book' && (
        <BookingPage
          onNavigateHome={() => setCurrentPage('landing')}
          onNavigateBook={() => setCurrentPage('book')}
          onNavigateBookings={() => setCurrentPage('bookings')}
          onNavigateAbout={() => setCurrentPage('about')}
          onNavigateProfile={() => setCurrentPage('profile')}
          onNavigateLogin={() => setCurrentPage('login')}
          onNavigateRegister={() => setCurrentPage('register')}
        />
      )}

      {currentPage === 'login' && (
        <LoginPage
          onNavigateRegister={() => setCurrentPage('register')}
          onNavigateHome={() => setCurrentPage('landing')}
        />
      )}

      {currentPage === 'register' && (
        <RegisterPage
          onNavigateToLogin={() => setCurrentPage('login')}
          onNavigateHome={() => setCurrentPage('landing')}
        />
      )}
    </div>
  );
}

export default App;
