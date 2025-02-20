import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useVehicleContext } from '../context/VehicleContext';
import Cookies from 'js-cookie';

const BrandForm = ({ typeArr }: any) => {

    const host = "http://localhost:8000/api"
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const { getTypeBrandModel } = useVehicleContext();

    const handleFormSubmit = async (data: any) => {
        var apiUrl ="/addBrand";
        var token = Cookies.get("token");

        //////.log('Form Data:', data);

        try {
            const formData = new FormData();
            formData.append('typeId', data.typeId);
            formData.append('brand', data.brand);
            formData.append('description', data.description);
            if (data.photo && data.photo[0]) {
                formData.append('photo', data.brandLogo[0]);
            }
            formData.append("apiUrl",apiUrl);

            await axios.post(`${host}/addBrand`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                      'Authorization': `Bearer ${Cookies.get("token")}`
                },
            });

            alert('Brand added successfully');
            reset();
            getTypeBrandModel();
        } catch (error) {
            //.error('Error while submitting brand:', error);
            alert('Error adding brand');
        }
    };

    return (
        <div className="p-5">
            <h2 className="text-2xl font-semibold mb-5">Add Brand</h2>
            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
                <div className="mb-5 flex items-center gap-2">
                    <div className="flex-1">
                        <label htmlFor="dropdown" className="text-md font-semibold">
                            Type
                        </label>
                        <select id="dropdown" className="form-input" {...register('typeId', { required: 'Type is required' })}>
                            <option value="" className="text-md font-semibold">
                                Select Type
                            </option>
                            {typeArr?.map((type: any) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                        {errors?.typeId?.message && <span className="text-red-500 text-sm">{errors.typeId.message as string}</span>}
                    </div>
                    <div>
                        <label htmlFor="brandLogo">Brand Logo</label>
                        <input
                            id="brandLogo"
                            type="file"
                            className="form-input file:py-2 file:px-4 file:border-0 file:font-semibold p-0 file:bg-primary/90 file:text-white file:hover:bg-primary"
                            {...register('photo')}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="brand" className="text-md font-semibold">
                        Brand
                    </label>
                    <input type="text" id="brand" {...register('brand', { required: 'Brand is required' })} className="form-input w-full" />
                    {errors?.brand && <p className="text-red-500 text-sm">{errors?.brand?.message as string}</p>}
                </div>

                <div>
                    <label htmlFor="description" className="text-md font-semibold">
                        Short Description
                    </label>
                    <textarea id="description" {...register('description', { required: 'Description is required' })} className="form-input w-full" />
                    {errors?.description && <p className="text-red-500 text-sm">{errors?.description?.message as string}</p>}
                </div>

                <div className="flex justify-end items-center mt-8">
                    <button type="button" className="btn btn-outline-danger" onClick={() => reset()}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary ml-4">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BrandForm;
