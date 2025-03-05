import axios from 'axios';
import { host } from '../secret';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';

interface FirstCreateContextType {
    firstCreateId: string | null;
    setFirstCreateId: (id: string) => void;
}

const FirstCreateContext = createContext<FirstCreateContextType | undefined>(undefined);

interface FirstCreateProviderProps {
    children: ReactNode;
}

export const FirstCreateProvider: React.FC<FirstCreateProviderProps> = ({ children }) => {
    const [firstCreateId, setFirstCreateId] = useState<string | null>(null);
    const host = 'https://api.getarider.in/api';

    var token = Cookies.get('token');
    const callFirstCreate = async () => {
        try {
            const response = await axios.post(
                `${host}/firstCreate`,
                {
                    apiUrl: '/firstCreate',
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setFirstCreateId(response?.data?.id);
        } catch (error) {
            //////.log('error fetching firstCreate Id', error);
        }
    };

    useEffect(() => {
        callFirstCreate();
    }, []);

    return <FirstCreateContext.Provider value={{ firstCreateId, setFirstCreateId }}>{children}</FirstCreateContext.Provider>;
};

export const useFirstCreate = (): FirstCreateContextType => {
    const context = useContext(FirstCreateContext);
    if (!context) {
        throw new Error('useFirstCreate must be used within an AuthProvider');
    }
    return context;
};
