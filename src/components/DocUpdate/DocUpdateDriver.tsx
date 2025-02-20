import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useDriver } from '../../context/DriverContext';
import Cookies from 'js-cookie';

// 1) Define all the file fields your form will handle:
interface UpdateFormFields {
    aadhaarFront: FileList | null;
    aadhaarBack: FileList | null;
    panFront: FileList | null;
    panBack: FileList | null;
    drivingFront: FileList | null;
    drivingBack: FileList | null;
    addressProof: FileList | null;
    vehicleDriver: FileList | null;
    numberDriver: FileList | null;
    passBook: FileList | null;
    qrCode: FileList | null;
    pollution: FileList | null;
    care: FileList | null;
}

interface DriverData {
    // Extend as needed if you store other driver properties
    driverDocument?: {
        aadhaarFront?: { data: string };
        aadhaarBack?: { data: string };
        panFront?: { data: string };
        panBack?: { data: string };
        drivingFront?: { data: string };
        drivingBack?: { data: string };
        addressProof?: { data: string };
        vehicleDriver?: { data: string };
        numberDriver?: { data: string };
        passBook?: { data: string };
        qrCode?: { data: string };
        pollution?: { data: string };
        care?: { data: string };
    };
}

interface DocUpdateDriverProps {
    driver: DriverData | null;
    onSave?: () => void;
    onCancel?: () => void;
}

