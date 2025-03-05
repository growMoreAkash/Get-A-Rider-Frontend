import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { useAuth } from '../context/UserContext';
import Cookies from 'js-cookie';

interface UpdateFormFields {
    username: string;
    phone: string;
    // registrationNumber: string;
    userPhoto?: File;
    careoff?: string;
    careoffphone?: string;
    pincode: string;
    identity_Type?: number;
    identity_Number: number;
    street_address: string;
    building_name: string;
    landmark: string;
}

const Updateform = ({ user, onSave, onCancel }: any) => {
    const host = "https://api.getarider.in/api"

    const { userId } = useAuth();
    const [imagePreview, setImagePreview] = useState<string | null>(null); // For previewing image
    const [fileName, setFileName] = useState<string>('No file selected');
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm<UpdateFormFields>({
        defaultValues: {
            username: user?.username || '',
            phone: user.phone || '',
            // registrationNumber: user.registrationNumber || '',
            careoff: user?.careoff || '',
            careoffphone: user?.careoffphone || '',
            pincode: user?.pincode || '',
            // identity_Type?: user.identity_Type || '',
            identity_Number: user?.identity_Number || '',
            building_name: user?.building_name || '',
            landmark: user?.landmark || '',
            street_address: user?.street_address || '',
            userPhoto: user?.userPhoto,
        },
    });

    useEffect(() => {
        if (user) {
            reset({
                username: user?.username || '',
                phone: user.phone || '',
                // registrationNumber: user.registrationNumber || '',
                careoff: user?.careoff || '',
                careoffphone: user?.careoffphone || '',
                pincode: user?.pincode || '',
                identity_Type: user.identity_Type || '',
                identity_Number: user?.identity_Number || '',
                building_name: user?.building_name || '',
                landmark: user?.landmark || '',
                street_address: user?.street_address || '',
            });
            if (user?.userPhoto) {
                setImagePreview(user?.userPhoto); // Cloudinary image URL
                setFileName(user?.userPhoto.split('/').pop() || 'Existing image');
            }
        }
    }, [user, reset]);

    const onSubmit = async (data: UpdateFormFields) => {
        try {
            alert("akash")
            //.log(data)
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined) {
                    formData.append(key, value as any);
                }
            });
            //.log(formData)
            await axios.put(`${host}/updateProfile/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${Cookies.get("token")}`
                },
            });

            Swal.fire({
                icon: 'success',
                title: 'Profile updated successfully',
                timer: 3000,
            });
        } catch (error) {
            //.error('Error while updating profile:', error);
            Swal.fire({
                icon: 'error',
                title: 'Failed to update profile',
                text: `error`,
            });
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setValue('userPhoto', file); // Update the userPhoto value
            setImagePreview(URL.createObjectURL(file)); // Preview the image
            setFileName(file.name); // Set the file name
        } else {
            setImagePreview(null); // Reset preview
            setFileName('No photo selected'); // Reset file name
        }
    };

    useEffect(() => {
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
        };
    }, [imagePreview]);

    return (
        <div>
            <div className="panel">
                <form className="space-y-5">
                    {/* Main Container */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Section - Input Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Driver Name */}
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                    Username
                                </label>
                                <input id="username" type="text" {...register('username', { required: 'Driver Name is required' })} placeholder="Enter Driver Name" className="form-input mt-1" />
                                {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                            </div>

                            {/* Care Of */}
                            <div>
                                <label htmlFor="careof" className="block text-sm font-medium text-gray-700">
                                    Care Of
                                </label>
                                <input id="careof" type="text" {...register('careoff')} placeholder="Enter Care Of" className="form-input mt-1" />
                            </div>

                            {/* Care Of Phone */}
                            <div>
                                <label htmlFor="careoffphone" className="block text-sm font-medium text-gray-700">
                                    Care Of Phone
                                </label>
                                <input
                                    id="careoffphone"
                                    type="text"
                                    {...register('careoffphone', {
                                        pattern: {
                                            value: /^[0-9]{10}$/,
                                            message: 'Enter a valid 10-digit phone number',
                                        },
                                    })}
                                    placeholder="Enter Care Of Phone"
                                    className="form-input mt-1"
                                />
                                {errors.careoffphone && <p className="text-red-500 text-sm">{errors.careoffphone.message}</p>}
                            </div>

                            {/* Identity Details */}
                            <div>
                                <label htmlFor="identity_Type" className="block text-sm font-medium text-gray-700">
                                    Identity Type
                                </label>
                                <select id="identity_Type" {...register('identity_Type', { required: 'Identity Type is required' })} className="form-input mt-1">
                                    <option value="">Select Type</option>
                                    <option value="aadhar">Aadhar</option>
                                    <option value="driving">Driving License</option>
                                </select>
                                {errors.identity_Type && <p className="text-red-500 text-sm">{errors.identity_Type.message}</p>}
                            </div>

                            {/* Identity Number */}
                            <div>
                                <label htmlFor="identity_Number" className="block text-sm font-medium text-gray-700">
                                    Identity Number
                                </label>
                                <input id="identity_Number" type="text" {...register('identity_Number')} placeholder="Enter Identity Number" className="form-input mt-1" />
                            </div>

                            {/* Address */}
                            <div>
                                <label htmlFor="street_address" className="block text-sm font-medium text-gray-700">
                                    Street Address
                                </label>
                                <input id="street_address" {...register('street_address')} placeholder="Enter Street Address" className="form-input mt-1" />
                            </div>

                            <div>
                                <label htmlFor="building_name" className="block text-sm font-medium text-gray-700">
                                    Building Name
                                </label>
                                <input id="building_name" {...register('building_name')} placeholder="Enter Building Name" className="form-input mt-1" />
                            </div>

                            <div>
                                <label htmlFor="landmark" className="block text-sm font-medium text-gray-700">
                                    Landmark
                                </label>
                                <input id="landmark" {...register('landmark')} placeholder="Enter Landmark" className="form-input mt-1" />
                            </div>
                        </div>

                        {/* Right Section - Driver Photo */}
                        <div className="flex justify-center items-center flex-col ">
                            <label htmlFor="" className="block text-sm font-medium text-gray-700">
                                User Photo
                            </label>
                            <div className="relative w-64 h-64 border-2 border-gray-300 rounded-md overflow-hidden shadow-md">
                                {/* Hidden File Input */}
                                <input
                                    id="userPhoto"
                                    type="file"
                                    accept="image/*"
                                    {...register('userPhoto')}
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />

                                {/* Image Preview or Placeholder */}
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Driver Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-100">No photo selected</div>
                                )}
                                {errors.userPhoto && <p className="text-red-500 text-sm mt-1">{errors.userPhoto.message}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center mt-8">
                        <button type="submit" className="bg-teal-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-teal-600">
                            Update User
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Updateform;
