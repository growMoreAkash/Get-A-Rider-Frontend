import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const useGetBranchIdData = () => {
    const host = 'http://localhost:8000/api';
    const token = Cookies.get('token');
    const [branchData, setBranchData] = useState();

    const getBranchIdData = async (id: any) => {
        try {
            const response = await axios.get(`${host}/getBranch/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setBranchData(response?.data?.branch);
        } catch (error) {
            console.error('Error fetching drivers:', error);
            throw error;
        }
    };

    return {
        branchData,
        getBranchIdData,
    };
};

export default useGetBranchIdData;
