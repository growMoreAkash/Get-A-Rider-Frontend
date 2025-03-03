import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

const useProcessingSectionVerify = () => {
    const host = 'http://localhost:8000/api';
    const token = Cookies.get('token');

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 1500,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    const verifyDriverIds = async (driverIds: any) => {
        try {
            const response = await axios.post(
                `${host}/changeProcessingSection`,
                {
                    drivers: driverIds,
                    processingSection: 'VERIFY',
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            showMessage('Successfull', 'success');
        } catch (error) {
            console.error('Error fetching drivers:', error);
            showMessage('Error', 'error');
            throw error;
        }
    };

    return { verifyDriverIds };
};

export default useProcessingSectionVerify;
