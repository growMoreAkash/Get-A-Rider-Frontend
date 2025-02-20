import axios from 'axios';
import { host } from '../secret';
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';

interface DriverContextType {
    driverId: string | null;
    setDriverId: (id: string) => void;
    drivers: any;
    getAllDrivers: () => void;
}

const DriverContext = createContext<DriverContextType | undefined>(undefined);

interface DriverProviderProps {
    children: ReactNode;
}

export const DriverProvider: React.FC<DriverProviderProps> = ({ children }) => {
    const [driverId, setDriverId] = useState<string | null>(null);

    const [drivers, setDrivers] = useState<{ _id: string; fullname: string }[]>([]);

    const apiUrl = import.meta.env.VITE_API_URL;

    const getAllDrivers = async () => {
        const host = 'http://localhost:8000/api';
        const apiUrl = '/getAllDrivers';
        var token = Cookies.get('token');

        try {
            const response = await axios.post(
                `${host}/getAllDrivers`,
                {
                    page: 1,
                    limit: 0,
                    apiUrl: apiUrl,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            ////.log(response.data)
            if (response.data.drivers) {
                // Map the drivers' data to only include _id and fullname
                const driverData = response.data.drivers.map((driver: any) => ({
                    _id: driver._id,
                    // fullname: driver.fullname.verified ? driver.fullname.data : 'Verified', (actual implementation , but data not present in api so using next line code)
                    fullname: driver.fullname.data,
                    registrationNumber: driver.registrationNumber,
                    identity_Type: driver.identity_Type.data,
                    identity_Number: driver.identity_Number.data,
                    whatsapp: driver.whatsapp.data,
                    pincode: driver.pincode.data,
                    building_name: driver.building_name.data,
                    landmark: driver.landmark.data,
                    street_address: driver.street_address.data,
                    careof: driver.careof.data,
                    careofPhone: driver.careofPhone.data,
                    phone: driver.phone.data,
                    gender: driver.gender?.data,
                    maritial: driver.maritial?.data,
                    religion: driver.religion?.data,
                    annualIncome: driver.annualIncome?.data,
                    date: driver.date,
                    time: driver.time,
                    owners: driver.owners,
                    phoneVerified: driver.phoneVerified,
                }));
                setDrivers(driverData);
            }
        } catch (error) {
            //.error('Error fetching drivers:', error);
        }
    };

    useEffect(() => {
        getAllDrivers();
    }, []);

    return <DriverContext.Provider value={{ driverId, setDriverId, drivers, getAllDrivers }}>{children}</DriverContext.Provider>;
};

export const useDriver = (): DriverContextType => {
    const context = useContext(DriverContext);
    if (!context) {
        throw new Error('useDriver must be used within an AuthProvider');
    }
    return context;
};
