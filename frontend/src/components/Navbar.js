import React from 'react';
import { Car, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({
  activeTab = 'book',
  onNavigateHome,
  onNavigateBook,
  onNavigateBookings,
  onNavigateAbout,
  onNavigateProfile,
  onNavigateAdmin,
  onNavigateLogin,
  onNavigateRegister,
}) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  const getInitials = (u) => {
    if (!u) return 'U';
    if (u.firstName && u.lastName) return `${u.firstName[0]}${u.lastName[0]}`.toUpperCase();
    if (u.name) {
      const parts = u.name.trim().split(' ');
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return parts[0].slice(0, 2).toUpperCase();
    }
    if (u.email) return u.email.slice(0, 2).toUpperCase();
    return 'AD';
  };

  const displayName =
    user?.name ||
    `${user?.firstName || ''} ${user?.lastName || ''}`.trim() ||
    (user?.email ? user.email.split('@')[0] : 'User');

  const handleSignOut = () => {
    logout();
    if (onNavigateHome) onNavigateHome();
  };

  const handleProfileClick = () => {
    if (isAdmin && onNavigateAdmin) {
      onNavigateAdmin();
    } else if (onNavigateProfile) {
      onNavigateProfile();
    } else if (onNavigateLogin) {
      onNavigateLogin();
    }
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        {/* Brand Lockup */}
        <div
          className="header-brand"
          onClick={onNavigateHome}
          style={{ cursor: 'pointer' }}
        >
          <div className="brand-icon-box">
            <Car size={20} className="brand-car-icon" />
          </div>
          <span className="brand-title">ApexDrive</span>
        </div>

        {/* Navigation Links */}
        <nav className="header-nav">
          <button
            type="button"
            onClick={onNavigateHome}
            className={`nav-item nav-btn ${activeTab === 'home' ? 'active' : ''}`}
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => onNavigateBook && onNavigateBook()}
            className={`nav-item nav-btn ${activeTab === 'book' ? 'active' : ''}`}
          >
            Book Service
          </button>
          <button
            type="button"
            onClick={onNavigateBookings}
            className={`nav-item nav-btn ${activeTab === 'bookings' ? 'active' : ''}`}
          >
            My Bookings
          </button>
          <button
            type="button"
            onClick={onNavigateAbout}
            className={`nav-item nav-btn ${activeTab === 'about' ? 'active' : ''}`}
          >
            About Us
          </button>

          {isAdmin && onNavigateAdmin && (
            <button
              type="button"
              onClick={onNavigateAdmin}
              className="nav-item nav-btn"
              style={{
                color: 'var(--primary-blue)',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: '#eff6ff',
                borderRadius: '6px',
              }}
            >
              <Shield size={14} />
              <span>Admin Console</span>
            </button>
          )}
        </nav>

        {/* Right Section: Profile & Authentication */}
        <div className="header-right">

          {isAuthenticated && user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                className="header-profile"
                onClick={handleProfileClick}
                title={isAdmin ? 'Switch to Admin Console' : 'View Account & Garage Profile'}
              >
                <div className="avatar-circle">
                  <span>{getInitials(user)}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                  <span className="profile-name">{displayName}</span>
                  {isAdmin && (
                    <span
                      style={{
                        fontSize: '0.68rem',
                        color: 'var(--primary-blue)',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      Admin
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleSignOut}
                className="nav-btn"
                style={{
                  background: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  borderRadius: '7px',
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: '#64748b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'all 0.18s ease',
                }}
                title="Sign Out of ApexDrive"
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#fee2e2';
                  e.currentTarget.style.color = '#ef4444';
                  e.currentTarget.style.borderColor = '#fecaca';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f1f5f9';
                  e.currentTarget.style.color = '#64748b';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }}
              >
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={onNavigateLogin}
                className="nav-btn"
                style={{
                  padding: '0.42rem 0.9rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontWeight: 600,
                  fontSize: '0.86rem',
                  color: '#334155',
                  cursor: 'pointer',
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={onNavigateRegister}
                className="nav-btn"
                style={{
                  padding: '0.42rem 0.95rem',
                  borderRadius: '8px',
                  background: 'var(--primary-blue)',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
                }}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
