import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useVehicleContext } from '../context/VehicleContext';
import Cookies from 'js-cookie';

const ModelForm = ({ typeArr, brandArr }: any) => {
    const host = 'http://localhost:8000/api';

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const { getTypeBrandModel } = useVehicleContext();

    const handleFormSubmit = async (data: any) => {
        var token = Cookies.get('token');
        data.apiUrl ='/addCategory';

        try {
            await axios.post(`${host}/addModel`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            reset();
            getTypeBrandModel();
        } catch (error) {
            //////.log(error, 'error while submitting model');
            alert('error');
        }
    };

    return (
        <div className="p-5 ">
            <h2 className="text-2xl font-semibold mb-5">Add Model</h2>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
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
                        {errors?.typeId && <span className="text-red-500 text-sm">{errors?.typeId?.message as string}</span>}
                    </div>
                    <div>
                        <label htmlFor="modelImage">Model Image</label>
                        <input id="modelImage" type="file" className="form-input file:py-2 file:px-4 file:border-0 file:font-semibold p-0 file:bg-primary/90 file:text-white file:hover:bg-primary" />
                    </div>
                </div>

                {/* Brand drop down */}
                <div className="mb-5">
                    <label htmlFor="dropdown" className="text-md font-semibold">
                        Brand
                    </label>
                    <select id="dropdown" className="form-input" {...register('brandId', { required: 'Brand is required' })}>
                        <option value="" className="text-md font-semibold">
                            Select Brand
                        </option>
                        {brandArr?.map((brand: any) => (
                            <option key={brand.id} value={brand.id}>
                                {brand.name}
                            </option>
                        ))}
                    </select>
                    {errors?.brandId && <span className="text-red-500 text-sm">{errors?.brandId?.message as string}</span>}
                </div>

                <div className="mb-5">
                    <label htmlFor="model" className="text-md font-semibold">
                        Model
                    </label>
                    <input type="text" id="model" {...register('model', { required: 'Model is required' })} className="form-input" />
                    {errors?.model && <span className="text-red-500 text-sm">{errors?.model?.message as string}</span>}
                </div>
                <div>
                    <label htmlFor="brand" className="text-md font-semibold">
                        Short Description
                    </label>
                    <textarea className="form-input w-full" />
                </div>
                <div className="flex justify-end items-center mt-2">
                    <button type="button" className="btn btn-outline-danger" onClick={() => {}}>
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-primary ltr:ml-4 rtl:mr-4">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ModelForm;
