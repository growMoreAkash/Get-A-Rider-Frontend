import React, { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import { useVehicleContext } from '../context/VehicleContext';
import axios from 'axios';
import ReusableDropdown from './VehicleSignup/ReusableDropDown';
import { host } from '../secret';
import Cookies from 'js-cookie';

interface TypeItem {
    name: string;
    id: string;
}

interface DropdownItem {
    name: string;
}
// Props interface for VehicleModelForm
interface VehicleModelFormProps {
    typeArr: TypeItem[]; // Array of TypeItem objects
    brandArr: TypeItem[]; // Assuming brandArr follows the same structure
}

const VehicleModelForm = ({ typeArr, brandArr }: VehicleModelFormProps) => {
    console.log(typeArr);
    const [brandLogo, setBrandLogo] = useState(null);
    const [modelData, setModelData] = useState<DropdownItem[]>([]);
    const [brandData, setBrandData] = useState<DropdownItem[]>([]);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
        watch,
    } = useForm();
    const selectedType = watch('type');

    const host = 'http://localhost:8000/api';
    const { getTypeBrandModel } = useVehicleContext();

    const typeOptions = typeArr?.map((type: any) => ({
        value: type._id,
        label: type.name,
    }));

    const brandOptions = brandArr?.map((brand: any) => ({
        value: brand._id,
        label: brand.name,
    }));

    const handleLogoChange = (e: any) => {
        const file = e.target.files[0];
        if (file) setBrandLogo(file);
    };

    const handleFormSubmit = async (data: any) => {
        var token = Cookies.get('token');
        const apiUrl ='/addModel';
        try {
            const formData = new FormData();
            formData.append('brand', data.brand); // Using the value from the brand object
            formData.append('type', data.type); // Using the value from the type object
            formData.append('model', data.model);
            formData.append('description', data.description);
            formData.append('apiUrl', apiUrl);
            if (brandLogo) formData.append('photo', brandLogo);

            await axios.post(`${host}/addModel`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            reset();
            getTypeBrandModel();
            alert('success');
        } catch (error) {
            //////.log(error, 'error while submitting model');
            alert('Error');
        }
    };
    useEffect(() => {
        if (selectedType) {
            console.log(selectedType);
            axios
                .post(`${host}/getSpecificData`, { name: 'type', _id: selectedType }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Cookies.get('token')}`,
                    },
                })
                .then((res) => {
                    setBrandData(res.data.brands || []);
                })
                .catch((err) => {
                    console.error('Error fetching brands:', err);
                });
        } else {
            setBrandData([]);
            setModelData([]);
        }
    }, [selectedType, host]);

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-white shadow-md rounded-lg p-6">
            <h5 className="text-xl font-bold text-teal-500 mb-4">Add New Model</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Section */}

                <div className="flex flex-col gap-4">
                    <div className="flex gap-4 w-full">
                        {/* <div className="w-full">
                            <label htmlFor="type_name" className="block mb-2 font-medium">
                                Type Name
                            </label>
                            <Controller
                                name="typeId"
                                control={control}
                                rules={{ required: 'Type is required' }}
                                render={({ field }) => <Select {...field} options={typeOptions} placeholder="Select Type" isSearchable className="w-full" />}
                            />
                            {errors?.typeId && <span className="text-red-500 text-sm">{errors?.typeId?.message as string}</span>}
                        </div> */}

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
                    </div>

                    <div>
                        <label htmlFor="model_name" className="block mb-2 font-medium">
                            Model Name
                        </label>
                        <input type="text" id="model_name" placeholder="Ex: Model" className="w-full px-3 py-2 border rounded-md" {...register('model', { required: 'Model Name is required' })} />
                        {errors?.model && <span className="text-red-500 text-sm">{errors?.model?.message as string}</span>}
                    </div>

                    <div>
                        <label htmlFor="short_desc" className="block mt-4 mb-2 font-medium">
                            Short Description
                        </label>
                        <textarea
                            id="short_desc"
                            placeholder="Ex: Description"
                            rows={5}
                            maxLength={800}
                            className="w-full px-3 py-2 border rounded-md"
                            {...register('description', { required: 'Short Description is required' })}
                        />
                        {errors?.description && <span className="text-red-500 text-sm">{errors?.description?.message as string}</span>}
                        <p className="text-sm text-gray-500">Length/800</p>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex flex-col items-center justify-center">
                    <h5 className="font-medium mb-2">Model Logo</h5>
                    <label className="w-48 h-48 flex items-center justify-center border-dashed border-2 rounded-md cursor-pointer">
                        {brandLogo ? (
                            <img src={URL.createObjectURL(brandLogo)} alt="Logo Preview" className="w-full h-full object-contain" />
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

export default VehicleModelForm;
