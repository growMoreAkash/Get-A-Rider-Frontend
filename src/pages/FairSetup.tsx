import React, { useEffect, useState } from 'react';
import useGetIdCreation from '../hooks/useGetIdCreation';
import Select from 'react-select';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useVehicleContext } from '../context/VehicleContext';
import TypeBrandCategoryList from '../components/TypeBrandCategoryList';

type branch = {
    value: string;
    label: string;
};

type FareData = {
    [key: string]: string; // Allows any string key
};

const FairSetup = () => {
    const { branch } = useGetIdCreation();
    const { typeArr } = useVehicleContext();
    const token = Cookies.get('token');
    const host = 'http://localhost:8000/api';

    const tabs: { label: string; key: string }[] = [
        { label: 'Day Share', key: 'DAYSHARE' },
        { label: 'Day Reserve', key: 'DAYRESERVE' },
        { label: 'Night Share', key: 'NIGHTSHARE' },
        { label: 'Night Reserve', key: 'NIGHTRESERVE' },
    ];

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

    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

    const [activeTab, setActiveTab] = useState<string>('DAYSHARE');
    const [daySharedPrice, setDaySharedPrice] = useState([]);
    const [nightSharedPrice, setNightSharedPrice] = useState([]);
    const [dayReservedPrice, setDayReservedPrice] = useState([]);
    const [nightReservedPrice, setNightReservedPrice] = useState([]);

    const [selectedBranch, setSelectedBranch] = useState<branch>();

    const [selectedZone, setSelectedZone] = useState<any>(null);
    const [zone, setZone] = useState([]);
    const [zoneOptions, setZoneOptions] = useState<string[]>([]);

    const branchOptions = branch.map((b: any) => ({
        value: b.branchId,
        label: `${b.branchName} (${b.branchId})`,
    }));

    const handleChange = (selectedOption: any) => {
        setSelectedBranch(selectedOption);
    };

    const fetchZone = async () => {
        try {
            const response = await axios.get(`${host}/getAllZonesByBranch/${selectedBranch?.value}/zones`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include token in the request headers
                },
            });

            const extractedZones = response.data.zones.map((zone: any) => ({
                zoneId: zone.zoneId,
                branchId: zone.branchId,
                vehicleType: zone.vehicleType.map((vehicle: any) => ({
                    name: vehicle.name,
                    dayShared: vehicle.DaySharedPrice,
                    dayReserved: vehicle.DayReservedPrice,
                    nightShared: vehicle.NightSharedPrice,
                    nightReserved: vehicle.NightReservedPrice,
                })),
            }));
            setZone(extractedZones);

            // Convert zone data into select options
            const formattedZoneOptions = extractedZones.map((z: any) => ({
                value: z.zoneId,
                label: `Zone ${z.zoneId}`,
            }));

            setZoneOptions(formattedZoneOptions);

            //extracted for xonelistdata
            const extractedDaySharedPrice = response.data.zones.flatMap((zone: any) =>
                zone.vehicleType.map((vehicle: any) => ({
                    name: vehicle.name,
                    baseFare: vehicle.DaySharedPrice?.baseFare ?? 0,
                    farePerKm: vehicle.DaySharedPrice?.farePerKm ?? 0,
                    cancellationFee: vehicle.DaySharedPrice?.cancellationFee ?? 0,
                    minimumCancellationFee: vehicle.DaySharedPrice?.minimumCancellationFee ?? 0,
                    ideleFee: vehicle.DaySharedPrice?.ideleFee ?? 0,
                    tripDelayFee: vehicle.DaySharedPrice?.tripDelayFee ?? 0,
                    tax: vehicle.DaySharedPrice?.tax ?? 0,
                    convenience: vehicle.DaySharedPrice?.convenience ?? 0,
                    indexReg: vehicle.DaySharedPrice?.indexReg ?? 0,
                    indexDed: vehicle.DaySharedPrice?.indexDed ?? 0,
                }))
            );
            setDaySharedPrice(extractedDaySharedPrice);

            const extractedDayReservedPrice = response.data.zones.flatMap((zone: any) =>
                zone.vehicleType.map((vehicle: any) => ({
                    name: vehicle.name,
                    baseFare: vehicle.DayReservedPrice?.baseFare ?? 0,
                    farePerKm: vehicle.DayReservedPrice?.farePerKm ?? 0,
                    cancellationFee: vehicle.DayReservedPrice?.cancellationFee ?? 0,
                    minimumCancellationFee: vehicle.DayReservedPrice?.minimumCancellationFee ?? 0,
                    ideleFee: vehicle.DayReservedPrice?.ideleFee ?? 0,
                    tripDelayFee: vehicle.DayReservedPrice?.tripDelayFee ?? 0,
                    tax: vehicle.DayReservedPrice?.tax ?? 0,
                    convenience: vehicle.DayReservedPrice?.convenience ?? 0,
                    indexReg: vehicle.DayReservedPrice?.indexReg ?? 0,
                    indexDed: vehicle.DayReservedPrice?.indexDed ?? 0,
                }))
            );
            setDayReservedPrice(extractedDayReservedPrice);

            const extractedNightSharedPrice = response.data.zones.flatMap((zone: any) =>
                zone.vehicleType.map((vehicle: any) => ({
                    name: vehicle.name,
                    baseFare: vehicle.NightSharedPrice?.baseFare ?? 0,
                    farePerKm: vehicle.NightSharedPrice?.farePerKm ?? 0,
                    cancellationFee: vehicle.NightSharedPrice?.cancellationFee ?? 0,
                    minimumCancellationFee: vehicle.NightSharedPrice?.minimumCancellationFee ?? 0,
                    ideleFee: vehicle.NightSharedPrice?.ideleFee ?? 0,
                    tripDelayFee: vehicle.NightSharedPrice?.tripDelayFee ?? 0,
                    tax: vehicle.NightSharedPrice?.tax ?? 0,
                    convenience: vehicle.NightSharedPrice?.convenience ?? 0,
                    indexReg: vehicle.NightSharedPrice?.indexReg ?? 0,
                    indexDed: vehicle.NightSharedPrice?.indexDed ?? 0,
                }))
            );
            setNightSharedPrice(extractedNightSharedPrice);

            const extractedNightReservedPrice = response.data.zones.flatMap((zone: any) =>
                zone.vehicleType.map((vehicle: any) => ({
                    name: vehicle.name,
                    baseFare: vehicle.NightReservedPrice?.baseFare ?? 0,
                    farePerKm: vehicle.NightReservedPrice?.farePerKm ?? 0,
                    cancellationFee: vehicle.NightReservedPrice?.cancellationFee ?? 0,
                    minimumCancellationFee: vehicle.NightReservedPrice?.minimumCancellationFee ?? 0,
                    ideleFee: vehicle.NightReservedPrice?.ideleFee ?? 0,
                    tripDelayFee: vehicle.NightReservedPrice?.tripDelayFee ?? 0,
                    tax: vehicle.NightReservedPrice?.tax ?? 0,
                    convenience: vehicle.NightReservedPrice?.convenience ?? 0,
                    indexReg: vehicle.NightReservedPrice?.indexReg ?? 0,
                    indexDed: vehicle.NightReservedPrice?.indexDed ?? 0,
                }))
            );
            setNightReservedPrice(extractedNightReservedPrice);
        } catch (error) {
            setZone([]);
            setDaySharedPrice([]);
            setDayReservedPrice([]);
            setNightReservedPrice([]);
            setNightSharedPrice([]);
            alert('error');
        }
    };

    const handleTypeChange = (id: string) => {
        setSelectedTypes((prev: any) => {
            if (prev?.includes(id)) {
                return prev.filter((t: any) => t !== id); // Remove if already selected
            } else {
                return [...prev, id]; // Add if not selected
            }
        });
    };

    const handleFormChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === 'branchName' ? value : value === '' ? '' : Number(value),
        }));
    };

    console.log(selectedTypes, 'selected types');

    useEffect(() => {
        if (selectedBranch?.value) {
            fetchZone();
        }
    }, [selectedBranch]);

    console.log(zone, 'zone');
    console.log(typeArr, 'typeArr');

    const fairColumn = [
        { header: 'Type Name', key: 'name' },
        { header: 'Base Fare', key: 'baseFare' },
        { header: 'Fare/Km', key: 'farePerKm' },
        { header: 'Cancel Fee', key: 'cancellationFee' },
        { header: 'Min Cancel Fee', key: 'minimumCancellationFee' },
        { header: 'Trip Delay Fee', key: 'tripDelayFee' },
        { header: 'Idele Fee', key: 'ideleFee' },
        { header: 'Tax', key: 'tax' },
        { header: 'Convenience', key: 'convenience' },
    ];

    const onTypeRefresh = () => {};

    const onViewLog = () => {};

    const onTrashed = () => {};

    console.log(daySharedPrice, 'daySharedPrice');

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const requestData = {
            zoneId: selectedZone.value,
            vehicleType: selectedTypes, // Array of selected type IDs
            price: formData,
            type: activeTab,
        };

        try {
            await axios.put(`${host}/addFareToZone`, requestData, {
                headers: {
                    Authorization: `Bearer ${token}`, // Replace with actual token
                    'Content-Type': 'application/json',
                },
            });
            fetchZone();
            alert('Success');

            setSelectedTypes([]);
        } catch (error: any) {
            alert('Error');
        }
    };

    return (
        <div className="panel">
            <div className="bg-white rounded">
                <ul className="flex">
                    {tabs.map((tab: any, index: any): any => (
                        <li key={index} className="mb-6">
                            <button
                                onClick={() => setActiveTab(tab.key as string)}
                                className={`w-36 text-capitalize px-2 mx-5 py-2 rounded-md ${activeTab === tab.key ? 'bg-teal-500 text-white font-semibold' : 'text-gray-700 hover:text-teal-500'}`}
                            >
                                {tab.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="flex flex-col md:flex-row gap-5 w-full">
                <div className="flex flex-col w-full md:w-1/2">
                    <label className="text-lg font-semibold mb-1">Select Branch:</label>
                    <Select options={branchOptions} value={selectedBranch} onChange={handleChange} placeholder="Select a branch..." isSearchable className="w-full" />
                </div>
                <div className="flex flex-col w-full md:w-1/2">
                    <label className="text-lg font-semibold mb-1">Select Zone:</label>
                    <Select
                        options={zoneOptions}
                        value={selectedZone}
                        onChange={(selectedOption: any) => setSelectedZone(selectedOption)}
                        placeholder="Select a zone..."
                        isSearchable
                        isDisabled={zoneOptions.length === 0}
                        className="w-full"
                    />
                </div>
            </div>

            <div className="my-4">
                <label className="text-lg font-medium">Select Types:</label>
                <div className="flex gap-4 overflow-x-auto whitespace-nowrap mt-2 p-2 border rounded-md scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200" style={{ maxWidth: '100%' }}>
                    {typeArr.map((type: any) => (
                        <label key={type._id} className="flex items-center gap-2 border p-2 rounded-md min-w-max">
                            <input type="checkbox" value={type.name} onChange={() => handleTypeChange(type.name)} checked={selectedTypes.includes(type.name)} />
                            {type.name}
                        </label>
                    ))}
                </div>
            </div>

            <form className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" onSubmit={handleSubmit}>
                {Object.keys(formData).map(
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
                                    onChange={handleFormChange}
                                    className="mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        )
                )}
                <div className="flex justify-start mt-4 sm:col-span-2 md:col-span-3 lg:col-span-4 gap-3">
                    <button type="submit" className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                        Cancel
                    </button>
                    <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                        Update
                    </button>
                </div>
            </form>

            <div className="mt-10">
                {activeTab === 'DAYSHARE' && (
                    <TypeBrandCategoryList columns={fairColumn} data={daySharedPrice} onRefresh={onTypeRefresh} onViewLog={onViewLog} onTrashed={onTrashed} activeTab={activeTab} />
                )}
                {activeTab === 'DAYRESERVE' && (
                    <TypeBrandCategoryList columns={fairColumn} data={dayReservedPrice} onRefresh={onTypeRefresh} onViewLog={onViewLog} onTrashed={onTrashed} activeTab={activeTab} />
                )}
                {activeTab === 'NIGHTSHARE' && (
                    <TypeBrandCategoryList columns={fairColumn} data={nightSharedPrice} onRefresh={onTypeRefresh} onViewLog={onViewLog} onTrashed={onTrashed} activeTab={activeTab} />
                )}
                {activeTab === 'NIGHTRESERVE' && (
                    <TypeBrandCategoryList columns={fairColumn} data={nightReservedPrice} onRefresh={onTypeRefresh} onViewLog={onViewLog} onTrashed={onTrashed} activeTab={activeTab} />
                )}
            </div>
        </div>
    );
};

export default FairSetup;
