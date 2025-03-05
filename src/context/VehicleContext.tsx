import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { host } from '../secret';
import Cookies from 'js-cookie';

// Interfaces for vehicle data
interface VehicleData {
    name: string;
    _id: string;
}

interface Vehicle {
    _id: string;
    driverId: string;
    registrationNumber: string;
    details: string;
    otherDetails: string;
    isDriver: boolean;
    active: boolean;
    date: string;
    time: string;
}

interface Category {
    modelName: string;
    modelId(modelId: any): string;
    name: string;
    _id: string;
}

interface TypeData {
    name: string;
    id: string;
}

interface BrandData {
    name: string;
    id: string;
}

interface ModelData {
    _id: any;
    name: string;
    id: string;
}

// Interface for Vehicle State
interface VehicleState {
    maxEnginePower: VehicleData[];
    fuelPerLiter: VehicleData[];
    mode: VehicleData[];
    capacity: VehicleData[];
    color: VehicleData[];
    fuelType: VehicleData[];
    gearType: VehicleData[];
    regYear: VehicleData[];
    type: VehicleData[];
    maxSpeed: VehicleData[];
    acceleration: VehicleData[];
}

// Interface for Context
interface VehicleContextType {
    categories: Category[];
    vehicleData: VehicleState;
    loading: boolean;
    error: string | null;
    typeArr: TypeData[]; // Add type for typeArr
    brandArr: BrandData[]; // Add type for brandArr
    modelArr: ModelData[]; // Add type for modelArr
    getTypeBrandModel: () => void; // Add the function signature here
    fetchVehicleOtherData: () => void; // Add the function signature here
    fetchCategories: () => void;
    vehicles: Vehicle[];
    mapCategoriesToModels: () => void;
    setCategories: any;
    setTriggerMappping: any;
}

// Create the context
const VehicleContext = createContext<VehicleContextType | undefined>(undefined);
// const MainVehicleContext = createContext<VehicleContextType | undefined>(undefined);

// Provider component
interface VehicleProviderProps {
    children: ReactNode;
}

