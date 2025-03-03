import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface CareCenterFormFields {
    branch: string;
    zone: string;
    numberOfZone: string;
    vehicletype: string;
    email: string;
    whatsappNumber: string;
    phoneNumber: string;
    nearestCareCenter: string;
    computerAvailable: boolean;
    printerAvailable: boolean;
    franchiseAmount: number;
}

interface OfficialDetailsformProps {
    careCenterId: string; // Passed as a prop
    onSubmit: (data: CareCenterFormFields) => void;
    onCancel: () => void;
    initialData: Partial<CareCenterFormFields>; // Initial data for the form
}

const OfficialDetailsform = ({ careCenterId, onSubmit, onCancel, initialData }: OfficialDetailsformProps) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CareCenterFormFields>({
        defaultValues: {
            // Exclude careCenterId from defaultValues
            branch: initialData.branch || '',
            zone: initialData.zone || '',
            numberOfZone: initialData.numberOfZone || '',
            vehicletype: initialData.vehicletype || '',
            email: initialData.email || '',
            whatsappNumber: initialData.whatsappNumber || '',
            phoneNumber: initialData.phoneNumber || '',
            nearestCareCenter: initialData.nearestCareCenter || '',
            computerAvailable: initialData.computerAvailable || false,
            printerAvailable: initialData.printerAvailable || false,
            franchiseAmount: initialData.franchiseAmount || 0,
        },
    });

    useEffect(() => {
        reset({
            // Reset the form with initialData (excluding careCenterId)
            branch: initialData.branch || '',
            zone: initialData.zone || '',
            numberOfZone: initialData.numberOfZone || '',
            vehicletype: initialData.vehicletype || '',
            email: initialData.email || '',
            whatsappNumber: initialData.whatsappNumber || '',
            phoneNumber: initialData.phoneNumber || '',
            nearestCareCenter: initialData.nearestCareCenter || '',
            computerAvailable: initialData.computerAvailable || false,
            printerAvailable: initialData.printerAvailable || false,
            franchiseAmount: initialData.franchiseAmount || 0,
        });
    }, [initialData, reset]);

    return (
        <div>
            <div className="panel">
                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                    {/* Form fields */}
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-5">
                        {/* Branch */}
                        <div>
                            <label htmlFor="branch" className="block text-sm font-medium text-gray-700">
                                Branch
                            </label>
                            <input
                                id="branch"
                                type="text"
                                {...register('branch', { required: 'Branch is required' })}
                                placeholder="Enter Branch"
                                className="form-input mt-1"
                            />
                            {errors.branch && <p className="text-red-500 text-sm">{errors.branch.message}</p>}
                        </div>

                        {/* Zone */}
                        <div>
                            <label htmlFor="zone" className="block text-sm font-medium text-gray-700">
                                Zone
                            </label>
                            <input
                                id="zone"
                                type="text"
                                {...register('zone', { required: 'Zone is required' })}
                                placeholder="Enter Zone"
                                className="form-input mt-1"
                            />
                            {errors.zone && <p className="text-red-500 text-sm">{errors.zone.message}</p>}
                        </div>

                        {/* Number of Zone */}
                        <div>
                            <label htmlFor="numberOfZone" className="block text-sm font-medium text-gray-700">
                                Number of Zone
                            </label>
                            <input
                                id="numberOfZone"
                                type="text"
                                {...register('numberOfZone', { required: 'Number of Zone is required' })}
                                placeholder="Enter Number of Zone"
                                className="form-input mt-1"
                            />
                            {errors.numberOfZone && <p className="text-red-500 text-sm">{errors.numberOfZone.message}</p>}
                        </div>

                        {/* Vehicle Type */}
                        <div>
                            <label htmlFor="vehicletype" className="block text-sm font-medium text-gray-700">
                                Vehicle Type
                            </label>
                            <input
                                id="vehicletype"
                                type="text"
                                {...register('vehicletype', { required: 'Vehicle Type is required' })}
                                placeholder="Enter Vehicle Type"
                                className="form-input mt-1"
                            />
                            {errors.vehicletype && <p className="text-red-500 text-sm">{errors.vehicletype.message}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                {...register('email', { required: 'Email is required' })}
                                placeholder="Enter Email"
                                className="form-input mt-1"
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>

                        {/* Whatsapp Number */}
                        <div>
                            <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700">
                                Whatsapp Number
                            </label>
                            <input
                                id="whatsappNumber"
                                type="text"
                                {...register('whatsappNumber', { required: 'Whatsapp Number is required' })}
                                placeholder="Enter Whatsapp Number"
                                className="form-input mt-1"
                            />
                            {errors.whatsappNumber && <p className="text-red-500 text-sm">{errors.whatsappNumber.message}</p>}
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <input
                                id="phoneNumber"
                                type="text"
                                {...register('phoneNumber', { required: 'Phone Number is required' })}
                                placeholder="Enter Phone Number"
                                className="form-input mt-1"
                            />
                            {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
                        </div>

                        {/* Nearest CareCenter */}
                        <div>
                            <label htmlFor="nearestCareCenter" className="block text-sm font-medium text-gray-700">
                                Nearest CareCenter
                            </label>
                            <input
                                id="nearestCareCenter"
                                type="text"
                                {...register('nearestCareCenter', { required: 'Nearest CareCenter is required' })}
                                placeholder="Enter Nearest CareCenter"
                                className="form-input mt-1"
                            />
                            {errors.nearestCareCenter && <p className="text-red-500 text-sm">{errors.nearestCareCenter.message}</p>}
                        </div>

                        {/* Computer Available */}
                        <div>
                            <label htmlFor="computerAvailable" className="block text-sm font-medium text-gray-700">
                                Computer Available
                            </label>
                            <input
                                id="computerAvailable"
                                type="checkbox"
                                {...register('computerAvailable')}
                                className="form-checkbox mt-1"
                            />
                        </div>

                        {/* Printer Available */}
                        <div>
                            <label htmlFor="printerAvailable" className="block text-sm font-medium text-gray-700">
                                Printer Available
                            </label>
                            <input
                                id="printerAvailable"
                                type="checkbox"
                                {...register('printerAvailable')}
                                className="form-checkbox mt-1"
                            />
                        </div>

                        {/* Franchise Amount */}
                        <div>
                            <label htmlFor="franchiseAmount" className="block text-sm font-medium text-gray-700">
                                Franchise Amount
                            </label>
                            <input
                                id="franchiseAmount"
                                type="number"
                                {...register('franchiseAmount', { required: 'Franchise Amount is required' })}
                                placeholder="Enter Franchise Amount"
                                className="form-input mt-1"
                            />
                            {errors.franchiseAmount && <p className="text-red-500 text-sm">{errors.franchiseAmount.message}</p>}
                        </div>
                    </div>

                    {/* Submit and Cancel Buttons */}
                    <div className="flex justify-center mt-8 gap-4">
                        <button type="submit" className="bg-teal-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-teal-600">
                            Update Official Details
                        </button>
                        <button type="button" onClick={onCancel} className="bg-gray-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-gray-600">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default OfficialDetailsform;