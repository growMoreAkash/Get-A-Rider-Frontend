import axios from 'axios';
import { host } from '../secret';
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

type FormData = {
    ownerName: string;
    ownerAge: number;
    ownerBuildingNumber: string;
    ownerPincode: string;
    ownerStreetAddress: string;
    ownerLandMark: string;
    ownerPhone: string;
    ownerWhatsapp: string;
    careof: string;
    careofPhone: string;
    careofWhatsapp: string;
    driverId: string | null;
};

interface OwnerFormProps {
    driverId: string | null;
}

const OwnerForm: React.FC<OwnerFormProps> = ({ driverId }: any) => {
    const host = "http://localhost:8000/api"
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>();

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };


    const onSubmit: SubmitHandler<FormData> = async (data) => {
        //////.log(data);

        // const cookie = Cookies?.get('driver_token');
        // data.driverId = driverId;

        try {
            await axios.post(`${host}/addOwner/${driverId}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get("token")}`
                }
            });
            showMessage('Owner added successfully', 'success');
            reset();
        } catch (error) {
            showMessage('Failed to add owner', 'error');
        }
    };

    return (
        <div>
            <div className="panel">
                <div className="flex flex-col">
                    <h2 className="text-2xl font-bold mb-6 text-center">Owner Registration Form</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                        {/* Owner Name */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium">Owner Name</label>
                            <input
                                {...register('ownerName')}
                                className="form-input w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600"
                            />
                            {errors.ownerName && <p className="text-red-500 text-sm">{errors.ownerName.message}</p>}
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium">Owner Age</label>
                            <input
                                type="number"
                                {...register('ownerAge')}
                                className="form-input w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600"
                            />
                            {errors.ownerAge && <p className="text-red-500 text-sm">{errors.ownerAge.message}</p>}
                        </div>

                        {/* Owner Permanent Address */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium">Owner Building Number</label>
                            <input
                                {...register('ownerBuildingNumber', { required: 'building nummber is required' })}
                                className="form-input w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600"
                            />
                            {errors.ownerBuildingNumber && <p className="text-red-500 text-sm">{errors.ownerBuildingNumber.message}</p>}
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium">Owner Pincode</label>
                            <input
                                {...register('ownerPincode', { required: 'pincode is required' })}
                                className="form-input w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600"
                            />
                            {errors.ownerPincode && <p className="text-red-500 text-sm">{errors.ownerPincode.message}</p>}
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium">Owner Street Address</label>
                            <textarea
                                {...register('ownerStreetAddress', { required: 'pincode is required' })}
                                className="form-input w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600"
                            />
                            {errors.ownerStreetAddress && <p className="text-red-500 text-sm">{errors.ownerStreetAddress.message}</p>}
                        </div>
                        <div className="flex flex-col">
                            <label className="text-sm font-medium">Owner Landmark</label>
                            <textarea
                                {...register('ownerLandMark', { required: 'ownerLandMark is required' })}
                                className="form-input w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600"
                            />
                            {errors.ownerLandMark && <p className="text-red-500 text-sm">{errors.ownerLandMark.message}</p>}
                        </div>
                        
                        {/* Owner Phone */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium">Owner Phone</label>
                            <input
                                type="text"
                                {...register('ownerPhone', { required: 'Phone number is required' })}
                                className="form-input w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600"
                            />
                            {errors.ownerPhone && <p className="text-red-500 text-sm">{errors.ownerPhone.message}</p>}
                        </div>
                        
                        {/* Whatsapp */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium">Owner WhatsApp</label>
                            <input type="text" {...register('ownerWhatsapp')} className="form-input w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600" />
                        </div>

                        {/* Careof */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium">Care Of</label>
                            <input {...register('careof')} className="form-input w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600" />
                        </div>
                        
                        {/* Careof Phone */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium">Care Of Phone</label>
                            <input type="text" {...register('careofPhone')} className="form-input w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600" />
                        </div>

                        {/* Care Of WhatsApp */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium">Care Of WhatsApp</label>
                            <input
                                type="text"
                                {...register('careofWhatsapp')}
                                className="form-input w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-600"
                            />
                            {errors.careofPhone && <p className="text-red-500 text-sm">{errors.careofPhone.message}</p>}
                        </div>
                        <button
                            type="submit"
                            className="w-[100px] flex justify-center hover:text-white text-teal-700 p-3 rounded-md hover:bg-teal-500 focus:outline-none focus:ring-1 border-[1px] border-teal-600"
                        >
                            Register
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default OwnerForm;
