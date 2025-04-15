import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { AuthController } from './controllers/AuthController';
import { checkAuth, AuthRequest } from './middlewares/authMiddleware';
import { AnnouncementController } from './controllers/AnnouncementController';
import morgan from 'morgan';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));


app.get('/api/healthcheck', (req: Request, res: Response) => {
    res.json({ status: 'OK', message: 'Backend powered by Vite now!' });
});


app.post('/api/auth/register', AuthController.register);
app.post('/api/auth/login', AuthController.login);

app.get('/api/profile', checkAuth, (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    res.json({
        message: 'Dane użytkownika',
        userDecoded: authReq.user
    });
});

app.get('/api/announcements', AnnouncementController.getAll);
app.get('/api/announcements/:id', AnnouncementController.getById);
app.post('/api/announcements', checkAuth, AnnouncementController.create);
app.put('/api/announcements/:id', checkAuth, AnnouncementController.update);
app.delete('/api/announcements/:id', checkAuth, AnnouncementController.delete);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
