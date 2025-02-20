// src/components/GeoFenceMap.jsx
import React, { useEffect, useRef, useState } from 'react';
import useCreateMapBranch from '../hooks/useCreateMapBranch';
import useGetIdCreation from '../hooks/useGetIdCreation';
import Select from 'react-select';
import TypeBrandCategoryList from './TypeBrandCategoryList';

const GeoFenceMap = () => {
    const [coordinates, setCoordinates] = useState([]);
    const [branchName, setBranchName] = useState('');
    const iframeRef = useRef(null);
    const [selectedBranch, setSelectedBranch] = useState('');
    const { zone, country, branch, state } = useGetIdCreation();
    const { createBranch, success } = useCreateMapBranch();

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
        createBranch(branch, coordinates);
        setBranchName('');
    };

    console.log(branch, 'branch');
    const branchOptions = branch.map((b: any) => ({
        value: b.branchId,
        label: `${b.branchName} (${b.branchId})`,
    }));

    console.log(selectedBranch, 'value');

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

    const branchActions = [{ icon: 'bi-pencil-fill', title: 'Edit', onClick: (row: any) => alert(row), className: 'text-teal-400' }];

    return (
        <div className="flex flex-col justify-center ">
            <div className="">
                <div className="max-w-[55%]">
                    {/* <div className="flex flex-col gap-2 justify-center">
                        <label className="text-2xl font-semibold ">Enter Branch:</label>
                        <input type="text" className="form-input w-full" value={branchName} onChange={(e) => setBranchName(e.target.value)} />
                    </div> */}

                    <div className="flex flex-col gap-2 justify-center">
                        <label className="text-2xl font-semibold">Select Branch:</label>
                        <Select options={branchOptions} value={selectedBranch} onChange={(selectedOption: any) => setSelectedBranch(selectedOption)} placeholder="Select a branch..." isSearchable />
                    </div>

                    <div className="border border-gray-300 rounded-lg overflow-hidden shadow-md mt-4">
                        <iframe src="/geofence.html" title="Geofence Map" className="w-full h-[400px]" style={{ border: 'none' }}></iframe>
                    </div>
                </div>

                <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
                    Submit
                </button>
            </div>

            <div className="mt-5">
                <TypeBrandCategoryList columns={branchColumn} data={branch} actions={branchActions} onRefresh={onBranchRefresh} onViewLog={onViewLog} onTrashed={onTrashed} activeTab={activeTab} />
            </div>
        </div>
    );
};

export default GeoFenceMap;
