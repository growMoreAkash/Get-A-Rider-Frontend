import axios from 'axios';
import { host } from '../secret';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import DriverLoginForm from '../components/DriverLoginForm';
import DriverUpdateForm from '../components/DriverUpdateForm';
import OwnerForm from './OwnerForm';
import { useDriver } from '../context/DriverContext';
import TypeBrandCategoryList from '../components/TypeBrandCategoryList';
import OwnerUpdateForm from './OwnerUpdateForm';
import DocUpdateDriver from '../components/DocUpdate/DocUpdateDriver';
import DocUpdateOwner from '../components/DocUpdate/DocUpdateOwner';
import useDeleteDriver from '../hooks/useDeleteDriver';
import Cookies from 'js-cookie';

const DriverUpdate = () => {
    const host = 'http://localhost:8000/api';
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };
    const [ownerData, setOwnerData] = useState();
    const [activeTab, setActiveTab] = useState('driverUpdate');

    const { driverId, setDriverId, getAllDrivers, drivers } = useDriver();
    // ////.log(drivers)

    const [showEditForm, setShowEditForm] = useState(false); // State to control showing the edit form

    const [driverData, setDriverData] = useState(Object);
    const [selectedOwner, setSelectedOwner] = useState(String);
    const [owners, setOwners] = useState([]);
    const [professions, setProfessions] = useState<any[]>([]);
    const [religion, setReligion] = useState<any[]>([]);
    const [occupations, setOccupations] = useState<any[]>([]);

    const { onDriverDelete } = useDeleteDriver();

    var token = Cookies.get('token');

    const fetchAttributes = async () => {
        try {
            var firstCreateId = (await axios.post('http://localhost:8000/api/firstCreateMaster', {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })).data.id;
            var response = await axios.post(`http://localhost:8000/api/getDriverAttribute/${firstCreateId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProfessions(response.data.driverAttribute.profession);
            setReligion(response.data.driverAttribute.religion);
            setOccupations(response.data.driverAttribute.occupation);
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchAttributes();
    }, []);

    const fetchOwners = async () => {
        handleEdit({ _id: driverId });
    };

    useEffect(() => {
        if (driverData._id) {
            if (driverData.owners.find((owner: any) => owner._id === selectedOwner) == null) setSelectedOwner('');
        }
    }, [driverData]);

    const driverActions = [
        {
            icon: 'bi-pencil-fill',
            title: 'Edit',
            onClick: (row: any) => handleEdit(row), // Trigger edit when clicked
            className: 'text-teal-400',
        },
        {
            icon: 'bi-trash-fill',
            title: 'Delete',
            onClick: async (row: any) => {
                await onDriverDelete(row._id);
            },
            className: 'text-red-400',
        },
    ];

    const ownerActions = [
        {
            icon: 'bi-pencil-fill',
            title: 'Edit',
            onClick: (row: any) => {
                setSelectedOwner(row._id);
                setActiveTab('ownerUpdate');
            }, // Trigger edit when clicked
            className: 'text-teal-400',
        },
        {
            icon: 'bi-trash-fill',
            title: 'Delete',
            onClick: (row: any) => {}, // Handle delete (not implemented here)
            className: 'text-red-400',
        },
    ];

    const handleEdit = async (row: any) => {
        //////.log(row, 'row data');
        setDriverId(row._id);

        try {
            const response = await axios.post(`${host}/getDriver/${row._id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setDriverData(response.data);
            //.log(response.data)

            const ownerResponse = await axios.post(`${host}/getOwners/${row._id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setOwnerData(ownerResponse.data);

            setShowEditForm(true);
            // setEditingUser(response.data)
        } catch (error) {
            alert('error fetching data from api');
        }
    };

    const driverColumns = [
        // { header: 'Id', key: '_id' },
        { header: 'Index', key: 'index' },
        { header: 'Date', key: 'date' },
        { header: 'Time', key: 'time' },
        { header: 'Phone', key: 'phone' },
        { header: 'Registration Number', key: 'registrationNumber' },
    ];

    const ownerColumns = [
        { header: 'Index', key: 'index' },
        { header: 'Date', key: 'date' },
        { header: 'Time', key: 'time' },
        { header: 'Registration Number', key: 'registrationNumber' },
    ];

    const onRefresh = () => {
        getAllDrivers();
    };

    const onViewLog = () => {};

    const onTrashed = () => {};

    return (
        <div className="flex justify-center flex-col">
            {showEditForm ? (
                <div>
                    <div className="flex flex-col gap-3">
                        <div className="bg-white rounded p-1 overflow-x-hidden ">
                            <ul
                                className="flex overflow-x-scroll space-x-4 justify-center px-2 "
                                style={{
                                    msOverflowStyle: 'none',
                                    // scrollbarWidth: 'none',
                                    WebkitOverflowScrolling: 'touch',
                                }}
                            >
                                <li>
                                    <button
                                        onClick={() => setActiveTab('driverUpdate')}
                                        className={`text-capitalize  px-4 py-2 rounded-md ${
                                            activeTab === 'driverUpdate' ? 'bg-teal-500 text-white font-semibold' : 'text-gray-700 hover:text-teal-500'
                                        }`}
                                    >
                                        Driver Update
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setActiveTab('driverDocUpdate')}
                                        className={`text-capitalize px-4 py-2 rounded-md ${
                                            activeTab === 'driverDocUpdate' ? 'bg-teal-500 text-white font-semibold' : 'text-gray-700 hover:text-teal-500'
                                        }`}
                                    >
                                        Driver Document Update
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setActiveTab('addOwner')}
                                        className={`text-capitalize px-4 py-2 rounded-md ${activeTab === 'addOwner' ? 'bg-teal-500 text-white font-semibold' : 'text-gray-700 hover:text-teal-500'}`}
                                    >
                                        Add Owner
                                    </button>
                                </li>

                                <li>
                                    <button
                                        onClick={() => setActiveTab('ownerUpdate')}
                                        className={`text-capitalize px-4 py-2 rounded-md ${activeTab === 'ownerUpdate' ? 'bg-teal-500 text-white font-semibold' : 'text-gray-700 hover:text-teal-500'}`}
                                    >
                                        Owner Update
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setActiveTab('ownerDocUpdate')}
                                        className={`text-capitalize px-4 py-2 rounded-md ${
                                            activeTab === 'ownerDocUpdate' ? 'bg-teal-500 text-white font-semibold' : 'text-gray-700 hover:text-teal-500'
                                        }`}
                                    >
                                        Owner Document Update
                                    </button>
                                </li>
                            </ul>
                        </div>

                        <div className="mt-4">
                            {activeTab === 'driverUpdate' && (
                                <>
                                    <div className="w-full">
                                        <DriverUpdateForm driver={driverData} professions={professions} religion={religion} occupations={occupations} />
                                    </div>
                                </>
                            )}

                            {activeTab === 'driverDocUpdate' && (
                                <>
                                    <DocUpdateDriver driver={driverData} />
                                </>
                            )}

                            {activeTab === 'addOwner' && (
                                <>
                                    <div className="w-full">
                                        <OwnerForm driverId={driverId} />
                                        <TypeBrandCategoryList
                                            columns={ownerColumns}
                                            actions={ownerActions}
                                            data={driverData.owners}
                                            onRefresh={fetchOwners}
                                            onViewLog={onViewLog}
                                            onTrashed={onTrashed}
                                        />
                                    </div>
                                </>
                            )}
                            {activeTab === 'ownerUpdate' && (
                                <>
                                    <OwnerUpdateForm
                                        driverId={driverId}
                                        professions={professions}
                                        religion={religion}
                                        occupations={occupations}
                                        owners={driverData.owners}
                                        selectedOwner={selectedOwner}
                                        setSelectedOwner={setSelectedOwner}
                                        fetchOwners={fetchOwners}
                                    />
                                </>
                            )}

                            {activeTab === 'ownerDocUpdate' && (
                                <>
                                    <DocUpdateOwner driverId={driverData._id} owners={driverData.owners} selectedOwner={selectedOwner} setSelectedOwner={setSelectedOwner} fetchOwners={fetchOwners} />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="mt-6">
                        <TypeBrandCategoryList columns={driverColumns} actions={driverActions} data={drivers} onRefresh={onRefresh} onViewLog={onViewLog} onTrashed={onTrashed} />
                    </div>
                </>
            )}
        </div>
    );
};

export default DriverUpdate;
