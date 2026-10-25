import React, { useState } from 'react';
import {
  Gauge,
  Radio,
  CheckCircle2,
  User,
  Mail,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  Headphones,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RegisterPage = ({ onNavigateToLogin, onNavigateHome, onNavigateProfile }) => {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [subscribeAlerts, setSubscribeAlerts] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'success' | 'error', text: '' }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!agreeTerms) {
      setStatusMessage({
        type: 'error',
        text: 'Please agree to the Terms of Service, Privacy Policy, and digital Vehicle Custody Authorization.',
      });
      return;
    }

    if (password !== confirmPassword) {
      setStatusMessage({
        type: 'error',
        text: 'Master Password and Confirm Password do not match.',
      });
      return;
    }

    if (password.length < 6) {
      setStatusMessage({
        type: 'error',
        text: 'Master Password must be at least 6 characters long.',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await register({
        fullName,
        email,
        password,
        phoneNumber,
      });

      setIsLoading(false);
      setStatusMessage({
        type: 'success',
        text: 'Customer account provisioned successfully! Initializing your garage...',
      });

      setTimeout(() => {
        if (onNavigateHome) {
          onNavigateHome();
        } else if (onNavigateProfile) {
          onNavigateProfile();
        } else if (onNavigateToLogin) {
          onNavigateToLogin();
        }
      }, 700);
    } catch (err) {
      setIsLoading(false);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Registration failed. Please check your information and try again.',
      });
    }
  };

  return (
    <div className="login-screen-wrapper">
      <div className="login-card-container register-card-container">
        {/* ================= LEFT HERO PANEL ================= */}
        <div className="hero-telemetry-panel">
          <div className="hero-bg-overlay"></div>

          {/* Top Bar: Brand & Live Bay Status */}
          <div className="hero-header-bar">
            <div
              className="brand-lockup"
              onClick={onNavigateHome}
              style={{ cursor: onNavigateHome ? 'pointer' : 'default' }}
              title="Return to Landing Page"
            >
              <div className="brand-logo-glass">
                <Gauge size={22} className="brand-gauge-icon" />
              </div>
              <div className="brand-text-group">
                <span className="brand-main-name">ApexDrive</span>
                <span className="brand-hub-sub">SERVICE HUB PORTAL</span>
              </div>
            </div>

            <div className="live-bay-badge">
              <span className="live-pulse-dot"></span>
              <span className="live-bay-text">BAY 03 LIVE</span>
            </div>
          </div>

          {/* Center Message */}
          <div className="hero-center-content">
            <div className="telemetry-pill-tag">
              <Radio size={13} className="telemetry-icon" />
              <span>LIVE TELEMETRY &amp; DIAGNOSTICS</span>
            </div>

            <h1 className="hero-headline">
              Precision care for your high-performance fleet.
            </h1>

            <p className="hero-subtext">
              Join certified master technician live feeds, encrypted diagnostic telemetry, and proactive maintenance dispatch.
            </p>
          </div>

          {/* Bottom HUD: Live Diagnostics Node Card */}
          <div className="telemetry-hud-card">
            <div className="hud-card-top">
              <div className="diag-node-info">
                <CheckCircle2 size={15} className="node-check-icon" />
                <span className="node-id-text">DIAG_NODE: #APX-982</span>
              </div>
              <span className="calibrated-badge">CALIBRATED</span>
            </div>

            <div className="hud-metrics-row">
              <div className="metric-tile">
                <span className="metric-label">FLUID INDEX</span>
                <span className="metric-value">99.4%</span>
              </div>

              <div className="metric-tile">
                <span className="metric-label">ECU STATUS</span>
                <span className="metric-value status-optimal">OPTIMAL</span>
              </div>

              <div className="metric-tile">
                <span className="metric-label">BRAKE WEAR</span>
                <span className="metric-value">12%</span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT FORM PANEL ================= */}
        <div className="login-form-panel register-form-panel">
          {/* Top Header Row */}
          <div className="form-header-row">
            <span className="terminal-auth-tag">SECURE ONBOARDING PORTAL</span>
            <span className="sso-enabled-badge">Step 1 of 2: Profile Link</span>
          </div>

          <h2 className="login-title">Create Your Customer Account</h2>
          <p className="login-desc">
            Manage your vehicles, track ongoing services, and unlock loyalty rewards with telemetry-backed precision.
          </p>

          {statusMessage && (
            <div
              className={`login-alert-${statusMessage.type === 'success' ? 'success' : 'error'}`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 size={16} />
              ) : (
                <ShieldCheck size={16} />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form-fields register-fields">
            {/* Row 1: Full Name & Phone Number */}
            <div className="two-col-grid">
              {/* Full Name */}
              <div className="form-input-group">
                <label htmlFor="fullNameInput" className="input-label">
                  Full Name <span className="req-asterisk">*</span>
                </label>
                <div className="input-field-wrapper">
                  <User size={18} className="field-icon-left" />
                  <input
                    id="fullNameInput"
                    type="text"
                    required
                    placeholder="Marcus Vance"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="custom-text-input"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="form-input-group">
                <div className="input-label-row">
                  <label htmlFor="phoneInput" className="input-label">
                    Phone Number <span className="req-asterisk">*</span>
                  </label>
                  <span className="sms-updates-tag">SMS Updates</span>
                </div>
                <div className="phone-input-combo">
                  <div className="phone-country-pill">
                    <span>+1 (US)</span>
                  </div>
                  <div className="input-field-wrapper flex-1">
                    <input
                      id="phoneInput"
                      type="tel"
                      required
                      placeholder="(555) 019-2834"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="custom-text-input no-left-icon"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Email Address or Username */}
            <div className="form-input-group">
              <div className="input-label-row">
                <label htmlFor="regEmailInput" className="input-label">
                  Email Address or Username <span className="req-asterisk">*</span>
                </label>
                <span className="input-hint">ApexID or Corporate SSO</span>
              </div>
              <div className="input-field-wrapper">
                <Mail size={18} className="field-icon-left" />
                <input
                  id="regEmailInput"
                  type="email"
                  required
                  placeholder="marcus.v@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="custom-text-input"
                />
              </div>
            </div>

            {/* Row 3: Master Password & Confirm Password */}
            <div className="two-col-grid">
              {/* Master Password */}
              <div className="form-input-group">
                <label htmlFor="regPasswordInput" className="input-label">
                  Master Password <span className="req-asterisk">*</span>
                </label>
                <div className="input-field-wrapper">
                  <Lock size={18} className="field-icon-left" />
                  <input
                    id="regPasswordInput"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="custom-text-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="toggle-password-btn"
                    title={showPassword ? 'Hide password' : 'Show password'}
                    aria-label="Toggle master password visibility"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="form-input-group">
                <label htmlFor="confirmPasswordInput" className="input-label">
                  Confirm Password <span className="req-asterisk">*</span>
                </label>
                <div className="input-field-wrapper">
                  <ShieldCheck size={18} className="field-icon-left" />
                  <input
                    id="confirmPasswordInput"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="custom-text-input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="toggle-password-btn"
                    title={showConfirmPassword ? 'Hide password' : 'Show password'}
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Row 4: Agreement Checkboxes */}
            <div className="checkboxes-stack">
              {/* Terms Checkbox */}
              <label className="custom-legal-checkbox">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <span className="checkbox-custom"></span>
                <span className="legal-label-text">
                  I agree to the <a href="#terms">Terms of Service</a>,{' '}
                  <a href="#privacy">Privacy Policy</a>, and digital{' '}
                  <a href="#custody">Vehicle Custody Authorization</a>.
                </span>
              </label>

              {/* Marketing / Telemetry Alerts Checkbox */}
              <label className="custom-legal-checkbox">
                <input
                  type="checkbox"
                  checked={subscribeAlerts}
                  onChange={(e) => setSubscribeAlerts(e.target.checked)}
                />
                <span className="checkbox-custom"></span>
                <span className="legal-label-text">
                  Send telemetry-backed service interval alerts, predictive wear updates, and seasonal discounts.
                </span>
              </label>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-sign-in-primary btn-create-account"
            >
              <span>{isLoading ? 'Provisioning Account...' : 'Create Account & Access Garage'}</span>
              <ArrowRight size={18} className="btn-arrow-icon" />
            </button>
          </form>

          {/* Social Divider */}
          <div className="social-divider">
            <span className="divider-line"></span>
            <span className="divider-text">OR SIGN IN WITH</span>
            <span className="divider-line"></span>
          </div>

          {/* Social Buttons */}
          <div className="social-buttons-grid">
            <button type="button" className="social-btn google-btn">
              <svg className="social-svg-icon" viewBox="0 0 24 24" width="18" height="18">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google</span>
            </button>

            <button type="button" className="social-btn apple-btn">
              <svg className="social-svg-icon" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.77 1.06-1.84.94-2.91-.91.04-2.02.61-2.67 1.38-.58.67-1.09 1.76-.95 2.8.01 0 .03 0 .04 0 1.02 0 2.01-.5 2.64-1.27z" />
              </svg>
              <span>Apple</span>
            </button>
          </div>

          {/* Already have an account prompt */}
          <div className="register-prompt-footer">
            <span>Already have an ApexDrive account? </span>
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="register-now-link text-btn"
            >
              Sign in
            </button>
          </div>

          {/* Bottom Trust & Roadside Assistance Bar */}
          <div className="bottom-trust-bar">
            <div className="trust-item">
              <ShieldCheck size={16} className="ssl-shield-icon" />
              <span>256-bit SSL Encrypted Connection</span>
            </div>

            <div className="support-item">
              <Headphones size={15} className="headset-icon" />
              <span>
                24/7 Roadside Assistance: <strong>1-800-APX-FAST</strong>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
