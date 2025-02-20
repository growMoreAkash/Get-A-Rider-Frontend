import axios from 'axios';
import Cookies from 'js-cookie';
import React from 'react';
import Swal from 'sweetalert2';

const useDeleteDriver = () => {
    const host = 'https://api.getarider.in/api';
    const onDriverDelete = async (id: string) => {
        try {
            await axios.put(`${host}/deleteDriver/${id}`, {
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${Cookies.get("token")}` },
            });

            Swal.fire({
                icon: 'success',
                title: 'Deleted successfully',
                timer: 2000,
            });
        } catch (error) {
            console.error('Failed to delete:', error);
            Swal.fire('Error', 'Failed to delete. Try again.', 'error');
        }
    };

    return { onDriverDelete };
};

export default useDeleteDriver;
