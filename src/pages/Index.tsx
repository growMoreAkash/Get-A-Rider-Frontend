// Index.tsx

import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import axios from 'axios';
import { host } from '../secret';
import BrandCard from '../pages/BrandCard';
import { useFirstCreate } from '../context/FirstCreateContext';
import { useVehicleContext } from '../context/VehicleContext';
import Cookies from 'js-cookie';

const Index = () => {
    const defaultParams = {
        id: null,
        power: '',
        fuel: '',
    };

    const [params, setParams] = useState<any>({ ...defaultParams });
    const { firstCreateId } = useFirstCreate();

    const [maxPowerData, setMaxPowerData] = useState<any[]>([]);
    const [fuelData, setFuelData] = useState<any[]>([]);

    const { vehicleData, fetchVehicleOtherData } = useVehicleContext();

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    // Max Engine Power Form
    const {
        register: registerMaxPower,
        handleSubmit: handleSubmitMaxPower,
        formState: { errors: errorsMaxPower },
        reset: resetMaxPower,
    } = useForm();

    var token = Cookies.get('token');

    const handleMaxPowerSubmit = async (data: any) => {
        const apiUrl = import.meta.env.VITE_API_URL;
        try {
            await axios.post(
                `${host}addOtherData`,
                {
                    apiUrl: '/addOtherData',
                    id: firstCreateId,
                    field: 'maxEnginePower',
                    value: {
                        name: data['maxEnginePower'],
                        status: data['status'],
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            showMessage('Max Engine Power added successfully', 'success');
            resetMaxPower();
            fetchVehicleOtherData();
        } catch (error) {
            showMessage('Failed to add Max Engine Power', 'error');
        }
    };

    // Fuel Consumption Form
    const {
        register: registerFuel,
        handleSubmit: handleSubmitFuel,
        formState: { errors: errorsFuel },
        reset: resetFuel,
    } = useForm();

    const handleFuelSubmit = async (data: any) => {
        const apiUrl = import.meta.env.VITE_API_URL;
        try {
            await axios.post(
                `${host}addOtherData`,
                {
                    apiUrl: '/addOtherData',
                    id: firstCreateId,
                    field: 'fuelPerLiter',
                    value: {
                        name: data['fuelPerLiter'],
                        status: data['status'],
                    },
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            showMessage('Fuel Consumption added successfully', 'success');
            resetFuel();
            fetchVehicleOtherData();
        } catch (error) {
            showMessage('Failed to add Fuel Consumption', 'error');
        }
    };

    const [buttonTitle, setButtonTitle] = useState('maxEnginePower');

    return (
        <div className="px-5 py-8">
            <Tab.Group>
                <Tab.List className="flex space-x-4 p-2 border-b-2 border-gray-300">
                    <Tab
                        className={({ selected }) => `py-2 px-4 text-lg font-medium rounded-lg transition-all ${selected ? 'bg-blue-500 text-white' : 'text-gray-700 hover:text-blue-500'}`}
                        onClick={() => setButtonTitle('maxEnginePower')}
                    >
                        Max Engine Power
                    </Tab>
                    <Tab
                        className={({ selected }) => `py-2 px-4 text-lg font-medium rounded-lg transition-all ${selected ? 'bg-blue-500 text-white' : 'text-gray-700 hover:text-blue-500'}`}
                        onClick={() => setButtonTitle('fuelPerLiter')}
                    >
                        Fuel Consumption
                    </Tab>
                </Tab.List>

                <Tab.Panels className="mt-4">
                    {/* Max Engine Power Tab */}
                    <Tab.Panel>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Add Max Engine Power</h2>
                            <form onSubmit={handleSubmitMaxPower(handleMaxPowerSubmit)}>
                                <div className="mb-4">
                                    <label htmlFor="maxEnginePower" className="block text-md font-medium mb-2">
                                        Power
                                    </label>
                                    <input
                                        id="maxEnginePower"
                                        type="text"
                                        placeholder="Enter power"
                                        className="form-input w-full"
                                        {...registerMaxPower('maxEnginePower', {
                                            required: 'Power is required.',
                                        })}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-md font-medium mb-2">Status</label>
                                    <div className="flex items-center space-x-4">
                                        <label className="flex items-center">
                                            <input type="radio" value="active" {...registerMaxPower('status')} defaultChecked className="form-radio" />
                                            <span className="ml-2">Active</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input type="radio" value="inactive" {...registerMaxPower('status')} className="form-radio" />
                                            <span className="ml-2">Inactive</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button type="button" className="btn btn-outline-danger" onClick={() => resetMaxPower()}>
                                        Reset
                                    </button>
                                    <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                        {/* <BrandCard dataArr={maxPowerData} /> */}

                        <div className="mt-6">{buttonTitle === 'maxEnginePower' ? <BrandCard dataArr={vehicleData.maxEnginePower} /> : ''}</div>
                    </Tab.Panel>

                    {/* Fuel Consumption Tab */}
                    <Tab.Panel>
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Add Fuel Consumption</h2>
                            <form onSubmit={handleSubmitFuel(handleFuelSubmit)}>
                                <div className="mb-4">
                                    <label htmlFor="fuelPerLiter" className="block text-md font-medium mb-2">
                                        Fuel Consumption (per Liter)
                                    </label>
                                    <input
                                        id="fuelPerLiter"
                                        type="text"
                                        placeholder="Enter fuel consumption"
                                        className="form-input w-full"
                                        {...registerFuel('fuelPerLiter', {
                                            required: 'Fuel consumption is required.',
                                        })}
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-md font-medium mb-2">Status</label>
                                    <div className="flex items-center space-x-4">
                                        <label className="flex items-center">
                                            <input type="radio" value="active" {...registerFuel('status')} defaultChecked className="form-radio" />
                                            <span className="ml-2">Active</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input type="radio" value="inactive" {...registerFuel('status')} className="form-radio" />
                                            <span className="ml-2">Inactive</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button type="button" className="btn btn-outline-danger" onClick={() => resetFuel()}>
                                        Reset
                                    </button>
                                    <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                        {/* <BrandCard dataArr={fuelData} /> */}

                        <div className="mt-6">{buttonTitle === 'fuelPerLiter' ? <BrandCard dataArr={vehicleData.fuelPerLiter} /> : ''}</div>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
};

export default Index;
