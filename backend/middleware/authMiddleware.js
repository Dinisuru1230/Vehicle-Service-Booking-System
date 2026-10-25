const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (format: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'apexdrive_super_secure_jwt_token_secret_key_2026_xyz982'
      );

      // Fetch user from Prisma DB and attach to req (excluding password)
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          name: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          role: true,
          city: true,
          state: true,
          address: true,
          zip: true,
          avatar: true,
          bio: true,
          department: true,
          notes: true,
          tier: true,
          status: true,
          twoFactorEnabled: true,
          smsReminders: true,
          emailStatus: true,
          promotions: true,
          vehicles: true,
          createdAt: true,
          lastLogin: true,
        },
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'The user belonging to this session token no longer exists.',
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error('[Auth Error] Token verification failed:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired authorization token. Please log in again.',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No authorization token provided.',
    });
  }
};

// Grant access to specific user roles (e.g. 'admin')
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user ? req.user.role : 'unauthorized'}' is not authorized to access this route.`,
      });
    }
    next();
  };
};

// Optional protect - if Bearer token is provided and valid, attach req.user; otherwise proceed as guest
const optionalProtect = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      if (token && token !== 'null' && token !== 'undefined') {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || 'apexdrive_super_secure_jwt_token_secret_key_2026_xyz982'
        );

        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
          select: {
            id: true,
            name: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            role: true,
            city: true,
            state: true,
            address: true,
            zip: true,
            avatar: true,
            tier: true,
            status: true,
          },
        });

        if (user) {
          req.user = user;
        }
      }
    } catch (error) {
      console.warn('[OptionalAuth] Token verification bypassed, continuing as guest:', error.message);
    }
  }
  next();
};

module.exports = { protect, authorize, optionalProtect };

