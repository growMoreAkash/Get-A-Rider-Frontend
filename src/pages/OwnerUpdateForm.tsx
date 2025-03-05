import axios from 'axios';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useForm, SubmitHandler, set } from 'react-hook-form';
import { use } from 'i18next';
import Cookies from 'js-cookie';

type FormData = {
    ownerName: string | undefined;
    ownerAge: number | undefined;
    ownerPincode: number | undefined;
    ownerBuildingNumber: string | undefined;
    ownerLandMark: string | undefined;
    ownerStreetAddress: string | undefined;
    ownerPhone: string | undefined;
    ownerWhatsapp: string | undefined;
    profession: string;
    religion: string;
    occupation: string;
    gender: string;
    careof: string | undefined;
    careofPhone: string | undefined;
};

const OwnerUpdateForm = ({ driverId, professions, religion, occupations, owners, selectedOwner, setSelectedOwner, fetchOwners }: any) => {
    const host = "https://api.getarider.in/api";
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm<FormData>({
        defaultValues: {
            ownerName: owners.find((owner: any) => owner._id === selectedOwner)?.ownerName.data,
            ownerAge: owners.find((owner: any) => owner._id === selectedOwner)?.ownerAge.data,
            gender: owners.find((owner: any) => owner._id === selectedOwner)?.gender.data,
            profession: owners.find((owner: any) => owner._id === selectedOwner)?.profession.data,
            // religion: owners.find((owner: any) => owner._id === selectedOwner)?.religion.data,
            occupation: owners.find((owner: any) => owner._id === selectedOwner)?.occupation.data,
            ownerPincode: owners.find((owner: any) => owner._id === selectedOwner)?.ownerPincode.data,
            ownerBuildingNumber: owners.find((owner: any) => owner._id === selectedOwner)?.ownerBuildingNumber.data,
            ownerLandMark: owners.find((owner: any) => owner._id === selectedOwner)?.ownerLandMark.data,
            ownerStreetAddress: owners.find((owner: any) => owner._id === selectedOwner)?.ownerStreetAddress.data,
            ownerPhone: owners.find((owner: any) => owner._id === selectedOwner)?.ownerPhone.data,
            ownerWhatsapp: owners.find((owner: any) => owner._id === selectedOwner)?.ownerWhatsapp.data,
            careof: owners.find((owner: any) => owner._id === selectedOwner)?.careof.data,
            careofPhone: owners.find((owner: any) => owner._id === selectedOwner)?.careofPhone.data,
        }
    });

    // const [imagePreview, setImagePreview] = useState();


    useEffect(() => {
        console.log(owners);
    }, []);

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
        console.log(data)

        try {
            await axios.put(`${host}/updateOwner/${driverId}/${selectedOwner}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('token')}`
                }
            });
            showMessage('Owner updated successfully', 'success');
            await fetchOwners();
            selectedOwner && setSelectedOwner(selectedOwner);
        } catch (error) {
            showMessage('Failed to add owner', 'error');
        }
    };

    return (
        <div>
            <div className="panel">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Main Container */}
                    <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                        {/* Left Section - Input Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Owner Id */}
                            <div>
                                <label htmlFor="ownerId" className="block text-sm font-medium text-gray-700">
                                    Owner
                                </label>
                                <select
                                    id="ownerId"
                                    className="form-input mt-1"
                                    onChange={(e) => {
                                        setSelectedOwner && setSelectedOwner(e.target.value);
                                        setValue('ownerName', owners.find((owner: any) => owner._id === e.target.value)?.ownerName.data);
                                        setValue('ownerAge', owners.find((owner: any) => owner._id === e.target.value)?.ownerAge.data);
                                        setValue('ownerPincode', owners.find((owner: any) => owner._id === e.target.value)?.ownerPincode.data);
                                        setValue('ownerBuildingNumber', owners.find((owner: any) => owner._id === e.target.value)?.ownerBuildingNumber.data);
                                        setValue('ownerLandMark', owners.find((owner: any) => owner._id === e.target.value)?.ownerLandMark.data);
                                        setValue('ownerStreetAddress', owners.find((owner: any) => owner._id === e.target.value)?.ownerStreetAddress.data);
                                        setValue('ownerPhone', owners.find((owner: any) => owner._id === e.target.value)?.ownerPhone.data);
                                        setValue('ownerWhatsapp', owners.find((owner: any) => owner._id === e.target.value)?.ownerWhatsapp.data);
                                        setValue('careof', owners.find((owner: any) => owner._id === e.target.value)?.careof.data);
                                        setValue('careofPhone', owners.find((owner: any) => owner._id === e.target.value)?.careofPhone.data);
                                    }}
                                    defaultValue={selectedOwner}
                                >
                                    <option value="">Select Owner</option>
                                    {owners.map((owner: any) => (
                                        <option key={owner._id} value={owner._id}>
                                            {owner.ownerName.data}
                                        </option>
                                    ))}
                                </select>
                                {/* {errors._id && <p className="text-red-500 text-sm">{errors._id.message}</p>} */}
                            </div>

                            {selectedOwner != "" &&
                                <>
                                    {/* Owner Name */}
                                    <div>
                                        <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">
                                            Owner Name
                                        </label>
                                        <input id="ownerName" type="text" {...register('ownerName', { required: 'Owner Name is required' })} placeholder="Enter Owner Name" className="form-input mt-1" />
                                        {/* {errors.ownerName && <p className="text-red-500 text-sm">{errors.ownerName.message}</p>} */}
                                    </div>

                                    {/* Owner Age */}
                                    <div>
                                        <label htmlFor="ownerAge" className="block text-sm font-medium text-gray-700">
                                            Owner Age
                                        </label>
                                        <input id="ownerAge" type="text" {...register('ownerAge', { required: 'Owner Age is required' })} placeholder="Enter Owner Age" className="form-input mt-1" />
                                        {/* {errors.ownerAge && <p className="text-red-500 text-sm">{errors.ownerAge.message}</p>} */}
                                    </div>

                                    {/* Owner Phone */}
                                    <div>
                                        <label htmlFor="ownerPhone" className="block text-sm font-medium text-gray-700">
                                            Owner Phone
                                        </label>
                                        <input id="ownerPhone" type="text" {...register('ownerPhone', { required: 'Owner Phone is required' })} placeholder="Enter Owner Phone" className="form-input mt-1" />
                                        {/* {errors.ownerPhone && <p className="text-red-500 text-sm">{errors.ownerPhone.message}</p>} */}
                                    </div>
                                    {/* profession gender occupation */}
                                    {/* o */}
                                    {/* <div>
                                        <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">
                                            Occupation
                                        </label>
                                        <select
                                            id="occupation"
                                            className="form-input mt-1"
                                            {...register('occupation')}
                                        >
                                            <option value="">Select Occupation</option>
                                            {occupations.map((occupation: any) => (
                                                <option key={occupation._id} value={occupation._id}>
                                                    {occupation.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                                            Gender
                                        </label>
                                        <select id="gender" {...register('gender')} className="form-input mt-1">
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="custom">Custom</option>
                                        </select>
                                        {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message as string}</p>}
                                    </div>

                                    <div>
                                        <label htmlFor="profession" className="block text-sm font-medium text-gray-700">
                                            profession
                                        </label>
                                        <select
                                            id="profession"
                                            className="form-input mt-1"
                                            {...register('profession')}
                                        >
                                            <option value="">Select profession</option>
                                            {professions.map((profession: any) => (
                                                <option key={profession._id} value={profession._id}>
                                                    {profession.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div> */}
                                    {/* ownerWhatsapp */}
                                    <div>
                                        <label htmlFor="ownerWhatsapp" className="block text-sm font-medium text-gray-700">
                                            ownerWhatsapp
                                        </label>
                                        <input id="ownerWhatsapp" type="text" {...register('ownerWhatsapp', { required: 'ownerWhatsapp is required' })} placeholder="Enter ownerWhatsapp" className="form-input mt-1" />
                                        {/* {errors.ownerWhatsapp && <p className="text-red-500 text-sm">{errors.ownerWhatsapp.message}</p>} */}
                                    </div>

                                    {/* Care of */}
                                    <div>
                                        <label htmlFor="careof" className="block text-sm font-medium text-gray-700">
                                            Care of
                                        </label>
                                        <input id="careof" type="text" {...register('careof', { required: 'Care of is required' })} placeholder="Enter Care of" className="form-input mt-1" />
                                        {/* {errors.careof && <p className="text-red-500 text-sm">{errors.careof.message}</p>} */}
                                    </div>

                                    {/* Care of Phone */}
                                    <div>
                                        <label htmlFor="careofPhone" className="block text-sm font-medium text-gray-700">
                                            Care of Phone
                                        </label>
                                        <input id="careofPhone" type="text" {...register('careofPhone', { required: 'Care of Phone is required' })} placeholder="Enter Care of Phone" className="form-input mt-1" />
                                        {/* {errors.careofPhone && <p className="text-red-500 text-sm">{errors.careofPhone.message}</p>} */}
                                    </div>

                                    {/* Owner Pincode */}
                                    <div>
                                        <label htmlFor="ownerPincode" className="block text-sm font-medium text-gray-700">
                                            Owner Pincode
                                        </label>
                                        <input id="ownerPincode" type="text" {...register('ownerPincode', { required: 'Owner Pincode is required' })} placeholder="Enter Owner Pincode" className="form-input mt-1" />
                                        {/* {errors.ownerPincode && <p className="text-red-500 text-sm">{errors.ownerPincode.message}</p>} */}
                                    </div>

                                    {/* Owner Building Name */}
                                    <div>
                                        <label htmlFor="ownerBuildingNumber" className="block text-sm font-medium text-gray-700">
                                            Owner Building Name
                                        </label>
                                        <input id="ownerBuildingNumber" type="text" {...register('ownerBuildingNumber', { required: 'Owner Building Name is required' })} placeholder="Enter Owner Building Name" className="form-input mt-1" />
                                        {/* {errors.ownerBuildingNumber && <p className="text-red-500 text-sm">{errors.ownerBuildingNumber.message}</p>} */}
                                    </div>

                                    {/* Owner Landmark */}
                                    <div>
                                        <label htmlFor="ownerLandMark" className="block text-sm font-medium text-gray-700">
                                            Owner Landmark
                                        </label>
                                        <input id="ownerLandMark" type="text" {...register('ownerLandMark', { required: 'Owner Landmark is required' })} placeholder="Enter Owner Landmark" className="form-input mt-1" />
                                        {/* {errors.ownerLandMark && <p className="text-red-500 text-sm">{errors.ownerLandMark.message}</p>} */}
                                    </div>

                                    {/* Owner Street Address */}
                                    <div>
                                        <label htmlFor="ownerStreetAddress" className="block text-sm font-medium text-gray-700">
                                            Owner Street Address
                                        </label>
                                        <input id="ownerStreetAddress" type="text" {...register('ownerStreetAddress', { required: 'Owner Street Address is required' })} placeholder="Enter Owner Street Address" className="form-input mt-1" />
                                        {/* {errors.ownerStreetAddress && <p className="text-red-500 text-sm">{errors.ownerStreetAddress.message}</p>} */}
                                    </div>
                                    <div>
                                        <label htmlFor="ownerStreetAddress" className="block text-sm font-medium text-gray-700">
                                            Owner Street Address
                                        </label>
                                        <input id="ownerStreetAddress" type="text" {...register('ownerStreetAddress', { required: 'Owner Street Address is required' })} placeholder="Enter Owner Street Address" className="form-input mt-1" />
                                        {/* {errors.ownerStreetAddress && <p className="text-red-500 text-sm">{errors.ownerStreetAddress.message}</p>} */}
                                    </div>


                                </>}
                        </div>

                        {/* Right Section - Owner Photo */}
                        {/* <div className="flex justify-center items-center flex-col ">
                            <label htmlFor="" className="block text-sm font-medium text-gray-700">
                                Owner Image
                            </label>
                            <div className="relative w-64 h-64 border-2 border-gray-300 rounded-md overflow-hidden shadow-md">
                                <input
                                    id="OwnerPhoto"
                                    type="file"
                                    accept="image/*"
                                    {...register('OwnerPhoto')}
                                    // onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />

                                {imagePreview ? (
                                    <img src={imagePreview} alt="Owner Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-100">No photo selected</div>
                                )}
                            </div>
                        </div> */}
                    </div>

                    {/* Submit Button */}
                    {selectedOwner != "" && <div className="flex justify-center mt-8">
                        <button type="submit" className="bg-teal-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-teal-600">
                            Update Owner
                        </button>
                    </div>}
                </form>
            </div>
        </div>
    );
};

export default OwnerUpdateForm;