import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import branchesData from './branches.json'; // Import branches JSON
import zonesData from './zones.json'; // Import zones JSON

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

const OfficialDetailsForm: React.FC<OfficialDetailsFormProps> = ({
    careCenterId,
    onSubmit,
    onCancel,
    initialData,
}) => {
    const [zones, setZones] = useState<{ zoneId: string; zoneName: string }[]>([]);
    const [selectedBranch, setSelectedBranch] = useState<string>('');

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

    useEffect(() => {
        if (selectedBranch) {
            const filteredZones = zonesData.filter(zone => zone.branchId === selectedBranch);
            setZones(filteredZones);
        } else {
            setZones([]);
        }
    }, [selectedBranch]);

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
                    {branchesData.map((branch) => (
                        <option key={branch.branchId} value={branch.branchId}>{branch.branchName}</option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="zoneCovered" className="block text-sm font-medium text-gray-700">Zone Covered</label>
                <select id="zoneCovered" {...register('zoneCovered')} className="form-select mt-1" disabled={!selectedBranch}>
                    <option value="">Select a zone</option>
                    {zones.map((zone) => (
                        <option key={zone.zoneId} value={zone.zoneId}>{zone.zoneName}</option>
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
