import React from 'react';
import TypeBrandCategoryList from '../components/TypeBrandCategoryList';
import useGetAllBranches from '../hooks/useGetAllBranches';
import Cookies from 'js-cookie';
import axios from 'axios';

const DeleteZone = () => {
    const zoneColumn = [
        { header: 'Index', key: 'index' },
        // { header: 'Zone Name', key: 'zoneName' },
        // { header: 'Branch Code', key: 'branchCode' },
        { header: 'ZoneId', key: 'zoneId' },
        { header: 'BranchId', key: 'branchId' },
        { header: 'Time', key: 'time' },
    ];

    const onZoneRefresh = () => {};
    const onViewLog = () => {};
    const onTrashed = () => {};
    const activeTab = 'branch';

    const { branchZoneData, getZoneByBranch } = useGetAllBranches();

    var token = Cookies.get('token');

    const deleteZone = async (branchId: any, zoneId: any) => {
        const host = 'https://api.getarider.in/api';
        try {
            await axios.put(
                `${host}/deleteZone/${branchId}/${zoneId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            alert('deleted successfully');
        } catch (err: any) {
            alert('failed');
            console.log(err.response?.data?.message || 'Failed to delete');
        }
    };

    const zoneActions = [
        {
            icon: 'bi-trash-fill',
            title: 'Delete',
            onClick: async (row: any) => {
                await deleteZone(row.branchId, row.zoneId);
            },
            className: 'text-red-400',
        },
    ];
    return (
        <div>
            <div className="mt-5">
                <TypeBrandCategoryList
                    columns={zoneColumn}
                    // add data as zone using get zone
                    data={branchZoneData}
                    actions={zoneActions}
                    onRefresh={onZoneRefresh}
                    onViewLog={onViewLog}
                    onTrashed={onTrashed}
                    activeTab={activeTab}
                />
            </div>
        </div>
    );
};

export default DeleteZone;
