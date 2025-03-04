// src/components/GeoFenceMap.jsx
import React, { useEffect, useRef, useState } from 'react';
import useCreateMapBranch from '../hooks/useCreateMapBranch';
import useGetIdCreation from '../hooks/useGetIdCreation';
import Select from 'react-select';
import TypeBrandCategoryList from './TypeBrandCategoryList';
import useGetBranchIdData from '../hooks/useGetBranchIdData';
import EditBranch from '../pages/EditBranch';

const GeoFenceMap = () => {
    const [coordinates, setCoordinates] = useState([]);
    const [branchName, setBranchName] = useState('');
    const iframeRef = useRef(null);
    const [selectedBranch, setSelectedBranch] = useState('');
    const { zone, country, branch, state } = useGetIdCreation();
    const { createBranch, success } = useCreateMapBranch();

    const [editBranch, setEditBranch] = useState(false);

    const { getBranchIdData, branchData } = useGetBranchIdData();

    const branchOptions = branch.map((b: any) => ({
        value: b.branchId,
        label: `${b.branchName} (${b.branchId})`,
    }));

    const handleIframeMessage = (event: any) => {
        if (event.origin !== window.location.origin) return; // Security check

        if (event.data.type === 'SEND_COORDINATES') {
            const coords = event.data.data;
            setCoordinates(coords);
        }
    };

    useEffect(() => {
        window.addEventListener('message', handleIframeMessage);

        return () => {
            window.removeEventListener('message', handleIframeMessage);
        };
    }, []);

    console.log(coordinates, 'coordinates');

    const handleSubmit = (e: any) => {
        e.preventDefault();
        createBranch(selectedBranch?.value, coordinates);
        setBranchName('');
    };


    // console.log(selectedBranch, 'selected branch');

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
    const activeTab = 'branch';

    const branchActions = [
        {
            icon: 'bi-pencil-fill',
            title: 'Edit',
            onClick: async (row: any) => {
                setEditBranch(true);
                await getBranchIdData(row.branchId);
            },
            className: 'text-teal-400',
        },
    ];

    return (
        <div className="flex flex-col justify-center ">
            {editBranch ? (
                <>
                    <EditBranch branch={branch} branchData={branchData} setEditBranch={setEditBranch} />
                </>
            ) : (
                <div>
                    <div className="">
                        <div className="max-w-[50%]">
                            <div className="flex flex-col justify-center">
                                <label className="text-2xl font-semibold">Select Branch:</label>
                                <Select
                                    options={branchOptions}
                                    value={selectedBranch}
                                    onChange={(selectedOption: any) => setSelectedBranch(selectedOption)}
                                    placeholder="Select a branch..."
                                    isSearchable
                                />
                            </div>

                            <iframe src="/geofence.html" title="Geofence Map" className="w-full h-[460px]"></iframe>
                        </div>
                        <button type="submit" className="btn bg-teal-500 text-white" onClick={handleSubmit}>
                            Submit
                        </button>
                    </div>
                    <div className="mt-4">
                        <TypeBrandCategoryList
                            columns={branchColumn}
                            data={branch}
                            actions={branchActions}
                            onRefresh={onBranchRefresh}
                            onViewLog={onViewLog}
                            onTrashed={onTrashed}
                            activeTab={activeTab}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default GeoFenceMap;
