import axios from 'axios';
import { changeProcessingSectionUrl, getAllDriverUrl, getDriverByIdUrl, verifyDriverAndOwnerFieldsUrl } from './url';
import { host } from '../secret';

const baseURL = "https://rider-back-api.vercel.app";
const timeout = 10000; // 10 second timeout

// Create an axios Instance with default configuration which remain same for all request made using this instance
const axiosInstance = axios.create({
    baseURL,
    timeout,

    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include JWT token
axiosInstance.interceptors.request.use(
    (config) => {
        // Get the token from
        config.headers.Authorization =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwaG9uZSI6Iis5MTg4MTEwNzIyMzkiLCJwYXNzd29yZCI6IiQyYSQxMCRUdmZ3R2VtQUNqbjlVdDk3WXByRFR1T3oxWk54Nlk5UGxoNi9jL2F3Y0tydk9vVHJ4TFJyQyIsImlkIjoiNjc3OGJkMWVmZGJmNjBjMDQ2ODMzMDRiIiwiaWF0IjoxNzM1OTY2MDcwfQ.ICCEbtEYHOzfmbgpELU-G15PvFxp0-NOkpq_PrM5nyo';

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// driver api
export const getAllDrivers = async (data) => {
    try {
        const response = await axiosInstance.post(getAllDriverUrl, data);

        //////.log('src :: service :: api :: getAllDrivers :: response', response.data);

        return response.data;
    } catch (error) {
        //////.log('src :: service :: api :: getAllDrivers :: error', error);
        throw error;
    }
};

export const getDriverById = async (driverId) => {
    try {
        const relativeUrl = `${getDriverByIdUrl}/${driverId}`; // Construct the relative URL using getDriverByIdUrl
        const response = await axiosInstance.get(relativeUrl);

        //////.log('src :: service :: api :: getDriverById :: response', response.data);

        return response.data;
    } catch (error) {
        //////.log('src :: service :: api :: getDriverById :: error', error);
        throw error;
    }
};

export const verifyDriverAndOwnerFields = async (data) => {
    try {
        const response = await axiosInstance.post(verifyDriverAndOwnerFieldsUrl, data);

        //////.log('src :: service :: api :: verifyDriverAndOwnerFields :: response', response.data);

        return response.data;
    } catch (error) {
        //////.log('src :: service :: api :: verifyDriverAndOwnerFields :: error', error);
        throw error;
    }
};

export const changeProcessingStatus = async (driverId, processingSection) => {
    const data = {
        drivers: driverId,
        processingSection: processingSection,
    };
    try {
        const response = await axiosInstance.post(changeProcessingSectionUrl, data);

        //////.log('src :: service :: api :: changeProcessingStatus :: response', response.data);

        return response.data;
    } catch (error) {
        //////.log('src :: service :: api :: changeProcessingStatus :: error', error);
        throw error;
    }
};

export const deleteDriver = async (driverId) => {
    try {
        const relativeUrl = `${deleteDriver}/${driverId}`; // Construct the relative URL
        const response = await axiosInstance.delete(relativeUrl);

        //////.log('src :: service :: api :: deleteDriver :: response', response.data);

        return response.data;
    } catch (error) {
        //////.log('src :: service :: api :: deleteDriver :: error', error);
        throw error;
    }
};
