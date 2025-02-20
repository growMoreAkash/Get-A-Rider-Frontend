import axios from 'axios';
import { host } from '../secret';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
// import Loginform from '../components/Loginform';
// import Updateform from '../components/Updateform';
import TypeBrandCategoryList from '../components/TypeBrandCategoryList';
import { useAuth } from '../context/UserContext';
import Updateform from '../components/Updateform';
import Cookies from 'js-cookie';

const ProfileUpdate = () => {
    const host = 'http://localhost:8000/api';
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };

    const { setUserId, userId, getAllUsers, users } = useAuth();

    const [editingUser, setEditingUser] = useState(null); // State to track the user being edited
    const [showEditForm, setShowEditForm] = useState(false); // State to control showing the edit form

    const userActions = [
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

    const userColumns = [
        { header: 'Id', key: '_id' },
        { header: 'Username', key: 'username' },
        { header: 'Phone', key: 'phone' },
        { header: 'Registration Number', key: 'registrationNumber' },
    ];

    const onRefresh = () => {
        getAllUsers();
    };

    const onViewLog = () => {};

    const onTrashed = () => {};

    // state for update user

    var token = Cookies.get('token');
    const [userData, setUserData] = useState({});

    const handleEdit = async (row: any) => {
        //////.log(row, 'row data');

        try {
            const response = await axios.post(`${host}/getUser/${row.id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUserId(row.id);
            setUserData(response.data);
            setShowEditForm(true);
            setEditingUser(response.data);
        } catch (error) {
            alert('error fetching data from api');
        }
    };

    const handleSaveEdit = (updatedUserData: any) => {
        // Perform update operation here (e.g., send PUT request)
        axios
            .put(`${host}/users/`, updatedUserData)
            .then((response) => {
                Swal.fire('Success!', 'User data updated successfully', 'success');
                setShowEditForm(false); // Hide the edit form after saving
                getAllUsers(); // Refresh the users data
            })
            .catch((error) => {
                Swal.fire('Error!', 'Something went wrong. Please try again later.', 'error');
            });
    };

    const userHandleSubmit = async (data: any) => {
        try {
            await axios.put(`${host}/updateProfile`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setShowEditForm(false);
            alert('success');
        } catch (error) {
            alert('error updating data');
        }
    };

    return (
        <div className="flex justify-center flex-col">
            <div>
                {showEditForm && editingUser ? (
                    <div className="mt-6">
                        <Updateform
                            user={userData} // Pass user data to Updateform component
                            onSave={handleSaveEdit} // Pass the save handler to Updateform
                            onCancel={() => setShowEditForm(false)} // Hide form when canceled
                        />
                    </div>
                ) : (
                    <div>
                        <TypeBrandCategoryList columns={userColumns} actions={userActions} data={users} onRefresh={onRefresh} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileUpdate;
