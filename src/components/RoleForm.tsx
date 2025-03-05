import axios from 'axios';
import Cookies from 'js-cookie';
import { FormEvent, useEffect, useState } from 'react';

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

type RoleFormProps = {
    title?: string;
    data?: Role;
    onSubmit: (data: Role) => void;
};

const RoleForm = ({ title, data, onSubmit }: RoleFormProps) => {
    const host = 'https://api.getarider.in/api';
    const [apiFunctions, setApiFunctions] = useState({});
    const [role, setRole] = useState<Role>(data || { roleName: '', roleDefination: '', assignFunction: [] });
    const [selectedSection, setSelectedSection] = useState(0);

    var token = Cookies.get('token');

    useEffect(() => {
        if (data) {
            setRole(data);
        }
    }, [data]);

    useEffect(() => {
        axios
            .post(`${host}/getApiList`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                setApiFunctions(res.data);
            });
    }, []);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit({ ...role });
    };

    return (
        <div className="w-full flex justify-center">
            <div className="panel w-full sm:w-[50%]">
                {title && <h2 className="text-center text-3xl p-5 text-teal-500 font-bold">{title}</h2>}
                <form onSubmit={handleSubmit} className=''>
                    <div>
                        <label>Name</label>
                        <input
                            type="text"
                            value={role.roleName}
                            className='pt-2 pb-1 px-2 mb-5 border-[1px] rounded-sm border-gray-300 w-full'
                            onChange={(e) => setRole({ ...role, roleName: e.target.value })}
                        />
                    </div>
                    <div>
                        <label>Defination</label>
                        <textarea
                            value={role.roleDefination}
                            className='pt-2 pb-1 px-2 mb-5 border-[1px] rounded-sm border-gray-300 w-full'
                            onChange={(e) => setRole({ ...role, roleDefination: e.target.value })}
                        />
                    </div>

                    {role._id !== undefined && <div>
                        {Object.entries(apiFunctions).map(([key, value]: any, index) => (
                            <div key={key}>
                            <input
                                className='me-2 mt-2'
                                type="checkbox"
                                checked={role.assignFunction.some((f) => f.name === value.name)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setRole({ ...role, assignFunction: [...role.assignFunction, value] });
                                    } else {
                                        setRole({ ...role, assignFunction: role.assignFunction.filter((f) => f.name !== value.name) });
                                    }
                                }}
                            />
                            <span className='text-base'>{value.name}</span>
                            </div>
                        ))}
                    </div>}

                    <button className='btn shadow-none bg-teal-400 hover:bg-teal-600 hover:text-white border-none' type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default RoleForm;
