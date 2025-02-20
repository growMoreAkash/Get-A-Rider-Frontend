// import React, { useEffect, useState } from 'react';
// import { useForm, SubmitHandler, Controller } from 'react-hook-form';
// import axios from 'axios';
// import Swal from 'sweetalert2';
// import { useDriver } from '../../context/DriverContext';

// // Define all the file fields your form will handle
// interface UpdateFormFields {
//     vehicleFrontMiddle: FileList | null;
//     vehicleFrontRight: FileList | null;
//     vehicleFrontLeft: FileList | null;
//     vehicleBack: FileList | null;
//     vehicleNumberPlate: FileList | null;
//     vehicleSeat1: FileList | null;
//     vehicleSeat2: FileList | null;
//     RCPhoto: FileList | null;
//     vehicleFull: FileList | null;
// }

// interface VehicleDocument {
//     data?: string;
//   }

//   interface Vehicle {
//     _id: string;
//     driverId: string;
//     documents?: {
//       vehicleFrontMiddle?: VehicleDocument;
//       vehicleFrontRight?: VehicleDocument;
//       vehicleFrontLeft?: VehicleDocument;
//       vehicleBack?: VehicleDocument;
//       vehicleNumberPlate?: VehicleDocument;
//       vehicleSeat1?: VehicleDocument;
//       vehicleSeat2?: VehicleDocument;
//       RCPhoto?: VehicleDocument;
//       vehicleFull?: VehicleDocument;
//     };
//   }

//   interface VehicleData {
//     vehicles: Vehicle[];
//   }

// interface DocUpdateVehicleProps {
//     vehicle: VehicleData | null;
//     onSave?: () => void;
//     onCancel?: () => void;
// }

// const DocUpdateVehicle: React.FC<DocUpdateVehicleProps> = ({ vehicle, onSave, onCancel }) => {
//     const oldVehicleDocuments = vehicle?.vehicles[0]?.documents || {};
//     const host = 'https://api.getarider.in/api';

//     const [filePreviews, setFilePreviews] = useState<{ [key: string]: string | null }>({});

//     const {
//         control,
//         handleSubmit,
//         formState: { errors },
//         reset,
//     } = useForm<UpdateFormFields>({
//         defaultValues: {
//             vehicleFrontMiddle: null,
//             vehicleFrontRight: null,
//             vehicleFrontLeft: null,
//             vehicleBack: null,
//             vehicleNumberPlate: null,
//             vehicleSeat1: null,
//             vehicleSeat2: null,
//             RCPhoto: null,
//             vehicleFull: null,
//         },
//     });

//     useEffect(() => {
//         if (oldVehicleDocuments) {
//             const newPreviews: { [key: string]: string | null } = {};
//             (Object.keys(oldVehicleDocuments) as Array<keyof typeof oldVehicleDocuments>).forEach((key) => {
//                 if (oldVehicleDocuments[key]?.data) {
//                     newPreviews[key] = oldVehicleDocuments[key]!.data!;
//                 }
//             });
//             setFilePreviews(newPreviews);
//         }
//     }, [oldVehicleDocuments])

//     const onSubmit: SubmitHandler<UpdateFormFields> = async (data) => {
//         try {
//             const formData = new FormData();

//             Object.keys(data).forEach((key) => {
//                 const fileList = data[key as keyof UpdateFormFields];
//                 if (fileList && fileList.length > 0) {
//                     formData.append(key, fileList[0]);
//                 }
//             });

//             await axios.post(`${host}/uploadVehicleDocuments/${vehicle?.vehicles[0]._id}/${vehicle?.vehicles[0].driverId}`, formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                     'Authorization': `Bearer ${Cookies.get("token")}`
//                 },
//             });

//             Swal.fire({
//                 icon: 'success',
//                 title: 'Vehicle documents updated successfully',
//                 timer: 3000,
//             });

//             if (onSave) onSave();
//         } catch (error: any) {
//             Swal.fire('Error', 'Failed to update vehicle documents. Try again.', 'error');
//         }
//     };

//     const handleFileChange = (
//         e: React.ChangeEvent<HTMLInputElement>,
//         onChange: (val: FileList | null) => void
//     ) => {
//         const { id, files } = e.target;
//         onChange(files || null);

//         if (files && files[0]) {
//             const localUrl = URL.createObjectURL(files[0]);
//             setFilePreviews((prev) => ({ ...prev, [id]: localUrl }));
//         } else {
//             setFilePreviews((prev) => ({ ...prev, [id]: null }));
//         }
//     };

//     useEffect(() => {
//         return () => {
//             Object.values(filePreviews).forEach((url) => {
//                 if (url) URL.revokeObjectURL(url);
//             });
//         };
//     }, [filePreviews]);

//     return (
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//                 {[
//                     'vehicleFrontMiddle',
//                     'vehicleFrontRight',
//                     'vehicleFrontLeft',
//                     'vehicleBack',
//                     'vehicleNumberPlate',
//                     'vehicleSeat1',
//                     'vehicleSeat2',
//                     'RCPhoto',
//                     'vehicleFull',
//                 ].map((field) => (
//                     <div key={field}>
//                         <label htmlFor={field} className="block text-sm font-medium text-gray-700">
//                             {field.replace(/([A-Z])/g, ' $1')}
//                         </label>
//                         <div className="relative w-[200px] h-[200px] border-2 border-gray-300 rounded-md overflow-hidden shadow-md">
//                             <Controller
//                                 name={field as keyof UpdateFormFields}
//                                 control={control}
//                                 render={({ field: { onChange } }) => (
//                                     <input
//                                         id={field}
//                                         type="file"
//                                         accept="image/*"
//                                         onChange={(e) => handleFileChange(e, onChange)}
//                                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                                     />
//                                 )}
//                             />
//                             {filePreviews[field] ? (
//                                 <img
//                                     src={filePreviews[field] as string}
//                                     alt={`${field} Preview`}
//                                     className="w-full h-full object-cover"
//                                 />
//                             ) : (
//                                 <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-100">
//                                     No photo selected
//                                 </div>
//                             )}
//                         </div>
//                         {errors[field as keyof UpdateFormFields] && (
//                             <p className="text-red-500 text-sm mt-1">
//                                 {errors[field as keyof UpdateFormFields]?.message as string}
//                             </p>
//                         )}
//                     </div>
//                 ))}
//             </div>
//             <div className="flex justify-center mt-8">
//                 <button
//                     type="submit"
//                     className="bg-teal-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-teal-600"
//                 >
//                     Update Vehicle
//                 </button>
//             </div>
//         </form>
//     );
// };

