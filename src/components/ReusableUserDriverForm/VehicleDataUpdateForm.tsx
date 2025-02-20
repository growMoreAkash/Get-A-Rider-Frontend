import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import useUpdateVehicleOtherData from '../../hooks/useUpdateVehicleOtherData';

const VehicleDataUpdateForm = ({ data, title, setOnEdit }: any) => {
    const registerTitle = title?.toLowerCase().replace(/\s/g, '');
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();
    const { updateVehicleData, loading } = useUpdateVehicleOtherData();

    const handleFormSubmit = async (info: any) => {
        await updateVehicleData(title, data, info, setOnEdit);
        reset();
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-white shadow-md rounded-lg p-6">
            <h5 className="text-xl font-bold text-teal-500 mb-4">Update {title}</h5>
            <div className="flex flex-col gap-4">
                <div className="flex gap-4 flex-col">
                    <label htmlFor="typeName" className="text-md font-semibold capitalize">
                        {title}
                    </label>
                    <input
                        id="typeName"
                        type="text"
                        {...register(registerTitle, { required: `${title} name is required` })}
                        className="form-input w-full"
                        defaultValue={title === 'acceleration' ? data.name.split('/')[0] : data.name}
                    />
                </div>

                {title === 'acceleration' && (
                    <div>
                        <label htmlFor="typeName" className="text-md font-semibold">
                            Time
                        </label>
                        <input id="typeName" type="text" {...register('time', { required: `time is required` })} className="form-input w-full" defaultValue={data.name.split('/')[1] || ''} />
                    </div>
                )}

                {/* <div>
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
        </div>
            {errors?.description && <span className="text-red-500 text-sm">{errors.description.message as string}</span>} */}
            </div>

            <div className="flex justify-end mt-6 gap-5">
                <button className=" border-[1px] hover:bg-teal-500 hover:text-white border-teal-600 text-teal-600 shadow-none  px-4 py-2 rounded-md" onClick={() => setOnEdit(false)}>
                    Cancel
                </button>
                <button type="submit" className=" border-[1px] hover:bg-teal-500 hover:text-white border-teal-600 text-teal-600 shadow-none  px-4 py-2 rounded-md ">
                    Update
                </button>
            </div>
        </form>
    );
};

export default VehicleDataUpdateForm;
