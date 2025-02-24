import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import useGetIdCreation from '../hooks/useGetIdCreation';

interface OfficialDetailsFormProps {
    careCenterId: string;
    onSubmit: (data: any) => void;
    onCancel: () => void;
    initialData?: {
        email: string;
        phoneNumber: string;
        whatsappNumber: string;
        branchCovered: string;
        zoneCovered: string;
        franchiseConnected: string;
        amountReceivedFromCustomer: string;
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
            email: initialData?.email || '',
            phoneNumber: initialData?.phoneNumber || '',
            whatsappNumber: initialData?.whatsappNumber || '',
            branchCovered: initialData?.branchCovered || '',
            zoneCovered: initialData?.zoneCovered || '',
            franchiseConnected: initialData?.franchiseConnected || '',
            amountReceivedFromCustomer: initialData?.amountReceivedFromCustomer || '',
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
        setValue('branchCovered', selectedBranchId);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" {...register('email')} className="form-input mt-1" />
            </div>

            <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input type="text" id="phoneNumber" {...register('phoneNumber')} className="form-input mt-1" />
            </div>

            <div>
                <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700">WhatsApp Number</label>
                <input type="text" id="whatsappNumber" {...register('whatsappNumber')} className="form-input mt-1" />
            </div>

            <div>
                <label htmlFor="branchCovered" className="block text-sm font-medium text-gray-700">Branch Covered</label>
                <select id="branchCovered" {...register('branchCovered')} onChange={handleBranchChange} className="form-select mt-1">
                    <option value="">Select a branch</option>
                    {branch.map((b: Branch) => (
                        <option key={b.branchId} value={b.branchId}>{b.branchName}</option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="zoneCovered" className="block text-sm font-medium text-gray-700">Zone Covered</label>
                <select id="zoneCovered" {...register('zoneCovered')} className="form-select mt-1" disabled={!selectedBranch}>
                    <option value="">Select a zone</option>
                    {filteredZones.map((z: Zone) => (
                        <option key={z.zoneId} value={z.zoneId}>{z.zoneName}</option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="franchiseConnected" className="block text-sm font-medium text-gray-700">Franchise Connected</label>
                <input type="text" id="franchiseConnected" {...register('franchiseConnected')} className="form-input mt-1" />
            </div>

            <div>
                <label htmlFor="amountReceivedFromCustomer" className="block text-sm font-medium text-gray-700">Amount Received from Customer</label>
                <input type="text" id="amountReceivedFromCustomer" {...register('amountReceivedFromCustomer')} className="form-input mt-1" />
            </div>

            <div className="flex justify-center mt-8 space-x-4">
                <button type="submit" className="bg-teal-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-teal-600">Save</button>
                <button type="button" onClick={onCancel} className="bg-gray-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-gray-600">Cancel</button>
            </div>
        </form>
    );
};

export default OfficialDetailsForm;