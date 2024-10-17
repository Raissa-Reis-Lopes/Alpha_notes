import React, { createContext, useContext, useEffect, useState } from 'react';
import { validateAuthApi } from '../api/authApi';


interface User {
    id: string;
    username: string;
    email: string;
}
interface UserContextType {
    user: User | null;
    setUser: (user: User) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const validateAuth = async () => {
            try {
                const { data, error } = await validateAuthApi();

                if (error) {
                    setUser(null);
                    console.log(error);
                    return error;
                }
                if (data) setUser(data as User);

            } catch (error) {
                setUser(null);
                return { data: null as null, error: "validateAuth : Um erro inesperado aconteceu" };
            }
        }
        validateAuth();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
