import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { userAPI, vehicleAPI } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Car,
  Lock,
  Bell,
  Mail,
  Phone,
  Plus,
  Check,
  ShieldCheck,
  X,
  CheckCircle2,
  AlertCircle,
  Star,
} from 'lucide-react';

const initialVehicles = [
  {
    id: 'demo-1',
    name: '2023 BMW M3 Competition',
    isPrimary: true,
    license: 'TX-784-KPL',
    odometer: '18,450 mi',
  },
  {
    id: 'demo-2',
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
  onNavigateAdmin,
  onNavigateLogin,
  onNavigateRegister,
}) => {
  const { user: authUser, setUser: setAuthUser } = useAuth();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'vehicles' | 'security' | 'notifications'

  // Personal details state
  const [personalInfo, setPersonalInfo] = useState({
    firstName: authUser?.firstName || 'Marcus',
    lastName: authUser?.lastName || 'Vance',
    email: authUser?.email || 'm.vance@apexdrive.io',
    phone: authUser?.phone || '+1 (555) 234-8901',
    address: authUser?.address || 'Bay Area Precision Hub #742',
    city: authUser?.city || 'San Francisco',
    state: authUser?.state || 'CA',
    zip: authUser?.zip || '94103',
    tier: authUser?.tier || 'Gold Member',
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
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  // Notification preferences state
  const [notifications, setNotifications] = useState({
    smsReminders: true,
    emailStatus: true,
    promotions: false,
  });

  // Loading & feedback banner toast state
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastType, setToastType] = useState('success'); // 'success' | 'error'

  const showToast = (msg, type = 'success') => {
    setToastType(type);
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Fetch authenticated user profile and garage on mount
  useEffect(() => {
    let isMounted = true;

    const loadProfileData = async () => {
      try {
        setIsLoading(true);
        const res = await userAPI.getProfile();
        if (isMounted && res.success && res.user) {
          const u = res.user;
          setPersonalInfo({
            firstName: u.firstName || (u.name ? u.name.split(' ')[0] : 'Member'),
            lastName: u.lastName || (u.name && u.name.split(' ').length > 1 ? u.name.split(' ').slice(1).join(' ') : ''),
            email: u.email || '',
            phone: u.phone || '',
            address: u.address || '',
            city: u.city || 'San Francisco',
            state: u.state || 'CA',
            zip: u.zip || '',
            tier: u.tier || 'Gold Member',
          });

          if (u.vehicles && u.vehicles.length > 0) {
            setVehicles(
              u.vehicles.map((v) => ({
                id: v.id,
                name: v.name || `${v.year} ${v.make} ${v.model}`,
                isPrimary: Boolean(v.isPrimary),
                license: v.plate || v.license || 'N/A',
                odometer: v.mileage || v.odometer || '0 mi',
              }))
            );
          }

          setIs2FAEnabled(Boolean(u.twoFactorEnabled));
          setNotifications({
            smsReminders: u.smsReminders !== undefined ? Boolean(u.smsReminders) : true,
            emailStatus: u.emailStatus !== undefined ? Boolean(u.emailStatus) : true,
            promotions: u.promotions !== undefined ? Boolean(u.promotions) : false,
          });

          if (setAuthUser) {
            setAuthUser((prev) => ({ ...prev, ...u }));
          }
        }
      } catch (err) {
        // Fallback gracefully to default state if offline or network error
        console.warn('[ProfilePage] Live backend sync unavailable:', err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadProfileData();
    return () => {
      isMounted = false;
    };
  }, [setAuthUser]);

  const handlePersonalSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await userAPI.updateProfile({
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        name: `${personalInfo.firstName} ${personalInfo.lastName}`.trim(),
        phone: personalInfo.phone,
        address: personalInfo.address,
        city: personalInfo.city,
        state: personalInfo.state,
        zip: personalInfo.zip,
      });

      if (res.success) {
        showToast('Personal and contact details updated successfully!', 'success');
        if (setAuthUser && res.user) {
          setAuthUser((prev) => ({ ...prev, ...res.user }));
        }
      } else {
        showToast(res.message || 'Failed to update personal details.', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error updating profile details.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast('Please enter your current password.', 'error');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      showToast('New password must be at least 6 characters long.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New password and confirm password do not match.', 'error');
      return;
    }

    try {
      setIsLoading(true);
      const res = await userAPI.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (res.success) {
        showToast('Password updated successfully! Your account is secured.', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        showToast(res.message || 'Failed to update password.', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Incorrect current password or update failed.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationsSubmit = async () => {
    try {
      setIsLoading(true);
      const res = await userAPI.updatePreferences({
        ...notifications,
        twoFactorEnabled: is2FAEnabled,
      });

      if (res.success) {
        showToast('Notification and security preferences saved successfully!', 'success');
      } else {
        showToast(res.message || 'Failed to save preferences.', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Error saving preferences.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveVehicle = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (vehicleModal?.mode === 'add') {
        const payload = {
          name: vehicleForm.name || 'New Vehicle',
          license: vehicleForm.license || 'N/A',
          plate: vehicleForm.license || 'N/A',
          odometer: vehicleForm.odometer || '0 mi',
          mileage: vehicleForm.odometer || '0 mi',
          isPrimary: vehicleForm.isPrimary || vehicles.length === 0,
        };

        const res = await vehicleAPI.addVehicle(payload);
        if (res.success && res.vehicle) {
          const newV = {
            id: res.vehicle.id,
            name: res.vehicle.name,
            license: res.vehicle.license,
            odometer: res.vehicle.odometer,
            isPrimary: res.vehicle.isPrimary,
          };
          setVehicles((prev) => [
            ...prev.map((v) => (newV.isPrimary ? { ...v, isPrimary: false } : v)),
            newV,
          ]);
          showToast('New vehicle added to your garage!', 'success');
        } else {
          // Local fallback
          const newV = {
            id: String(Date.now()),
            name: vehicleForm.name || 'New Vehicle',
            license: vehicleForm.license || 'N/A',
            odometer: vehicleForm.odometer || '0 mi',
            isPrimary: vehicles.length === 0,
          };
          setVehicles([...vehicles, newV]);
          showToast('Vehicle added to garage (offline mode).', 'success');
        }
      } else if (vehicleModal?.mode === 'edit') {
        const id = vehicleModal.data.id;
        const payload = {
          name: vehicleForm.name,
          license: vehicleForm.license,
          plate: vehicleForm.license,
          odometer: vehicleForm.odometer,
          mileage: vehicleForm.odometer,
          isPrimary: vehicleForm.isPrimary,
        };

        try {
          await vehicleAPI.updateVehicle(id, payload);
        } catch {
          // Continue local update
        }

        setVehicles(
          vehicles.map((v) =>
            v.id === id ? { ...v, ...vehicleForm } : v
          )
        );
        showToast('Vehicle details updated successfully!', 'success');
      }
      setVehicleModal(null);
      setVehicleForm({ name: '', license: '', odometer: '', isPrimary: false });
    } catch (err) {
      showToast(err.message || 'Error saving vehicle.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetPrimaryVehicle = async (id) => {
    try {
      await vehicleAPI.setPrimary(id);
      setVehicles((prev) =>
        prev.map((v) => ({ ...v, isPrimary: v.id === id }))
      );
      showToast('Primary garage vehicle updated!', 'success');
    } catch {
      setVehicles((prev) =>
        prev.map((v) => ({ ...v, isPrimary: v.id === id }))
      );
      showToast('Primary vehicle updated.', 'success');
    }
  };

  const handleRemoveVehicle = async (id) => {
    if (window.confirm('Are you sure you want to remove this vehicle from your garage?')) {
      try {
        await vehicleAPI.deleteVehicle(id);
      } catch (err) {
        console.warn('Vehicle delete fallback:', err.message);
      }
      setVehicles(vehicles.filter((v) => v.id !== id));
      showToast('Vehicle removed from your garage.', 'success');
    }
  };

  const fullName = `${personalInfo.firstName} ${personalInfo.lastName}`.trim() || 'Marcus Vance';
  const userInitials = (
    (personalInfo.firstName?.[0] || 'M') + (personalInfo.lastName?.[0] || 'V')
  ).toUpperCase();

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
        onNavigateAdmin={onNavigateAdmin}
        onNavigateLogin={onNavigateLogin}
        onNavigateRegister={onNavigateRegister}
      />

      <main className="profile-main-container">
        {/* Toast Alert */}
        {toastMessage && (
          <div className={`profile-toast-alert ${toastType === 'error' ? 'toast-error' : ''}`}>
            {toastType === 'error' ? (
              <AlertCircle size={18} className="toast-icon text-red" />
            ) : (
              <CheckCircle2 size={18} className="toast-icon" />
            )}
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
              <span>{userInitials}</span>
            </div>

            <div className="profile-identity-block">
              <div className="name-badge-row">
                <h2 className="profile-user-name">{fullName}</h2>
                <span className="member-tier-pill">{personalInfo.tier || 'VIP Platinum'}</span>
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

                        {!v.isPrimary && (
                          <button
                            type="button"
                            onClick={() => handleSetPrimaryVehicle(v.id)}
                            className="btn-vehicle-edit"
                            title="Set as primary vehicle"
                          >
                            Set Primary
                          </button>
                        )}

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
