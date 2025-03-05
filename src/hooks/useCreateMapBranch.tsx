import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

const useCreateMapBranch = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const host = 'https://api.getarider.in/api';

    const createBranch = async (branchName: any, coordinates: any) => {
        setLoading(true);
        setError(null);

        var token = Cookies.get('token');

        const formattedCoordinates = coordinates.map((coord: any) => {
            const [lat, lng] = coord.split(','); // Split string by comma
            return { latitude: lat.trim(), longitude: lng.trim() };
        });

        try {
            await axios.post(
                `${host}/createBranch`,
                {
                    branchName,
                    vertex: formattedCoordinates,
                    apiUrl: '/createBranch',
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

    return { createBranch, loading, error, success };
};

export default useCreateMapBranch;
