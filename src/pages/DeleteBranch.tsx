import React from 'react';
import TypeBrandCategoryList from '../components/TypeBrandCategoryList';
import useGetBranchIdData from '../hooks/useGetBranchIdData';
import useGetIdCreation from '../hooks/useGetIdCreation';
import axios from 'axios';
import Cookies from 'js-cookie';

const DeleteBranch = () => {
    const { branch } = useGetIdCreation();

    const { getBranchIdData, branchData } = useGetBranchIdData();
    const branchColumn = [
        { header: 'Index', key: 'index' },
        { header: 'Branch Name', key: 'branchName' },
        { header: 'Branch Code', key: 'branchCode' },
        { header: 'BranchId', key: 'branchId' },
        { header: 'Time', key: 'time' },
    ];
    const onBranchRefresh = () => {};
    const onViewLog = () => {};
    const onTrashed = () => {};

    var token = Cookies.get('token');

    const activeTab = 'branch';

    const deleteBranch = async (branchId: any) => {
        const host = 'https://api.getarider.in/api';
        try {
            await axios.put(
                `${host}/deleteBranch/${branchId}`,
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

    console.log(branch, 'branch');

    const branchActions = [
        {
            icon: 'bi-trash-fill',
            title: 'Delete',
            onClick: async (row: any) => {
                console.log(row, 'delete branch');
                await deleteBranch(row._id);
            },
            className: 'text-red-400',
        },
    ];
    return (
        <div className="flex flex-col justify-center ">
            <h1 className="text-lg font-bold">Delete Branch</h1>
            <div className="mt-4">
                <TypeBrandCategoryList columns={branchColumn} data={branch} actions={branchActions} onRefresh={onBranchRefresh} onViewLog={onViewLog} onTrashed={onTrashed} activeTab={activeTab} />
            </div>
        </div>
    );
};

export default DeleteBranch;
