import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import axios from 'axios';
import { useVehicleContext } from '../context/VehicleContext';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

const TypeReusableForm = ({ title, firstCreateId, handleTypeFormSubmit }: any) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const host = 'https://api.getarider.in/api';

    const registerTitle = title?.toLowerCase().replace(/\s/g, '');

    const { fetchVehicleOtherData } = useVehicleContext();

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    const handleFormSubmit = async (data: any) => {
        var token = Cookies.get('token');
        try {
            const fieldValue = data[registerTitle];

            if (title === 'Type') {
                data.apiUrl ='/addType';
                await axios.post(`${host}/addType`, data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
            } else if (registerTitle === 'geartype') {
                await axios.post(
                    `${host}/addOtherData`,
                    {
                        apiUrl:'/addOtherData',
                        id: firstCreateId,
                        field: 'gearType',
                        value: { name: fieldValue },
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            } else if (registerTitle === 'fueltype') {
                await axios.post(
                    `${host}/addOtherData`,
                    {
                        apiUrl:'/addOtherData',
                        id: firstCreateId,
                        field: 'fuelType',
                        value: { name: fieldValue },
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            } else if (registerTitle === 'registrationyear') {
                await axios.post(
                    `${host}/addOtherData`,
                    {
                        apiUrl:'/addOtherData',
                        id: firstCreateId,
                        field: 'regYear',
                        value: { name: fieldValue },
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            } else if (registerTitle === 'maxenginepower') {
                await axios.post(
                    `${host}/addOtherData`,
                    {
                        apiUrl:'/addOtherData',
                        id: firstCreateId,
                        field: 'maxEnginePower',
                        value: { name: fieldValue },
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            } else if (registerTitle === 'mode') {
                await axios.post(
                    `${host}/addOtherData`,
                    {
                        apiUrl:'/addOtherData',
                        id: firstCreateId,
                        field: 'mode',
                        value: { name: fieldValue },
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            } else if (registerTitle === 'color') {
                await axios.post(
                    `${host}/addOtherData`,
                    {
                        apiUrl:'/addOtherData',
                        id: firstCreateId,
                        field: 'color',
                        value: { name: fieldValue },
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            } else if (registerTitle === 'capacity') {
                await axios.post(
                    `${host}/addOtherData`,
                    {
                        apiUrl:'/addOtherData',
                        id: firstCreateId,
                        field: 'capacity',
                        value: { name: fieldValue },
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            } else if (registerTitle === 'maxspeed') {
                await axios.post(
                    `${host}/addOtherData`,
                    {
                        apiUrl:'/addOtherData',
                        id: firstCreateId,
                        field: 'maxSpeed',
                        value: { name: fieldValue },
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            } else if (registerTitle === 'acceleration') {
                const time = data.time;
                await axios.post(
                    `${host}/addOtherData`,
                    {
                        apiUrl:'/addOtherData',
                        id: firstCreateId,
                        field: 'accelaretion',
                        value: { name: fieldValue + '/' + time },
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            } else {
                await axios.post(
                    `${host}/addOtherData`,
                    {
                        apiUrl:'/addOtherData',
                        id: firstCreateId,
                        field: 'fuelPerLiter',
                        value: { name: fieldValue },
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            }
            reset();
            fetchVehicleOtherData();
            handleTypeFormSubmit();
            showMessage('Added successfully', 'success');
        } catch (error) {
            //.error('Error submitting type:', error);
            showMessage('Error', 'error');
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-white shadow-md rounded-lg p-6">
            <h5 className="text-xl font-bold text-teal-500 mb-4">Add {title}</h5>
            <div className="flex flex-col gap-4">
                <div className="flex gap-4 flex-col">
                    <label htmlFor="typeName" className="text-md font-semibold">
                        {title}
                    </label>
                    <input id="typeName" type="text" {...register(registerTitle, { required: `${title} name is required` })} className="form-input w-full" />
                </div>

                {title === 'Acceleration' && (
                    <div>
                        <label htmlFor="typeName" className="text-md font-semibold">
                            Time
                        </label>
                        <input id="typeName" type="text" {...register('time', { required: `time is required` })} className="form-input w-full" />
                    </div>
                )}

                <div>
                    <label htmlFor="description" className="block font-medium">
                        Short Description
                    </label>
                    <textarea
                        id="description"
                        {...register('description', { required: 'Description is required' })}
                        placeholder="Ex: Description"
                        rows={5}
                        maxLength={800}
                        className="w-full px-3 border rounded-md"
                    />
                </div>
                {errors?.description && <span className="text-red-500 text-sm">{errors.description.message as string}</span>}
            </div>

            <div className="flex justify-end mt-6">
                <button type="submit" className=" border-[1px] hover:bg-teal-500 hover:text-white border-teal-600 text-teal-600 shadow-none  px-4 py-2 rounded-md ">
                    Submit
                </button>
            </div>
        </form>
    );
};

export default TypeReusableForm;
