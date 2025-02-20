import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { host } from '../secret';
import Select from 'react-select';
import { useVehicleContext } from '../context/VehicleContext';
import Cookies from 'js-cookie';

interface TypeItem {
    name: string;
    id: string;
}

// Define props for the component
interface VehicleBrandFormProps {
    typeArr: TypeItem[];
}

const VehicleBrandForm = ({ typeArr }: VehicleBrandFormProps) => {
    const host = 'http://localhost:8000/api';
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
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
        //////.log('Form Data:', data);
        console.log(data, 'data');
        var token = Cookies.get('token');
        const apiUrl ='/addBrand';

        try {
            const formData = new FormData();
            console.log(formData);
            formData.append('typeId', data.typeId.value); // Selected type value
            formData.append('brand', data.brand);
            formData.append('description', data.description);
            formData.append('apiUrl', apiUrl);

            if (data.photo instanceof File) {
                formData.append('photo', data.photo);
            } else {
                //.warn('Enter Photo');
            }

            await axios.post(`${host}/addBrand`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });
            getTypeBrandModel();
            alert('Brand added successfully');
            reset();
            setLogoPreview(null);
        } catch (error) {
            //.error('Error while submitting brand:', error);
            alert('Error adding brand');
        }
    };

    const typeOptions = typeArr?.map((type: any) => ({
        value: type._id,
        label: type.name,
    }));

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-white shadow-md rounded-lg p-6">
            <h5 className="text-xl font-bold text-teal-500 mb-4">Add New Brand</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Section */}
                <div className="flex gap-4 flex-col">
                    <div>
                        <label htmlFor="typeId" className="block mb-2 font-medium">
                            Type Name
                        </label>
                        <Controller
                            name="typeId"
                            control={control}
                            rules={{ required: 'Type is required' }}
                            render={({ field }) => <Select {...field} options={typeOptions} placeholder="Select Type" isSearchable className="w-full" />}
                        />
                        {errors?.typeId && <span className="text-red-500 text-sm">{errors?.typeId.message as string}</span>}
                    </div>
                    <div>
                        <label htmlFor="brand" className="block mb-2 font-medium">
                            Brand Name
                        </label>
                        <input type="text" id="brand" {...register('brand', { required: 'Brand is required' })} placeholder="Ex: Brand" className="w-full px-3 py-2 border rounded-md" />
                        {errors?.brand && <span className="text-red-500 text-sm">{errors.brand.message as string}</span>}
                    </div>

                    <label htmlFor="description" className="block font-medium">
                        Short Description
                    </label>
                    <textarea
                        id="description"
                        {...register('description', { required: 'Description is required' })}
                        placeholder="Ex: Description"
                        rows={5}
                        maxLength={800}
                        className="w-full px-3 border rounded-md"
                    />
                    {errors?.description && <span className="text-red-500 text-sm">{errors.description.message as string}</span>}
                </div>

                {/* Right Section */}
                <div className="flex flex-col items-center justify-center">
                    <h5 className="font-medium mb-2">Brand Logo</h5>
                    <label className="w-48 h-48 flex items-center justify-center border-dashed border-2 rounded-md cursor-pointer">
                        {logoPreview ? (
                            <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain" />
                        ) : (
                            <div className="text-center">
                                <span className="text-gray-500">Upload Image</span>
                                <p className="text-xs text-gray-400">5MB image note</p>
                            </div>
                        )}
                        <input type="file" accept="image/png" onChange={handleLogoChange} className="hidden" />
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

export default VehicleBrandForm;
