import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import { db } from '../database/connection';
import { UserRepository } from '../repositories/user/UserRepository';

dotenv.config();

// Fallback used if JWT_SECRET is not provided in .env (should be overridden in production)
const JWT_SECRET = process.env.JWT_SECRET || 'defaultSecret';

// Repository instance for handling user persistence
const userRepo = new UserRepository(db);

/**
 * Service layer responsible for authentication logic:
 * - Account creation (registration)
 * - Credential validation (login)
 * - Password hashing
 * - Token generation (JWT)
 */
export class AuthService {

    /**
     * Registers a new user account after validating email uniqueness and hashing the password.
     *
     * @param email - The user’s email address
     * @param plainPassword - The raw password input from the user
     * @throws Error if the email is already in use
     * @returns A lightweight object with the new user's ID and email
     */
    static async registerUser(email: string, plainPassword: string) {
        // Prevent duplicate registration
        const existingUser = await userRepo.getUserByEmail(email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        // Hash the password with bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

        // Create a new user with default 'user' role
        const newUser = await userRepo.addUser(email, hashedPassword, 'user');

        // Return minimal public-safe data
        return { id: newUser.id, email: newUser.getEmail() };
    }

    /**
     * Validates credentials and issues a signed JWT if valid.
     *
     * @param email - Email address entered during login
     * @param plainPassword - Raw password entered by the user
     * @throws Error if the credentials are invalid
     * @returns An object containing a JWT and user information
     */
    static async loginUser(email: string, plainPassword: string) {
        const user = await userRepo.getUserByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Compare provided password with stored hash
        const isMatch = await bcrypt.compare(plainPassword, user.getPassword());
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        // Generate JWT with user ID and role as payload
        const token = jwt.sign(
            {
                userId: user.id,
                role: user.getRole()
            },
            JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );

        // Return token and limited user data
        return {
            token,
            user: {
                id: user.id,
                email: user.getEmail(),
                role: user.getRole()
            }
        };
    }
}
