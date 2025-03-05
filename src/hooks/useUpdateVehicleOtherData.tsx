import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useVehicleContext } from '../context/VehicleContext';
import { useFirstCreate } from '../context/FirstCreateContext';
import { time } from 'console';
import Cookies from 'js-cookie';

const useUpdateVehicleOtherData = () => {
    const [loading, setLoading] = useState(false);
    const { fetchVehicleOtherData } = useVehicleContext();
    const { firstCreateId } = useFirstCreate();
    const host = 'https://api.getarider.in/api';

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

    const updateVehicleData = async (title: string, data: any, info: any, setOnEdit: (value: boolean) => void) => {
        setLoading(true);
        try {
            const registerTitle = title.toLowerCase().replace(/\s/g, '');
            const fieldValue = info[registerTitle];

            if (title === 'acceleration') {
                const updateData = {
                    name: "accelaretion",
                    firstCreate: firstCreateId,
                    id: data._id || '',
                    updateData: {
                        name: fieldValue + '/' + info.time,
                    },
                };
                await axios.put(`${host}/updateVehicleOtherData`, updateData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Cookies.get("token")}`
                    }
                });
                fetchVehicleOtherData();
                showMessage('Updated successfully', 'success');
                setOnEdit(false);
            } else {
                const updateData = {
                    name: title,
                    firstCreate: firstCreateId,
                    id: data._id || '',
                    updateData: {
                        name: fieldValue,
                    },
                };

                await axios.put(`${host}/updateVehicleOtherData`, updateData, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Cookies.get("token")}`
                    }
                });

                fetchVehicleOtherData();
                showMessage('Updated successfully', 'success');
                setOnEdit(false);
            }
        } catch (error) {
            showMessage('Error updating data', 'error');
        } finally {
            setLoading(false);
        }
    };

    return { updateVehicleData, loading };
};

export default useUpdateVehicleOtherData;
