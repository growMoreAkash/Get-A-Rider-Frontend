import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

// 1) Define all the file fields your form will handle:
interface UpdateFormFields {
    aadhaarCardFront: FileList | null;
    aadhaarCardBack: FileList | null;
    photo: FileList | null;
    cancelledChequeOrPassbook: FileList | null;
    houseProof: FileList | null;
    qrCode: FileList | null;
    signature: FileList | null;
}

interface PartnerData {
    _id: string;
    // Extend as needed if you store other partner properties
    uploads?: {
        aadhaarCardFront?: string;
        aadhaarCardBack?: string;
        photo?: string;
        cancelledChequeOrPassbook?: string;
        houseProof?: string;
        qrCode?: string;
        signature?: string;
    };
}

interface DocUpdatePartnerProps {
    partner: PartnerData;
    onSave?: () => void;
    onCancel?: () => void;
}

// 2) Main Component
const DocUpdatePartner: React.FC<DocUpdatePartnerProps> = ({ partner, onSave, onCancel }) => {
    // Replace with your actual backend URL:
    const host = 'https://api.getarider.in/api';

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
            aadhaarCardFront: null,
            aadhaarCardBack: null,
            photo: null,
            cancelledChequeOrPassbook: null,
            houseProof: null,
            qrCode: null,
            signature: null,
        },
    });

    // 5) If editing an existing partner, reset form & set previews if you have existing images
    useEffect(() => {
        if (partner) {
            reset({
                aadhaarCardFront: null,
                aadhaarCardBack: null,
                photo: null,
                cancelledChequeOrPassbook: null,
                houseProof: null,
                qrCode: null,
                signature: null,
            });

            // If the backend returns existing images, set them as preview
            const doc = partner.uploads;
            if (doc) {
                const newPreviews: { [key: string]: string | null } = {};
                if (doc.aadhaarCardFront) {
                    newPreviews['aadhaarCardFront'] = doc.aadhaarCardFront;
                }
                if (doc.aadhaarCardBack) {
                    newPreviews['aadhaarCardBack'] = doc.aadhaarCardBack;
                }
                if (doc.photo) {
                    newPreviews['photo'] = doc.photo;
                }
                if (doc.cancelledChequeOrPassbook) {
                    newPreviews['cancelledChequeOrPassbook'] = doc.cancelledChequeOrPassbook;
                }
                if (doc.houseProof) {
                    newPreviews['houseProof'] = doc.houseProof;
                }
                if (doc.qrCode) {
                    newPreviews['qrCode'] = doc.qrCode;
                }
                if (doc.signature) {
                    newPreviews['signature'] = doc.signature;
                }
                setFilePreviews((prev) => ({ ...prev, ...newPreviews }));
            }
        }
    }, [partner, reset]);

    const onSubmit: SubmitHandler<UpdateFormFields> = async (data) => {
        try {
            const apiUrl ='/uploadPartnerDocuments/:id';
            var token = Cookies.get('token');
            const formData = new FormData();

            if (data.aadhaarCardFront && data.aadhaarCardFront.length > 0) {
                formData.append('aadhaarCardFront', data.aadhaarCardFront[0]);
            }
            if (data.aadhaarCardBack && data.aadhaarCardBack.length > 0) {
                formData.append('aadhaarCardBack', data.aadhaarCardBack[0]);
            }
            if (data.photo && data.photo.length > 0) {
                formData.append('photo', data.photo[0]);
            }
            if (data.cancelledChequeOrPassbook && data.cancelledChequeOrPassbook.length > 0) {
                formData.append('cancelledChequeOrPassbook', data.cancelledChequeOrPassbook[0]);
            }
            if (data.houseProof && data.houseProof.length > 0) {
                formData.append('houseProof', data.houseProof[0]);
            }
            if (data.qrCode && data.qrCode.length > 0) {
                formData.append('qrCode', data.qrCode[0]);
            }
            if (data.signature && data.signature.length > 0) {
                formData.append('signature', data.signature[0]);
            }
            formData.append('apiUrl', apiUrl);

            await axios.post(`${host}/uploadPartnerDocuments/${partner._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            Swal.fire({
                icon: 'success',
                title: 'Partner documents updated successfully',
                timer: 3000,
            });

            if (onSave) onSave();
        } catch (error: any) {
            //.error('Error while updating partner documents:', error);
            Swal.fire('Error', 'Failed to update partner documents. Try again.', 'error');
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Aadhaar Card Front */}
                <div>
                    <label htmlFor="aadhaarCardFront" className="block text-sm font-medium text-gray-700">
                        Aadhaar Card Front
                    </label>
                    <div className="relative w-[200px] h-[200px] border-2 border-gray-300 rounded-md overflow-hidden shadow-md">
                        <Controller
                            name="aadhaarCardFront"
                            control={control}
                            render={({ field }) => (
                                <input
                                    id="aadhaarCardFront"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, field.onChange)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            )}
                        />
                        {filePreviews['aadhaarCardFront'] ? (
                            <img src={filePreviews['aadhaarCardFront'] as string} alt="Aadhaar Front Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-100">No photo selected</div>
                        )}
                    </div>
                    {errors.aadhaarCardFront && <p className="text-red-500 text-sm mt-1">{errors.aadhaarCardFront.message as string}</p>}
                </div>

                {/* Aadhaar Card Back */}
                <div>
                    <label htmlFor="aadhaarCardBack" className="block text-sm font-medium text-gray-700">
                        Aadhaar Card Back
                    </label>
                    <div className="relative w-[200px] h-[200px] border-2 border-gray-300 rounded-md overflow-hidden shadow-md">
                        <Controller
                            name="aadhaarCardBack"
                            control={control}
                            render={({ field }) => (
                                <input
                                    id="aadhaarCardBack"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, field.onChange)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            )}
                        />
                        {filePreviews['aadhaarCardBack'] ? (
                            <img src={filePreviews['aadhaarCardBack'] as string} alt="Aadhaar Back Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-100">No photo selected</div>
                        )}
                    </div>
                    {errors.aadhaarCardBack && <p className="text-red-500 text-sm mt-1">{errors.aadhaarCardBack.message as string}</p>}
                </div>

                {/* Photo */}
                <div>
                    <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                        Photo
                    </label>
                    <div className="relative w-[200px] h-[200px] border-2 border-gray-300 rounded-md overflow-hidden shadow-md">
                        <Controller
                            name="photo"
                            control={control}
                            render={({ field }) => (
                                <input
                                    id="photo"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, field.onChange)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            )}
                        />
                        {filePreviews['photo'] ? (
                            <img src={filePreviews['photo'] as string} alt="Photo Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-100">No photo selected</div>
                        )}
                    </div>
                    {errors.photo && <p className="text-red-500 text-sm mt-1">{errors.photo.message as string}</p>}
                </div>

                {/* Cancelled Cheque or Passbook */}
                <div>
                    <label htmlFor="cancelledChequeOrPassbook" className="block text-sm font-medium text-gray-700">
                        Cancelled Cheque or Passbook
                    </label>
                    <div className="relative w-[200px] h-[200px] border-2 border-gray-300 rounded-md overflow-hidden shadow-md">
                        <Controller
                            name="cancelledChequeOrPassbook"
                            control={control}
                            render={({ field }) => (
                                <input
                                    id="cancelledChequeOrPassbook"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, field.onChange)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            )}
                        />
                        {filePreviews['cancelledChequeOrPassbook'] ? (
                            <img src={filePreviews['cancelledChequeOrPassbook'] as string} alt="Cancelled Cheque or Passbook Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-100">No photo selected</div>
                        )}
                    </div>
                    {errors.cancelledChequeOrPassbook && <p className="text-red-500 text-sm mt-1">{errors.cancelledChequeOrPassbook.message as string}</p>}
                </div>

                {/* House Proof */}
                <div>
                    <label htmlFor="houseProof" className="block text-sm font-medium text-gray-700">
                        House Proof
                    </label>
                    <div className="relative w-[200px] h-[200px] border-2 border-gray-300 rounded-md overflow-hidden shadow-md">
                        <Controller
                            name="houseProof"
                            control={control}
                            render={({ field }) => (
                                <input
                                    id="houseProof"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, field.onChange)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            )}
                        />
                        {filePreviews['houseProof'] ? (
                            <img src={filePreviews['houseProof'] as string} alt="House Proof Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-100">No photo selected</div>
                        )}
                    </div>
                    {errors.houseProof && <p className="text-red-500 text-sm mt-1">{errors.houseProof.message as string}</p>}
                </div>

                {/* QR Code */}
                <div>
                    <label htmlFor="qrCode" className="block text-sm font-medium text-gray-700">
                        QR Code
                    </label>
                    <div className="relative w-[200px] h-[200px] border-2 border-gray-300 rounded-md overflow-hidden shadow-md">
                        <Controller
                            name="qrCode"
                            control={control}
                            render={({ field }) => (
                                <input
                                    id="qrCode"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, field.onChange)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            )}
                        />
                        {filePreviews['qrCode'] ? (
                            <img src={filePreviews['qrCode'] as string} alt="QR Code Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-100">No photo selected</div>
                        )}
                    </div>
                    {errors.qrCode && <p className="text-red-500 text-sm mt-1">{errors.qrCode.message as string}</p>}
                </div>

                {/* Signature */}
                <div>
                    <label htmlFor="signature" className="block text-sm font-medium text-gray-700">
                        Signature
                    </label>
                    <div className="relative w-[200px] h-[200px] border-2 border-gray-300 rounded-md overflow-hidden shadow-md">
                        <Controller
                            name="signature"
                            control={control}
                            render={({ field }) => (
                                <input
                                    id="signature"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, field.onChange)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            )}
                        />
                        {filePreviews['signature'] ? (
                            <img src={filePreviews['signature'] as string} alt="Signature Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-100">No photo selected</div>
                        )}
                    </div>
                    {errors.signature && <p className="text-red-500 text-sm mt-1">{errors.signature.message as string}</p>}
                </div>
            </div>
            {/* Submit Button */}
            <div className="flex justify-center mt-8">
                <button type="submit" className="bg-teal-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-teal-600">
                    Update Partner
                </button>
            </div>
        </form>
    );
};

export default DocUpdatePartner;
