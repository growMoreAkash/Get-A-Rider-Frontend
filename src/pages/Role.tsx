import { useInsertionEffect, useState } from 'react';
import RoleForm from '../components/RoleForm';
import axios from 'axios';
import Swal from 'sweetalert2';
import TypeBrandCategoryList from '../components/TypeBrandCategoryList';
import Cookies from 'js-cookie';

type ApiFunction = {
    name: string;
    apis: string[];
};

type Role = {
    _id?: string;
    roleName: string | '';
    roleDefination: string | '';
    assignFunction: ApiFunction[] | [];
};

const Role = () => {
    const host = 'https://api.getarider.in/api';
    const [roles, setRoles] = useState<Role[]>([]);
    const [role, setRole] = useState<Role>({ roleName: '', roleDefination: '', assignFunction: [] });

    var token = Cookies.get('token');

    const roleActions = [
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

    const roleColumns = [
        // { header: 'Id', key: '_id' },
        { header: 'Index', key: 'index' },
        { header: 'Role Name', key: 'roleName' },
        { header: 'Date', key: 'date' },
        { header: 'Time', key: 'time' },
    ];

    const handleEdit = (row: any) => {
        setRole(row);
    };

    const getAllRoles = async () => {
        try {
            const response = await axios.post(`${host}/getAllRole`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setRoles(response?.data?.roles);
        } catch (error) {
            Swal.fire('Error', 'Failed to fetch roles', 'error');
        }
    };

    const handleSubmit = async (data: Role) => {
        try {
            if (data._id) {
                const response = await axios.post(
                    `${host}/updateRole`,
                    {
                        roleId: data._id,
                        roleName: data.roleName,
                        roleDefination: data.roleDefination,
                        assignFunction: data.assignFunction,
                        apiUrl: '/updateRole',
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                Swal.fire('Success', 'Role updated successfully', 'success');
            } else {
                const response = await axios.post(
                    `${host}/createRole`,
                    {
                        apiUrl: '/createRole',
                        roleName: data.roleName,
                        roleDefination: data.roleDefination,
                        assignFunction: data.assignFunction,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                Swal.fire('Success', 'Role added successfully', 'success');
            }
            setRole({ roleName: '', roleDefination: '', assignFunction: [] });
            getAllRoles();
        } catch (error) {
            Swal.fire('Error', 'Failed to add role', 'error');
        }
    };

    const onRefresh = () => {
        getAllRoles();
    };

    const onViewLog = () => {};

    const onTrashed = () => {};

    useInsertionEffect(() => {
        getAllRoles();
    }, []);

    return (
        <>
            <div className="flex justify-center flex-col">
                <RoleForm title="Create Role" data={role} onSubmit={(data: Role) => handleSubmit(data)} />
            </div>

            <div className="mt-6">
                <TypeBrandCategoryList columns={roleColumns} actions={roleActions} data={roles} onRefresh={onRefresh} onViewLog={onViewLog} onTrashed={onTrashed} />
            </div>
        </>
    );
};

export default Role;
