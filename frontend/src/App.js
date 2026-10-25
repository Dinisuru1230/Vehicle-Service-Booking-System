import React, { useState, useEffect, useCallback } from 'react';
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
import { useAuth } from './context/AuthContext';

const ADMIN_PAGES = [
  'admin',
  'admin_bookings',
  'admin_customers',
  'admin_services',
  'admin_staff',
  'admin_settings',
  'admin_profile',
];

const CUSTOMER_PAGES = [
  'landing',
  'home',
  'book',
  'bookings',
  'about',
  'profile',
  'login',
  'register',
];

const ALL_VALID_PAGES = [...CUSTOMER_PAGES, ...ADMIN_PAGES];

const getInitialPage = () => {
  try {
    let saved = localStorage.getItem('apexdrive_current_page');
    if (saved === 'home') saved = 'landing';

    const savedToken = localStorage.getItem('apexdrive_token');
    const savedUserStr = localStorage.getItem('apexdrive_user');
    const savedUser = savedUserStr ? JSON.parse(savedUserStr) : null;

    const isLoggedIn = Boolean(savedToken && savedUser);
    const isUserAdmin = savedUser?.role === 'admin';

    if (isLoggedIn) {
      if (saved && saved !== 'login' && saved !== 'register') {
        // If non-admin user somehow had an admin page saved, redirect to profile
        if (saved.startsWith('admin') && !isUserAdmin) {
          return 'profile';
        }
        if (ALL_VALID_PAGES.includes(saved)) {
          return saved;
        }
      }
      return isUserAdmin ? 'admin' : 'landing';
    }

    // Guest / Not logged in:
    if (saved && ALL_VALID_PAGES.includes(saved) && !PROTECTED_PAGES.includes(saved)) {
      return saved;
    }
    return 'landing';
  } catch {
    return 'landing';
  }
};

function App() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState(getInitialPage);
  const [selectedBookingService, setSelectedBookingService] = useState(() => {
    try {
      const saved = sessionStorage.getItem('apexdrive_selected_service');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Unified navigation function with localStorage persistence
  const navigateTo = useCallback((page) => {
    const targetPage = page === 'home' ? 'landing' : page;
    setCurrentPage(targetPage);
    try {
      localStorage.setItem('apexdrive_current_page', targetPage);
    } catch {
      // Storage unavailable or disabled
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleNavigateToBook = useCallback(
    (service = null) => {
      // Filter out synthetic event objects when called from uncurried event handlers
      const isEvent =
        service &&
        (service.nativeEvent ||
          service._reactName ||
          typeof service.preventDefault === 'function' ||
          typeof service.stopPropagation === 'function');
      const cleanService = isEvent ? null : service;

      setSelectedBookingService(cleanService);
      try {
        if (cleanService) {
          sessionStorage.setItem('apexdrive_selected_service', JSON.stringify(cleanService));
        } else {
          sessionStorage.removeItem('apexdrive_selected_service');
        }
      } catch {
        // Storage unavailable or disabled
      }
      navigateTo('book');
    },
    [navigateTo]
  );

  // Auth Guard: handle direct route protection and redirection
  useEffect(() => {
    if (ADMIN_PAGES.includes(currentPage)) {
      if (!isAuthenticated) {
        navigateTo('login');
      } else if (!isAdmin) {
        navigateTo('profile');
      }
    } else if (currentPage === 'profile' && !isAuthenticated) {
      navigateTo('login');
    }
  }, [currentPage, isAuthenticated, isAdmin, navigateTo]);

  // If user is authenticated and hits login or register, automatically redirect
  useEffect(() => {
    if (isAuthenticated && (currentPage === 'login' || currentPage === 'register')) {
      navigateTo(isAdmin ? 'admin' : 'landing');
    }
  }, [isAuthenticated, isAdmin, currentPage, navigateTo]);

  // Shared admin navigation helpers
  const adminNavProps = {
    onNavigateDashboard: () => navigateTo('admin'),
    onNavigateBookings: () => navigateTo('admin_bookings'),
    onNavigateBookingsAdmin: () => navigateTo('admin_bookings'),
    onNavigateCustomers: () => navigateTo('admin_customers'),
    onNavigateCustomersAdmin: () => navigateTo('admin_customers'),
    onNavigateServices: () => navigateTo('admin_services'),
    onNavigateServicesAdmin: () => navigateTo('admin_services'),
    onNavigateStaff: () => navigateTo('admin_staff'),
    onNavigateStaffAdmin: () => navigateTo('admin_staff'),
    onNavigateSettings: () => navigateTo('admin_settings'),
    onNavigateSettingsAdmin: () => navigateTo('admin_settings'),
    onNavigateProfile: () => navigateTo('admin_profile'),
    onNavigateHome: () => navigateTo('landing'),
    onNavigateBook: () => handleNavigateToBook(null),
    onSignOut: () => {
      logout();
      navigateTo('landing');
    },
  };

  // Shared customer navigation helpers
  const customerNavProps = {
    onNavigateHome: () => navigateTo('landing'),
    onNavigateBook: handleNavigateToBook,
    onNavigateBookings: () => navigateTo('bookings'),
    onNavigateAbout: () => navigateTo('about'),
    onNavigateProfile: () => navigateTo('profile'),
    onNavigateAdmin: () => navigateTo('admin'),
    onNavigateLogin: () => navigateTo('login'),
    onNavigateRegister: () => navigateTo('register'),
  };

  return (
    <div className="app-root">
      {currentPage === 'admin_customers' && <AdminCustomersPage {...adminNavProps} />}

      {currentPage === 'admin_profile' && <AdminProfilePage {...adminNavProps} />}

      {currentPage === 'admin_settings' && <AdminSettingsPage {...adminNavProps} />}

      {currentPage === 'admin_staff' && <AdminStaffPage {...adminNavProps} />}

      {currentPage === 'admin_services' && <AdminServicesPage {...adminNavProps} />}

      {currentPage === 'admin_bookings' && <AdminBookingsPage {...adminNavProps} />}

      {currentPage === 'admin' && <AdminDashboardPage {...adminNavProps} />}

      {currentPage === 'profile' && <ProfilePage {...customerNavProps} />}

      {currentPage === 'about' && <AboutUsPage {...customerNavProps} />}

      {currentPage === 'bookings' && <MyBookingsPage {...customerNavProps} />}

      {/* Render Landing Page as home or fallback if no other page matched */}
      {(currentPage === 'landing' ||
        currentPage === 'home' ||
        !ALL_VALID_PAGES.includes(currentPage)) && (
        <LandingPage {...customerNavProps} />
      )}

      {currentPage === 'book' && (
        <BookingPage
          {...customerNavProps}
          initialService={selectedBookingService}
        />
      )}

      {currentPage === 'login' && (
        <LoginPage
          onNavigateToRegister={() => navigateTo('register')}
          onNavigateRegister={() => navigateTo('register')}
          onNavigateHome={() => navigateTo('landing')}
          onNavigateDashboard={() => navigateTo('admin')}
          onNavigateProfile={() => navigateTo('profile')}
        />
      )}

      {currentPage === 'register' && (
        <RegisterPage
          onNavigateToLogin={() => navigateTo('login')}
          onNavigateHome={() => navigateTo('landing')}
          onNavigateProfile={() => navigateTo('profile')}
        />
      )}
    </div>
  );
}

export default App;
