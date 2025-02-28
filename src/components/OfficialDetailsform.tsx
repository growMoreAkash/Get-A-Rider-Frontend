import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useGetIdCreation from '../hooks/useGetIdCreation';

interface OfficialDetailsFormProps {
    careCenterId: string;
    onSubmit: (data: any) => void;
    onCancel: () => void;
    initialData?: {
        branch: string;
        zone: string;
        numberOfZone: string;
        vehicletype: string;
        careCenterCode: string;
        careCenterSerial: string;
    };
}

interface Branch {
    branchId: string;
    branchName: string;
}

interface Zone {
    zoneId: string;
    zoneName: string;
    branchId: string;
}

const OfficialDetailsForm: React.FC<OfficialDetailsFormProps> = ({
    careCenterId,
    onSubmit,
    onCancel,
    initialData,
}) => {
    const { branch, zone } = useGetIdCreation(); // Use the custom hook to fetch branch and zone data
    const [selectedBranch, setSelectedBranch] = useState<string>('');
    const [filteredZones, setFilteredZones] = useState<Zone[]>([]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm({
        defaultValues: {
            branch: initialData?.branch || '',
            zone: initialData?.zone || '',
            numberOfZone: initialData?.numberOfZone || '',
            vehicletype: initialData?.vehicletype || '',
            careCenterCode: initialData?.careCenterCode || '',
            careCenterSerial: initialData?.careCenterSerial || '',
        },
    });

    // Filter zones based on the selected branch
    useEffect(() => {
        if (selectedBranch) {
            const filteredZones = zone.filter((z: Zone) => z.branchId === selectedBranch);
            setFilteredZones(filteredZones);
        } else {
            setFilteredZones([]);
        }
    }, [selectedBranch, zone]);

    const handleBranchChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedBranchId = event.target.value;
        setSelectedBranch(selectedBranchId);
        setValue('branch', selectedBranchId);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label htmlFor="branch" className="block text-sm font-medium text-gray-700">Branch</label>
                <select id="branch" {...register('branch')} onChange={handleBranchChange} className="form-select mt-1">
                    <option value="">Select a branch</option>
                    {branch.map((b: Branch) => (
                        <option key={b.branchId} value={b.branchId}>{b.branchName}</option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="zone" className="block text-sm font-medium text-gray-700">Zone</label>
                <select id="zone" {...register('zone')} className="form-select mt-1" disabled={!selectedBranch}>
                    <option value="">Select a zone</option>
                    {filteredZones.map((z: Zone) => (
                        <option key={z.zoneId} value={z.zoneId}>{z.zoneName}</option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="numberOfZone" className="block text-sm font-medium text-gray-700">Number of Zones</label>
                <input type="text" id="numberOfZone" {...register('numberOfZone')} className="form-input mt-1" />
            </div>

            <div>
                <label htmlFor="vehicletype" className="block text-sm font-medium text-gray-700">Vehicle Type</label>
                <select id="vehicletype" {...register('vehicletype')} className="form-select mt-1">
                    <option value="">Select vehicle type</option>
                    <option value="R">R</option>
                    <option value="S">S</option>
                    <option value="T">T</option>
                </select>
            </div>

            <div>
                <label htmlFor="careCenterCode" className="block text-sm font-medium text-gray-700">Care Center Code</label>
                <input type="text" id="careCenterCode" {...register('careCenterCode')} className="form-input mt-1" />
            </div>

            <div>
                <label htmlFor="careCenterSerial" className="block text-sm font-medium text-gray-700">Care Center Serial</label>
                <input type="text" id="careCenterSerial" {...register('careCenterSerial')} className="form-input mt-1" />
            </div>

            <div className="flex justify-center mt-8 space-x-4">
                <button type="submit" className="bg-teal-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-teal-600">Save</button>
                <button type="button" onClick={onCancel} className="bg-gray-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-gray-600">Cancel</button>
            </div>
        </form>
    );
};

export default OfficialDetailsForm;