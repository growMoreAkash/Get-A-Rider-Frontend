import axios from 'axios';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import TypeBrandCategoryList from '../components/TypeBrandCategoryList';
import Cookies from 'js-cookie';

type ApiFunction = {
    name: string;
    api: string;
};

type Role = {
    _id?: string;
    roleName: string | '';
    roleDefination: string | '';
    assignFunction: ApiFunction[] | [];
};

type Employee = {
    _id: string;
    phone: string;
    phoneVerified: boolean;
    roleId: String[];
};

type Partner = {
    _id: string;
    phone: string;
    phoneVerified: boolean;
    roleId: String[];
};

type CareCenter = {
    _id: string;
    phone: string;
    phoneVerified: boolean;
    roleId: String[];
};

const AssignRole = () => {
    const host = 'http://localhost:8000/api';
    const [type, setType] = useState<string>('');
    const [roles, setRoles] = useState<Role[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [partners, setPartners] = useState<Partner[]>([]);
    const [careCenters, setCareCenters] = useState<CareCenter[]>([]);
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
    const [selectedPartners, setSelectedPartners] = useState<string[]>([]);
    const [selectedCareCenters, setSelectedCareCenters] = useState<string[]>([]);
    const [selectedRole, setSelectedRole] = useState<string>('');

    const userColumns = [
         //{ header: 'Id', key: '_id' },
        { header: 'Index', key: 'index' },
        { header: 'Name', key: 'name' },
        { header: 'Phone', key: 'phone' },
        { header: 'Date', key: 'date' },
        { header: 'Time', key: 'time' },
    ];
    const roleActions = [
        {
            icon: 'bi-trash-fill',
            title: 'Delete',
            onClick: (row: any) => handleDelete(row.roleId, row._id, type),
            className: 'text-red-400',
        },
    ];



    var token = Cookies.get('token');
    const getAllRoles = async () => {
        try {
            const response = await axios.post(
                `${host}/getAllRole`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setRoles(response?.data?.roles);
        } catch (error) {
            Swal.fire('Error', 'Failed to fetch roles', 'error');
        }
    };

    const getAllEmployees = async () => {
        try {
            const response = await axios.post(
                `${host}/getAllEmployee`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setEmployees(response?.data?.entity);
        } catch (error) {
            //.error('Error fetching employees:', error);
            Swal.fire('Error', 'Failed to fetch employees', 'error');
        }
    };

    const getAllPartners = async () => {
        try {
            const response = await axios.post(
                `${host}/getAllPartner`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setPartners(response?.data?.entity);
        } catch (error) {
            //.error('Error fetching partners:', error);
            Swal.fire('Error', 'Failed to fetch partners', 'error');
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

    const onRefresh = () => {
        getAllRoles();
        getAllEmployees();
        getAllPartners();
        getAllCareCenters();
    };

    const onViewLog = () => {
        Swal.fire('View Log', 'View log is not implemented yet', 'info');
    };

    const onTrashed = () => {
        Swal.fire('Trashed', 'Trashed is not implemented yet', 'info');
    };


    // const handleDelete = async (roleId: string, userId: string, userType: string) => {
       
    //     try {
    //         const response = await axios.post(`${host}/deleteUserRole`, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //             data: {
    //                 roleId,
    //                 userId,
    //                 userType,
    //             },
    //         });
    //         console.log(response.data)
    //         if (response.status === 200) {
    //             Swal.fire('Success', 'User role deleted successfully', 'success');
    //             onRefresh(); 
    //         } else {
    //             Swal.fire('Error', 'Failed to delete user role', 'error');
    //         }
    //     } catch (error) {
    //         Swal.fire('Error', 'Failed to delete user role', 'error');
    //     }
    // };

    const handleDelete = async (roleId: string, userId: string, userType: string) => {
        try {
            const response = await axios.post(
                `${host}/deleteUserRole`,
                {
                    roleId,
                    userId,
                    userType,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            console.log(response.data);
    
            if (response.status === 200) {
                Swal.fire('Success', 'User role deleted successfully', 'success');
                onRefresh(); 
            } else {
                Swal.fire('Error', 'Failed to delete user role', 'error');
            }
        } catch (error) {
            console.error('Error deleting user role:', error);
    
            if (axios.isAxiosError(error)) {
              
                if (error.response) {
                  
                    const errorMessage = error.response.data?.message || 'Failed to delete user role';
                    Swal.fire('Error', errorMessage, 'error');
                } else if (error.request) {
                   
                    Swal.fire('Error', 'No response received from the server', 'error');
                } else {
                   
                    Swal.fire('Error', 'Error setting up the request', 'error');
                }
            } else {
               
                Swal.fire('Error', 'An unexpected error occurred', 'error');
            }
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        var token = Cookies.get('token');
        e.preventDefault();
        try {
            const response = axios.post(
                `${host}/assignCustomUserRole`,
                {
                    apiUrl: '/assignCustomUserRole',
                    Model: type,
                    role: selectedRoles,
                    customUser: type === 'Employee' ? selectedEmployees : type === 'Partner' ? selectedPartners : selectedCareCenters,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            Swal.fire('Success', 'Role assigned successfully', 'success');
        } catch (error) {
            Swal.fire('Error', 'Failed to assign role', 'error');
        }
    };

    useEffect(() => {
        getAllRoles();
        getAllEmployees();
        getAllPartners();
        getAllCareCenters();
    }, []);

    return (
        <div className="flex justify-center flex-col">
            <div className="w-full flex justify-center">
                <div className="panel w-full sm:w-[50%]">
                    <h2 className="text-center text-3xl p-5 text-teal-500 font-bold">Assign Role</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="flex justify-center">
                            <div className="flex flex-col w-full">
                                <div className="flex justify-center">
                                    <div className="flex flex-col w-full">
                                        <div className="flex-col justify-center">
                                            <div className="flex flex-col w-full">
                                                <label className="text-lg text-gray-700">Type</label>
                                                <select className="input pt-2 pb-1 px-2 mb-2" onChange={(e) => setType(e.target.value)} required>
                                                    <option value="">Select Type</option>
                                                    <option value="Employee">Employee</option>
                                                    <option value="Partner">Partner</option>
                                                    <option value="CareCenter">Care Center</option>
                                                </select>
                                            </div>
                                            <div className="w-full h-px bg-gray-300 my-4"></div>
                                            <div className="flex justify-center">
                                                <div className="flex flex-col w-full mb-3">
                                                    <label className="text-lg text-gray-700">Roles</label>
                                                    {roles.map((role, index) => (
                                                        <div key={index} className="flex items-center">
                                                            <input type="checkbox" className="me-2" value={role._id} onChange={(e) => setSelectedRoles([...selectedRoles, e.target.value])} />
                                                            <label className="text-lg text-gray-700 mb-0">{role.roleName}</label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            {type === 'Employee' && (
                                                <>
                                                    <div className="w-full h-px bg-gray-300 my-4"></div>

                                                    <div className="flex justify-center">
                                                        <div className="flex flex-col w-full">
                                                            <label className="text-lg text-gray-700">Employees</label>
                                                            {employees.map((employee, index) => (
                                                                <div key={index} className="flex items-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="me-2"
                                                                        value={employee._id}
                                                                        onChange={(e) => setSelectedEmployees([...selectedEmployees, e.target.value])}
                                                                    />
                                                                    <label className="text-lg text-gray-700 mb-0">{employee.phone}</label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                            {type === 'Partner' && (
                                                <>
                                                    <div className="w-full h-px bg-gray-300 my-4"></div>
                                                    <div className="flex justify-center">
                                                        <div className="flex flex-col w-full">
                                                            <label className="text-lg text-gray-700">Partners</label>
                                                            {partners.map((partner, index) => (
                                                                <div key={index} className="flex items-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="me-2"
                                                                        value={partner._id}
                                                                        onChange={(e) => setSelectedPartners([...selectedPartners, e.target.value])}
                                                                    />
                                                                    <label className="text-lg text-gray-700 mb-0">{partner.phone}</label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                            {type === 'CareCenter' && (
                                                <>
                                                    <div className="w-full h-px bg-gray-300 my-4"></div>
                                                    <div className="flex justify-center">
                                                        <div className="flex flex-col w-full">
                                                            <label className="text-lg text-gray-700">Care Centers</label>
                                                            {careCenters.map((careCenter, index) => (
                                                                <div key={index} className="flex items-center">
                                                                    <input
                                                                        type="checkbox"
                                                                        className="me-2"
                                                                        value={careCenter._id}
                                                                        onChange={(e) => setSelectedCareCenters([...selectedCareCenters, e.target.value])}
                                                                    />
                                                                    <label className="text-lg text-gray-700 mb-0">{careCenter.phone}</label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-center">
                                    <button type="submit" className="btn mt-3 shadow-none bg-teal-400 hover:bg-teal-600 hover:text-white border-none">
                                        Assign Role
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className="mt-6">
                {roles.map((role, index) => (
                    <div key={index}>
                        <h2 id={`accordion-collapse-heading-${index}`}>
                            <button
                                type="button"
                                onClick={() => setSelectedRole(role._id!)}
                                className="flex items-center justify-between w-full p-5 font-medium rtl:text-right text-gray-500 border border-gray-200 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 gap-3"
                            >
                                <span>{role.roleName}</span>
                            </button>
                        </h2>
                        {selectedRole === role._id! && (
                            <div id={`accordion-collapse-body-${index}`} aria-labelledby={`accordion-collapse-heading-${index}`}>
                                <TypeBrandCategoryList
                                    columns={userColumns}
                                    data={(type === 'Employee' ? employees : type === 'Partner' ? partners : careCenters)
                                        .filter((user) => user.roleId.includes(role._id!))
                                        .map((user) => ({ ...user, roleId: role._id }))} 
                                    onRefresh={onRefresh}
                                    onViewLog={onViewLog}
                                    onTrashed={onTrashed}
                                    actions={roleActions}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AssignRole;