export const VehicleProvider: React.FC<VehicleProviderProps> = ({ children }) => {
    const host = 'https://api.getarider.in/api';
    const [categories, setCategories] = useState<Category[]>([]);
    const [typeArr, setTypeArr] = useState<TypeData[]>([]);
    const [brandArr, setBrandArr] = useState<BrandData[]>([]);
    const [modelArr, setModelArr] = useState<ModelData[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [vechileId, setVehicleId] = useState<string | null>(null);
    const [vehicleData, setVehicleData] = useState<VehicleState>({
        maxEnginePower: [],
        fuelPerLiter: [],
        mode: [],
        capacity: [],
        color: [],
        fuelType: [],
        gearType: [],
        regYear: [],
        type: [],
        maxSpeed: [],
        acceleration: [],
    });

    const [triggerMappping, setTriggerMappping] = useState(false);

    var token = Cookies.get('token');

    // Fetch categories
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await axios.post(
                `${host}/getCategory`,
                {
                    apiUrl: '/getCategory',
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const extractedCategories: Category[] = response.data.flatMap((item: any) =>
                item.category.map((cat: any) => ({
                    _id: cat._id,
                    name: cat.name,
                    date: cat.date,
                    time: cat.time,
                    description: cat.description,
                    photo: cat.photo,
                    modelId: item.modelId, // Include modelId from parent object
                }))
            );
            setCategories(extractedCategories);
            setTriggerMappping((prev: boolean) => !prev);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch categories');
        } finally {
            setLoading(false);
        }
    };

    // Fetch vehicle data
    const fetchVehicleOtherData = async () => {
        try {
            const response = await axios.post(
                `${host}/getVehicleOtherData`,
                {
                    apiUrl: '/getVehicleOtherData',
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const apiResponse = response.data;
            ////.log(apiResponse)
            const extractData = (key: string): VehicleData[] => {
                //.log(apiResponse)
                return apiResponse.flatMap(
                    (item: any) =>
                        item[key]?.map((entry: any) => ({
                            name: entry.name,
                            _id: entry._id,
                            date: entry.date,
                            time: entry.time,
                        })) || []
                );
            };

            setVehicleData({
                maxEnginePower: extractData('maxEnginePower'),
                fuelPerLiter: extractData('fuelPerLiter'),
                mode: extractData('mode'),
                capacity: extractData('capacity'),
                color: extractData('color'),
                fuelType: extractData('fuelType'),
                gearType: extractData('gearType'),
                regYear: extractData('regYear'),
                type: [], // to bypass typescript error
                maxSpeed: extractData('maxSpeed'),
                acceleration: extractData('accelaretion'),
            });
        } catch (error) {
            //.error('Error fetching vehicle data:', error);
        }
    };

    const getAllVehicle = async () => {
        try {
            // If your endpoint expects pagination info, pass it as the request body:
            const response = await axios.post(
                `${host}/getAllVehicle`,
                {
                    page: 1,
                    limit: 10,
                    apiUrl: '/getAllVehicle',
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Check if vehicles exist in the response and map them
            if (response.data.vehicles) {
                const vehicleData = response.data.vehicles.map((vehicle: any) => ({
                    _id: vehicle._id,
                    driverId: vehicle.driverId,
                    registrationNumber: vehicle.registrationNumber.data,
                    details: vehicle.details,
                    otherDetails: vehicle.otherDetails,
                    isDriver: vehicle.isDriver,
                    active: vehicle.active,
                    date: vehicle.date,
                    time: vehicle.time,
                }));

                setVehicles(vehicleData);
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        }
    };

    // Fetch type, brand, and model data
    const getTypeBrandModel = async () => {
        try {
            const response = await axios.post(
                `${host}/getVehicleData`,
                {
                    apiUrl: '/getVehicleData',
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = response.data;

            // Extract type data
            const extractedTypes: TypeData[] = data.map((item: any) => ({
                name: item.type.name,
                _id: item.type._id,
                date: item.type.date,
                time: item.type.time,
                photo: item.type.photo,
                description: item.type.description,
            }));
            setTypeArr(extractedTypes);

            // Extract brand data
            const extractedBrands: BrandData[] = data.flatMap((item: any) =>
                item.type.brand.map((brand: any) => ({
                    name: brand.name,
                    _id: brand._id,
                    date: brand.date,
                    time: brand.time,
                    description: brand.description,
                    photo: brand.photo,
                    typeId: item.type._id, // Add corresponding typeId
                    typeName: item.type.name, // Add corresponding typeName
                }))
            );
            setBrandArr(extractedBrands);

            // Extract model data
            const extractedModels: ModelData[] = data.flatMap((item: any) =>
                item.type.brand.flatMap((brand: any) =>
                    brand.model.map((model: any, index: any) => ({
                        name: model.name,
                        _id: model._id,
                        time: model.time,
                        date: model.date,
                        description: model.description,
                        photo: model.photo,
                        brandId: brand._id, // Add corresponding brandId
                        brandName: brand.name, // Add corresponding brandName
                    }))
                )
            );
            setModelArr(extractedModels);
        } catch (error) {
            //.error('Error fetching Type, Brand, and Model data:', error);
        }
    };

    const mapCategoriesToModels = () => {
        const modelMap = new Map(modelArr.map((model) => [model._id, model.name]));

        const updatedCategories = categories.map((category) => ({
            ...category,
            modelName: modelMap.get(category.modelId) || 'Unknown Model',
        }));

        setCategories(updatedCategories);
    };

    useEffect(() => {
        fetchVehicleOtherData();
        getTypeBrandModel();
        getAllVehicle();
        fetchCategories();
    }, []);

    useEffect(() => {
        if (modelArr.length > 0 && categories.length > 0) {
            mapCategoriesToModels();
        }
    }, [triggerMappping, modelArr]);

    return (
        <VehicleContext.Provider
            value={{
                categories,
                vehicleData,
                typeArr,
                brandArr,
                modelArr,
                loading,
                error,
                getTypeBrandModel,
                fetchVehicleOtherData,
                vehicles,
                fetchCategories,
                mapCategoriesToModels,
                setCategories,
                setTriggerMappping,
            }}
        >
            {children}
        </VehicleContext.Provider>
    );
};

// Custom hook to use the context
export const useVehicleContext = () => {
    const context = useContext(VehicleContext);
    if (!context) {
        throw new Error('useVehicleContext must be used within a VehicleProvider');
    }
    return context;
};
