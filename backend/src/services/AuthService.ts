import { UserRepository } from '../db/repositories/UserRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { db } from '../db/connection';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'defaultSecret';
const userRepo = new UserRepository(db);

export class AuthService {
    // REJESTRACJA
    static async registerUser(email: string, plainPassword: string) {
        // 1. Sprawdzenie czy user o takim email już istnieje
        const existingUser = await userRepo.getUserByEmail(email);
        console.log(existingUser);
        if (existingUser) {
            throw new Error('User already exists');
        }

        // 2. Hashowanie hasła
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

        // 3. Tworzenie usera w bazie
        const newUser = await userRepo.addUser(email, hashedPassword);

        // 4. Zwróć dane usera (bez hasła) – ewentualnie same metadane
        return {
            id: newUser.id,
            email: newUser.email
        };
    }

    // LOGOWANIE
    static async loginUser(email: string, plainPassword: string) {
        // 1. Znajdź usera w bazie
        const user = await userRepo.getUserByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }

        // 2. Porównaj hasło
        const isMatch = await bcrypt.compare(plainPassword, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        // 3. Generowanie tokenu JWT
        //    Payload zawiera np. userId i role
        const token = jwt.sign(
            {
                userId: user.id
            },
            JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );

        // 4. Zwróć token
        return {
            token,
            user: {
                id: user.id,
                email: user.email
            }
        };
    }
}
