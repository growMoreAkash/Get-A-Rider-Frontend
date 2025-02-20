import React, { useEffect, useState } from 'react';
import { useVehicleContext } from '../context/VehicleContext';
import axios from 'axios';
import { Controller, useForm } from 'react-hook-form';
import { useDriver } from '../context/DriverContext';
import ReusableDropdown from '../components/VehicleSignup/ReusableDropDown';
import { host } from '../secret';
import OwnerReusableDropdownList from '../components/Owner/OwnerReusableDropdownList';
import Cookies from 'js-cookie';

interface DropdownItem {
    name: string;
}

const VehicleSignup = () => {
    const host = 'http://localhost:8000/api';

    const { control, handleSubmit, watch, reset, register } = useForm<any>({
        defaultValues: {
            isDriver: 'true',
            driver: '',
            ownerId: '',
            otherDetails: {},
            registrationNumber: '',
            active: true,
            details: {
                typ: { data: '' },
                brand: { data: '' },
                model: { data: '' },
                category: { data: 'Luxury' },
            },
        },
    });

    const { typeArr, vehicleData } = useVehicleContext();
    // console.log(vehicleData)
    const { drivers } = useDriver();

    const mapArray: { label: string; key: keyof typeof vehicleData }[] = [
        { label: 'Mode', key: 'mode' },
        { label: 'Color', key: 'color' },
        { label: 'Capacity', key: 'capacity' },
        { label: 'Gear Type', key: 'gearType' },
        { label: 'Fuel Type', key: 'fuelType' },
        { label: 'Registration Year', key: 'regYear' },
        { label: 'Engine Power', key: 'maxEnginePower' },
        { label: 'Maximum Speed', key: 'maxSpeed' },
        { label: 'Acceleration', key: 'acceleration' },
        { label: 'Mileage', key: 'fuelPerLiter' },
    ];

    const selectedType = watch('type');
    const selectedBrand = watch('brand');
    const selectedModel = watch('model');
    const selectedDriver = watch('driver');
    const isDriver = watch('isDriver');

    const [owners, setOwners] = useState<DropdownItem[]>([]);
    const [showOwnerDropdown, setShowOwnerDropdown] = useState(false);

    const [brandData, setBrandData] = useState<DropdownItem[]>([]);
    const [modelData, setModelData] = useState<DropdownItem[]>([]);
    const [categoryData, setCategoryData] = useState<DropdownItem[]>([]);

    var token = Cookies.get('token');

    // Fetch owners dynamically when driver is selected
    useEffect(() => {
        if (selectedDriver) {
            axios
                .post(`${host}/getOwners/${selectedDriver}`, {},{
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    setOwners(res.data);
                })
                .catch((err) => {
                    console.error('Error fetching owners:', err);
                });
        } else {
            setOwners([]);
        }
    }, [selectedDriver, host]);

    // Show Owner Dropdown dynamically based on isDriver state
    useEffect(() => {
        setShowOwnerDropdown(isDriver === 'false' && selectedDriver);
    }, [isDriver, selectedDriver]);

    // Fetch Brands when Type is selected
    useEffect(() => {
        if (selectedType) {
            axios
                .post(
                    `${host}/getSpecificData`,
                    { name: 'type', _id: selectedType, apiUrl: '/getSpecificData' },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                .then((res) => {
                    setBrandData(res.data.brands || []);
                    setModelData([]);
                    setCategoryData([]);
                })
                .catch((err) => {
                    console.error('Error fetching brands:', err);
                });
        } else {
            setBrandData([]);
            setModelData([]);
            setCategoryData([]);
        }
    }, [selectedType, host]);

    // Fetch Models when Brand is selected
    useEffect(() => {
        if (selectedBrand) {
            console.log(selectedBrand);

            axios
                .post(
                    `${host}/getSpecificData`,
                    { name: 'brand', _id: selectedBrand, apiUrl: '/getSpecificData' },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                .then((res) => {
                    setModelData(res.data.models || ['No']);
                })
                .catch((err) => {
                    setModelData([]);
                    console.error('Error fetching models:', err);
                });
        } else {
            setModelData([]);
        }
    }, [selectedBrand, host]);

    // Fetch Categories when Model is selected
    useEffect(() => {
        if (selectedModel) {
            axios
                .post(
                    `${host}/getSpecificData`,
                    { name: 'model', _id: selectedModel, apiUrl: '/getSpecificData' },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                .then((res) => {
                    setCategoryData(res.data.categories || []);
                })
                .catch((err) => {
                    setCategoryData([]);
                    console.error('Error fetching categories:', err);
                });
        } else {
            setCategoryData([]);
        }
    }, [selectedModel, host]);

    const onSubmit = async (data: any) => {
        // console.log('Form data:', data);

        const apiUrl = '/createVehicle';
        console.log(data);
        const formattedData: any = {
            apiUrl: apiUrl,
            isDriver: data.isDriver === 'true',
            active: true,
            ownerId: data.ownerId || null,
            driverId: data.driver || null,
            // If you want registrationNumber to be a direct string or an object with “data”
            registrationNumber: data.registrationNumber ? { data: data.registrationNumber } : null,
            otherDetails: {},
            details: {
                typ: { data: data.type || '' },
                brand: { data: data.brand || '' },
                model: { data: data.model || '' },
                category: { data: data.category || '' },
            },
        };

        // For each dynamic field in otherDetails:
        mapArray.forEach(({ key }) => {
            if (data[key]) {
                formattedData.otherDetails[key] = { data: data[key] };
            }
        });

        try {
            const response = await axios.post(`${host}/createVehicle`, formattedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log('Vehicle created successfully:', response.data);
            alert('Vehicle has been created');
            reset();
        } catch (error) {
            console.error('Error creating vehicle:', error);
            alert('Fill all the fields');
        }
    };
    return (
        <div className="panel p-4 md:p-6 lg:p-8 bg-white rounded-md shadow-md">
            <form onSubmit={handleSubmit(onSubmit)}>
                <h2 className="text-teal-400 my-4 text-4xl font-bold">Create Vehicle</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Driver Dropdown */}
                    <ReusableDropdown
                        item="Driver"
                        oldValue=""
                        options={
                            Array.isArray(drivers)
                                ? drivers.map((driver: any) => ({
                                      _id: driver._id,
                                      name: driver.phone,
                                      fullName: driver.fullname,
                                  }))
                                : []
                        }
                        control={control}
                        name="driver"
                    />
                    {/* Radio Buttons */}
                    <div>
                        <label>Are you the owner of the vehicle?</label>
                        <div className="flex gap-5">
                            <label>
                                <Controller
                                    name="isDriver"
                                    control={control}
                                    defaultValue="true"
                                    render={({ field }) => <input type="radio" value="true" checked={field.value === 'true'} onChange={() => field.onChange('true')} />}
                                />
                                Yes
                            </label>
                            <label>
                                <Controller
                                    name="isDriver"
                                    control={control}
                                    render={({ field }) => <input type="radio" value="false" checked={field.value === 'false'} onChange={() => field.onChange('false')} />}
                                />
                                No
                            </label>
                        </div>
                    </div>

                    {/* Owner Dropdown (Dynamic) */}
                    {showOwnerDropdown && <OwnerReusableDropdownList item="Owner" options={owners} control={control} name="ownerId" />}

                    {mapArray.map(({ label, key }) => (
                        <ReusableDropdown
                            oldValue=""
                            key={key}
                            item={label}
                            options={(vehicleData[key] || []).map((option: any) => {
                                return { _id: option.name || '', name: option.name || '' };
                            })}
                            control={control}
                            name={key}
                        />
                    ))}

                    {/* Type Dropdown */}
                    <ReusableDropdown
                        oldValue=""
                        item="Type"
                        options={typeArr.map((type: any) => ({
                            _id: type._id,
                            name: type.name,
                        }))}
                        control={control}
                        name="type"
                    />

                    {/* Registration Number (FIXED) */}
                    <div className="flex flex-col w-[83%]">
                        <label className="text-sm font-medium">Registration Number</label>
                        {/* Use register here */}
                        <input
                            type="text"
                            {...register('registrationNumber')}
                            className="form-input w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600"
                        />
                    </div>

                    {/* Brand & Model & Category */}
                    <ReusableDropdown oldValue="" item="Brand" options={brandData} control={control} name="brand" disabled={!selectedType} />
                    <ReusableDropdown oldValue="" item="Model" options={modelData} control={control} name="model" disabled={!selectedBrand} />
                    <ReusableDropdown oldValue="" item="Category" options={categoryData} control={control} name="category" disabled={!selectedModel} />
                </div>

                {/* Submit Button */}
                <button type="submit" className="btn btn-primary mt-4 w-full sm:w-auto px-6 py-2 bg-teal-500 text-white rounded-md hover:bg-blue-700">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default VehicleSignup;
