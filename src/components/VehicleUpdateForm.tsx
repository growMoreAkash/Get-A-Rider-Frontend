import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { useVehicleContext } from '../context/VehicleContext';
import Cookies from 'js-cookie';
import { useDriver } from '../context/DriverContext';
import ReusableDropdown from './VehicleSignup/ReusableDropDown';

interface DropdownItem {
    name: string;
}

const DriverUpdateForm = ({ vehicle, fetchVehicleOtherData, driver, professions, occupations, onSave, onCancel }: any) => {
    const host = 'https://api.getarider.in/api';

    type OldValue = string | { data?: string };
    console.log("object")
    console.log(vehicle)
    const oldVehicleData = vehicle;
    console.log(oldVehicleData)
    const { _id: vehicleId, details, otherDetails, ownerId, driverId, seat } = oldVehicleData;

    const { typeArr, brandArr, categories, modelArr, vehicleData } = useVehicleContext();
    // console.log(vehicleData)
    var token = Cookies.get('token');

    const seatOptions = [
        { name: '2', _id: '2' },
        { name: '5', _id: '5' },
        { name: '7', _id: '7' },
        { name: '8', _id: '8' },
        { name: '9', _id: '9' },
    ];

    // console.log(otherDetails)

    const mapArray: { label: string; oldValue: OldValue; key: keyof typeof vehicleData }[] = [
        { label: 'Mode', key: 'mode', oldValue: otherDetails.mode },
        { label: 'Color', key: 'color', oldValue: otherDetails.color },
        { label: 'Capacity', key: 'capacity', oldValue: otherDetails.capacity },
        { label: 'Gear Type', key: 'gearType', oldValue: otherDetails.gearType },
        { label: 'Fuel Type', key: 'fuelType', oldValue: otherDetails.fuelType },
        { label: 'Registration Year', key: 'regYear', oldValue: otherDetails.regYear },
        { label: 'Engine Power', key: 'maxEnginePower', oldValue: otherDetails.maxEnginePower },
        { label: 'Mileage', key: 'fuelPerLiter', oldValue: otherDetails.fuelPerLiter },
    ];

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
        watch,
    } = useForm({
        defaultValues: {
            registrationNumber: oldVehicleData.registrationNumber?.data || '',
            type: details.typ?.data || '',
            brand: details.brand?.data || '',
            model: details.model?.data || '',
            category: details.category?.data || '',
            mode: otherDetails.mode?.data || '',
            color: otherDetails.color?.data || '',
            capacity: otherDetails.capacity?.data || '',
            gearType: otherDetails.gearType?.data || '',
            fuelType: otherDetails.fuelType?.data || '',
            regYear: otherDetails.regYear?.data || '',
            maxEnginePower: otherDetails.maxEnginePower?.data || '',
            fuelPerLiter: otherDetails.fuelPerLiter?.data || '',
            seat: seat?.number || '',
        },
    });

    console.log('otherDetails', otherDetails);
    const selectedType = watch('type');
    const selectedBrand = watch('brand');
    const selectedModel = watch('model');

    const [brandData, setBrandData] = useState<DropdownItem[]>([]);
    const [modelData, setModelData] = useState<DropdownItem[]>([]);
    const [categoryData, setCategoryData] = useState<DropdownItem[]>([]);

    const onSubmit = async (data: any) => {
        const apiUrl = '/updateVehicle';
        try {
            for (const key in data) {
                if (typeof data[key] === 'object' && data[key]?.data) {
                    data[key] = data[key].data; // Replace the object with its `data` property
                }
            }
            console.log(data);
            const payload = {
                vehicleId,
                driverId,
                ownerId,
                isDriver: !!driverId,
                registrationNumber: { data: data.registrationNumber || otherDetails.registrationNumber?.data },
                details: {
                    typ: { data: data.type },
                    brand: { data: data.brand },
                    model: { data: data.model },
                    category: { data: data.category },
                },
                otherDetails: {
                    maxEnginePower: { data: data.maxEnginePower || otherDetails.maxEnginePower?.data || '' },
                    fuelPerLiter: { data: data.fuelPerLiter || otherDetails.fuelPerLiter?.data || '' },
                    mode: { data: data.mode || otherDetails.mode?.data || '' },
                    capacity: { data: data.capacity || otherDetails.capacity?.data || '' },
                    color: { data: data.color || otherDetails.color?.data || '' },
                    fuelType: { data: data.fuelType || otherDetails.fuelType?.data || '' },
                    gearType: { data: data.gearType || otherDetails.gearType?.data || '' },
                    regYear: { data: data.regYear || otherDetails.regYear?.data || '' },
                    maxSpeed: { data: data.maxSpeed || otherDetails.maxSpeed?.data || '' },
                    acceleration: { data: data.acceleration || otherDetails.acceleration?.data || '' },
                },
                seat: {
                    number: data.seat || seat?.number || '',
                },
                active: true,
                range: 1000, // Default range
                apiUrl: apiUrl,
            };

            // console.log(payload);

            const response = await axios.put(`${host}/updateVehicle`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            console.log(response.data);
            Swal.fire({
                icon: 'success',
                title: response.data.message || 'Vehicle updated successfully',
                timer: 3000,
            });

            if (onSave) {
                onSave(response.data.vehicle);
            }
        } catch (error: any) {
            console.error('Error updating vehicle:', error);

            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to update vehicle. Try again.',
            });
        }
    };

    useEffect(() => {
        const apiUrl = '/getSpecificData';
        if (selectedType) {
            axios
                .post(
                    `${host}/getSpecificData`,
                    { name: 'type', _id: selectedType, apiUrl: apiUrl },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                .then((res) => {
                    setBrandData(res.data.brands || []);
                    setModelData([]);
                })
                .catch((err) => {
                    console.error('Error fetching brands:', err);
                });
        } else {
            setBrandData([]);
            setModelData([]);
        }
    }, [selectedType, host]);

    // Fetch Models when Brand is selected
    useEffect(() => {
        const apiUrl = '/getSpecificData';
        if (selectedBrand) {
            // console.log(selectedBrand)

            axios
                .post(
                    `${host}/getSpecificData`,
                    { name: 'brand', _id: selectedBrand, apiUrl: apiUrl },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                .then((res) => {
                    setModelData(res.data.models || ['No']);
                    // console.log(res.data.models)
                })
                .catch((err) => {
                    console.error('Error fetching models:', err);
                    setModelData([]);
                });
        } else {
            setModelData([]);
        }
    }, [selectedBrand, host]);

    useEffect(() => {
        const apiUrl = '/getSpecificData';
        if (selectedModel) {
            // console.log(selectedModel)
            axios
                .post(
                    `${host}/getSpecificData`,
                    { name: 'model', _id: selectedModel, apiUrl: apiUrl },
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
                    console.error('Error fetching categories:', err);
                });
        } else {
            setCategoryData([]);
        }
    }, [selectedModel, host]);

    return (
        <div>
            <div className="panel">
                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label htmlFor="RegistrationNumber">Registration Number</label>
                                <input
                                    id="RegistrationNumber"
                                    type="text"
                                    {...register('registrationNumber', { required: true })}
                                    defaultValue={oldVehicleData.registrationNumber.data || ''}
                                    className="form-input"
                                />
                                {errors.registrationNumber && <p className="text-red-500 text-sm">Registration Number is required</p>}
                            </div>

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

                            <ReusableDropdown oldValue="" item="Brand" options={brandData} control={control} name="brand" disabled={!selectedType} />
                            <ReusableDropdown oldValue="" item="Model" options={modelData} control={control} name="model" disabled={!selectedBrand} />
                            <ReusableDropdown oldValue="" item="Category" options={categoryData} control={control} name="category" disabled={!selectedModel} />

                            {mapArray.map(({ label, key, oldValue }) => (
                                <ReusableDropdown
                                    oldValue={typeof oldValue === 'object' ? oldValue?.data || '' : oldValue || ''}
                                    key={key}
                                    item={label}
                                    options={(vehicleData[key] || []).map((option: any) => ({
                                        _id: option.name || '',
                                        name: option.name || '',
                                    }))}
                                    control={control}
                                    name={key}
                                />
                            ))}

                            <div>
                                <ReusableDropdown item="Seat" oldValue={seat?.number || ''} options={seatOptions} control={control} name="seat" />
                                {errors.seat && <p className="text-red-500 text-sm">{errors.seat.message as string}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center mt-8">
                        <button type="submit" className="bg-teal-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-teal-600">
                            Update Vehicle
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DriverUpdateForm;
