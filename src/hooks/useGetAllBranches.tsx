import { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const useGetAllBranches = () => {
    const host = 'http://localhost:8000/api';
    const [branchZoneData, setBranchZoneData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [zoneData,setZoneData] = useState<any[]>([]);
    const [branch, setBranch] = useState([]);

    var token = Cookies.get('token');
    const fetchBranches = async () => {
        try {
            const response = await axios.get(`${host}/getAllBranch`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const extractedZones: any = response.data.branches.flatMap((branch: { zones: any }) => branch.zones);
            const extractedData = response.data?.branches.map((item:any) => ({ branchId: item.branchId }));
            setBranch(extractedData);
            setBranchZoneData(extractedZones);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch branches');
        } finally {
            setLoading(false);
        }
    };

    const getZoneByBranch = async (branchId: any, zoneId: any) => {
        try {
            const response = await axios.get(`${host}/getZone/${branchId}/zone/${zoneId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const extractedZones: any = response.data.zone;
            setZoneData(extractedZones);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to fetch branches');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBranches();
    }, []);

    return { branchZoneData, loading, error, getZoneByBranch,zoneData , branch };
};

export default useGetAllBranches;
