import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { host } from '../secret';
import Select from 'react-select';
import { useVehicleContext } from '../context/VehicleContext';
import Cookies from 'js-cookie';

interface ModelType {
    name: string;
    id: string;
}

// Define props for the component
interface VehicleBrandFormProps {
    modelArr: ModelType[];
}

const VehicleCategoryForm = ({ modelArr }: VehicleBrandFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
    } = useForm();
    const apiUrl = import.meta.env.VITE_API_URL;
    const { fetchCategories } = useVehicleContext();
    const [logo, setLogo] = useState(null);

    const handleLogoChange = (e: any) => {
        const file = e.target.files[0];
        if (file) setLogo(file);
    };

    const handleFormSubmit = async (data: any) => {
        var token = Cookies.get('token');
        try {
            const host = 'http://localhost:8000/api';
            const apiUrl ='/addCategory';
            const formData = new FormData();

            // Ensure to send the selected modelId's value, not the entire object
            formData.append('modelId', data.modelId.value);
            formData.append('category', data.category);
            formData.append('description', data.description);
            formData.append('apiUrl', apiUrl);

            // Check if a photo is selected and append it
            if (logo) {
                formData.append('photo', logo);
            }

            // Send the form data to the server
            await axios.post(`${host}/addCategory`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            reset();
            alert('Successfully added category!');
            fetchCategories();
        } catch (error) {
            //.error('Error while submitting category:', error);
            alert('An error occurred while submitting the category');
        }
    };

    const modelOptions = modelArr?.map((type: any) => ({
        value: type._id,
        label: type.name,
    }));

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-white shadow-md rounded-lg p-6">
            <h5 className="text-xl font-bold text-teal-500 mb-4">Add New Brand</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Section */}
                <div className="flex gap-4 flex-col">
                    <div className="">
                        <label htmlFor="typeId" className="block mb-2 font-medium">
                            Model Name
                        </label>
                        <Controller
                            name="modelId"
                            control={control}
                            rules={{ required: 'Model is required' }}
                            render={({ field }) => <Select {...field} options={modelOptions} placeholder="Select Model" isSearchable className="w-full" />}
                        />
                        {errors?.typeId && <span className="text-red-500 text-sm">{errors?.typeId.message as string}</span>}
                    </div>
                    <div>
                        <label htmlFor="category" className="block mb-2 font-medium">
                            Category Name
                        </label>
                        <input type="text" id="category" {...register('category', { required: 'Category is required' })} placeholder="Ex: Category" className="w-full px-3 py-2 border rounded-md" />
                        {errors?.category && <span className="text-red-500 text-sm">{errors.category.message as string}</span>}
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

                <div className="flex flex-col items-center justify-center">
                    <h5 className="font-medium mb-2">Category Logo</h5>
                    <label className="w-48 h-48 flex items-center justify-center border-dashed border-2 rounded-md cursor-pointer">
                        {logo ? (
                            <img src={URL.createObjectURL(logo)} alt="Logo Preview" className="w-full h-full object-contain" />
                        ) : (
                            <div className="text-center">
                                <span className="text-gray-500">Upload Image</span>
                                <p className="text-xs text-gray-400">5MB image note</p>
                            </div>
                        )}
                        <input type="file" accept="image/png" onChange={handleLogoChange} className="hidden" />
                    </label>
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

export default VehicleCategoryForm;