// export default DocUpdateVehicle;

import React, { useEffect, useState, useMemo } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useDriver } from '../../context/DriverContext';
import Cookies from 'js-cookie';

// Define all the file fields your form will handle
interface UpdateFormFields {
    vehicleFrontMiddle: FileList | null;
    vehicleFrontRight: FileList | null;
    vehicleFrontLeft: FileList | null;
    vehicleBack: FileList | null;
    vehicleNumberPlate: FileList | null;
    vehicleSeat1: FileList | null;
    vehicleSeat2: FileList | null;
    RCPhoto: FileList | null;
    vehicleFull: FileList | null;
}

interface VehicleDocument {
    data?: string;
}

interface Vehicle {
    _id: string;
    driverId: string;
    documents?: {
        vehicleFrontMiddle?: VehicleDocument;
        vehicleFrontRight?: VehicleDocument;
        vehicleFrontLeft?: VehicleDocument;
        vehicleBack?: VehicleDocument;
        vehicleNumberPlate?: VehicleDocument;
        vehicleSeat1?: VehicleDocument;
        vehicleSeat2?: VehicleDocument;
        RCPhoto?: VehicleDocument;
        vehicleFull?: VehicleDocument;
    };
}

interface DocUpdateVehicleProps {
    vehicle: Vehicle | null;
    onSave?: () => void;
    onCancel?: () => void;
}

const DocUpdateVehicle: React.FC<DocUpdateVehicleProps> = ({ vehicle, onSave, onCancel }) => {
    const oldVehicleDocuments = vehicle?.documents || {};
    const host = 'https://api.getarider.in/api';

    const [filePreviews, setFilePreviews] = useState<{ [key: string]: string | null }>({});

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<UpdateFormFields>({
        defaultValues: {
            vehicleFrontMiddle: null,
            vehicleFrontRight: null,
            vehicleFrontLeft: null,
            vehicleBack: null,
            vehicleNumberPlate: null,
            vehicleSeat1: null,
            vehicleSeat2: null,
            RCPhoto: null,
            vehicleFull: null,
        },
    });

    const memoizedDocuments = useMemo(() => oldVehicleDocuments, [vehicle]);

    useEffect(() => {
        if (memoizedDocuments) {
            const newPreviews: { [key: string]: string | null } = {};
            (Object.keys(memoizedDocuments) as Array<keyof typeof memoizedDocuments>).forEach((key) => {
                if (memoizedDocuments[key]?.data) {
                    newPreviews[key] = memoizedDocuments[key]!.data!;
                }
            });
            setFilePreviews(newPreviews);
        }
    }, [memoizedDocuments]);

    const onSubmit: SubmitHandler<UpdateFormFields> = async (data) => {
        try {
            const apiUrl ='/uploadVehicleDocuments/:vehicleId/:driverId';
            var token = Cookies.get('token');
            const formData = new FormData();

            Object.keys(data).forEach((key) => {
                const fileList = data[key as keyof UpdateFormFields];
                if (fileList && fileList.length > 0) {
                    formData.append(key, fileList[0]);
                }
            });

            formData.append('apiUrl', apiUrl);

            await axios.post(`${host}/uploadVehicleDocuments/${vehicle?._id}/${vehicle?.driverId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            Swal.fire({
                icon: 'success',
                title: 'Vehicle documents updated successfully',
                timer: 3000,
            });

            if (onSave) onSave();
        } catch (error: any) {
            Swal.fire('Error', 'Failed to update vehicle documents. Try again.', 'error');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (val: FileList | null) => void) => {
        const { id, files } = e.target;
        onChange(files || null);

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

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {['vehicleFrontMiddle', 'vehicleFrontRight', 'vehicleFrontLeft', 'vehicleBack', 'vehicleNumberPlate', 'vehicleSeat1', 'vehicleSeat2', 'RCPhoto', 'vehicleFull'].map((field) => (
                    <div key={field}>
                        <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                            {field.replace(/([A-Z])/g, ' $1')}
                        </label>
                        <div className="relative w-[200px] h-[200px] border-2 border-gray-300 rounded-md overflow-hidden shadow-md">
                            <Controller
                                name={field as keyof UpdateFormFields}
                                control={control}
                                render={({ field: { onChange } }) => (
                                    <input
                                        id={field}
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, onChange)}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                )}
                            />
                            {filePreviews[field] ? (
                                <img src={filePreviews[field] as string} alt={`${field} Preview`} className="w-full h-full object-cover" />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-100">No photo selected</div>
                            )}
                        </div>
                        {errors[field as keyof UpdateFormFields] && <p className="text-red-500 text-sm mt-1">{errors[field as keyof UpdateFormFields]?.message as string}</p>}
                    </div>
                ))}
            </div>
            <div className="flex justify-center mt-8">
                <button type="submit" className="bg-teal-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-teal-600">
                    Update Vehicle
                </button>
            </div>
        </form>
    );
};

export default DocUpdateVehicle;
