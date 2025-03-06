import axios from 'axios';
import React, { useState, useEffect, RefObject, useRef } from 'react';
import { useForm } from 'react-hook-form';
import CareCenterUpdateForm from '../components/CareCenterUpdateForm';
import DocUpdateCareCenter from '../components/DocUpdate/DocUpdateCareCenter';
import TypeBrandCategoryList from '../components/TypeBrandCategoryList';
import OfficialDetailsForm from '../components/OfficialDetailsform';
import CareCenterDownload from '../components/CareCenterDownload';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { toPng } from 'html-to-image';
type CareCenter = {
    id: string;
    phone: string;
    phoneVerified: boolean;
};

const CareCenterUpdate = () => {
    const careCenterDownloadRef = useRef(null);
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

    const handleDownloadImage = (componentRef: RefObject<HTMLElement>) => {
        if (componentRef.current) {
            toPng(componentRef.current, { quality: 1 })
                .then((dataUrl: string) => {
                    const link = document.createElement('a');
                    link.download = 'care_center_registration.png';
                    link.href = dataUrl;
                    link.click();
                })
                .catch((error: Error) => {
                    console.error('Error capturing image:', error);
                });
        }
    };
    const handleSendDetails = async (careCenterId: string) => {
        try {
            const response = await axios.post(
                `${host}/sendCareCenterDetails/${careCenterId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

           
            Swal.fire('Success', response.data, 'success');
        } catch (error) {
            console.error('Error sending details:', error);
            Swal.fire('Error', 'Failed to send details. Please try again.', 'error');
        }
    };
    const getAllCareCenters = async () => {
        try {
            const response = await axios.post(
                `${host}/getAllCareCenter`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
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
            onClick: (row: any) => handleEdit(row), 
            className: 'text-teal-400',
        },
        {
            icon: 'bi-trash-fill',
            title: 'Delete',
            onClick: (row: any) => {},
            className: 'text-red-400',
        },
    ];

    const handleEdit = async (row: any) => {
        try {
            const response = await axios.post(
                `${host}/getCareCenter/${row._id}`,
                {
                    apiUrl: '/getCareCenter/:id',
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setCareCenterData(response.data);
            console.log(response.data);

            setShowEditForm(true);
            // setEditingUser(response.data)
        } catch (error) {
            alert('error fetching data from api');
        }
    };

    // Handle form submission
    const handleOfficialDetailsSubmit = async (data) => {
        const payload = {
            careCenterId: careCenterData?._id, 
            ...data, 
        };

        console.log('Submitting payload:', payload);

        try {
            const response = await axios.post(`${host}/fillOfficialDetails`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log('API Response:', response.data);

            if (response.status === 201) {
                Swal.fire({
                    icon: 'success',
                    title: 'Official details updated successfully',
                    text: `CareCenter ID: ${response.data.officialDetails.careCenterId}, Partner ID: ${response.data.officialDetails.partnerId}`,
                    timer: 3000,
                });
            } else {
                Swal.fire('Error', 'Failed to update official details. Try again.', 'error');
                console.log(response.status);
            }
        } catch (error) {
            console.error('Error:', error);
            if (axios.isAxiosError(error)) {
                console.error('Axios Error:', error.response?.data);
                Swal.fire('Error', `Server Error: ${error.response?.data?.error || 'Unknown error'}`, 'error');
            } else {
                Swal.fire('Error', 'An unexpected error occurred. Try again.', 'error');
            }
        }
    };
    const handleCancel = () => {
        console.log('Form cancelled');
        
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
                                <li>
                                    <button
                                        onClick={() => setActiveTab('officialDetails')}
                                        className={`text-capitalize px-4 py-2 rounded-md ${
                                            activeTab === 'officialDetails' ? 'bg-teal-500 text-white font-semibold' : 'text-gray-700 hover:text-teal-500'
                                        }`}
                                    >
                                        Official Details
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setActiveTab('download')}
                                        className={`text-capitalize px-4 py-2 rounded-md ${activeTab === 'download' ? 'bg-teal-500 text-white font-semibold' : 'text-gray-700 hover:text-teal-500'}`}
                                    >
                                        download
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
                            {activeTab === 'officialDetails' && (
                                <>
                                    <OfficialDetailsForm
                                        careCenterId={careCenterData._id} // Pass the correct careCenterId
                                        onSubmit={handleOfficialDetailsSubmit}
                                        onCancel={handleCancel}
                                        initialData={careCenterData.officialDetails || {}}
                                    />
                                </>
                            )}
                            {activeTab === 'download' && (
                                <div>
                                    <h1 className="text-center text-2xl font-bold my-4">Shop Owner</h1>
                                    <div className='overflow-x-auto'>
                                    <CareCenterDownload ref={careCenterDownloadRef} data={careCenterData} />

                                    </div>
                                    <button onClick={() => handleDownloadImage(careCenterDownloadRef)} className="bg-teal-500 text-white px-4 py-2 rounded-md mt-4">
                                        Download as Image
                                    </button>
                                    <button onClick={() => handleSendDetails(careCenterData._id)} className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4 ml-4">
                                        Send Details
                                    </button>
                                </div>
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
