import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import EmployeeUpdateForm from '../components/EmployeeUpdateForm';
import DocUpdateEmployee from '../components/DocUpdate/DocUpdateEmployee';
import TypeBrandCategoryList from '../components/TypeBrandCategoryList';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

type Employee = {
    id: string;
    phone: string;
    phoneVerified: boolean;
};

const EmployeeUpdate = () => {
    const host = 'https://api.getarider.in/api';
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };
    const [activeTab, setActiveTab] = useState('employeeUpdate');

    const [employees, setEmployees] = useState<Employee[]>([]);

    const [showEditForm, setShowEditForm] = useState(false); // State to control showing the edit form

    const [employeeData, setEmployeeData] = useState(Object);
    const [selectedOwner, setSelectedOwner] = useState(String);

    var token = Cookies.get('token');

    const getAllEmployees = async () => {
        try {
            const response = await axios.post(`${host}/getAllEmployee`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setEmployees(response?.data?.entity);
        } catch (error) {
            //.error('Error fetching employees:', error);
            Swal.fire('Error', 'Failed to fetch employees', 'error');
        }
    };

    useEffect(() => {
        getAllEmployees();
    }, []);

    const employeeActions = [
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
            const response = await axios.post(
                `${host}/getEmployee/${row._id}`,
                {
                    apiUrl: '/getEmployee/:id',
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setEmployeeData(response.data);
            //.log(response.data)

            setShowEditForm(true);
            // setEditingUser(response.data)
        } catch (error) {
            alert('error fetching data from api');
        }
    };

    const employeeColumns = [
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
        getAllEmployees();
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
                                        onClick={() => setActiveTab('employeeUpdate')}
                                        className={`text-capitalize  px-4 py-2 rounded-md ${
                                            activeTab === 'employeeUpdate' ? 'bg-teal-500 text-white font-semibold' : 'text-gray-700 hover:text-teal-500'
                                        }`}
                                    >
                                        Employee Update
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setActiveTab('employeeDocUpdate')}
                                        className={`text-capitalize px-4 py-2 rounded-md ${
                                            activeTab === 'employeeDocUpdate' ? 'bg-teal-500 text-white font-semibold' : 'text-gray-700 hover:text-teal-500'
                                        }`}
                                    >
                                        Employee Document Update
                                    </button>
                                </li>
                            </ul>
                        </div>

                        <div className="mt-4">
                            {activeTab === 'employeeUpdate' && (
                                <>
                                    <div className="w-full">
                                        <EmployeeUpdateForm employee={employeeData} />
                                    </div>
                                </>
                            )}

                            {activeTab === 'employeeDocUpdate' && (
                                <>
                                    <DocUpdateEmployee employee={employeeData} />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="mt-6">
                        <TypeBrandCategoryList columns={employeeColumns} actions={employeeActions} data={employees} onRefresh={onRefresh} onViewLog={onViewLog} onTrashed={onTrashed} />
                    </div>
                </>
            )}
        </div>
    );
};

export default EmployeeUpdate;
