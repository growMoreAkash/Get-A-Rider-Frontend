import React from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';


const DriverLoginForm = ({ onLoginSuccess }: any) => {
    const host = "https://api.getarider.in/api"
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const handlePasswordSubmit = async (data: any) => {
        const apiUrl = import.meta.env.VITE_API_URL;
        try {
            const response = await axios.post(`${host}/loginDriver`, { phone: "+91" + data.phone, password: data.password }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get("token")}`
                },
            });
            Swal.fire({
                icon: 'success',
                title: 'loggedin successfully',
                timer: 1500,
            });
            onLoginSuccess();
            Cookies.set('driver_token', response?.data?.token, { expires: 1 });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'incorrect credentials',
                timer: 1500,
            });
        }
    };

    return (
        <div className="w-[40%] panel">
            <h1 className="text-3xl text-center text-blue-600 font-bold">Driver Login</h1>
            <form className="space-y-5" onSubmit={handleSubmit(handlePasswordSubmit)}>
                <div>
                    <label htmlFor="phone">Phone Number</label>
                    <input id="phone" type="text" className="form-input" {...register('phone', { required: 'Phone number is required' })} placeholder="Enter phone number" />
                    {errors?.phone && <p className="text-red-500">{errors?.phone?.message as string}</p>}
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input id="password" type="password" className="form-input" {...register('password', { required: 'Password is required' })} placeholder="Enter Password" />
                    {errors?.password && <p className="text-red-500">{errors?.password?.message as string}</p>}
                </div>
                <button type="submit" className="btn btn-primary">
                    Submit
                </button>
            </form>
        </div>
    );
};

export default DriverLoginForm;
