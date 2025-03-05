import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const useGetIdCreation = () => {
    const [zone, setZone] = useState([]);
    const [country, setCountry] = useState([]);
    const [branch, setBranch] = useState([]);
    const [state, setState] = useState([]);
    const token = Cookies.get('token');
    const host = 'https://api.getarider.in/api';
    const [masterId, setMasterId] = useState('');

    const firstCreateMaster = async () => {
        try {
            const firstCreateResponse = await axios.post(
                `${host}/firstCreateMaster`,
                {
                    apiUrl: '/firstCreateMaster',
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const masterId = firstCreateResponse.data.id;
            console.log(masterId, 'masterId');
            setMasterId(masterId);
        } catch (error) {
            console.log(error, 'error');
        }
    };

    const fetchIdCreation = async () => {
        try {
            const response = await axios.post(
                `${host}/getIdCreation/${masterId}`,
                {
                    apiUrl: '/getIdCreation/:MasterId',
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data && response.data.idCreation) {
                setZone(response.data.idCreation.zone || []);
                setCountry(response.data.idCreation.country || []);
                setBranch(response.data.idCreation.branch || []);
                setState(response.data.idCreation.state || []);
            }
        } catch (error) {
            console.error('Error fetching ID creation data:', error);
        }
    };

    useEffect(() => {
        if (masterId) {
            fetchIdCreation();
        }
        firstCreateMaster();
    }, [masterId]);

    return { zone, country, branch, state, refetchData: fetchIdCreation };
};

export default useGetIdCreation;