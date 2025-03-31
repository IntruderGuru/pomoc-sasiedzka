import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config(); // wczytuje zmienne z pliku .env (jeśli istnieje)

const app = express();

app.use(cors());
app.use(express.json());

// Prosty endpoint testowy
app.get('/api/healthcheck', (req: Request, res: Response) => {
    res.json({ status: 'OK', message: 'Backend is running!' });
});

// Pobranie portu z .env, a jeśli brak – 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
