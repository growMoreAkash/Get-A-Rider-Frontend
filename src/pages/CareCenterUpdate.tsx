import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import CareCenterUpdateForm from '../components/CareCenterUpdateForm';
import DocUpdateCareCenter from '../components/DocUpdate/DocUpdateCareCenter';
import TypeBrandCategoryList from '../components/TypeBrandCategoryList';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

type CareCenter = {
    id: string;
    phone: string;
    phoneVerified: boolean;
};

const CareCenterUpdate = () => {
    const host = 'http://localhost:8000/api';
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };
    const [activeTab, setActiveTab] = useState('careCenterUpdate');

    const [careCenters, setCareCenters] = useState<CareCenter[]>([]);

    const [showEditForm, setShowEditForm] = useState(false); // State to control showing the edit form

    const [careCenterData, setCareCenterData] = useState(Object);
    const [selectedOwner, setSelectedOwner] = useState(String);

    var token = Cookies.get('token');

    const getAllCareCenters = async () => {
        try {
            const response = await axios.post(`${host}/getAllCareCenter`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCareCenters(response?.data?.entity);
        } catch (error) {
            //.error('Error fetching careCenters:', error);
            Swal.fire('Error', 'Failed to fetch careCenters', 'error');
        }
    };

    useEffect(() => {
        getAllCareCenters();
    }, []);

    const careCenterActions = [
        {
            icon: 'bi-pencil-fill',
            title: 'Edit',
            onClick: (row: any) => handleEdit(row), // Trigger edit when clicked
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
        try {
            const response = await axios.post(`${host}/getCareCenter/${row._id}`, {
                apiUrl : '/getCareCenter/:id'
            } , {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCareCenterData(response.data);
            //.log(response.data)

            setShowEditForm(true);
            // setEditingUser(response.data)
        } catch (error) {
            alert('error fetching data from api');
        }
    };

    const careCenterColumns = [
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
        getAllCareCenters();
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
                                        onClick={() => setActiveTab('careCenterUpdate')}
                                        className={`text-capitalize  px-4 py-2 rounded-md ${
                                            activeTab === 'careCenterUpdate' ? 'bg-teal-500 text-white font-semibold' : 'text-gray-700 hover:text-teal-500'
                                        }`}
                                    >
                                        CareCenter Update
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setActiveTab('careCenterDocUpdate')}
                                        className={`text-capitalize px-4 py-2 rounded-md ${
                                            activeTab === 'careCenterDocUpdate' ? 'bg-teal-500 text-white font-semibold' : 'text-gray-700 hover:text-teal-500'
                                        }`}
                                    >
                                        CareCenter Document Update
                                    </button>
                                </li>
                            </ul>
                        </div>

                        <div className="mt-4">
                            {activeTab === 'careCenterUpdate' && (
                                <>
                                    <div className="w-full">
                                        <CareCenterUpdateForm careCenter={careCenterData} />
                                    </div>
                                </>
                            )}

                            {activeTab === 'careCenterDocUpdate' && (
                                <>
                                    <DocUpdateCareCenter careCenter={careCenterData} />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="mt-6">
                        <TypeBrandCategoryList columns={careCenterColumns} actions={careCenterActions} data={careCenters} onRefresh={onRefresh} onViewLog={onViewLog} onTrashed={onTrashed} />
                    </div>
                </>
            )}
        </div>
    );
};

export default CareCenterUpdate;
