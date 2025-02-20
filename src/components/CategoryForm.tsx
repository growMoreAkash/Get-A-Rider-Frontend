import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
// import { host } from '../secret';
import { useVehicleContext } from '../context/VehicleContext';
import Cookies from 'js-cookie';

const CategoryForm = ({ modelArr }: any) => {
    const host = 'http://localhost:8000/api';

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const { fetchCategories, setTriggerMappping } = useVehicleContext();

    const handleFormSubmit = async (data: any) => {
        var token = Cookies.get('token');
        data.apiUrl ='/addCategory';

        try {
            await axios.post(`${host}/addCategory`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    "Authorization": `Bearer ${token}`,
                },
            });
            reset();
            alert('successfull');
            fetchCategories();
        } catch (error) {
            alert('error');
        }
    };

    return (
        <div className="p-5">
            <h2 className="text-2xl font-semibold mb-5">Add Category</h2>
            <form onSubmit={handleSubmit(handleFormSubmit)}>
                <div className="mb-5 flex items-center gap-2">
                    <div className="flex-1">
                        <label htmlFor="dropdown" className="text-md font-semibold">
                            Type
                        </label>
                        <select id="dropdown" className="form-input" {...register('modelId', { required: 'Model is required' })}>
                            <option value="" className="text-md font-semibold">
                                Select Type
                            </option>
                            {modelArr?.map((type: any) => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                        {errors?.typeId && <span className="text-red-500 text-sm">{errors?.typeId?.message as string}</span>}
                    </div>
                    <div>
                        <label htmlFor="categoryImage">Category Image</label>
                        <input
                            id="categoryImage"
                            type="file"
                            className="form-input file:py-2 file:px-4 file:border-0 file:font-semibold p-0 file:bg-primary/90 file:text-white file:hover:bg-primary"
                        />
                    </div>
                </div>

                <div className="mb-5">
                    <label htmlFor="category" className="text-md font-semibold">
                        Category
                    </label>
                    <input type="text" id="category" {...register('category', { required: 'Category is required' })} className="form-input" />
                    {errors.category && <span className="text-red-500 text-sm">{errors?.category?.message as string}</span>}
                </div>

                <div>
                    <label htmlFor="brand" className="text-md font-semibold">
                        Short Description
                    </label>
                    <textarea className="form-input w-full" />
                </div>

                <div className="flex justify-end items-center mt-8">
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

export default CategoryForm;
