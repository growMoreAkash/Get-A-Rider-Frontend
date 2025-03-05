import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

// 1) Define all the file fields your form will handle:
interface UpdateFormFields {
    aadhaarFront: FileList | null;
    aadhaarBack: FileList | null;
    addressProof: FileList | null;
    drivingFront: FileList | null;
    drivingBack: FileList | null;
    ownerVehicle: FileList | null;
    ownerPhoto: FileList | null;
}

interface OwnerData {
    // Extend as needed if you store other owner properties
    _id: string;
    documents?: {
        aadhaarFront?: { data: string };
        aadhaarBack?: { data: string };
        addressProof?: { data: string };
        drivingFront?: { data: string };
        drivingBack?: { data: string };
        ownerVehicle?: { data: string };
        ownerPhoto?: { data: string };
    };
}

interface DocUpdateOwnerProps {
    driverId: string;
    owners: OwnerData[];
    selectedOwner: string;
    setSelectedOwner: (ownerId: string) => void;
    fetchOwners: () => void;
    onSave?: () => void;
    onCancel?: () => void;
}

// 2) Main Component
const DocUpdateOwner: React.FC<DocUpdateOwnerProps> = ({ driverId, owners, selectedOwner, setSelectedOwner, fetchOwners, onSave, onCancel }) => {
    // Replace with your actual backend URL:
    const host = 'http://localhost:8000/api';

    // 3) We'll store previews in an object keyed by field name
    const [filePreviews, setFilePreviews] = useState<{
        [key: string]: string | null;
    }>({});

    // 4) Initialize react-hook-form
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<UpdateFormFields>({
        defaultValues: {
            aadhaarFront: null,
            aadhaarBack: null,
            addressProof: null,
            drivingFront: null,
            drivingBack: null,
            ownerVehicle: null,
            ownerPhoto: null,
        },
    });

    // 5) If editing an existing owner, reset form & set previews if you have existing images
    useEffect(() => {
        if (selectedOwner) {
            reset({
                aadhaarFront: null,
                aadhaarBack: null,
                addressProof: null,
                drivingFront: null,
                drivingBack: null,
                ownerVehicle: null,
                ownerPhoto: null,
            });

            // If the backend returns existing images, set them as preview
            const doc = owners.find((o) => o._id === selectedOwner)?.documents;
            if (doc) {
                const newPreviews: { [key: string]: string | null } = {};
                if (doc.aadhaarFront?.data) {
                    newPreviews['aadhaarFront'] = doc.aadhaarFront.data;
                }
                if (doc.aadhaarBack?.data) {
                    newPreviews['aadhaarBack'] = doc.aadhaarBack.data;
                }
                if (doc.drivingFront?.data) {
                    newPreviews['drivingFront'] = doc.drivingFront.data;
                }
                if (doc.drivingBack?.data) {
                    newPreviews['drivingBack'] = doc.drivingBack.data;
                }
                if (doc.addressProof?.data) {
                    newPreviews['addressProof'] = doc.addressProof.data;
                }
                if (doc.ownerVehicle?.data) {
                    newPreviews['ownerVehicle'] = doc.ownerVehicle.data;
                }
                if (doc.ownerPhoto?.data) {
                    newPreviews['ownerPhoto'] = doc.ownerPhoto.data;
                }
                setFilePreviews((prev) => ({ ...prev, ...newPreviews }));
            }
        }
    }, [owners, selectedOwner, reset]);

    const onSubmit: SubmitHandler<UpdateFormFields> = async (data) => {
        try {
            const apiUrl ='/uploadOwnerDocuments/:driverId/:ownerId';
            var token = Cookies.get('token');
            const formData = new FormData();

            if (data.aadhaarFront && data.aadhaarFront.length > 0) {
                formData.append('aadhaarFront', data.aadhaarFront[0]);
            }
            if (data.aadhaarBack && data.aadhaarBack.length > 0) {
                formData.append('aadhaarBack', data.aadhaarBack[0]);
            }
            if (data.drivingFront && data.drivingFront.length > 0) {
                formData.append('drivingFront', data.drivingFront[0]);
            }
            if (data.drivingBack && data.drivingBack.length > 0) {
                formData.append('drivingBack', data.drivingBack[0]);
            }
            if (data.addressProof && data.addressProof.length > 0) {
                formData.append('addressProof', data.addressProof[0]);
            }
            if (data.ownerVehicle && data.ownerVehicle.length > 0) {
                formData.append('ownerVehicle', data.ownerVehicle[0]);
            }
            if (data.ownerPhoto && data.ownerPhoto.length > 0) {
                formData.append('ownerPhoto', data.ownerPhoto[0]);
            }
            formData.append('apiUrl', apiUrl);
            console.log(formData);

            await axios.post(`${host}/uploadOwnerDocuments/${driverId}/${selectedOwner}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
            });

            Swal.fire({
                icon: 'success',
                title: 'Owner documents updated successfully',
                timer: 3000,
            });

            if (onSave) onSave();
        } catch (error: any) {
            //.error('Error while updating owner documents:', error);
            Swal.fire('Error', 'Failed to update owner documents. Try again.', 'error');
        }
    };

    // 7) Generic change handler to set a local preview
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (val: FileList | null) => void) => {
        const { id, files } = e.target;
        onChange(files || null); // This updates react-hook-form’s state

        if (files && files[0]) {
            const localUrl = URL.createObjectURL(files[0]);
            setFilePreviews((prev) => ({ ...prev, [id]: localUrl }));
        } else {
            setFilePreviews((prev) => ({ ...prev, [id]: null }));
        }
    };

    useEffect(() => {
        return () => {
            Object.values(filePreviews).forEach((url) => {
                if (url) URL.revokeObjectURL(url);
            });
        };
    }, [filePreviews]);

    // 9) Render the form
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

            {owners.find((owner: any) => owner._id === selectedOwner) != null && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {/* Aadhaar Front */}
                        <div>
                            <label htmlFor="aadhaarFront" className="block text-sm font-medium text-gray-700">
                                Aadhaar Front
                            </label>
                            <div className="relative w-[200px] h-[200px] border-2 border-gray-300 rounded-md overflow-hidden shadow-md">
                                <Controller
                                    name="aadhaarFront"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            id="aadhaarFront"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, field.onChange)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    )}
                                />
                                {filePreviews['aadhaarFront'] ? (
                                    <img src={filePreviews['aadhaarFront'] as string} alt="Aadhaar Front Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-100">No photo selected</div>
                                )}
                            </div>
                            {errors.aadhaarFront && <p className="text-red-500 text-sm mt-1">{errors.aadhaarFront.message as string}</p>}
                        </div>

                        {/* Aadhaar Back */}
                        <div>
                            <label htmlFor="aadhaarBack" className="block text-sm font-medium text-gray-700">
                                Aadhaar Back
                            </label>
                            <div className="relative w-[200px] h-[200px] border-2 border-gray-300 rounded-md overflow-hidden shadow-md">
                                <Controller
                                    name="aadhaarBack"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            id="aadhaarBack"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, field.onChange)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    )}
                                />
                                {filePreviews['aadhaarBack'] ? (
                                    <img src={filePreviews['aadhaarBack'] as string} alt="Aadhaar Back Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-100">No photo selected</div>
                                )}
                            </div>
                        </div>

                        {/* Driving License (Front) */}
                        <div>
                            <label htmlFor="drivingFront" className="block text-sm font-medium text-gray-700">
                                Driving License (Front)
                            </label>
                            <div className="relative w-[200px] h-[200px] border-2 border-gray-300 rounded-md overflow-hidden shadow-md">
                                <Controller
                                    name="drivingFront"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            id="drivingFront"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, field.onChange)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    )}
                                />
                                {filePreviews['drivingFront'] ? (
                                    <img src={filePreviews['drivingFront'] as string} alt="Driving License Front Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-100">No photo selected</div>
                                )}
                            </div>
                        </div>

                        {/* Driving License (Back) */}
                        <div>
                            <label htmlFor="drivingBack" className="block text-sm font-medium text-gray-700">
                                Driving License (Back)
                            </label>
                            <div className="relative w-[200px] h-[200px] border-2 border-gray-300 rounded-md overflow-hidden shadow-md">
                                <Controller
                                    name="drivingBack"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            id="drivingBack"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, field.onChange)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    )}
                                />
                                {filePreviews['drivingBack'] ? (
                                    <img src={filePreviews['drivingBack'] as string} alt="Driving License Back Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-100">No photo selected</div>
                                )}
                            </div>
                        </div>

                        {/* Address Proof */}
                        <div>
                            <label htmlFor="addressProof" className="block text-sm font-medium text-gray-700">
                                Address Proof
                            </label>
                            <div className="relative w-[200px] h-[200px] border-2 border-gray-300 rounded-md overflow-hidden shadow-md">
                                <Controller
                                    name="addressProof"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            id="addressProof"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, field.onChange)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    )}
                                />
                                {filePreviews['addressProof'] ? (
                                    <img src={filePreviews['addressProof'] as string} alt="Address Proof Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-100">No photo selected</div>
                                )}
                            </div>
                        </div>

                        {/* Owner Vehicle */}
                        <div>
                            <label htmlFor="ownerVehicle" className="block text-sm font-medium text-gray-700">
                                Owner Vehicle
                            </label>
                            <div className="relative w-[200px] h-[200px] border-2 border-gray-300 rounded-md overflow-hidden shadow-md">
                                <Controller
                                    name="ownerVehicle"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            id="ownerVehicle"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, field.onChange)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    )}
                                />
                                {filePreviews['ownerVehicle'] ? (
                                    <img src={filePreviews['ownerVehicle'] as string} alt="Owner Vehicle Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-100">No photo selected</div>
                                )}
                            </div>
                        </div>

                        {/* Owner Photo */}
                        <div>
                            <label htmlFor="ownerPhoto" className="block text-sm font-medium text-gray-700">
                                Owner Photo
                            </label>
                            <div className="relative w-[200px] h-[200px] border-2 border-gray-300 rounded-md overflow-hidden shadow-md">
                                <Controller
                                    name="ownerPhoto"
                                    control={control}
                                    render={({ field }) => (
                                        <input
                                            id="ownerPhoto"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, field.onChange)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    )}
                                />
                                {filePreviews['ownerPhoto'] ? (
                                    <img src={filePreviews['ownerPhoto'] as string} alt="Owner Photo Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-100">No photo selected</div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Submit Button */}
                    <div className="flex justify-center mt-8">
                        <button type="submit" className="bg-teal-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-teal-600">
                            Update Owner
                        </button>
                    </div>
                </>
            )}
        </form>
    );
};

export default DocUpdateOwner;
