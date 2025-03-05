import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

const useCreateZone = () => {
    const host = 'http://localhost:8000/api';
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    var token = Cookies.get('token');

    const createZone = async (branchId: any, zoneId: any, coordinates: any) => {
        setLoading(true);
        setError(null);

        const formattedCoordinates = coordinates.map((coord: any) => {
            const [lat, lng] = coord.split(','); // Split string by comma
            return { latitude: lat.trim(), longitude: lng.trim() };
        });

        try {
            await axios.post(
                `${host}/createZone`,
                {
                    branchId,
                    zoneId,
                    vertex: formattedCoordinates,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            Swal.fire({
                icon: 'success',
                title: 'Added successfully',
                timer: 2000,
            });
            setSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong');
            setSuccess(false);
            Swal.fire('Error', 'Failed to Add. Try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const deleteZone = async (zoneId: string) => {
        setLoading(true);
        setError(null);

        try {
            await axios.put(
                `${host}/deleteZone/${zoneId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            Swal.fire({
                icon: 'success',
                title: 'Deleted successfully',
                timer: 2000,
            });
            setSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong');
            setSuccess(false);
            Swal.fire('Error', 'Failed to Delete. Try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return { createZone, loading, error, success, deleteZone };
};

export default useCreateZone;
