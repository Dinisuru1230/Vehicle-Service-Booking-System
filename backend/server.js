const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const prisma = require('./config/prisma');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminUserRoutes = require('./routes/adminUserRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const staffRoutes = require('./routes/staffRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminBookingRoutes = require('./routes/adminBookingRoutes');
const adminDashboardRoutes = require('./routes/adminDashboardRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const adminReportRoutes = require('./routes/adminReportRoutes');
const { ensureServicesSeeded } = require('./controllers/serviceController');
const { ensureStaffSeeded } = require('./controllers/staffController');
const { ensureBookingsSeeded } = require('./controllers/bookingController');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Initialize Express App
const app = express();

// Initialize Prisma Database Connection & Seed Default Accounts
const initDatabase = async () => {
  try {
    await prisma.$connect();
    console.log(`[Database] Prisma ORM connected to SQLite (${process.env.DATABASE_URL || 'file:./dev.db'})`);

    // 1. Ensure Super Administrator account exists
    const adminEmail = 'm.vance@apexdrive.io';
    const adminExists = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (!adminExists) {
      const adminPasswordHash = await bcrypt.hash('ApexAdmin2026!', 10);
      await prisma.user.create({
        data: {
          name: 'Marcus Vance',
          firstName: 'Marcus',
          lastName: 'Vance',
          email: adminEmail,
          password: adminPasswordHash,
          phone: '+1 (555) 234-8901',
          role: 'admin',
          city: 'San Francisco, CA',
          state: 'CA',
          address: 'Bay Area Precision Hub #742',
          zip: '94103',
          department: 'Technical Operations & Workshop Logistics',
          bio: 'Lead Workshop Administrator & Master Tech overseeing daily shop floor operations.',
          tier: 'VIP Platinum',
          status: 'Active',
        },
      });
      console.log('[System Init] Super Administrator initialized: m.vance@apexdrive.io');
    } else if (!adminExists.firstName) {
      await prisma.user.update({
        where: { email: adminEmail },
        data: {
          firstName: 'Marcus',
          lastName: 'Vance',
          state: 'CA',
          zip: '94103',
          department: 'Technical Operations & Workshop Logistics',
          bio: 'Lead Workshop Administrator & Master Tech overseeing daily shop floor operations.',
        },
      });
    }

    // 2. Ensure Demo Customer account exists
    const customerEmail = 'alexander@example.com';
    const customerExists = await prisma.user.findUnique({
      where: { email: customerEmail },
      include: { vehicles: true },
    });

    if (!customerExists) {
      const customerPasswordHash = await bcrypt.hash('Customer2026!', 10);
      await prisma.user.create({
        data: {
          name: 'Alexander Wright',
          firstName: 'Alexander',
          lastName: 'Wright',
          email: customerEmail,
          password: customerPasswordHash,
          phone: '+1 (555) 234-5678',
          role: 'customer',
          city: 'San Francisco, CA',
          state: 'CA',
          address: '1420 Market St, Suite 400',
          zip: '94102',
          tier: 'VIP Platinum',
          status: 'Active',
          vehicles: {
            create: [
              {
                name: '2023 BMW M3 Competition',
                make: 'BMW',
                model: 'M3 Competition (G80)',
                year: 2023,
                plate: 'CA 8XYZ901',
                vin: 'WBA33AY08PFS18920',
                mileage: '14,200 mi',
                color: 'Isle of Man Green',
                isPrimary: true,
                inBay: true,
                lastService: 'Track Alignment & Dynamic Corner Balancing',
              },
            ],
          },
        },
      });
      console.log('[System Init] Demo Customer initialized: alexander@example.com');
    } else if (!customerExists.firstName) {
      await prisma.user.update({
        where: { email: customerEmail },
        data: {
          firstName: 'Alexander',
          lastName: 'Wright',
          state: 'CA',
          zip: '94102',
        },
      });
      if (customerExists.vehicles.length > 0 && !customerExists.vehicles[0].name) {
        await prisma.vehicle.update({
          where: { id: customerExists.vehicles[0].id },
          data: {
            name: `${customerExists.vehicles[0].year} ${customerExists.vehicles[0].make} ${customerExists.vehicles[0].model}`,
            isPrimary: true,
          },
        });
      }
    }

    // Seed sample bookings for Alexander Wright if none exist
    const alexBookings = await prisma.booking.count({ where: { userId: customerExists?.id } });
    if (customerExists && alexBookings === 0) {
      const alexVeh = await prisma.vehicle.findFirst({ where: { userId: customerExists.id } });
      await prisma.booking.createMany({
        data: [
          {
            bookingRef: '#APX-84920',
            userId: customerExists.id,
            vehicleId: alexVeh ? alexVeh.id : null,
            serviceTitle: 'Track Alignment & Dynamic Corner Balancing',
            scheduledDate: 'Oct 14, 2024',
            scheduledTime: '10:00 AM',
            bay: 'Bay 3 (Hunter Elite Alignment)',
            technician: 'Dave Miller',
            totalCost: 450.0,
            status: 'In-Bay',
            notes: 'Customer requested Motul 300V 5W-40 and Castrol SRF high-temp fluid.',
          },
          {
            bookingRef: '#APX-81204',
            userId: customerExists.id,
            vehicleId: alexVeh ? alexVeh.id : null,
            serviceTitle: 'Custom ECU Dyno Calibration & Boost Curve',
            scheduledDate: 'Jul 22, 2024',
            scheduledTime: '02:00 PM',
            bay: 'Bay 6 (Dyno Cell)',
            technician: 'Sam Rivera',
            totalCost: 1200.0,
            status: 'Completed',
          },
        ],
      });
      console.log('[System Init] Seeded initial service history for Alexander Wright.');
    }

    // 3. Ensure VIP Customer Elena Rostova exists
    const elenaEmail = 'elena.rostova@apexcapital.io';
    const elenaExists = await prisma.user.findUnique({ where: { email: elenaEmail } });
    if (!elenaExists) {
      const elenaHash = await bcrypt.hash('Customer2026!', 10);
      const elena = await prisma.user.create({
        data: {
          name: 'Elena Rostova',
          firstName: 'Elena',
          lastName: 'Rostova',
          email: elenaEmail,
          password: elenaHash,
          phone: '+1 (555) 891-2345',
          city: 'Palo Alto, CA',
          state: 'CA',
          address: '840 University Ave',
          zip: '94301',
          tier: 'VIP Platinum',
          status: 'In-Bay',
          notes: 'Member of Porsche Club of America. High sensitivity to paint protection and ceramic coatings.',
          vehicles: {
            create: [
              {
                name: '2021 Porsche 911 GT3 RS (992)',
                make: 'Porsche',
                model: '911 GT3 RS (992)',
                year: 2021,
                plate: 'CA 9TRK911',
                vin: 'WP0AF2A97MS29104',
                mileage: '6,800 mi',
                color: 'Shark Blue',
                isPrimary: true,
                inBay: true,
                lastService: 'Corner Weighting & Aero Downforce Setup',
              },
              {
                name: '2024 Porsche Taycan Turbo S',
                make: 'Porsche',
                model: 'Taycan Turbo S',
                year: 2024,
                plate: 'CA 4EV911',
                vin: 'WP0AB2Y15PSA91204',
                mileage: '3,400 mi',
                color: 'Frozen Blue Metallic',
                isPrimary: false,
                inBay: false,
                lastService: 'Annual High-Voltage EV Inspection',
              },
            ],
          },
        },
        include: { vehicles: true },
      });

      await prisma.booking.create({
        data: {
          bookingRef: '#APX-86401',
          userId: elena.id,
          vehicleId: elena.vehicles[0].id,
          serviceTitle: 'Corner Weighting & Aero Downforce Setup',
          scheduledDate: 'Oct 14, 2024',
          scheduledTime: '01:30 PM',
          bay: 'Bay 5 (Precision Corner Balancing)',
          technician: 'Marcus Vance',
          totalCost: 1450.0,
          status: 'In-Bay',
          notes: 'PCA track day setup for Laguna Seca.',
        },
      });
      console.log('[System Init] VIP Customer initialized: elena.rostova@apexcapital.io');
    }

    // 4. Ensure Gold Customer Rachel Adams exists
    const rachelEmail = 'rachel.adams@adamslaw.com';
    const rachelExists = await prisma.user.findUnique({ where: { email: rachelEmail } });
    if (!rachelExists) {
      const rachelHash = await bcrypt.hash('Customer2026!', 10);
      const rachel = await prisma.user.create({
        data: {
          name: 'Rachel Adams',
          firstName: 'Rachel',
          lastName: 'Adams',
          email: rachelEmail,
          password: rachelHash,
          phone: '+1 (555) 345-6789',
          city: 'San Francisco, CA',
          state: 'CA',
          address: '555 California St, 32nd Fl',
          zip: '94104',
          tier: 'Gold Member',
          status: 'Active',
          notes: 'Exclusively services AMG performance models. Requires enclosed trailer transport.',
          vehicles: {
            create: [
              {
                name: '2022 Mercedes-AMG GT R Coupe',
                make: 'Mercedes-AMG',
                model: 'GT R Coupe',
                year: 2022,
                plate: 'CA 5AMG019',
                vin: 'WDDYJ7JA8NA018249',
                mileage: '11,400 mi',
                color: 'Green Hell Magno',
                isPrimary: true,
                inBay: false,
                lastService: 'Ceramic Brake Inspection & Carbon Pads',
              },
            ],
          },
        },
        include: { vehicles: true },
      });

      await prisma.booking.create({
        data: {
          bookingRef: '#APX-83901',
          userId: rachel.id,
          vehicleId: rachel.vehicles[0].id,
          serviceTitle: 'Ceramic Brake Inspection & Carbon Pads',
          scheduledDate: 'Oct 02, 2024',
          scheduledTime: '11:00 AM',
          bay: 'Bay 3',
          technician: 'Dave Miller',
          totalCost: 780.0,
          status: 'Completed',
        },
      });
      console.log('[System Init] Gold Member initialized: rachel.adams@adamslaw.com');
    }

    // 4. Ensure Service Catalog is seeded
    await ensureServicesSeeded();

    // 5. Ensure Workshop Technicians Roster is seeded
    await ensureStaffSeeded();

    // 6. Ensure Canonical Workshop Bookings are seeded
    await ensureBookingsSeeded();
  } catch (error) {
    console.error(`[Database Error] Prisma initialization failed: ${error.message}`);
  }
};

initDatabase();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ONLINE',
    database: 'Prisma ORM (SQLite)',
    service: 'ApexDrive Vehicle Service Booking API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/admin/staff', staffRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/customers', adminUserRoutes);
app.use('/api/customers', adminUserRoutes);
app.use('/api/users', adminUserRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin/bookings', adminBookingRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);
app.use('/api/dashboard', adminDashboardRoutes);
app.use('/api/admin/settings', settingsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/admin/reports', adminReportRoutes);
app.use('/api/reports', adminReportRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Server Listening
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`======================================================`);
  console.log(`🚗 ApexDrive Backend Server running with Prisma ORM`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🗄️ Database: SQLite via Prisma (${process.env.DATABASE_URL || 'file:./dev.db'})`);
  console.log(`🔐 Auth Endpoints:          http://localhost:${PORT}/api/auth`);
  console.log(`👤 User Account Endpoints:    http://localhost:${PORT}/api/user`);
  console.log(`🔧 Services Endpoints:        http://localhost:${PORT}/api/services`);
  console.log(`👨‍🔧 Staff Endpoints:           http://localhost:${PORT}/api/admin/staff`);
  console.log(`📅 Customer Bookings:         http://localhost:${PORT}/api/bookings`);
  console.log(`📋 Admin Bookings Management: http://localhost:${PORT}/api/admin/bookings`);
  console.log(`📊 Admin Dashboard Overview:  http://localhost:${PORT}/api/admin/dashboard`);
  console.log(`⚙️ Workshop Settings:        http://localhost:${PORT}/api/admin/settings`);
  console.log(`📈 Reports & Export:          http://localhost:${PORT}/api/admin/reports`);
  console.log(`👑 Admin Users Endpoints:     http://localhost:${PORT}/api/admin/users`);
  console.log(`======================================================`);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`[Unhandled Rejection Error]: ${err.message}`);
});
