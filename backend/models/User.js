const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const vehicleSubSchema = new mongoose.Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  plate: { type: String, required: true },
  vin: { type: String, default: '' },
  mileage: { type: String, default: '' },
  color: { type: String, default: '' },
  inBay: { type: Boolean, default: false },
}, { timestamps: true });

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Don't return password in queries by default
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    role: {
      type: String,
      enum: ['customer', 'admin', 'technician'],
      default: 'customer',
    },
    city: {
      type: String,
      default: 'San Francisco, CA',
    },
    address: {
      type: String,
      default: '',
    },
    tier: {
      type: String,
      enum: ['Standard', 'Gold Member', 'VIP Platinum', 'Corporate Fleet'],
      default: 'Standard',
    },
    status: {
      type: String,
      enum: ['Active', 'Pending', 'Inactive'],
      default: 'Active',
    },
    vehicles: [vehicleSubSchema],
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving to database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
      name: this.name,
    },
    process.env.JWT_SECRET || 'apexdrive_super_secure_jwt_token_secret_key_2026_xyz982',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
};

module.exports = mongoose.model('User', userSchema);
