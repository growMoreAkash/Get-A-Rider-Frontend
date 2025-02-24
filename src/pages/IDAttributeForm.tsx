import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

interface IDAttributeFormProps {
    type: 'country' | 'state' | 'branch' | 'zone';
    masterId: string;
    countries?: any[];
    states?: any[];
    branches?: any[];
    onFormSubmit: () => void;
}

const IDAttributeForm: React.FC<IDAttributeFormProps> = ({ type, masterId, countries, states, branches, onFormSubmit }) => {
    const { register, handleSubmit, reset, setValue, watch } = useForm();
    const token = Cookies.get('token');
    const [selectedCountry, setSelectedCountry] = useState<string>('');
    const [selectedState, setSelectedState] = useState<string>('');
    const [selectedBranch, setSelectedBranch] = useState<string>('');

    const showMessage = (msg = '', type = 'success') => {
        Swal.fire({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    const getEndpoint = () => {
        switch (type) {
            case 'country':
                return '/createCountry';
            case 'state':
                return '/createState';
            case 'branch':
                return '/createBranchId';
            case 'zone':
                return '/createZoneId';
            default:
                return '';
        }
    };

    const onSubmit = async (data: any) => {
        try {
            let payload: any = {};
            switch (type) {
                case 'country':
                    payload = {
                        name: data.name,
                        code: data.code,
                    };
                    break;
                case 'state':
                    payload = {
                        countryId: data.countryId,
                        name: data.name,
                    };
                    break;
                case 'branch':
                    payload = {
                        countryId: data.countryId,
                        stateId: data.stateId,
                        branchName: data.branchName,
                    };
                    break;
                case 'zone':
                    payload = {
                        countryId: data.countryId,
                        stateId: data.stateId,
                        branchId: data.branchId,
                        zoneName: data.zoneName,
                    };
                    break;
            }
    
            const endpoint = getEndpoint(); // Get the correct endpoint
            const response = await axios.post(`http://localhost:8000/api${endpoint}`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            console.log('API Response:', response.data); // Debug the API response
    
            reset();
            onFormSubmit();
            showMessage(`${type} created successfully`);
        } catch (error) {
            console.error(`Error creating ${type}:`, error);
            showMessage(`Error creating ${type}`, 'error');
        }
    };

    const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCountryId = event.target.value;
        setSelectedCountry(selectedCountryId);
        setValue('countryId', selectedCountryId); // Use countryId instead of country
        setSelectedState(''); // Reset state when country changes
        setSelectedBranch(''); // Reset branch when country changes
    };

    const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedStateId = event.target.value;
        setSelectedState(selectedStateId);
        setValue('stateId', selectedStateId); // Use stateId instead of state
        setSelectedBranch(''); // Reset branch when state changes
    };

    const handleBranchChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedBranchId = event.target.value;
        setSelectedBranch(selectedBranchId);
        setValue('branchId', selectedBranchId); // Use branchId instead of branchCode
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded-lg p-6">
            <h5 className="text-xl font-bold text-teal-500 mb-4">Add {type.charAt(0).toUpperCase() + type.slice(1)}</h5>

            {/* Country Form */}
            {type === 'country' && (
                <div className="flex flex-col gap-4">
                    <div>
                        <label>Country Name</label>
                        <input {...register('name', { required: true })} className="form-input w-full" />
                    </div>
                    <div>
                        <label>Country Code</label>
                        <input {...register('code', { required: true })} className="form-input w-full" />
                    </div>
                </div>
            )}

            {/* State Form */}
            {type === 'state' && (
                <div className="flex flex-col gap-4">
                    <div>
                        <label>Country</label>
                        <select
                            {...register('countryId', { required: true })}
                            onChange={handleCountryChange}
                            className="form-select w-full"
                        >
                            <option value="">Select a country</option>
                            {countries?.map((c) => (
                                <option key={c._id} value={c._id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>State Name</label>
                        <input {...register('name', { required: true })} className="form-input w-full" />
                    </div>
                </div>
            )}

            {/* Branch Form */}
            {type === 'branch' && (
                <div className="flex flex-col gap-4">
                    <div>
                        <label>Country</label>
                        <select
                            {...register('countryId', { required: true })}
                            onChange={handleCountryChange}
                            className="form-select w-full"
                        >
                            <option value="">Select a country</option>
                            {countries?.map((c) => (
                                <option key={c._id} value={c._id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>State</label>
                        <select
                            {...register('stateId', { required: true })}
                            onChange={handleStateChange}
                            className="form-select w-full"
                            disabled={!selectedCountry}
                        >
                            <option value="">Select a state</option>
                            {states
                                ?.filter((s) => s.country === selectedCountry)
                                .map((s) => (
                                    <option key={s._id} value={s._id}>
                                        {s.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div>
                        <label>Branch Name</label>
                        <input {...register('branchName', { required: true })} className="form-input w-full" />
                    </div>
                </div>
            )}

            {/* Zone Form */}
            {type === 'zone' && (
    <div className="flex flex-col gap-4">
        <div>
            <label>Country</label>
            <select
                {...register('countryId', { required: true })}
                onChange={handleCountryChange}
                className="form-select w-full"
            >
                <option value="">Select a country</option>
                {countries?.map((c) => (
                    <option key={c._id} value={c._id}>
                        {c.name}
                    </option>
                ))}
            </select>
        </div>
        <div>
            <label>State</label>
            <select
                {...register('stateId', { required: true })}
                onChange={handleStateChange}
                className="form-select w-full"
                disabled={!selectedCountry}
            >
                <option value="">Select a state</option>
                {states
                    ?.filter((s) => s.country === selectedCountry)
                    .map((s) => (
                        <option key={s._id} value={s._id}>
                            {s.name}
                        </option>
                    ))}
            </select>
        </div>
        <div>
            <label>Branch</label>
            <select
                {...register('branchId', { required: true })}
                onChange={handleBranchChange}
                className="form-select w-full"
                disabled={!selectedState}
            >
                <option value="">Select a branch</option>
                {branches
                    ?.filter((b) => b.state === selectedState)
                    .map((b) => (
                        <option key={b._id} value={b.branchId}>
                            {b.branchName}
                        </option>
                    ))}
            </select>
        </div>
        <div>
            <label>Zone Name</label>
            <input {...register('zoneName', { required: true })} className="form-input w-full" />
        </div>
    </div>
)}

            <div className="flex justify-end mt-6">
                <button type="submit" className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600">
                    Submit
                </button>
            </div>
        </form>
    );
};

export default IDAttributeForm;