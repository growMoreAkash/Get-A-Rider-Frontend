import React, { useEffect } from 'react';
import { useState } from 'react';
import Select from 'react-select';
import useGetBranchIdData from '../hooks/useGetBranchIdData';
import axios from 'axios';
import { useVehicleContext } from '../context/VehicleContext';
import Cookies from 'js-cookie';

type branch = {
    value: string;
    label: string;
};

const EditBranch = ({ branch, branchData, setEditBranch }: any) => {
    const host = "http://localhost:8000/api"
    const [coordinates, setCoordinates] = useState([]);
    const [vertex, setVertex] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

    console.log(branch,"branch")
    console.log(branchData,"branchData")

    const { typeArr } = useVehicleContext();
    const [branchId, setBranchId] = useState('');

    var token = Cookies.get('token');

    const [selectedBranch, setSelectedBranch] = useState<branch>();

    const [formData, setFormData] = useState<any>({
        baseFare: '',
        farePerKm: '',
        cancellationFee: '',
        minimumCancellationFee: '',
        ideleFee: '',
        tripDelayFee: '',
        tax: '',
        convenience: '',
    });

    useEffect(() => {
        if (branchData) {
            setFormData({
                baseFare: branchData.branchPrice.baseFare,
                farePerKm: branchData.branchPrice.farePerKm,
                cancellationFee: branchData.branchPrice.cancellationFee,
                minimumCancellationFee: branchData.branchPrice.minimumCancellationFee,
                ideleFee: branchData.branchPrice.ideleFee,
                tripDelayFee: branchData.branchPrice.tripDelayFee,
                tax: branchData.branchPrice.tax,
                convenience: branchData.branchPrice.convenience,
            });
        }

        if (branchData && branchData.branchId) {
            const defaultOption = branchOptions.find((option: any) => option.label.includes(branchData.branchId));
            setSelectedBranch(defaultOption || null);
        }
    }, [branchData]);

    const branchOptions = branch.map((b: any) => ({
        value: b.branchId,
        label: `${b.branchName} (${b.branchId})`,
    }));

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prevData : any) => ({
            ...prevData,
            [name]: name === 'branchName' ? value : value === '' ? '' : Number(value),
        }));
    };

    const handleBranchChange = (selectedOption: any) => {
        setSelectedBranch(selectedOption);
        setFormData({
            ...formData,
        });
        setBranchId(selectedOption.label.match(/\(([^)]+)\)/)[1]);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const formattedCoordinates = coordinates.map((coord: any) => {
            const [lat, lng] = coord.split(','); // Split string by comma
            return { latitude: lat.trim(), longitude: lng.trim() };
        });

        const requestData = {
            branchPrice: formData, // Spread existing fare-related form data
            branchId : selectedBranch?.value,
            branchVertex: formattedCoordinates,
        };

        try {
            const response = await axios.put(`${host}/updateBranch`, requestData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log('Branch updated successfully', response.data);
        } catch (error: any) {
            console.error('Error updating branch:', error.response?.data || error.message);
        }
    };

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

    const handleTypeChange = (id: string) => {
        setSelectedTypes((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
    };

    return (
        <div className="w-full mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-center">Fare Settings</h2>

            <label className="text-lg font-medium">Select Branch:</label>
            <Select options={branchOptions} value={selectedBranch} onChange={handleBranchChange} placeholder="Select a branch..." isSearchable className="mt-2 mb-4" />

            {/* <div className="mb-4">
                <label className="text-lg font-medium">Select Types:</label>
                <div className="flex gap-4 overflow-x-auto whitespace-nowrap mt-2 p-2 border rounded-md scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200" style={{ maxWidth: '100%' }}>
                    {typeArr.map((type: any) => (
                        <label key={type._id} className="flex items-center gap-2 border p-2 rounded-md min-w-max">
                            <input type="checkbox" value={type._id} checked={selectedTypes.includes(type._id)} onChange={() => handleTypeChange(type._id)} />
                            {type.name}
                        </label>
                    ))}
                </div>
            </div> */}

            <form className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" onSubmit={handleSubmit}>
                {Object.keys(formData).map(
                    (key) =>
                        key !== 'branchId' &&
                        key !== 'branchName' && (
                            <div key={key} className="flex flex-col">
                                <label className="text-gray-700 font-medium" htmlFor={key}>
                                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                                </label>
                                <input
                                    type="number"
                                    id={key}
                                    name={key}
                                    value={formData[key]}
                                    onChange={handleChange}
                                    className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        )
                )}
                <div className="flex justify-center mt-4 sm:col-span-2 md:col-span-3 lg:col-span-4">
                    <iframe src="/geofence.html" title="Geofence Map" className="w-full h-[460px]"></iframe>
                </div>
                <div className="flex justify-start mt-4 sm:col-span-2 md:col-span-3 lg:col-span-4 gap-4">
                    <button type="submit" className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600" onClick={() => setEditBranch(false)}>
                        Cancel
                    </button>
                    <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        Update
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditBranch;
