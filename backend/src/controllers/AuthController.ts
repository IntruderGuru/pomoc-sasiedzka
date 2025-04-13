import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
    static async register(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res
                    .status(400)
                    .json({ message: 'Email and password are required' });
            }
            const user = await AuthService.registerUser(email, password);
            return res.status(201).json(user);
        } catch (error: any) {
            if (error.message === 'User already exists') {
                return res.status(409).json({ message: 'User already exists' });
            }
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res
                    .status(400)
                    .json({ message: 'Email and password are required' });
            }
            const result = await AuthService.loginUser(email, password);
            // result = { token, user: { id, email, role } }
            return res.status(200).json(result);
        } catch (error: any) {
            if (error.message === 'Invalid credentials') {
                return res
                    .status(401)
                    .json({ message: 'Invalid email or password' });
            }
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}
