import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { useDriver } from '../context/DriverContext';

interface DriverFormFields {
    driverPhoto?: File;
    Drivername: string;
    careoff: string;
    careoffphone: string;
    whatsapp: string;
    identity_Type: string;
    identity_Number: string;
    maritial: string;
    religion: string;
    annualIncome: string;
    gender: string;
    pincode: string;
    landmark: string;
    street_address: string;
    building_name: string;
    profession: string;
    occupation: string;
}

const DriverUpdateForm = ({ driver, professions, religion, occupations, onSave, onCancel }: any) => {
    const host = 'https://api.getarider.in/api';
    const { driverId } = useDriver();

    const [imagePreview, setImagePreview] = useState<string | null>(null); // For previewing image
    const [fileName, setFileName] = useState<string>('No file selected');

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        control
    } = useForm({
        defaultValues: {
            driverPhoto: null,
            Drivername: driver?.fullname?.data,
            careoff: driver?.careof?.data,
            careoffphone: driver?.careofPhone?.data,
            whatsapp: driver?.whatsapp?.data,
            identity_Type: driver?.identity_Type?.data,
            maritial: driver?.maritial?.data,
            religion: driver?.religion?.data,
            annualIncome: driver?.annualIncome?.data,
            gender: driver?.gender?.data,
            identity_Number: driver?.identity_Number?.data,
            pincode: driver?.pincode?.data,
            landmark: driver?.landmark?.data,
            street_address: driver?.street_address?.data,
            building_name: driver?.building_name?.data,
            profession: driver?.profession?.data,
            occupation: driver?.occupation?.data,
        },
    });

    useEffect(() => {
        if (driver) {
            reset({
                driverPhoto: null,
                Drivername: driver?.fullname?.data || '',
                careoff: driver.careof?.data || '',
                careoffphone: driver.careofPhone?.data || '',
                whatsapp: driver.whatsapp?.data || '',
                identity_Type: driver.identity_Type?.data || '',
                maritial: driver.maritial?.data || '',
                religion: driver.religion?.data || '',
                annualIncome: driver.annualIncome?.data || '',
                gender: driver.gender?.data || '',
                identity_Number: driver.identity_Number?.data || '',
                pincode: driver.pincode?.data || '',
                landmark: driver.landmark?.data || '',
                street_address: driver.street_address?.data || '',
                building_name: driver.building_name?.data || '',
                profession: driver.profession?.data || '',
                occupation: driver.occupation?.data || '',
            });
            if (driver?.driverPhoto) {
                setImagePreview(driver?.driverPhoto?.data); // Cloudinary image URL
                setFileName(driver?.driverPhoto || 'Existing image');
            }
        }
    }, [driver, reset]);

    const onSubmit = async (data: any) => {
        const formData = new FormData();

        if (data.driverPhoto && data.driverPhoto[0]) {
            formData.append('driverPhoto', data.driverPhoto[0]);
        }

        // Append other fields to FormData
        Object.entries(data).forEach(([key, value]) => {
            if (key !== 'driverPhoto' && value) {
                formData.append(key, value as string);
            }
        });

        try {
            ////.log('FormData Content:');
            formData.forEach((value, key) => {
                console.log(key, value);
            });

            await axios.put(`${host}/updateProfileDriver/${driverId}`, formData, {
                headers: {
                    'Authorization': `Bearer ${Cookies.get("token")}`
                }
            });

            Swal.fire({
                icon: 'success',
                title: 'Driver profile updated successfully',
                timer: 3000,
            });
        } catch (error) {
            //.error('Error while updating driver profile:', error);
            Swal.fire('Error', 'Failed to update profile. Try again.', 'error');
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // setValue('driverPhoto', file); // Update the userPhoto value
            setImagePreview(URL.createObjectURL(file)); // Preview the image
            setFileName(file.name); // Set the file name
        } else {
            setImagePreview(null); // Reset preview
            setFileName('No photo selected'); // Reset file name
        }
    };

    useEffect(() => {
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
        };
    }, [imagePreview]);



    return (
        <div>
            <div className="panel">
                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                    {/* Main Container */}
                    <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                        {/* Left Section - Input Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Driver Name */}
                            <div>
                                <label htmlFor="Drivername" className="block text-sm font-medium text-gray-700">
                                    Driver Name
                                </label>
                                <input id="Drivername" type="text" {...register('Drivername')} placeholder="Enter Driver Name" className="form-input mt-1" />
                                {errors.Drivername && <p className="text-red-500 text-sm">{errors.Drivername.message as string}</p>}
                            </div>

                            {/* Care Of */}
                            <div>
                                <label htmlFor="careof" className="block text-sm font-medium text-gray-700">
                                    Care Of
                                </label>
                                <input id="careof" type="text" {...register('careoff')} placeholder="Enter Care Of" className="form-input mt-1" />
                            </div>

                            {/* Care Of Phone */}
                            <div>
                                <label htmlFor="careoffphone" className="block text-sm font-medium text-gray-700">
                                    Care Of Phone
                                </label>
                                <input
                                    id="careoffphone"
                                    type="text"
                                    {...register('careoffphone', {
                                        pattern: {
                                            value: /^[0-9]{10}$/,
                                            message: 'Enter a valid 10-digit phone number',
                                        },
                                    })}
                                    placeholder="Enter Care Of Phone"
                                    className="form-input mt-1"
                                />
                                {errors.careoffphone && <p className="text-red-500 text-sm">{errors.careoffphone.message as string}</p>}
                            </div>

                            {/* WhatsApp Number */}
                            <div>
                                <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">
                                    WhatsApp Number
                                </label>
                                <input id="whatsapp" type="text" {...register('whatsapp')} placeholder="Enter WhatsApp Number" className="form-input mt-1" />
                            </div>

                            {/* Identity Details */}
                            <div>
                                <label htmlFor="annualIncome" className="block text-sm font-medium text-gray-700">

                                </label>
                                <select id="annualIncome" {...register('annualIncome')} className="form-input mt-1">
                                    <option value="">Select Annual Income</option>
                                    <option value="1Lakh">Below 1Lakh</option>
                                    <option value="2.5Lakh">Below 2.5Lakh</option>
                                    <option value="5Lakh">Below 5Lakh</option>
                                    <option value="7.5Lakh">Below 7.5Lakh</option>
                                    <option value="10Lakh">Below 10Lakh</option>
                                </select>
                                {errors.annualIncome && <p className="text-red-500 text-sm">{errors.annualIncome.message as string}</p>}
                            </div>
                            <div>
                                <label htmlFor="maritial" className="block text-sm font-medium text-gray-700">

                                </label>
                                <select id="maritial" {...register('maritial')} className="form-input mt-1">
                                    <option value="">Select Maritial Status</option>
                                    <option value="married">Married</option>
                                    <option value="single">Single</option>
                                    <option value="divorced">Divorced</option>
                                </select>
                                {errors.maritial && <p className="text-red-500 text-sm">{errors.maritial.message as string}</p>}
                            </div>
                            <div>
                                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">

                                </label>
                                <select id="gender" {...register('gender')} className="form-input mt-1">
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="custom">Custom</option>
                                </select>
                                {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message as string}</p>}
                            </div>
                            <div>
                                <label htmlFor="identity_Type" className="block text-sm font-medium text-gray-700">
                                    Identity Type
                                </label>
                                <select id="identity_Type" {...register('identity_Type')} className="form-input mt-1">
                                    <option value="">Select Type</option>
                                    <option value="aadhar">Aadhar</option>
                                    <option value="driving">Driving License</option>
                                </select>
                                {errors.identity_Type && <p className="text-red-500 text-sm">{errors.identity_Type.message as string}</p>}
                            </div>

                            {/* Identity Number */}
                            <div>
                                <label htmlFor="identity_Number" className="block text-sm font-medium text-gray-700">
                                    Identity Number
                                </label>
                                <input id="identity_Number" type="text" {...register('identity_Number')} placeholder="Enter Identity Number" className="form-input mt-1" />
                            </div>

                            {/* Address */}


                            {/* o */}
                            <div>
                                <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">
                                    Occupation
                                </label>
                                <select
                                    id="occupation"
                                    className="form-input mt-1"
                                    {...register('occupation')}
                                >
                                    <option value="">Select Occupation</option>
                                    {occupations.map((occupation: any) => (
                                        <option key={occupation._id} value={occupation._id}>
                                            {occupation.name}
                                        </option>
                                    ))}
                                </select>
                                {/* {errors.ownerId && <p className="text-red-500 text-sm">{errors.ownerId.message}</p>} */}
                            </div>

                            {/* p */}
                            <div>
                                <label htmlFor="profession" className="block text-sm font-medium text-gray-700">
                                    profession
                                </label>
                                <select
                                    id="profession"
                                    className="form-input mt-1"
                                    {...register('profession')}
                                >
                                    <option value="">Select profession</option>
                                    {professions.map((profession: any) => (
                                        <option key={profession._id} value={profession._id}>
                                            {profession.name}
                                        </option>
                                    ))}
                                </select>
                                {/* {errors.ownerId && <p className="text-red-500 text-sm">{errors.ownerId.message}</p>} */}
                            </div>
                            {/* r */}
                            <div>
                                <label htmlFor="religion" className="block text-sm font-medium text-gray-700">
                                    religion
                                </label>
                                <select
                                    id="religion"
                                    className="form-input mt-1"
                                    {...register('religion')}
                                >
                                    <option value="">Select Religion</option>
                                    {religion.map((religion: any) => (
                                        <option key={religion._id} value={religion._id}>
                                            {religion.name}
                                        </option>
                                    ))}
                                </select>
                                {/* {errors.ownerId && <p className="text-red-500 text-sm">{errors.ownerId.message}</p>} */}
                            </div>
                            <div>
                                <label htmlFor="building_name" className="block text-sm font-medium text-gray-700">
                                    Building Name
                                </label>
                                <input id="building_name" {...register('building_name')} placeholder="Enter Building Name" className="form-input mt-1" />
                            </div>
                            <div>
                                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
                                    pincode
                                </label>
                                <input id="pincode" {...register('pincode')} placeholder="Enter pincode" className="form-input mt-1" />
                            </div>

                        </div>

                        <div>
                            <div>
                                <label htmlFor="street_address" className="block text-sm font-medium text-gray-700">
                                    Street Address
                                </label>
                                <textarea id="street_address" {...register('street_address')} placeholder="Enter Street Address" className="form-input mt-1" />
                            </div>
                            <div>
                                <label htmlFor="landmark" className="block text-sm font-medium text-gray-700">
                                    Landmark
                                </label>
                                <textarea id="landmark" {...register('landmark')} placeholder="Enter Landmark" className="form-input mt-1" />
                            </div>
                        </div>
                        {/* Right Section - Driver Photo */}
                        <div className="flex justify-center items-center flex-col ">
                            <label htmlFor="" className="block text-sm font-medium text-gray-700">
                                Driver Image
                            </label>
                            <div className="relative w-64 h-64 border-2 border-gray-300 rounded-md overflow-hidden shadow-md">
                                {/* Hidden File Input */}
                                <Controller
                                    name="driverPhoto"
                                    control={control}
                                    defaultValue={null}
                                    render={({ field }) => (
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                handleImageChange(e);
                                                field.onChange(e.target.files);
                                            }}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"

                                        />
                                    )}
                                />




                                {/* Image Preview or Placeholder */}
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Driver Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-100">No photo selected</div>
                                )}
                                {errors.driverPhoto && <p className="text-red-500 text-sm mt-1">{errors.driverPhoto.message}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center mt-8">
                        <button type="submit" className="bg-teal-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-teal-600">
                            Update Driver
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DriverUpdateForm;