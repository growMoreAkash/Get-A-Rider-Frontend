import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

interface EmployeeFormFields {
    personalDetails: {
        name: string;
        careOf: string;
        sex: "Male" | "Female" | "Others";
        maritalStatus: "Married" | "Unmarried";
        age: Number;
        highestQualification: string;
        occupation: string;
        alternatePhoneNumber: string;
        personalEmailId: string;
        whatsappNumber: string;
        technicalSkills: string;
        extraTechnicalSkills: string;
    };

    bankingDetails: {
        bankName: string;
        branchName: string;
        accountNumber: string;
        accountHolderName: string;
        ifscCode: string;
        panNumber: string;
        aadhaarNumber: string;
        upiId: string;
        googlePayNumber: string;
        phonePayNumber: string;
    };

    addressDetails: {
        houseOrShopNumber: string;
        wardOrGPName: string;
        cityOrTown: string;
        laneNumberOrName: string;
        postOffice: string;
        policeStation: string;
        district: string;
        state: string;
        pinCode: string;
    };

    officialDetails: {
        employmentType: string;
        department: string;
        reportingTo: string;
        designation: string;
        grade: string;
    };
}

const EmployeeUpdateForm = ({ employee, onSave, onCancel }: any) => {
    const host = 'http://localhost:8000/api';

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        control
    } = useForm({
        defaultValues: {
            personalDetails: {
                name: employee?.personalDetails?.name || '',
                careOf: employee?.personalDetails?.careOf || '',
                sex: employee?.personalDetails?.sex || '',
                maritalStatus: employee?.personalDetails?.maritalStatus || '',
                age: employee?.personalDetails?.age || '',
                highestQualification: employee?.personalDetails?.highestQualification || '',
                occupation: employee?.personalDetails?.occupation || '',
                alternatePhoneNumber: employee?.personalDetails?.alternatePhoneNumber || '',
                personalEmailId: employee?.personalDetails?.personalEmailId || '',
                whatsappNumber: employee?.personalDetails?.whatsappNumber || '',
                technicalSkills: employee?.personalDetails?.technicalSkills || '',
                extraTechnicalSkills: employee?.personalDetails?.extraTechnicalSkills || '',
            },

            bankingDetails: {
                bankName: employee?.bankingDetails?.bankName || '',
                branchName: employee?.bankingDetails?.branchName || '',
                accountNumber: employee?.bankingDetails?.accountNumber || '',
                accountHolderName: employee?.bankingDetails?.accountHolderName || '',
                ifscCode: employee?.bankingDetails?.ifscCode || '',
                panNumber: employee?.bankingDetails?.panNumber || '',
                aadhaarNumber: employee?.bankingDetails?.aadhaarNumber || '',
                upiId: employee?.bankingDetails?.upiId || '',
                googlePayNumber: employee?.bankingDetails?.googlePayNumber || '',
                phonePayNumber: employee?.bankingDetails?.phonePayNumber || '',
            },

            addressDetails: {
                houseOrShopNumber: employee?.addressDetails?.houseOrShopNumber || '',
                wardOrGPName: employee?.addressDetails?.wardOrGPName || '',
                cityOrTown: employee?.addressDetails?.cityOrTown || '',
                laneNumberOrName: employee?.addressDetails?.laneNumberOrName || '',
                postOffice: employee?.addressDetails?.postOffice || '',
                policeStation: employee?.addressDetails?.policeStation || '',
                district: employee?.addressDetails?.district || '',
                state: employee?.addressDetails?.state || '',
                pinCode: employee?.addressDetails?.pinCode || '',
            },

            officialDetails: {
                employmentType: employee?.officialDetails?.employmentType || '',
                department: employee?.officialDetails?.department || '',
                reportingTo: employee?.officialDetails?.reportingTo || '',
                designation: employee?.officialDetails?.designation || '',
                grade: employee?.officialDetails?.grade || '',
            },
        },
    });

    useEffect(() => {
        if (employee) {
            reset({
                personalDetails: {
                    name: employee?.personalDetails?.name || '',
                    careOf: employee?.personalDetails?.careOf || '',
                    sex: employee?.personalDetails?.sex || '',
                    maritalStatus: employee?.personalDetails?.maritalStatus || '',
                    age: employee?.personalDetails?.age || '',
                    highestQualification: employee?.personalDetails?.highestQualification || '',
                    occupation: employee?.personalDetails?.occupation || '',
                    alternatePhoneNumber: employee?.personalDetails?.alternatePhoneNumber || '',
                    personalEmailId: employee?.personalDetails?.personalEmailId || '',
                    whatsappNumber: employee?.personalDetails?.whatsappNumber || '',
                    technicalSkills: employee?.personalDetails?.technicalSkills || '',
                    extraTechnicalSkills: employee?.personalDetails?.extraTechnicalSkills || '',
                },

                bankingDetails: {
                    bankName: employee?.bankingDetails?.bankName || '',
                    branchName: employee?.bankingDetails?.branchName || '',
                    accountNumber: employee?.bankingDetails?.accountNumber || '',
                    accountHolderName: employee?.bankingDetails?.accountHolderName || '',
                    ifscCode: employee?.bankingDetails?.ifscCode || '',
                    panNumber: employee?.bankingDetails?.panNumber || '',
                    aadhaarNumber: employee?.bankingDetails?.aadhaarNumber || '',
                    upiId: employee?.bankingDetails?.upiId || '',
                    googlePayNumber: employee?.bankingDetails?.googlePayNumber || '',
                    phonePayNumber: employee?.bankingDetails?.phonePayNumber || '',
                },

                addressDetails: {
                    houseOrShopNumber: employee?.addressDetails?.houseOrShopNumber || '',
                    wardOrGPName: employee?.addressDetails?.wardOrGPName || '',
                    cityOrTown: employee?.addressDetails?.cityOrTown || '',
                    laneNumberOrName: employee?.addressDetails?.laneNumberOrName || '',
                    postOffice: employee?.addressDetails?.postOffice || '',
                    policeStation: employee?.addressDetails?.policeStation || '',
                    district: employee?.addressDetails?.district || '',
                    state: employee?.addressDetails?.state || '',
                    pinCode: employee?.addressDetails?.pinCode || '',
                },

                officialDetails: {
                    employmentType: employee?.officialDetails?.employmentType || '',
                    department: employee?.officialDetails?.department || '',
                    reportingTo: employee?.officialDetails?.reportingTo || '',
                    designation: employee?.officialDetails?.designation || '',
                    grade: employee?.officialDetails?.grade || '',
                },
            });
        }
    }, [employee, reset]);

    const onSubmit = async (data: any) => {
        try {
            await axios.put(`${host}/updateEmployeeProfile/${employee._id}`, JSON.stringify(data), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get("token")}`
                }
            });

            Swal.fire({
                icon: 'success',
                title: 'Employee profile updated successfully',
                timer: 3000,
            });
        } catch (error) {
            //.error('Error while updating employee profile:', error);
            Swal.fire('Error', 'Failed to update profile. Try again.', 'error');
        }
    };


    return (
        <div>
            <div className="panel">
                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                    {/* Main Container */}
                    <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                        {/* Left Section - Input Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <h2 className="text-xl font-semibold">Personal Details</h2>
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        {...register('personalDetails.name', { required: 'Name is required' })}
                                        className="mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="careOf" className="block text-sm font-medium text-gray-700">Care Of</label>
                                    <input
                                        type="text"
                                        id="careOf"
                                        {...register('personalDetails.careOf')}
                                        className="mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                                    />
                                </div>

                                <div>
                                    <label htmlFor='sex' className='block text-sm font-medium text-gray-700'>Sex</label>
                                    <select
                                        {...register('personalDetails.sex')}
                                        className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm'
                                    >
                                        <option value=''>Select</option>
                                        <option value='Male'>Male</option>
                                        <option value='Female'>Female</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor='maritalStatus' className='block text-sm font-medium text-gray-700'>Marital Status</label>
                                    <select
                                        {...register('personalDetails.maritalStatus')}
                                        className='mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm'
                                    >
                                        <option value=''>Select</option>
                                        <option value='Married'>Married</option>
                                        <option value='Unmarried'>Unmarried</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor='age' className='block text-sm font-medium text-gray-700'>Age</label>
                                    <input
                                        type='number'
                                        {...register('personalDetails.age')}
                                        className='mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                    />
                                </div>

                                <div>
                                    <label htmlFor='highestQualification' className='block text-sm font-medium text-gray-700'>Highest Qualification</label>
                                    <input
                                        type='text'
                                        {...register('personalDetails.highestQualification')}
                                        className='mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                    />
                                </div>

                                <div>
                                    <label htmlFor='occupation' className='block text-sm font-medium text-gray-700'>Occupation</label>
                                    <input
                                        type='text'
                                        {...register('personalDetails.occupation')}
                                        className='mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                    />
                                </div>

                                <div>
                                    <label htmlFor='alternatePhoneNumber' className='block text-sm font-medium text-gray-700'>Alternate Phone Number</label>
                                    <input
                                        type='text'
                                        {...register('personalDetails.alternatePhoneNumber')}
                                        className='mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                    />
                                </div>

                                <div>
                                    <label htmlFor='personalEmailId' className='block text-sm font-medium text-gray-700'>Personal Email ID</label>
                                    <input
                                        type='email'
                                        {...register('personalDetails.personalEmailId')}
                                        className='mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                    />
                                </div>

                                <div>
                                    <label htmlFor='whatsappNumber' className='block text-sm font-medium text-gray-700'>WhatsApp Number</label>
                                    <input
                                        type='text'
                                        {...register('personalDetails.whatsappNumber')}
                                        className='mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                    />
                                </div>

                                <div>
                                    <label htmlFor='technicalSkills' className='block text-sm font-medium text-gray-700'>Technical Skills</label>
                                    <input
                                        type='text'
                                        {...register('personalDetails.technicalSkills')}
                                        className='mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                    />
                                </div>

                                <div>
                                    <label htmlFor='extraTechnicalSkills' className='block text-sm font-medium text-gray-700'>Extra Technical Skills</label>
                                    <input
                                        type='text'
                                        {...register('personalDetails.extraTechnicalSkills')}
                                        className='mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                    />
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold">Banking Details</h2>
                                <div>
                                    <label htmlFor='bankName' className='block text-sm font-medium text-gray-700'>Bank Name</label>
                                    <input
                                        type='text'
                                        {...register('bankingDetails.bankName')}
                                        className='mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                    />
                                </div>

                                <div>
                                    <label htmlFor='branchName' className='block text-sm font-medium text-gray-700'>Branch Name</label>
                                    <input
                                        type='text'
                                        {...register('bankingDetails.branchName')}
                                        className='mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                    />
                                </div>

                                <div>
                                    <label htmlFor='accountNumber' className='block text-sm font-medium text-gray-700'>Account Number</label>
                                    <input
                                        type='text'
                                        {...register('bankingDetails.accountNumber')}
                                        className='mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                    />
                                </div>

                                <div>
                                    <label htmlFor='accountHolderName' className='block text-sm font-medium text-gray-700'>Account Holder Name</label>
                                    <input
                                        type='text'
                                        {...register('bankingDetails.accountHolderName')}
                                        className='mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                    />
                                </div>

                                <div>
                                    <label htmlFor='ifscCode' className='block text-sm font-medium text-gray-700'>IFSC Code</label>
                                    <input
                                        type='text'
                                        {...register('bankingDetails.ifscCode')}
                                        className='mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                    />
                                </div>

                                <div>
                                    <label htmlFor='panNumber' className='block text-sm font-medium text-gray-700'>PAN Number</label>
                                    <input
                                        type='text'
                                        {...register('bankingDetails.panNumber')}
                                        className='mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                    />
                                </div>

                                <div>
                                    <label htmlFor='aadhaarNumber' className='block text-sm font-medium text-gray-700'>Aadhaar Number</label>
                                    <input
                                        type='text'
                                        {...register('bankingDetails.aadhaarNumber')}
                                        className='mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                    />
                                </div>

                                <div>
                                    <label htmlFor='upiId' className='block text-sm font-medium text-gray-700'>UPI ID</label>
                                    <input
                                        type='text'
                                        {...register('bankingDetails.upiId')}
                                        className='mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                    />
                                </div>

                                <div>
                                    <label htmlFor='googlePayNumber' className='block text-sm font-medium text-gray-700'>Google Pay Number</label>
                                    <input
                                        type='text'
                                        {...register('bankingDetails.googlePayNumber')}
                                        className='mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                    />
                                </div>

                                <div>
                                    <label htmlFor='phonePayNumber' className='block text-sm font-medium text-gray-700'>Phone Pay Number</label>
                                    <input
                                        type='text'
                                        {...register('bankingDetails.phonePayNumber')}
                                        className='mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                    />
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold">Address Details</h2>
                                <div>
                                    <label htmlFor='houseOrShopNumber' className='block text-sm font-medium text-gray-700'>House/Shop Number</label>
                                    <input
                                        type='text'
                                        {...register('addressDetails.houseOrShopNumber')}
                                        className='mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                    />
                                </div>

                                <div>
                                    <label htmlFor='wardOrGPName' className='block text-sm font-medium text-gray-700'>Ward/GP Name</label>
                                    <input
                                        type='text'
                                        {...register('addressDetails.wardOrGPName')}
                                        className='mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                    />
                                </div>

                                <div>
                                    <label htmlFor='cityOrTown' className='block text-sm font-medium text-gray-700'>City/Town</label>
                                    <input
                                        type='text'
                                        {...register('addressDetails.cityOrTown')}
                                        className='mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                    />
                                </div>

                                <div>
                                    <label htmlFor='laneNumberOrName' className='block text-sm font-medium text-gray-700'>Lane Number/Name</label>
                                    <input
                                        type='text'
                                        {...register('addressDetails.laneNumberOrName')}
                                        className='mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                    />
                                </div>

                                <div>
                                    <label htmlFor='postOffice' className='block text-sm font-medium text-gray-700'>Post Office</label>
                                    <input
                                        type='text'
                                        {...register('addressDetails.postOffice')}
                                        className='mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                    />
                                </div>

                                <div>
                                    <label htmlFor='policeStation' className='block text-sm font-medium text-gray-700'>Police Station</label>
                                    <input
                                        type='text'
                                        {...register('addressDetails.policeStation')}
                                        className='mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                    />
                                </div>

                                <div>
                                    <label htmlFor='district' className='block text-sm font-medium text-gray-700'>District</label>
                                    <input
                                        type='text'
                                        {...register('addressDetails.district')}
                                        className='mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                    />
                                </div>

                                <div>
                                    <label htmlFor='state' className='block text-sm font-medium text-gray-700'>State</label>
                                    <input
                                        type='text'
                                        {...register('addressDetails.state')}
                                        className='mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                    />
                                </div>

                                <div>
                                    <label htmlFor='pinCode' className='block text-sm font-medium text-gray-700'>Pin Code</label>
                                    <input
                                        type='text'
                                        {...register('addressDetails.pinCode')}
                                        className='mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                    />
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold">Official Details</h2>
                                <div>
                                    <label htmlFor='employmentType' className='block text-sm font-medium text-gray-700'>Employment Type</label>
                                    <input
                                        type='text'
                                        {...register('officialDetails.employmentType')}
                                        className='mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                    />
                                </div>

                                <div>
                                    <label htmlFor='department' className='block text-sm font-medium text-gray-700'>Department</label>
                                    <input
                                        type='text'
                                        {...register('officialDetails.department')}
                                        className='mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                    />
                                </div>

                                <div>
                                    <label htmlFor='reportingTo' className='block text-sm font-medium text-gray-700'>Reporting To</label>
                                    <input
                                        type='text'
                                        {...register('officialDetails.reportingTo')}
                                        className='mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                    />
                                </div>

                                <div>
                                    <label htmlFor='designation' className='block text-sm font-medium text-gray-700'>Designation</label>
                                    <input
                                        type='text'
                                        {...register('officialDetails.designation')}
                                        className='mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                    />
                                </div>

                                <div>
                                    <label htmlFor='grade' className='block text-sm font-medium text-gray-700'>Grade</label>
                                    <input
                                        type='text'
                                        {...register('officialDetails.grade')}
                                        className='mt-1 focus:ring-teal-500 focus:border-teal-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md'
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center mt-8">
                        <button type="submit" className="bg-teal-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-teal-600">
                            Update Employee
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeeUpdateForm;