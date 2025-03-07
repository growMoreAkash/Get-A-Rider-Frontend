import React, { useEffect, useRef, useState } from 'react';
import useCreateMapBranch from '../hooks/useCreateMapBranch';
import useGetIdCreation from '../hooks/useGetIdCreation';
import Select from 'react-select';
import TypeBrandCategoryList from '../components/TypeBrandCategoryList';
import useCreateZone from '../hooks/useCreateZone';
import EditZone from './EditZone';
import useGetBranchIdData from '../hooks/useGetBranchIdData';
import useGetAllBranches from '../hooks/useGetAllBranches';

interface BranchOption {
    value: string;
    label: string;
}
interface zoneOptions {
    value: string;
    label: string;
}

const CreateZone = () => {
    const [coordinates, setCoordinates] = useState([]);
    const [branchName, setBranchName] = useState('');
    const iframeRef = useRef(null);
    const [selectedBranch, setSelectedBranch] = useState<BranchOption | null>(null);
    const [selectedZone, setSelectedZone] = useState<zoneOptions | null>(null);

    const { zone, branch } = useGetIdCreation();
    const { createBranch, success } = useCreateMapBranch();
    const { createZone } = useCreateZone();
    const [zoneName, setZoneName] = useState('');

    const [editZone, setEditZone] = useState(false);

    const { branchZoneData, getZoneByBranch, zoneData } = useGetAllBranches();

    const { getBranchIdData, branchData } = useGetBranchIdData();

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

    // console.log(coordinates, 'coordinates');

    const handleSubmit = (e: any) => {
        e.preventDefault();
        if (selectedBranch && selectedZone) {
            createZone(selectedBranch.value, selectedZone.value, coordinates);
            setBranchName('');
        } else {
            console.warn('No branch selected');
        }
    };

    const branchOptions: BranchOption[] = branch.map((b: any) => ({
        value: b.branchId,
        label: `${b.branchName} (${b.branchId})`,
    }));

    // for zone options
    const zoneOptions: zoneOptions[] = zone.map((z: any) => ({
        value: z.zoneId,
        label: `${z.zoneName} (${z.zoneId})`,
    }));

    // below code used for editing the zone

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

    const zoneActions = [
        {
            icon: 'bi-pencil-fill',
            title: 'Edit',
            onClick: async (row: any) => {
                // branch ka data hai yeh , i need zone ka data
                setEditZone(true);
                console.log(row, 'akc');
                await getZoneByBranch(row.branchId, row.zoneId);
                await getBranchIdData(row.branchId);
            },
            className: 'text-teal-400',
        },
    ];

    return (
        <div>
            {editZone ? (
                <>
                    <EditZone branchData={zoneData} branch={branch} zone={zone} setEditZone={setEditZone} />
                </>
            ) : (
                <div className="flex flex-col justify-center ">
                    <div className="">
                        <div className="max-w-[55%]">
                            <div className="flex flex-col gap-2 justify-center">
                                <label className="text-2xl font-semibold">Select Branch:</label>
                                <Select
                                    options={branchOptions}
                                    value={selectedBranch}
                                    onChange={(selectedOption: any) => setSelectedBranch(selectedOption)}
                                    placeholder="Select a branch..."
                                    isSearchable
                                />
                            </div>
                            <div className="flex flex-col gap-2 justify-center">
                                <label className="text-2xl font-semibold">Select Zone:</label>
                                <Select options={zoneOptions} value={selectedZone} onChange={(selectedOption: any) => setSelectedZone(selectedOption)} placeholder="Select a zone..." isSearchable />
                            </div>

                            <div>
                                <iframe src="/geofence.html" title="Geofence Map" className="w-full h-[500px]"></iframe>
                            </div>
                        </div>

                        <button type="submit" className="btn bg-teal-500 text-white" onClick={handleSubmit}>
                            Submit
                        </button>
                    </div>

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
            )}
        </div>
    );
};

export default CreateZone;
