export interface User {
    id?: string | number;
    email: string;
    password: string;
    role?: string;
    created_at?: Date;
}

// Mock - baza w pamięci
const usersInMemory: User[] = [];

export class UserRepository {
    // Tworzenie nowego usera i zapisywanie go w tablicy
    static async create(user: User): Promise<User> {
        const newUser: User = {
            ...user,
            id: Math.floor(Math.random() * 1000000), // np. pseudo-ID
            role: user.role || 'user',
            created_at: new Date()
        };
        usersInMemory.push(newUser);
        // Zwróć usera (bez hasła, jeśli chcesz)
        return newUser;
    }

    // Szukanie usera po emailu
    static async findByEmail(email: string): Promise<User | null> {
        const found = usersInMemory.find(u => u.email === email);
        return found || null;
    }

    // (Opcjonalnie) szukanie usera po ID
    static async findById(id: number | string): Promise<User | null> {
        const found = usersInMemory.find(u => u.id === id);
        return found || null;
    }
}
