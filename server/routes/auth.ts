import { Router } from 'express';
import { db } from '../storage';
import { eq } from 'drizzle-orm';
import { users, admins } from '../../shared/schema';
import bcrypt from 'bcrypt';
import { z } from 'zod';

const router = Router();

// Validation schemas
const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const adminRegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

// User signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = signupSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [user] = await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      phone: null,
      address: null,
      profilePicture: null,
      updatedAt: new Date().toISOString()
    }).returning();

    res.status(201).json({ message: 'User created successfully', userId: user.id });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// User signin
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = signinSchema.parse(req.body);

    // Find user
    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Set session
    req.session.userId = user.id;
    req.session.isAdmin = false;

    res.json({ message: 'Logged in successfully', userId: user.id });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ message: 'Error signing in' });
  }
});

// Admin registration
router.post('/admin/register', async (req, res) => {
  try {
    const { name, email, password } = adminRegisterSchema.parse(req.body);

    // Check if admin already exists
    const existingAdmin = await db.select().from(admins).where(eq(admins.email, email));
    if (existingAdmin.length > 0) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const [admin] = await db.insert(admins).values({
      name,
      email,
      password: hashedPassword,
    }).returning();

    res.status(201).json({ message: 'Admin created successfully', adminId: admin.id });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ message: 'Error creating admin' });
  }
});

// Admin login
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = adminLoginSchema.parse(req.body);

    // Find admin
    const [admin] = await db.select().from(admins).where(eq(admins.email, email));
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Set session
    req.session.userId = admin.id;
    req.session.isAdmin = true;

    res.json({ message: 'Logged in successfully', adminId: admin.id });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// Get current user
router.get('/me', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    if (req.session.isAdmin) {
      const [admin] = await db.select().from(admins).where(eq(admins.id, req.session.userId));
      if (!admin) return res.status(404).json({ message: 'Admin not found' });
      return res.json({ user: { ...admin, isAdmin: true } });
    }

    const [user] = await db.select().from(users).where(eq(users.id, req.session.userId));
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json({ user: { ...user, isAdmin: false } });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
});

export default router;