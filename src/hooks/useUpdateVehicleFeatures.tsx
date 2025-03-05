import axios from 'axios';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useVehicleContext } from '../context/VehicleContext';
import Cookies from 'js-cookie';

const useUpdateVehicleFeatures = () => {
    const [loading, setLoading] = useState(false);
    const host = 'https://api.getarider.in/api';

    const { getTypeBrandModel, fetchCategories } = useVehicleContext();

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

    const handleUpdate = async (title: any, data: any, info: any, setOnEdit: any) => {
        console.log(data, 'data');

        console.log(info, 'info');
        try {
            const formData = new FormData();

            // Append typeId to FormData
            formData.append(`${title}Id`, data._id);
            formData.append('name', info[title]);
            formData.append('description', info.description);

            // Create updateData object
            // const updateData = {
            //     name: info[title],
            //     description: info.description,
            // };

            // Append updateData as a JSON string
            // formData.append('updateData', JSON.stringify(updateData));

            // Append the photo file separately (if provided)
            if (info.photo instanceof File) {
                formData.append('photo', info.photo); // Use 'file' as the key (matches backend's req.file)
            }

            // // Log FormData for debugging
            // for (let [key, value] of formData.entries()) {
            //     console.log(key, value);
            // }

            // Send the request
            let endpoint;
            switch (title) {
                case 'type':
                    endpoint = `${host}/updateType/`;
                    break;
                case 'brand':
                    endpoint = `${host}/updateBrand/`;
                    break;
                case 'model':
                    endpoint = `${host}/updateModel/`;
                    break;
                case 'category':
                    endpoint = `${host}/updateCategory/`;
                    break;
                default:
                    throw new Error('Invalid title');
            }

            const response = await axios.put(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Axios will set this automatically
                    'Authorization': `Bearer ${Cookies.get("token")}`
                },
            });

            // Handle success
            console.log('Response:', response.data);
            getTypeBrandModel();
            if (title === 'category') {
                fetchCategories();
            }
            showMessage('Updated successfully', 'success');
            setOnEdit(false);
        } catch (error) {
            console.error('Error updating data:', error);
            showMessage('Error updating data', 'error');
            setOnEdit(false);
        }
    };

    // Function to convert file to Base64 (if needed)
    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };

    return { handleUpdate };
};

export default useUpdateVehicleFeatures;
