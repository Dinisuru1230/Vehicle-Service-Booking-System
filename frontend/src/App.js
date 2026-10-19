import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import BookingPage from './pages/BookingPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AboutUsPage from './pages/AboutUsPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  const [currentPage, setCurrentPage] = useState('profile'); // Default to Profile page as requested

  return (
    <div className="app-root">
      {currentPage === 'profile' && (
        <ProfilePage
          onNavigateHome={() => setCurrentPage('landing')}
          onNavigateBook={() => setCurrentPage('book')}
          onNavigateBookings={() => setCurrentPage('bookings')}
          onNavigateAbout={() => setCurrentPage('about')}
          onNavigateProfile={() => setCurrentPage('profile')}
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
