import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import PartnerUpdateForm from '../components/PartnerUpdateForm';
import DocUpdatePartner from '../components/DocUpdate/DocUpdatePartner';
import TypeBrandCategoryList from '../components/TypeBrandCategoryList';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

type Partner = {
    id: string;
    phone: string;
    phoneVerified: boolean;
};

const PartnerUpdate = () => {
    const host = 'http://localhost:8000/api';
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };
    const [activeTab, setActiveTab] = useState('partnerUpdate');

    const [partners, setPartners] = useState<Partner[]>([]);

    const [showEditForm, setShowEditForm] = useState(false); // State to control showing the edit form

    const [partnerData, setPartnerData] = useState(Object);
    const [selectedOwner, setSelectedOwner] = useState(String);

    var token = Cookies.get('token');

    const getAllPartners = async () => {
        try {
            const response = await axios.post(`${host}/getAllPartner`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPartners(response?.data?.entity);
        } catch (error) {
            //.error('Error fetching partners:', error);
            Swal.fire('Error', 'Failed to fetch partners', 'error');
        }
    };

    useEffect(() => {
        getAllPartners();
    }, []);

    const partnerActions = [
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
            const response = await axios.post(`${host}/getPartner/${row._id}`,{
                apiUrl : '/getPartner/:id'
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setPartnerData(response.data);
            //.log(response.data)

            setShowEditForm(true);
            // setEditingUser(response.data)
        } catch (error) {
            alert('error fetching data from api');
        }
    };

    const partnerColumns = [
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
        getAllPartners();
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
                                        onClick={() => setActiveTab('partnerUpdate')}
                                        className={`text-capitalize  px-4 py-2 rounded-md ${
                                            activeTab === 'partnerUpdate' ? 'bg-teal-500 text-white font-semibold' : 'text-gray-700 hover:text-teal-500'
                                        }`}
                                    >
                                        Partner Update
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setActiveTab('partnerDocUpdate')}
                                        className={`text-capitalize px-4 py-2 rounded-md ${
                                            activeTab === 'partnerDocUpdate' ? 'bg-teal-500 text-white font-semibold' : 'text-gray-700 hover:text-teal-500'
                                        }`}
                                    >
                                        Partner Document Update
                                    </button>
                                </li>
                            </ul>
                        </div>

                        <div className="mt-4">
                            {activeTab === 'partnerUpdate' && (
                                <>
                                    <div className="w-full">
                                        <PartnerUpdateForm partner={partnerData} />
                                    </div>
                                </>
                            )}

                            {activeTab === 'partnerDocUpdate' && (
                                <>
                                    <DocUpdatePartner partner={partnerData} />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="mt-6">
                        <TypeBrandCategoryList columns={partnerColumns} actions={partnerActions} data={partners} onRefresh={onRefresh} onViewLog={onViewLog} onTrashed={onTrashed} />
                    </div>
                </>
            )}
        </div>
    );
};

export default PartnerUpdate;
