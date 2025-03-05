import { t, use } from "i18next";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Swal from "sweetalert2";
import axios from "axios";

type User = {
    _id: string | null;
    phone: string;
};

const Login = () => {
    const host = "https://api.getarider.in/api";
    const [type, setType] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState<User>({ _id: null, phone: '' });
    const [loading, setLoading] = useState(false);

    const getUser = async () => {
        var id = Cookies.get('id');
        var token = Cookies.get('token');
        var type = Cookies.get('type');
        setLoading(true);
        setType(type??'');
        try {
            var response = await axios.post(`${host}/get${type}/${id}`,{
                apiUrl : `/get${type}/:id`
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            if (response.statusText === 'OK') {
                setUser(response.data);
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            var response = await axios.post(`${host}/login${type}`, {
                type,
                phone: `+91${phone}`,
                password
            })
            if (response.statusText === 'OK') {
                Cookies.set('token', response.data.token);
                Cookies.set('type', type);
                if (type === 'Admin')
                    Cookies.set('id', response.data.admin.id);
                else
                    Cookies.set('id', response.data.entity.id);
                getUser();
                location.reload();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.data.message
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: t('error')
            });
        }
    }

    useEffect(() => {
        getUser();
    }, []);

    return <>
        <div className="flex justify-center flex-col">
            <div className="w-full flex justify-center">
                <div className="panel w-full sm:w-[50%]">
                    {loading
                        ? <>
                            <div className="flex justify-center">
                                <div className="loader"></div>
                            </div>
                        </>
                        : user._id != null
                            ? <>
                                <h2 className="text-center text-3xl p-5 text-teal-500 font-bold">Welcome {user.phone}</h2>
                                <div className="flex justify-center">
                                    <div className="flex flex-col w-full">
                                        <label className="text-lg text-gray-700">Type</label>
                                        <input type="text" className="input" value={type} disabled />

                                        <label className="text-lg text-gray-700">Phone</label>
                                        <input type="text" className="input" value={user.phone} disabled />

                                        <button onClick={getUser} className="btn">Refresh</button>
                                    </div>
                                </div>
                            </>
                            : <>
                                <h2 className="text-center text-3xl p-5 text-teal-500 font-bold">Login</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="flex justify-center">
                                        <div className="flex flex-col w-full">
                                            <label className="text-lg text-gray-700">Type</label>
                                            <select className="input pt-2 pb-1 px-2 mb-2" onChange={(e) => setType(e.target.value)} required>
                                                <option value="">Select Type</option>
                                                <option value="Admin">Admin</option>
                                                <option value="Employee">Employee</option>
                                                <option value="Partner">Partner</option>
                                                <option value="CareCenter">Care Center</option>
                                            </select>

                                            <label className="text-lg text-gray-700">Phone</label>
                                            <input type="text" className="input pt-2 pb-1 px-2 mb-2 border-[1px] rounded-sm border-gray-300" onChange={(e) => setPhone(e.target.value)} required />

                                            <label className="text-lg text-gray-700">Password</label>
                                            <input type="password" className="input pt-2 pb-1 px-2 mb-5 border-[1px] rounded-sm border-gray-300" onChange={(e) => setPassword(e.target.value)} required />

                                            <button type="submit" className="btn shadow-none bg-teal-400 hover:bg-teal-600 hover:text-white border-none">Login</button>
                                        </div>
                                    </div>
                                </form>
                            </>}
                </div>
            </div>
        </div>
    </>
};

export default Login;