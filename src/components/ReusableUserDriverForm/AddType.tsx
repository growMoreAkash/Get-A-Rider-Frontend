import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useVehicleContext } from '../../context/VehicleContext';
import axios from 'axios';
import Cookies from 'js-cookie';

const AddType = () => {
    const host = 'https://api.getarider.in/api';
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm();

    const { getTypeBrandModel } = useVehicleContext();
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoPreview(URL.createObjectURL(file)); // For preview
            setValue('photo', file); // Set file correctly in react-hook-form
        }
    };

    const handleFormSubmit = async (data: any) => {
        console.log(data, 'data for adding type');
        const apiUrl = '/addType';
        var token = Cookies.get('token');

        try {
            const formData = new FormData();
            console.log(formData);
            formData.append('type', data.type);
            formData.append('description', data.description);
            formData.append('apiUrl', apiUrl);

            if (data.photo instanceof File) {
                formData.append('photo', data.photo);
            } else {
                //.warn('Enter Photo');
            }

            console.log(formData, 'formdata');

            await axios.post(`${host}/addType`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            getTypeBrandModel();
            alert('Type added successfully');
            reset();
            setLogoPreview(null);
        } catch (error) {
            alert('Error adding type');
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-white shadow-md rounded-lg p-6">
            <h5 className="text-xl font-bold text-teal-500 mb-4">Add New Type</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Section */}
                <div className="space-y-4">
                    <div>
                        <label htmlFor="type" className="block mb-2 font-medium">
                            Type
                        </label>
                        <input type="text" id="type" {...register('type', { required: 'Type is required' })} placeholder="Ex: Type" className="w-full px-3 py-2 border rounded-md" />
                        {errors?.type && <span className="text-red-500 text-sm">{errors.type.message as string}</span>}
                    </div>

                    <div>
                        <label htmlFor="description" className="block mb-2 font-medium">
                            Short Description
                        </label>
                        <textarea
                            id="description"
                            {...register('description', { required: 'Description is required' })}
                            placeholder="Ex: Description"
                            rows={5}
                            maxLength={800}
                            className="w-full px-3 py-2 border rounded-md"
                        />
                        {errors?.description && <span className="text-red-500 text-sm">{errors.description.message as string}</span>}
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex flex-col items-center justify-center">
                    <h5 className="font-medium mb-2">Type Logo</h5>
                    <label className="w-48 h-48 flex items-center justify-center border-dashed border-2 rounded-md cursor-pointer">
                        {logoPreview ? (
                            <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain" />
                        ) : (
                            <div className="text-center">
                                <span className="text-gray-500">Upload Image</span>
                                <p className="text-xs text-gray-400">5MB max</p>
                            </div>
                        )}
                        <input type="file" accept="image/png, image/jpeg" onChange={handleLogoChange} className="hidden" />
                    </label>
                    {errors?.photo && <span className="text-red-500 text-sm">{errors.photo.message as string}</span>}
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-6">
                <button type="submit" className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-primary-dark">
                    Submit
                </button>
            </div>
        </form>
    );
};

export default AddType;
