import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import useUpdateVehicleFeatures from '../../hooks/useUpdateVehicleFeatures';

interface BrandModCatUpdateFormProps {
    data: any;
    title: string;
    setOnEdit: any;
}

const BrandModCatUpdateForm: React.FC<BrandModCatUpdateFormProps> = ({ data, title, setOnEdit }: any) => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        setValue,
    } = useForm();

    const { handleUpdate } = useUpdateVehicleFeatures();

    const [logoPreview, setLogoPreview] = useState<string | null>(data.photo);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoPreview(URL.createObjectURL(file)); // For preview
            setValue('photo', file); // Set file correctly in react-hook-form
        }
    };

    console.log(data, 'data');

    const onSubmit = async (info: any) => {
        console.log(info, 'info');
        await handleUpdate(title, data, info, setOnEdit);
        reset();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded-lg p-6">
            <h5 className="text-xl font-bold text-teal-500 mb-4 capitalize">Edit {title}</h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Section - Brand Name & Description */}
                <div className="flex gap-4 flex-col">
                    <div>
                        <label htmlFor="brand" className="block mb-2 font-medium capitalize">
                            {title} Name
                        </label>
                        <input
                            type="text"
                            id="brand"
                            {...register(title, { required: `${title} name is required` })}
                            defaultValue={data.name}
                            placeholder="Ex: Brand"
                            className="w-full px-3 py-2 border rounded-md"
                        />
                        {errors?.brand && <span className="text-red-500 text-sm">{errors.brand.message as string}</span>}
                    </div>

                    <div>
                        <label htmlFor="description" className="block font-medium capitalize">
                            {title} Description
                        </label>
                        <textarea
                            id="description"
                            {...register('description', { required: `Description is required` })}
                            placeholder="Ex: Description"
                            rows={5}
                            maxLength={800}
                            className="w-full px-3 border rounded-md"
                            defaultValue={data.description}
                        />
                        {errors?.description && <span className="text-red-500 text-sm">{errors.description.message as string}</span>}
                    </div>
                </div>

                {/* Right Section - Brand Logo */}
                <div className="flex flex-col items-center justify-center">
                    <h5 className="font-medium mb-2 capitalize">{title} Logo</h5>
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
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-6 gap-5">
                <button className=" border-[1px] hover:bg-teal-500 hover:text-white border-teal-600 text-teal-600 shadow-none  px-4 py-2 rounded-md" onClick={() => setOnEdit(false)}>
                    Cancel
                </button>
                <button type="submit" className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-primary-dark capitalize">
                    Update {title}
                </button>
            </div>
        </form>
    );
};

export default BrandModCatUpdateForm;
