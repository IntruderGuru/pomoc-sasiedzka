import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import morgan from 'morgan';

import { AnnouncementController } from './controllers/AnnouncementController';
import { AuthController } from './controllers/AuthController';
import { AuthRequest, checkAuth } from './middlewares/authMiddleware';
import { checkAdmin } from './middlewares/checkAdmin';
import { checkOwnerOrAdmin } from './middlewares/checkOwnerOrAdmin';

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Apply core middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)
app.use(express.json()); // Parse incoming JSON requests
app.use(morgan('dev')); // Log HTTP requests in dev-friendly format

/**
 * Healthcheck endpoint.
 * Used by monitoring tools or CI pipelines to verify that the API is online.
 */
app.get('/api/healthcheck', (req: Request, res: Response) => {
    res.json({ status: 'OK', message: 'Backend powered by Vite now!' });
});

// ---------------- AUTH ROUTES ----------------

/**
 * Register a new user (email + password).
 * Body: { email, password }
 */
app.post('/api/auth/register', AuthController.register);

/**
 * Log in an existing user and receive a JWT.
 * Body: { email, password }
 */
app.post('/api/auth/login', AuthController.login);

/**
 * Return decoded JWT for the currently authenticated user.
 * Useful for token verification and session introspection.
 */
app.get('/api/profile', checkAuth, (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    res.json({
        message: 'Dane użytkownika',
        userDecoded: authReq.user
    });
});

// ---------------- ANNOUNCEMENT ROUTES ----------------

/**
 * Publicly fetch all announcements, optionally filtered by category/type.
 */
app.get('/api/announcements', AnnouncementController.getAll);

/**
 * Public endpoint to get all distinct categories.
 * Used to dynamically populate frontend filters.
 */
app.get('/api/categories', AnnouncementController.getCategories);

/**
 * Fetch announcements created by a specific user (requires auth).
 */
app.get(
    '/api/users/:id/announcements',
    checkAuth,
    AnnouncementController.getByUser
);

/**
 * Admin-only: get all announcements, with author metadata.
 */
app.get(
    '/api/admin/announcements',
    checkAuth,
    checkAdmin,
    AnnouncementController.getAllForAdmin
);

/**
 * Get current user's data (uses JWT context).
 */
app.get('/api/me', checkAuth, AnnouncementController.getMe);

/**
 * Create a new announcement (requires authentication).
 */
app.post('/api/announcements', checkAuth, AnnouncementController.create);

/**
 * Update an existing announcement.
 * Only allowed for owner or admin.
 */
app.put(
    '/api/announcements/:id',
    checkAuth,
    checkOwnerOrAdmin,
    AnnouncementController.update
);

app.get('/api/announcements/:id', checkAuth, AnnouncementController.findById);

/**
 * Delete an announcement.
 * Only allowed for owner or admin.
 */
app.delete(
    '/api/announcements/:id',
    checkAuth,
    checkOwnerOrAdmin,
    AnnouncementController.delete
);

// ---------------- SERVER INIT ----------------

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
