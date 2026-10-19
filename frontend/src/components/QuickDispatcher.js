import React, { useState } from 'react';
import {
  Car,
  Zap,
  Sliders,
  MapPin,
  Calendar,
  CheckCircle2,
  Check,
  ShieldCheck,
  QrCode,
  ChevronDown,
} from 'lucide-react';

const QuickDispatcher = ({ onBookClick }) => {
  const [vehicle, setVehicle] = useState('');
  const [service, setService] = useState('');
  const [hub, setHub] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (onBookClick) {
      onBookClick({ vehicle, service, hub });
    }
  };

  return (
    <div className="dispatcher-floating-card">
      {/* Top Banner Row inside Card */}
      <div className="dispatcher-header">
        <div className="dispatcher-title-group">
          <Car size={18} className="dispatcher-car-icon" />
          <span className="dispatcher-title">QUICK SERVICE DISPATCHER</span>
        </div>

        <div className="dispatcher-bays-badge">
          <Zap size={14} className="bays-zap-icon" />
          <span className="bays-count-text">42 Active Service Bays Available</span>
          <span className="bays-divider">•</span>
          <span className="bays-confirm-text">Instant Confirmation</span>
        </div>
      </div>

      {/* Inputs Form */}
      <form onSubmit={handleSearch} className="dispatcher-form-row">
        {/* Selector 1: Vehicle Profile */}
        <div className="dispatcher-field-col">
          <div className="field-label-header">
            <span className="field-label">VEHICLE PROFILE</span>
            <span className="field-action-link">VIN / MAKE</span>
          </div>
          <div className="select-box-wrapper">
            <select
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              className="dispatcher-select"
            >
              <option value="">Select Make &amp; Model</option>
              <option value="bmw_m3">2023 BMW M3 Competition</option>
              <option value="porsche_911">2022 Porsche 911 Carrera</option>
              <option value="audi_q7">2023 Audi Q7 Quattro</option>
              <option value="tesla_s">2022 Tesla Model S Plaid</option>
              <option value="merc_amg">2024 Mercedes-AMG C63</option>
            </select>
            <ChevronDown size={16} className="select-arrow-icon" />
          </div>
        </div>

        {/* Selector 2: Service Category */}
        <div className="dispatcher-field-col">
          <div className="field-label-header">
            <span className="field-label">SERVICE CATEGORY</span>
            <span className="field-tag-badge">OEM SPEC</span>
          </div>
          <div className="select-box-wrapper">
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="dispatcher-select"
            >
              <option value="">Select Primary Service</option>
              <option value="periodic">Periodic Maintenance Service ($89)</option>
              <option value="brake">Brake Repair &amp; Pad Replacement ($149)</option>
              <option value="ecu">Engine Diagnostics &amp; ECU Tuning ($79)</option>
              <option value="ac">Climate Control &amp; AC Overhaul ($99)</option>
              <option value="alignment">Suspension &amp; 3D Laser Alignment ($69)</option>
              <option value="battery">Battery Health &amp; Replacement ($119)</option>
            </select>
            <Sliders size={16} className="select-arrow-icon" />
          </div>
        </div>

        {/* Selector 3: Preferred Hub */}
        <div className="dispatcher-field-col">
          <div className="field-label-header">
            <span className="field-label">PREFERRED HUB</span>
            <span className="field-tag-badge live">LIVE QUEUE</span>
          </div>
          <div className="select-box-wrapper">
            <select
              value={hub}
              onChange={(e) => setHub(e.target.value)}
              className="dispatcher-select"
            >
              <option value="">Choose Service Center</option>
              <option value="metro_bay03">Metro Hub - Bay 03 (Live Telemetry)</option>
              <option value="downtown_hq">Downtown Flagship Workshop</option>
              <option value="north_tech">Northside Precision Center</option>
              <option value="west_garage">West Bay Speed Hub</option>
            </select>
            <MapPin size={16} className="select-arrow-icon" />
          </div>
        </div>

        {/* Action Button */}
        <div className="dispatcher-button-col">
          <button type="submit" className="btn-dispatcher-cta">
            <Calendar size={17} className="btn-cal-icon" />
            <span>Check Slots &amp; Book</span>
          </button>
        </div>
      </form>

      {/* Perks Bottom Bar */}
      <div className="dispatcher-perks-row">
        <div className="perk-item">
          <CheckCircle2 size={16} className="perk-icon green" />
          <span>Free 15-minute express vehicle intake</span>
        </div>

        <div className="perk-item">
          <ShieldCheck size={16} className="perk-icon blue" />
          <span>Zero upfront deposit required for routine checks</span>
        </div>

        <div className="perk-item">
          <QrCode size={16} className="perk-icon orange" />
          <span>Complimentary loaner vehicle or Uber vouchers</span>
        </div>
      </div>
    </div>
  );
};

export default QuickDispatcher;
