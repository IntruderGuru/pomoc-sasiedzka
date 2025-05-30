import { Request, Response } from 'express';

import { AuthService } from '../services/AuthService';

/**
 * Controller responsible for handling authentication-related routes.
 * Delegates all business logic to the AuthService.
 */
export class AuthController {
    /**
     * POST /api/auth/register
     * Handles user registration.
     * Expects a JSON body with `email` and `password`.
     * Validates the input and delegates to the AuthService.
     */
    static async register(req: Request, res: Response) {
        try {
            const { email, password, username } = req.body;

            // Basic input validation
            if (!email || !password || !username) {
                return res
                    .status(400)
                    .json({ message: 'Email, password and username are required' });
            }

            // Calls service method that hashes the password and inserts the new user
            const user = await AuthService.registerUser(email, password, username);

            // Respond with 201 Created and user data (id + email)
            return res.status(201).json(user);
        } catch (error: any) {
            // Specific error if the user already exists
            if (error.message === 'User already exists') {
                return res.status(409).json({ message: 'User already exists' });
            }

            // Generic fallback error
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    /**
     * POST /api/auth/login
     * Handles user login.
     * Verifies email/password and returns a JWT if credentials are valid.
     */
    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            // Basic input validation
            if (!email || !password) {
                return res
                    .status(400)
                    .json({ message: 'Email and password are required' });
            }

            // Calls service method that checks credentials and returns JWT + user info
            const result = await AuthService.loginUser(email, password);

            return res.status(200).json(result);
        } catch (error: any) {
            // Invalid credentials are treated as a 401 Unauthorized

            if (error.message === 'Invalid credentials') {
                return res
                    .status(401)
                    .json({ message: 'Invalid email or password' });
            }

            // Fallback for unexpected issues
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
