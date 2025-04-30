import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import morgan from 'morgan';

import { AnnouncementController } from './controllers/AnnouncementController';
import { AuthController } from './controllers/AuthController';
import { AuthRequest, checkAuth } from './middlewares/authMiddleware';
import { checkAdmin } from './middlewares/checkAdmin';
import { checkOwnerOrAdmin } from './middlewares/checkOwnerOrAdmin';
import { MessageController } from './controllers/MessageController';
import { CommentController } from './controllers/CommentController';
import { ReactionController } from './controllers/ReactionController';
import { logger } from './utils/logger';

// ---------------- ENVIRONMENT SETUP ----------------

// Load environment variables from .env file into process.env
dotenv.config();

// ---------------- EXPRESS APP INITIALIZATION ----------------

// Create Express application instance
const app = express();

// ---------------- GLOBAL MIDDLEWARE ----------------

app.use(cors()); // Enable CORS (Cross-Origin Resource Sharing)
app.use(express.json()); // Automatically parse incoming JSON payloads
app.use(morgan('dev')); // Log HTTP requests in developer-friendly format

// ---------------- HEALTHCHECK ENDPOINT ----------------

/**
 * Basic endpoint to verify if the API is up and running.
 * Used in deployment/monitoring pipelines (e.g., Docker, CI/CD).
 */
app.get('/api/healthcheck', (req: Request, res: Response) => {
    res.json({ status: 'OK', message: 'Backend powered by Vite now!' });
});

// ---------------- AUTH ROUTES ----------------

/**
 * POST /api/auth/register
 * Registers a new user with email and password.
 */
app.post('/api/auth/register', AuthController.register);

/**
 * POST /api/auth/login
 * Logs in a user and returns a JWT on success.
 */
app.post('/api/auth/login', AuthController.login);

/**
 * GET /api/profile
 * Returns the decoded JWT payload of the current authenticated user.
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
 * GET /api/announcements
 * Public endpoint to list announcements, optionally filtered.
 */
app.get('/api/announcements', AnnouncementController.getAll);

/**
 * GET /api/categories
 * Returns all unique announcement categories (used in filters).
 */
app.get('/api/categories', AnnouncementController.getCategories);

/**
 * GET /api/users/:id/announcements
 * Lists all announcements created by a specific user.
 */
app.get(
    '/api/users/:id/announcements',
    checkAuth,
    AnnouncementController.getByUser
);

/**
 * GET /api/admin/announcements
 * Admin-only: returns all announcements with author metadata.
 */
app.get(
    '/api/admin/announcements',
    checkAuth,
    checkAdmin,
    AnnouncementController.getAllForAdmin
);

/**
 * GET /api/me
 * Returns data about the current authenticated user from the JWT.
 */
app.get('/api/me', checkAuth, AnnouncementController.getMe);

/**
 * POST /api/announcements
 * Creates a new announcement (requires login).
 */
app.post('/api/announcements', checkAuth, AnnouncementController.create);

/**
 * PUT /api/announcements/:id
 * Updates an existing announcement (owner or admin only).
 */
app.put(
    '/api/announcements/:id',
    checkAuth,
    checkOwnerOrAdmin,
    AnnouncementController.update
);

/**
 * GET /api/announcements/:id
 * Retrieves a single announcement by ID.
 */
app.get(
    '/api/announcements/:id',
    checkAuth,
    AnnouncementController.findById
);

/**
 * DELETE /api/announcements/:id
 * Deletes an announcement (owner or admin only).
 */
app.delete(
    '/api/announcements/:id',
    checkAuth,
    checkOwnerOrAdmin,
    AnnouncementController.delete
);

// ---------------- MESSAGING ROUTES ----------------

/**
 * POST /api/messages
 * Sends a private message to another user.
 */
app.post('/api/messages', checkAuth, MessageController.sendMessage);

/**
 * GET /api/messages/conversations
 * Retrieves the most recent message from each conversation the user is part of.
 */
app.get('/api/messages/conversations', checkAuth, MessageController.getConversations);

/**
 * GET /api/messages/:withUserId
 * Fetches the full message thread with a specific user.
 */
app.get('/api/messages/:withUserId', checkAuth, MessageController.getThread);

// ---------------- COMMENT ROUTES ----------------

/**
 * POST /api/announcements/:id/comments
 * Adds a comment to a specific announcement.
 */
app.post('/api/announcements/:id/comments', checkAuth, CommentController.addComment);

/**
 * GET /api/announcements/:id/comments
 * Retrieves all comments under a specific announcement.
 */
app.get('/api/announcements/:id/comments', checkAuth, CommentController.getComments);

/**
 * DELETE /api/comments/:id
 * Deletes a comment (if owner or admin).
 */
app.delete('/api/comments/:id', checkAuth, CommentController.deleteComment);

// ---------------- REACTION ROUTES ----------------

/**
 * POST /api/announcements/:id/reactions
 * Adds a like/dislike reaction to an announcement.
 */
app.post('/api/announcements/:id/reactions', checkAuth, ReactionController.addToAnnouncement);

/**
 * DELETE /api/announcements/:id/reactions
 * Removes user's reaction from an announcement.
 */
app.delete('/api/announcements/:id/reactions', checkAuth, ReactionController.removeFromAnnouncement);

/**
 * POST /api/comments/:id/reactions
 * Adds a reaction to a comment.
 */
app.post('/api/comments/:id/reactions', checkAuth, ReactionController.addToComment);

/**
 * DELETE /api/comments/:id/reactions
 * Removes user's reaction from a comment.
 */
app.delete('/api/comments/:id/reactions', checkAuth, ReactionController.removeFromComment);

// ---------------- GLOBAL ERROR HANDLING ----------------

/**
 * Centralized error-handling middleware.
 * Logs errors and returns standardized error responses.
 */
app.use((err: any, _req: Request, res: Response, _next: Function) => {
    logger.error(err);
    const status = err.status ?? 500;
    res.status(status).json({ error: err.message ?? 'Internal server error' });
});

// ---------------- START SERVER ----------------

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
