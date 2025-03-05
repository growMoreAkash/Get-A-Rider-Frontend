import React, { useEffect } from 'react';
import { useState } from 'react';
import Select from 'react-select';
import useGetBranchIdData from '../hooks/useGetBranchIdData';
import axios from 'axios';
import { useVehicleContext } from '../context/VehicleContext';
import Cookies from 'js-cookie';
import useGetAllBranches from '../hooks/useGetAllBranches';

type FareData = {
    [key: string]: string; // Allows any string key
};

const EditZone = ({ branchData, branch, zone, setEditZone }: any) => {
    const host = 'http://localhost:8000/api';
    const [formData, setFormData] = useState<FareData>({
        baseFare: '',
        farePerKm: '',
        cancellationFee: '',
        minimumCancellationFee: '',
        ideleFee: '',
        tripDelayFee: '',
        tax: '',
        convenience: '',
    });

    var token = Cookies.get('token');

    console.log(branchData, 'zoneData');
    const [refresh, setRefresh] = useState(false);

    const [coordinates, setCoordinates] = useState([]);

    const { typeArr } = useVehicleContext();

    const [branchId, setBranchId] = useState('');
    const [zoneId, setZoneId] = useState('');
    const [selectedTypes, setSelectedTypes] = useState<string[]>(() => {
        return branchData?.vehicleType?.map((vehicle: any) => vehicle.name) || [];
    });

    const [selectedBranch, setSelectedBranch] = useState(null);
    const [selectedZone, setSelectedZone] = useState(null);

    const branchOptions = branch.map((b: any) => ({
        value: b.branchId,
        label: `${b.branchName} (${b.branchId})`,
    }));

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
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

    const handleZoneChange = (selectedOption: any) => {
        setSelectedZone(selectedOption);
        setFormData({
            ...formData,
        });
        setZoneId(selectedOption.label.match(/\(([^)]+)\)/)[1]);
    };

    const zoneOptions: any[] = zone.map((z: any) => ({
        value: z.zoneId,
        label: `${z.zoneName} (${z.zoneId})`,
    }));

    useEffect(() => {
        if (branchData) {
            // Set default form values from the first vehicle type
            // if (branchData.vehicleType?.length > 0) {
            //     const firstVehicle = branchData.vehicleType[0];

            //     setFormData({
            //         baseFare: firstVehicle.price.baseFare,
            //         farePerKm: firstVehicle.price.farePerKm,
            //         cancellationFee: firstVehicle.price.cancellationFee,
            //         minimumCancellationFee: firstVehicle.price.minimumCancellationFee,
            //         ideleFee: firstVehicle.price.ideleFee,
            //         tripDelayFee: firstVehicle.price.tripDelayFee,
            //         tax: firstVehicle.price.tax,
            //         convenience: firstVehicle.price.convenience,
            //     });
            // }

            // Set default selected branch
            if (branchData.branchId) {
                const defaultBranchOption = branchOptions.find((option: any) => option.value === branchData.branchId);
                setSelectedBranch(defaultBranchOption || null);
                setBranchId(branchData.branchId);
            }

            // Set default selected zone
            if (branchData.zoneId) {
                const defaultZoneOption = zoneOptions.find((option: any) => option.value === branchData.zoneId);
                setSelectedZone(defaultZoneOption || null);
                setZoneId(branchData.zoneId);
            }

            setCoordinates(branchData.vertex?.map(({ latitude, longitude }: any) => `${latitude}, ${longitude}`));

            const defaultSelectedTypes = branchData.vehicleType?.filter((vehicle: any) => vehicle.active).map((vehicle: any) => vehicle.name);

            console.log('Default selected types:', defaultSelectedTypes);
            setSelectedTypes(defaultSelectedTypes);
            setRefresh((prev) => !prev);
        }
    }, [branchData]);

    const handleTypeChange = (name: string) => {
        setSelectedTypes((prev) => {
            if (prev.includes(name)) {
                return prev.filter((t) => t !== name); // Remove if already selected
            } else {
                return [...prev, name]; // Add if not selected
            }
        });
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

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const formattedCoordinates = coordinates.map((coord: any) => {
            const [lat, lng] = coord.split(','); // Split string by comma
            return { latitude: lat.trim(), longitude: lng.trim() };
        });

        const requestData = {
            branchId,
            zoneId,
            vehicleType: selectedTypes, // Array of selected type IDs
            vertex: formattedCoordinates,
        };
        try {
            const response = await axios.put(`${host}/updateZone`, requestData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            setSelectedTypes([]); // Clear selected vehicle types
            setCoordinates([]); // Clear coordinates
            setEditZone(false);
        } catch (error: any) {
            console.error('Error updating branch:', error.response?.data || error.message);
        }
    };

    console.log(selectedTypes, 'selectedType');

    return (
        <div>
            <div className="w-full mx-auto p-6 bg-white shadow-md rounded-lg">
                <h2 className="text-2xl font-semibold mb-4 text-center">Fare Settings</h2>

                <div>
                    <label className="text-lg font-medium">Select Branch:</label>
                    <Select options={branchOptions} value={selectedBranch} onChange={handleBranchChange} placeholder="Select a branch..." isSearchable className="mt-2 mb-4" />
                </div>

                <div>
                    <label className="text-lg font-medium">Select Zone:</label>
                    <Select options={zoneOptions} value={selectedZone} onChange={handleZoneChange} placeholder="Select a zone..." isSearchable className="mt-2 mb-4" />
                </div>

                <div className="mb-4">
                    <label className="text-lg font-medium">Select Types:</label>
                    <div
                        className="flex gap-4 overflow-x-auto whitespace-nowrap mt-2 p-2 border rounded-md scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200"
                        style={{ maxWidth: '100%' }}
                    >
                        {typeArr.map((type: any) => (
                            <label key={type._id} className="flex items-center gap-2 border p-2 rounded-md min-w-max">
                                <input type="checkbox" value={type.name} checked={selectedTypes?.includes(type.name)} onChange={() => handleTypeChange(type.name)} />
                                {type.name}
                            </label>
                        ))}
                    </div>
                </div>

                <form className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" onSubmit={handleSubmit}>
                    {/* {Object.keys(formData).map(
                        (key) =>
                            key !== 'branchId' &&
                            key !== 'zoneId' &&
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
                    )} */}
                    <div className="flex justify-center mt-4 sm:col-span-2 md:col-span-3 lg:col-span-4">
                        <iframe src="/geofence.html" title="Geofence Map" className="w-full h-[460px]"></iframe>
                    </div>
                    <div className="flex justify-start mt-4 sm:col-span-2 md:col-span-3 lg:col-span-4 gap-3">
                        <button type="submit" className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600" onClick={() => setEditZone(false)}>
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditZone;