// 2) Main Component
const DocUpdateDriver: React.FC<DocUpdateDriverProps> = ({ driver, onSave, onCancel }) => {
    // Get driverId from context (or other source)
    const { driverId } = useDriver();

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
            aadhaarFront: null,
            aadhaarBack: null,
            panFront: null,
            panBack: null,
            drivingFront: null,
            drivingBack: null,
            addressProof: null,
            vehicleDriver: null,
            numberDriver: null,
            passBook: null,
            qrCode: null,
            pollution: null,
            care: null,
        },
    });

    // 5) If editing an existing driver, reset form & set previews if you have existing images
    useEffect(() => {
        if (driver) {
            reset({
                aadhaarFront: null,
                aadhaarBack: null,
                panFront: null,
                panBack: null,
                drivingFront: null,
                drivingBack: null,
                addressProof: null,
                vehicleDriver: null,
                numberDriver: null,
                passBook: null,
                qrCode: null,
                pollution: null,
                care: null,
            });

            // If the backend returns existing images, set them as preview
            const doc = driver.driverDocument;
            if (doc) {
                const newPreviews: { [key: string]: string | null } = {};
                if (doc.aadhaarFront?.data) {
                    newPreviews['aadhaarFront'] = doc.aadhaarFront.data;
                }
                if (doc.aadhaarBack?.data) {
                    newPreviews['aadhaarBack'] = doc.aadhaarBack.data;
                }
                if (doc.panFront?.data) {
                    newPreviews['panFront'] = doc.panFront.data;
                }
                if (doc.panBack?.data) {
                    newPreviews['panBack'] = doc.panBack.data;
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
                if (doc.vehicleDriver?.data) {
                    newPreviews['vehicleDriver'] = doc.vehicleDriver.data;
                }
                if (doc.numberDriver?.data) {
                    newPreviews['numberDriver'] = doc.numberDriver.data;
                }
                if (doc.passBook?.data) {
                    newPreviews['passBook'] = doc.passBook.data;
                }
                if (doc.qrCode?.data) {
                    newPreviews['qrCode'] = doc.qrCode.data;
                }
                if (doc.pollution?.data) {
                    newPreviews['pollution'] = doc.pollution.data;
                }
                if (doc.care?.data) {
                    newPreviews['care'] = doc.care.data;
                }
                setFilePreviews((prev) => ({ ...prev, ...newPreviews }));
            }
        }
    }, [driver, reset]);

    const onSubmit: SubmitHandler<UpdateFormFields> = async (data) => {
        try {
            const apiUrl ='/uploadDriverDocuments/:id';
            var token = Cookies.get('token');
            const formData = new FormData();

            if (data.aadhaarFront && data.aadhaarFront.length > 0) {
                formData.append('aadhaarFront', data.aadhaarFront[0]);
            }
            if (data.aadhaarBack && data.aadhaarBack.length > 0) {
                formData.append('aadhaarBack', data.aadhaarBack[0]);
            }
            if (data.panFront && data.panFront.length > 0) {
                formData.append('panFront', data.panFront[0]);
            }
            if (data.panBack && data.panBack.length > 0) {
                formData.append('panBack', data.panBack[0]);
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
            if (data.vehicleDriver && data.vehicleDriver.length > 0) {
                formData.append('vehicleDriver', data.vehicleDriver[0]);
            }
            if (data.numberDriver && data.numberDriver.length > 0) {
                formData.append('numberDriver', data.numberDriver[0]);
            }
            if (data.passBook && data.passBook.length > 0) {
                formData.append('passBook', data.passBook[0]);
            }
            if (data.qrCode && data.qrCode.length > 0) {
                formData.append('qrCode', data.qrCode[0]);
            }
            if (data.pollution && data.pollution.length > 0) {
                formData.append('pollution', data.pollution[0]);
            }
            if (data.care && data.care.length > 0) {
                formData.append('care', data.care[0]);
            }
            formData.append('apiUrl', apiUrl);

            await axios.post(`${host}/uploadDriverDocuments/${driverId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            Swal.fire({
                icon: 'success',
                title: 'Driver documents updated successfully',
                timer: 3000,
            });

            if (onSave) onSave();
        } catch (error: any) {
            //.error('Error while updating driver documents:', error);
            Swal.fire('Error', 'Failed to update driver documents. Try again.', 'error');
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

                {/* Pan Front */}
                <div>
                    <label htmlFor="panFront" className="block text-sm font-medium text-gray-700">
                        Pan Card (Front)
                    </label>
                    <div className="relative w-[200px] h-[200px] border-2 border-gray-300 rounded-md overflow-hidden shadow-md">
                        <Controller
                            name="panFront"
                            control={control}
                            render={({ field }) => (
                                <input
                                    id="panFront"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, field.onChange)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            )}
                        />
                        {filePreviews['panFront'] ? (
                            <img src={filePreviews['panFront'] as string} alt="Pan Front Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-100">No photo selected</div>
                        )}
                    </div>
                </div>

                {/* Pan Back */}
                <div>
                    <label htmlFor="panBack" className="block text-sm font-medium text-gray-700">
                        Pan Card (Back)
                    </label>
                    <div className="relative w-[200px] h-[200px] border-2 border-gray-300 rounded-md overflow-hidden shadow-md">
                        <Controller
                            name="panBack"
                            control={control}
                            render={({ field }) => (
                                <input
                                    id="panBack"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, field.onChange)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            )}
                        />
                        {filePreviews['panBack'] ? (
                            <img src={filePreviews['panBack'] as string} alt="Pan Back Preview" className="w-full h-full object-cover" />
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

                {/* Vehicle Driver Photo */}
                <div>
                    <label htmlFor="vehicleDriver" className="block text-sm font-medium text-gray-700">
                        Vehicle Driver Photo
                    </label>
                    <div className="relative w-[200px] h-[200px] border-2 border-gray-300 rounded-md overflow-hidden shadow-md">
                        <Controller
                            name="vehicleDriver"
                            control={control}
                            render={({ field }) => (
                                <input
                                    id="vehicleDriver"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, field.onChange)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            )}
                        />
                        {filePreviews['vehicleDriver'] ? (
                            <img src={filePreviews['vehicleDriver'] as string} alt="Vehicle Driver Photo Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-100">No photo selected</div>
                        )}
                    </div>
                </div>

                {/* Vehicle Number and Driver Photo */}
                <div>
                    <label htmlFor="numberDriver" className="block text-sm font-medium text-gray-700">
                        Vehicle Number and Driver Photo
                    </label>
                    <div className="relative w-[200px] h-[200px] border-2 border-gray-300 rounded-md overflow-hidden shadow-md">
                        <Controller
                            name="numberDriver"
                            control={control}
                            render={({ field }) => (
                                <input
                                    id="numberDriver"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, field.onChange)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            )}
                        />
                        {filePreviews['numberDriver'] ? (
                            <img src={filePreviews['numberDriver'] as string} alt="Vehicle Number & Driver Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-100">No photo selected</div>
                        )}
                    </div>
                </div>

                {/* Driver's Passbook */}
                <div>
                    <label htmlFor="passBook" className="block text-sm font-medium text-gray-700">
                        Driver's Passbook
                    </label>
                    <div className="relative w-[200px] h-[200px] border-2 border-gray-300 rounded-md overflow-hidden shadow-md">
                        <Controller
                            name="passBook"
                            control={control}
                            render={({ field }) => (
                                <input
                                    id="passBook"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, field.onChange)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            )}
                        />
                        {filePreviews['passBook'] ? (
                            <img src={filePreviews['passBook'] as string} alt="Passbook Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-100">No photo selected</div>
                        )}
                    </div>
                </div>

                {/* Driver's QR-code */}
                <div>
                    <label htmlFor="qrCode" className="block text-sm font-medium text-gray-700">
                        Driver's QR-code
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
                            <img src={filePreviews['qrCode'] as string} alt="Driver's QR-code Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-100">No photo selected</div>
                        )}
                    </div>
                </div>

                {/* Pollution Certificate (PDF Only) */}
                <div>
                    <label htmlFor="pollution" className="block text-sm font-medium text-gray-700">
                        Pollution Certificate (PDF)
                    </label>
                    <div className="relative w-[200px] h-[200px] border-2 border-gray-300 rounded-md overflow-hidden shadow-md">
                        <Controller
                            name="pollution"
                            control={control}
                            render={({ field }) => (
                                <input
                                    id="pollution"
                                    type="file"
                                    accept="application/pdf" // PDF only
                                    onChange={(e) => handleFileChange(e, field.onChange)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            )}
                        />

                        {/* We can’t display PDF in an <img> tag; show link or placeholder */}
                        {filePreviews['pollution'] ? (
                            <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100 text-gray-800 p-2">
                                <p className="text-sm mb-2">PDF Selected</p>
                                <a href={filePreviews['pollution'] as string} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                    View PDF
                                </a>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-100">No PDF selected</div>
                        )}
                    </div>
                </div>

                {/* Insurance Certificate (PDF Only) */}
                <div>
                    <label htmlFor="care" className="block text-sm font-medium text-gray-700">
                        Insurance Certificate (PDF)
                    </label>
                    <div className="relative w-[200px] h-[200px] border-2 border-gray-300 rounded-md overflow-hidden shadow-md">
                        <Controller
                            name="care"
                            control={control}
                            render={({ field }) => (
                                <input
                                    id="care"
                                    type="file"
                                    accept="application/pdf" // PDF only
                                    onChange={(e) => handleFileChange(e, field.onChange)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            )}
                        />

                        {filePreviews['care'] ? (
                            <div className="flex flex-col items-center justify-center w-full h-full bg-gray-100 text-gray-800 p-2">
                                <p className="text-sm mb-2">PDF Selected</p>
                                <a href={filePreviews['care'] as string} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                    View PDF
                                </a>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-100">No PDF selected</div>
                        )}
                    </div>
                </div>
            </div>
            {/* Submit Button */}
            <div className="flex justify-center mt-8">
                <button type="submit" className="bg-teal-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-teal-600">
                    Update Driver
                </button>
            </div>
        </form>
    );
};

export default DocUpdateDriver;
