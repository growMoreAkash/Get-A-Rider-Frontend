import axios from 'axios';
import { host } from '../secret';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';

interface AuthContextType {
    userId: string | null;
    setUserId: (id: string) => void;
    getAllUsers: () => void;
    users: any;
}

interface User {
    id: string;
    username: string;
    phone: string;
    phoneVerified: boolean;
    registrationNumber: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [userId, setUserId] = useState<string | null>(null);

    const [users, setUsers] = useState<User[]>([]);

    var token = Cookies.get('token');

    // const apiUrl = import.meta.env.VITE_API_URL;

    const host = 'http://localhost:8000/api';
    const getAllUsers = async () => {
        try {
            const response = await axios.post(
                `${host}/getAllUser`,
                {
                    apiUrl: '/getAllUser',
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const usersData = response.data.map((user: any) => ({
                id: user._id,
                username: user.username || 'N/A',
                phone: user.phone || 'N/A',
                phoneVerified: user.phoneVerified || false,
                registrationNumber: user.registrationNumber || 'N/A',
            }));
            setUsers(usersData);
        } catch (error: any) {
            //.error('Error fetching users:', error.response?.data || error.message);
            throw new Error('Failed to fetch users');
        }
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    return <AuthContext.Provider value={{ userId, setUserId, users, getAllUsers }}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
