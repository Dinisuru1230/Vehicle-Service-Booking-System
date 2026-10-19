import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  User,
  Car,
  Lock,
  Bell,
  Mail,
  Phone,
  Edit2,
  Plus,
  Check,
  ShieldCheck,
  X,
  CheckCircle2,
} from 'lucide-react';

const initialVehicles = [
  {
    id: 1,
    name: '2023 BMW M3 Competition',
    isPrimary: true,
    license: 'TX-784-KPL',
    odometer: '18,450 mi',
  },
  {
    id: 2,
    name: '2021 Porsche 911 GT3 RS',
    isPrimary: false,
    license: 'FL-992-GT',
    odometer: '6,210 mi',
  },
];

const ProfilePage = ({
  onNavigateHome,
  onNavigateBook,
  onNavigateBookings,
  onNavigateAbout,
  onNavigateProfile,
  onNavigateLogin,
  onNavigateRegister,
}) => {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'vehicles' | 'security' | 'notifications'

  // Personal details state
  const [personalInfo, setPersonalInfo] = useState({
    firstName: 'Marcus',
    lastName: 'Vance',
    email: 'marcus.vance@example.com',
    phone: '+1 (555) 019-2834',
    address: '844 Oak Valley Dr',
    city: 'Dallas',
    state: 'TX',
    zip: '75201',
  });

  // Saved vehicles state
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [vehicleModal, setVehicleModal] = useState(null); // { mode: 'add' | 'edit', data?: any }
  const [vehicleForm, setVehicleForm] = useState({
    name: '',
    license: '',
    odometer: '',
    isPrimary: false,
  });

  // Account & Security state
  const [currentPassword, setCurrentPassword] = useState('••••••••••');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);

  // Notification preferences state
  const [notifications, setNotifications] = useState({
    smsReminders: true,
    emailStatus: true,
    promotions: false,
  });

  // Feedback banner toast state
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handlePersonalSubmit = (e) => {
    e.preventDefault();
    showToast('Personal and contact details updated successfully!');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    }
    showToast('Password and security preferences updated successfully!');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleNotificationsSubmit = () => {
    showToast('Notification preferences saved successfully!');
  };

  const handleSaveVehicle = (e) => {
    e.preventDefault();
    if (vehicleModal?.mode === 'add') {
      const newV = {
        id: Date.now(),
        name: vehicleForm.name || 'New Vehicle',
        license: vehicleForm.license || 'N/A',
        odometer: vehicleForm.odometer || '0 mi',
        isPrimary: vehicles.length === 0,
      };
      setVehicles([...vehicles, newV]);
      showToast('New vehicle added to your garage!');
    } else if (vehicleModal?.mode === 'edit') {
      setVehicles(
        vehicles.map((v) =>
          v.id === vehicleModal.data.id ? { ...v, ...vehicleForm } : v
        )
      );
      showToast('Vehicle details updated!');
    }
    setVehicleModal(null);
    setVehicleForm({ name: '', license: '', odometer: '', isPrimary: false });
  };

  const handleRemoveVehicle = (id) => {
    if (window.confirm('Are you sure you want to remove this vehicle?')) {
      setVehicles(vehicles.filter((v) => v.id !== id));
      showToast('Vehicle removed from your garage.');
    }
  };

  return (
    <div className="profile-page-root">
      {/* 1. Global Navbar */}
      <Navbar
        activeTab="profile"
        onNavigateHome={onNavigateHome}
        onNavigateBook={onNavigateBook}
        onNavigateBookings={onNavigateBookings}
        onNavigateAbout={onNavigateAbout}
        onNavigateProfile={onNavigateProfile}
        onNavigateLogin={onNavigateLogin}
        onNavigateRegister={onNavigateRegister}
      />

      <main className="profile-main-container">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="profile-toast-alert">
            <CheckCircle2 size={18} className="toast-icon" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 2. Page Title Block */}
        <div className="profile-page-header">
          <h1 className="profile-page-title">Account &amp; Garage Profile</h1>
          <p className="profile-page-subtitle">
            Manage your personal details, connected vehicles, login security, and notifications.
          </p>
        </div>

        {/* 3. Top Profile Header Banner Card */}
        <div className="profile-banner-card">
          <div className="banner-left-info">
            <div className="profile-avatar-circle">
              <span>MV</span>
            </div>

            <div className="profile-identity-block">
              <div className="name-badge-row">
                <h2 className="profile-user-name">Marcus Vance</h2>
                <span className="member-tier-pill">Gold Member</span>
              </div>

              <div className="profile-contacts-row">
                <div className="contact-item">
                  <Mail size={15} className="contact-icon" />
                  <span>{personalInfo.email}</span>
                </div>
                <div className="contact-item">
                  <Phone size={15} className="contact-icon" />
                  <span>{personalInfo.phone}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className="btn-edit-profile"
          >
            <Edit2 size={15} />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* 4. Main Two-Column Layout (Sidebar + Panel) */}
        <div className="profile-layout-grid">
          {/* Left Sidebar Navigation Menu */}
          <aside className="profile-sidebar-nav">
            <button
              type="button"
              onClick={() => setActiveTab('personal')}
              className={`sidebar-nav-item ${activeTab === 'personal' ? 'active' : ''}`}
            >
              <User size={18} />
              <span>Personal Details</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('vehicles')}
              className={`sidebar-nav-item ${activeTab === 'vehicles' ? 'active' : ''}`}
            >
              <Car size={18} />
              <span>Saved Vehicles</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className={`sidebar-nav-item ${activeTab === 'security' ? 'active' : ''}`}
            >
              <Lock size={18} />
              <span>Account &amp; Security</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('notifications')}
              className={`sidebar-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
            >
              <Bell size={18} />
              <span>Notifications</span>
            </button>
          </aside>

          {/* Right Main Content Card Area */}
          <div className="profile-content-card">
            {/* ========================================================
                TAB 1: Personal & Contact Details (Image 1)
                ======================================================== */}
            {activeTab === 'personal' && (
              <form onSubmit={handlePersonalSubmit} className="tab-pane-container">
                <div className="tab-pane-header">
                  <h3 className="tab-pane-title">Personal &amp; Contact Details</h3>
                  <p className="tab-pane-subtitle">
                    Update your personal contact coordinates and pickup location.
                  </p>
                </div>

                <div className="profile-form-grid">
                  {/* First & Last Name */}
                  <div className="form-field-group">
                    <label className="field-label">First Name</label>
                    <input
                      type="text"
                      value={personalInfo.firstName}
                      onChange={(e) =>
                        setPersonalInfo({ ...personalInfo, firstName: e.target.value })
                      }
                      className="profile-input"
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="field-label">Last Name</label>
                    <input
                      type="text"
                      value={personalInfo.lastName}
                      onChange={(e) =>
                        setPersonalInfo({ ...personalInfo, lastName: e.target.value })
                      }
                      className="profile-input"
                    />
                  </div>

                  {/* Email & Phone */}
                  <div className="form-field-group">
                    <label className="field-label">Email Address</label>
                    <input
                      type="email"
                      value={personalInfo.email}
                      onChange={(e) =>
                        setPersonalInfo({ ...personalInfo, email: e.target.value })
                      }
                      className="profile-input"
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="field-label">Phone Number</label>
                    <input
                      type="tel"
                      value={personalInfo.phone}
                      onChange={(e) =>
                        setPersonalInfo({ ...personalInfo, phone: e.target.value })
                      }
                      className="profile-input"
                    />
                  </div>
                </div>

                {/* Subheading: Home & Pick-up Address */}
                <div className="address-section-header">
                  <h4 className="address-title">Home &amp; Pick-up Address</h4>
                </div>

                <div className="address-form-grid">
                  <div className="form-field-group street-col">
                    <label className="field-label">Street Address</label>
                    <input
                      type="text"
                      value={personalInfo.address}
                      onChange={(e) =>
                        setPersonalInfo({ ...personalInfo, address: e.target.value })
                      }
                      className="profile-input"
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="field-label">City</label>
                    <input
                      type="text"
                      value={personalInfo.city}
                      onChange={(e) =>
                        setPersonalInfo({ ...personalInfo, city: e.target.value })
                      }
                      className="profile-input"
                    />
                  </div>

                  <div className="form-field-group state-col">
                    <label className="field-label">State</label>
                    <input
                      type="text"
                      value={personalInfo.state}
                      onChange={(e) =>
                        setPersonalInfo({ ...personalInfo, state: e.target.value })
                      }
                      className="profile-input"
                    />
                  </div>

                  <div className="form-field-group zip-col">
                    <label className="field-label">Postal Code</label>
                    <input
                      type="text"
                      value={personalInfo.zip}
                      onChange={(e) =>
                        setPersonalInfo({ ...personalInfo, zip: e.target.value })
                      }
                      className="profile-input"
                    />
                  </div>
                </div>

                {/* Actions Row */}
                <div className="tab-pane-footer-actions">
                  <button
                    type="button"
                    onClick={() => {
                      setPersonalInfo({
                        firstName: 'Marcus',
                        lastName: 'Vance',
                        email: 'marcus.vance@example.com',
                        phone: '+1 (555) 019-2834',
                        address: '844 Oak Valley Dr',
                        city: 'Dallas',
                        state: 'TX',
                        zip: '75201',
                      });
                      showToast('Changes discarded.');
                    }}
                    className="btn-form-cancel"
                  >
                    Cancel
                  </button>

                  <button type="submit" className="btn-form-save">
                    Save Changes
                  </button>
                </div>
              </form>
            )}

            {/* ========================================================
                TAB 2: Saved Vehicles (Image 2)
                ======================================================== */}
            {activeTab === 'vehicles' && (
              <div className="tab-pane-container">
                <div className="tab-pane-header-with-action">
                  <div>
                    <h3 className="tab-pane-title">Saved Vehicles</h3>
                    <p className="tab-pane-subtitle">
                      Manage your vehicles for rapid booking and service history.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setVehicleForm({
                        name: '',
                        license: '',
                        odometer: '',
                        isPrimary: false,
                      });
                      setVehicleModal({ mode: 'add' });
                    }}
                    className="btn-add-vehicle"
                  >
                    <Plus size={16} />
                    <span>Add Vehicle</span>
                  </button>
                </div>

                <div className="saved-vehicles-list">
                  {vehicles.map((v) => (
                    <div key={v.id} className="vehicle-card-row">
                      <div className="vehicle-icon-square">
                        <Car
                          size={20}
                          className={v.isPrimary ? 'text-blue' : 'text-slate'}
                        />
                      </div>

                      <div className="vehicle-info-block">
                        <div className="vehicle-name-line">
                          <h4 className="vehicle-name">{v.name}</h4>
                          {v.isPrimary && (
                            <span className="badge-primary-vehicle">PRIMARY</span>
                          )}
                        </div>

                        <div className="vehicle-meta-line">
                          <span>
                            License: <strong>{v.license}</strong>
                          </span>
                          <span className="dot-divider">•</span>
                          <span>
                            Odometer: <strong>{v.odometer}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="vehicle-actions-cluster">
                        <button
                          type="button"
                          onClick={onNavigateBook}
                          className={
                            v.isPrimary
                              ? 'btn-vehicle-book-blue'
                              : 'btn-vehicle-book-light'
                          }
                        >
                          Book Service
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setVehicleForm({
                              name: v.name,
                              license: v.license,
                              odometer: v.odometer,
                              isPrimary: v.isPrimary,
                            });
                            setVehicleModal({ mode: 'edit', data: v });
                          }}
                          className="btn-vehicle-edit"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveVehicle(v.id)}
                          className="btn-vehicle-remove"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================
                TAB 3: Account & Security (Image 3)
                ======================================================== */}
            {activeTab === 'security' && (
              <form onSubmit={handlePasswordSubmit} className="tab-pane-container">
                <div className="tab-pane-header">
                  <h3 className="tab-pane-title">Account &amp; Security</h3>
                  <p className="tab-pane-subtitle">
                    Manage your account password and multi-factor authentication.
                  </p>
                </div>

                {/* Password Fields Row (3 cols) */}
                <div className="password-fields-grid">
                  <div className="form-field-group">
                    <label className="field-label">Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="profile-input"
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="field-label">New Password</label>
                    <input
                      type="password"
                      placeholder="At least 8 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="profile-input"
                    />
                  </div>

                  <div className="form-field-group">
                    <label className="field-label">Confirm Password</label>
                    <input
                      type="password"
                      placeholder="Repeat new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="profile-input"
                    />
                  </div>
                </div>

                {/* 2FA Box */}
                <div className="two-factor-auth-box">
                  <div className="two-factor-text-block">
                    <div className="two-factor-title-line">
                      <span className="two-factor-title">
                        Two-Factor Authentication
                      </span>
                      <span
                        className={`two-factor-badge ${
                          is2FAEnabled ? 'enabled' : 'disabled'
                        }`}
                      >
                        {is2FAEnabled ? 'ENABLED' : 'DISABLED'}
                      </span>
                    </div>
                    <p className="two-factor-subtitle">
                      Secure your login with SMS codes or an authenticator app.
                    </p>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                    className={`toggle-switch-btn ${is2FAEnabled ? 'on' : 'off'}`}
                    title="Toggle Two-Factor Authentication"
                  >
                    <span className="toggle-switch-slider"></span>
                  </button>
                </div>

                {/* Bottom Action */}
                <div className="tab-pane-footer-actions">
                  <button type="submit" className="btn-form-save">
                    Update Password
                  </button>
                </div>
              </form>
            )}

            {/* ========================================================
                TAB 4: Notifications (Image 4)
                ======================================================== */}
            {activeTab === 'notifications' && (
              <div className="tab-pane-container">
                <div className="tab-pane-header">
                  <h3 className="tab-pane-title">Notification Preferences</h3>
                  <p className="tab-pane-subtitle">
                    Select how and when you want to receive service notifications.
                  </p>
                </div>

                <div className="notifications-list-group">
                  {/* Notification Item 1: SMS */}
                  <div
                    className="notification-pref-card"
                    onClick={() =>
                      setNotifications({
                        ...notifications,
                        smsReminders: !notifications.smsReminders,
                      })
                    }
                  >
                    <div
                      className={`custom-checkbox ${
                        notifications.smsReminders ? 'checked' : ''
                      }`}
                    >
                      {notifications.smsReminders && <Check size={14} />}
                    </div>

                    <div className="pref-text-block">
                      <h4 className="pref-title">Appointment Reminders via SMS</h4>
                      <p className="pref-desc">
                        Get helpful text alerts 24 hours and 2 hours before scheduled appointments.
                      </p>
                    </div>
                  </div>

                  {/* Notification Item 2: Email */}
                  <div
                    className="notification-pref-card"
                    onClick={() =>
                      setNotifications({
                        ...notifications,
                        emailStatus: !notifications.emailStatus,
                      })
                    }
                  >
                    <div
                      className={`custom-checkbox ${
                        notifications.emailStatus ? 'checked' : ''
                      }`}
                    >
                      {notifications.emailStatus && <Check size={14} />}
                    </div>

                    <div className="pref-text-block">
                      <h4 className="pref-title">Service Status Updates via Email</h4>
                      <p className="pref-desc">
                        Receive clear email updates when your vehicle check-in begins and when it is ready for pickup.
                      </p>
                    </div>
                  </div>

                  {/* Notification Item 3: Promo */}
                  <div
                    className="notification-pref-card"
                    onClick={() =>
                      setNotifications({
                        ...notifications,
                        promotions: !notifications.promotions,
                      })
                    }
                  >
                    <div
                      className={`custom-checkbox ${
                        notifications.promotions ? 'checked' : ''
                      }`}
                    >
                      {notifications.promotions && <Check size={14} />}
                    </div>

                    <div className="pref-text-block">
                      <h4 className="pref-title">
                        Promotions &amp; Seasonal Service Discounts
                      </h4>
                      <p className="pref-desc">
                        Occasional updates on seasonal tire changes, winter inspections, and special member pricing.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="tab-pane-footer-actions">
                  <button
                    type="button"
                    onClick={handleNotificationsSubmit}
                    className="btn-form-save"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Vehicle Add / Edit Modal */}
      {vehicleModal && (
        <div className="modal-backdrop" onClick={() => setVehicleModal(null)}>
          <div
            className="modal-content vehicle-form-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-line">
              <h3 className="modal-title">
                {vehicleModal.mode === 'add' ? 'Add New Vehicle' : 'Edit Vehicle'}
              </h3>
              <button
                type="button"
                onClick={() => setVehicleModal(null)}
                className="btn-close-modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveVehicle} className="modal-body-pad">
              <div className="form-field-group mb-3">
                <label className="field-label">Year, Make &amp; Model</label>
                <input
                  type="text"
                  placeholder="e.g. 2023 BMW M3 Competition"
                  value={vehicleForm.name}
                  onChange={(e) =>
                    setVehicleForm({ ...vehicleForm, name: e.target.value })
                  }
                  required
                  className="profile-input"
                />
              </div>

              <div className="form-field-group mb-3">
                <label className="field-label">License Plate / Tag</label>
                <input
                  type="text"
                  placeholder="e.g. TX-784-KPL"
                  value={vehicleForm.license}
                  onChange={(e) =>
                    setVehicleForm({ ...vehicleForm, license: e.target.value })
                  }
                  required
                  className="profile-input"
                />
              </div>

              <div className="form-field-group mb-4">
                <label className="field-label">Current Odometer (Mileage)</label>
                <input
                  type="text"
                  placeholder="e.g. 18,450 mi"
                  value={vehicleForm.odometer}
                  onChange={(e) =>
                    setVehicleForm({ ...vehicleForm, odometer: e.target.value })
                  }
                  required
                  className="profile-input"
                />
              </div>

              <div className="modal-actions-bar">
                <button
                  type="button"
                  onClick={() => setVehicleModal(null)}
                  className="btn-form-cancel"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-form-save">
                  {vehicleModal.mode === 'add' ? 'Add to Garage' : 'Save Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
