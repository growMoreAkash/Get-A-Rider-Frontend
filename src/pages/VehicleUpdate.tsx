import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

import { useVehicleContext } from '../context/VehicleContext';
import { useDriver } from '../context/DriverContext';

import CustomList from '../components/CustomList';
import DocUpdateVehicle from '../components/DocUpdate/DocUpdateVehicle';
import VehicleUpdateForm from '../components/VehicleUpdateForm';
import Cookies from 'js-cookie';

// Example: if you have the host in a secret file, import it
// import { host } from '../secret';
const host = 'http://localhost:8000/api'; // or from secret if needed

const VehicleUpdate = () => {
    const { vehicles } = useVehicleContext();
    console.log('Vehicles from context:', vehicles);

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };

    const [activeTab, setActiveTab] = useState('driverUpdate');
    const { driverId, setDriverId, getAllDrivers, drivers } = useDriver();

    // Controls showing/hiding the edit form
    const [showEditForm, setShowEditForm] = useState(false);

    // Instead of useState(Object), use an empty object or a typed interface
    const [vehicleData, setVehicleData] = useState<any>({});

    // If you need owners, professions, occupations, etc.
    const [owners, setOwners] = useState<any[]>([]);
    const [professions, setProfessions] = useState<any[]>([]);
    const [occupations, setOccupations] = useState<any[]>([]);

    /**
     * Fetch professions/occupations or other driver attributes
     */
    var token = Cookies.get('token');

    const fetchAttributes = async () => {
        try {
            const firstCreateResponse = await axios.post(`${host}/firstCreateMaster`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const firstCreateId = firstCreateResponse.data.id;

            const response = await axios.post(`${host}/getDriverAttribute/${firstCreateId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProfessions(response.data.driverAttribute.profession);
            setOccupations(response.data.driverAttribute.occupation);
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchAttributes();
    }, []);

    /**
     * Table action: Edit button
     */
    const handleEdit = async (row: any) => {
        console.log('handleEdit row:', row);
        setDriverId(row._id);

        try {
            const response = await axios.post(
                `${host}/getVehicle/${row._id}`,
                {
                    apiUrl: '/getVehicle/:id',
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            // The response should contain the vehicle object
            setVehicleData(response.data.vehicle); // store in state
            setShowEditForm(true);
        } catch (error) {
            alert('Error fetching data from API');
        }
    };

    /**
     * Example table columns & actions
     */
    const vehicleColumns = [
        { header: 'Index', key: 'index' },
        { header: 'Date', key: 'date' },
        { header: 'Time', key: 'time' },
        { header: 'Registration Number', key: 'registrationNumber' },
    ];

    const vehicleActions = [
        {
            icon: 'bi-pencil-fill',
            title: 'Edit',
            onClick: (row: any) => handleEdit(row),
            className: 'text-teal-400',
        },
        {
            icon: 'bi-trash-fill',
            title: 'Delete',
            onClick: (row: any) => {
                /* not implemented */
            },
            className: 'text-red-400',
        },
    ];

    const onRefresh = () => {
        getAllDrivers(); // Refresh driver list (and thereby vehicles if needed)
    };
    const onViewLog = () => { };
    const onTrashed = () => { };

    console.log(vehicleData, "VD")

    return (
        <div className="flex flex-col justify-center">
            {showEditForm ? (
                <div>
                    <div className="flex flex-col gap-3">
                        <div className="bg-white rounded p-1 overflow-x-hidden">
                            <ul
                                className="flex overflow-x-scroll space-x-4 justify-center px-2"
                                style={{
                                    msOverflowStyle: 'none',
                                    WebkitOverflowScrolling: 'touch',
                                }}
                            >
                                <li>
                                    <button
                                        onClick={() => setActiveTab('driverUpdate')}
                                        className={`text-capitalize px-4 py-2 rounded-md ${activeTab === 'driverUpdate' ? 'bg-teal-500 text-white font-semibold' : 'text-gray-700 hover:text-teal-500'
                                            }`}
                                    >
                                        Vehicle Update
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setActiveTab('driverDocUpdate')}
                                        className={`text-capitalize px-4 py-2 rounded-md ${activeTab === 'driverDocUpdate' ? 'bg-teal-500 text-white font-semibold' : 'text-gray-700 hover:text-teal-500'
                                            }`}
                                    >
                                        Vehicle Document Update
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <div className="mt-4">
                            {activeTab === 'driverUpdate' && (
                                <div className="w-full">
                                    {/* Pass the vehicleData to VehicleUpdateForm */}
                                    <VehicleUpdateForm
                                        vehicle={vehicleData}
                                        onCancel={() => setShowEditForm(false)} // If you want a Cancel button
                                    />
                                </div>
                            )}

                            {activeTab === 'driverDocUpdate' && (
                                <>
                                    {/* If you have a separate doc update for vehicles */}
                                    <DocUpdateVehicle vehicle={vehicleData} />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mt-6">
                    {/* When edit form is hidden, show the table/list of vehicles */}
                    <CustomList columns={vehicleColumns} actions={vehicleActions} data={vehicles} onRefresh={onRefresh} onTrashed={onTrashed} onViewLog={onViewLog} />
                </div>
            )}
        </div>
    );
};

export default VehicleUpdate;
