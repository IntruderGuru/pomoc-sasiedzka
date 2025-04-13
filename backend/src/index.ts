import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AuthController } from './controllers/AuthController';
import { checkAuth, AuthRequest } from './middlewares/authMiddleware'; // Zwróć uwagę na import AuthRequest, jeżeli chcesz rzutować typ
import morgan from 'morgan';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Testowy endpoint
app.get('/api/healthcheck', (req: Request, res: Response) => {
    res.json({ status: 'OK', message: 'Backend powered by Vite now!' });
});

// AUTH routes
app.post('/api/auth/register', AuthController.register);
app.post('/api/auth/login', AuthController.login);

// PRZYKŁADOWY ENDPOINT ZABEZPIECZONY MIDDLEWAREM:
app.get('/api/profile', checkAuth, (req: Request, res: Response) => {
    // W TS, by dostać się do req.user, możesz zrobić rzutowanie:
    const authReq = req as AuthRequest;
    res.json({
        message: 'Dane użytkownika',
        userDecoded: authReq.user // np. { userId, role, iat, exp }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
