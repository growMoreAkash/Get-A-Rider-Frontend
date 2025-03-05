import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

interface PartnerFormFields {
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

    bankDetails: {
        nameOfBank: String;
        branchName: String;
        accountNumber: String;
        accountHolderName: String;
        ifscCode: String;
        panNumber: String;
        aadhaarNumber: String;
        upiId: String;
        googlePayNumber: String;
        phonePayNumber: String;
    };

    addressDetails: {
        houseOrShopNumber: String;
        wardOrGpName: String;
        cityOrTown: String;
        laneNumberOrName: String;
        postOffice: String;
        policeStation: String;
        district: String;
        state: String;
        pin: String;
    };
}

const PartnerUpdateForm = ({ partner, onSave, onCancel }: any) => {
    const host = 'https://api.getarider.in/api';

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        control
    } = useForm({
        defaultValues: {
            name: partner?.name || '',
            careOf: partner?.careOf || '',
            sex: partner?.sex || '',
            maritalStatus: partner?.maritalStatus || '',
            age: partner?.age || '',
            highestQualification: partner?.highestQualification || '',
            occupation: partner?.occupation || '',
            alternatePhoneNumber: partner?.alternatePhoneNumber || '',
            personalEmailId: partner?.personalEmailId || '',
            whatsappNumber: partner?.whatsappNumber || '',
            technicalSkills: partner?.technicalSkills || '',
            extraTechnicalSkills: partner?.extraTechnicalSkills || '',

            bankDetails: {
                nameOfBank: partner?.bankDetails?.nameOfBank || '',
                branchName: partner?.bankDetails?.branchName || '',
                accountNumber: partner?.bankDetails?.accountNumber || '',
                accountHolderName: partner?.bankDetails?.accountHolderName || '',
                ifscCode: partner?.bankDetails?.ifscCode || '',
                panNumber: partner?.bankDetails?.panNumber || '',
                aadhaarNumber: partner?.bankDetails?.aadhaarNumber || '',
                upiId: partner?.bankDetails?.upiId || '',
                googlePayNumber: partner?.bankDetails?.googlePayNumber || '',
                phonePayNumber: partner?.bankDetails?.phonePayNumber || '',
            },

            addressDetails: {
                houseOrShopNumber: partner?.addressDetails?.houseOrShopNumber || '',
                wardOrGpName: partner?.addressDetails?.wardOrGpName || '',
                cityOrTown: partner?.addressDetails?.cityOrTown || '',
                laneNumberOrName: partner?.addressDetails?.laneNumberOrName || '',
                postOffice: partner?.addressDetails?.postOffice || '',
                policeStation: partner?.addressDetails?.policeStation || '',
                district: partner?.addressDetails?.district || '',
                state: partner?.addressDetails?.state || '',
                pin: partner?.addressDetails?.pin || '',
            },
        },
    });

    useEffect(() => {
        if (partner) {
            reset({
                name: partner?.name || '',
                careOf: partner?.careOf || '',
                sex: partner?.sex || '',
                maritalStatus: partner?.maritalStatus || '',
                age: partner?.age || '',
                highestQualification: partner?.highestQualification || '',
                occupation: partner?.occupation || '',
                alternatePhoneNumber: partner?.alternatePhoneNumber || '',
                personalEmailId: partner?.personalEmailId || '',
                whatsappNumber: partner?.whatsappNumber || '',
                technicalSkills: partner?.technicalSkills || '',
                extraTechnicalSkills: partner?.extraTechnicalSkills || '',
    
                bankDetails: {
                    nameOfBank: partner?.bankDetails?.nameOfBank || '',
                    branchName: partner?.bankDetails?.branchName || '',
                    accountNumber: partner?.bankDetails?.accountNumber || '',
                    accountHolderName: partner?.bankDetails?.accountHolderName || '',
                    ifscCode: partner?.bankDetails?.ifscCode || '',
                    panNumber: partner?.bankDetails?.panNumber || '',
                    aadhaarNumber: partner?.bankDetails?.aadhaarNumber || '',
                    upiId: partner?.bankDetails?.upiId || '',
                    googlePayNumber: partner?.bankDetails?.googlePayNumber || '',
                    phonePayNumber: partner?.bankDetails?.phonePayNumber || '',
                },
    
                addressDetails: {
                    houseOrShopNumber: partner?.addressDetails?.houseOrShopNumber || '',
                    wardOrGpName: partner?.addressDetails?.wardOrGpName || '',
                    cityOrTown: partner?.addressDetails?.cityOrTown || '',
                    laneNumberOrName: partner?.addressDetails?.laneNumberOrName || '',
                    postOffice: partner?.addressDetails?.postOffice || '',
                    policeStation: partner?.addressDetails?.policeStation || '',
                    district: partner?.addressDetails?.district || '',
                    state: partner?.addressDetails?.state || '',
                    pin: partner?.addressDetails?.pin || '',
                },
            });
        }
    }, [partner, reset]);

    const onSubmit = async (data: any) => {
        try {
            await axios.put(`${host}/updatePartnerProfile/${partner._id}`, JSON.stringify(data), {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get("token")}`
                }
            });

            Swal.fire({
                icon: 'success',
                title: 'Partner profile updated successfully',
                timer: 3000,
            });
        } catch (error) {
            //.error('Error while updating partner profile:', error);
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
                            {/* Partner Name */}
                            <div>
                                <label htmlFor="Partnername" className="block text-sm font-medium text-gray-700">
                                    Partner Name
                                </label>
                                <input id="Partnername" type="text" {...register('name')} placeholder="Enter Partner Name" className="form-input mt-1" />
                                {errors.name && <p className="text-red-500 text-sm">{errors.name.message as string}</p>}
                            </div>

                            {/* CareOf */}
                            <div>
                                <label htmlFor="CareOf" className="block text-sm font-medium text-gray-700">
                                    Care Of
                                </label>
                                <input id="CareOf" type="text" {...register('careOf')} placeholder="Enter Care Of" className="form-input mt-1" />
                                {errors.careOf && <p className="text-red-500 text-sm">{errors.careOf.message as string}</p>}
                            </div>

                            {/* sex */}
                            <div>
                                <label htmlFor="sex" className="block text-sm font-medium text-gray-700">
                                    Sex
                                </label>
                                <select id="sex" {...register('sex')} className="form-select mt-1">
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Others">Others</option>
                                </select>
                            </div>

                            {/* Marital Status */}
                            <div>
                                <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700">
                                    Marital Status
                                </label>
                                <select id="maritalStatus" {...register('maritalStatus')} className="form-select mt-1">
                                    <option value="">Select</option>
                                    <option value="Married">Married</option>
                                    <option value="Unmarried">Unmarried</option>
                                </select>
                            </div>

                            {/* Age */}
                            <div>
                                <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                                    Age
                                </label>
                                <input id="age" type="number" {...register('age')} placeholder="Enter Age" className="form-input mt-1" />
                                {errors.age && <p className="text-red-500 text-sm">{errors.age.message as string}</p>}
                            </div>

                            {/* Highest Qualification */}
                            <div>
                                <label htmlFor="highestQualification" className="block text-sm font-medium text-gray-700">
                                    Highest Qualification
                                </label>
                                <input id="highestQualification" type="text" {...register('highestQualification')} placeholder="Enter Highest Qualification" className="form-input mt-1" />
                                {errors.highestQualification && <p className="text-red-500 text-sm">{errors.highestQualification.message as string}</p>}
                            </div>

                            {/* Occupation */}
                            <div>
                                <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">
                                    Occupation
                                </label>
                                <input id="occupation" type="text" {...register('occupation')} placeholder="Enter Occupation" className="form-input mt-1" />
                            </div>

                            {/* Alternate Phone Number */}
                            <div>
                                <label htmlFor="alternatePhoneNumber" className="block text-sm font-medium text-gray-700">
                                    Alternate Phone Number
                                </label>
                                <input id="alternatePhoneNumber" type="text" {...register('alternatePhoneNumber')} placeholder="Enter Alternate Phone Number" className="form-input mt-1" />
                                {errors.alternatePhoneNumber && <p className="text-red-500 text-sm">{errors.alternatePhoneNumber.message as string}</p>}
                            </div>

                            {/* Personal Email ID */}
                            <div>
                                <label htmlFor="personalEmailId" className="block text-sm font-medium text-gray-700">
                                    Personal Email ID
                                </label>
                                <input id="personalEmailId" type="email" {...register('personalEmailId')} placeholder="Enter Personal Email ID" className="form-input mt-1" />
                                {errors.personalEmailId && <p className="text-red-500 text-sm">{errors.personalEmailId.message as string}</p>}
                            </div>

                            {/* WhatsApp Number */}
                            <div>
                                <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700">
                                    WhatsApp Number
                                </label>
                                <input id="whatsappNumber" type="text" {...register('whatsappNumber')} placeholder="Enter WhatsApp Number" className="form-input mt-1" />
                                {errors.whatsappNumber && <p className="text-red-500 text-sm">{errors.whatsappNumber.message as string}</p>}
                            </div>

                            {/* Technical Skills */}
                            <div>
                                <label htmlFor="technicalSkills" className="block text-sm font-medium text-gray-700">
                                    Technical Skills
                                </label>
                                <input id="technicalSkills" type="text" {...register('technicalSkills')} placeholder="Enter Technical Skills" className="form-input mt-1" />
                                {errors.technicalSkills && <p className="text-red-500 text-sm">{errors.technicalSkills.message as string}</p>}
                            </div>

                            {/* Extra Technical Skills */}
                            <div>
                                <label htmlFor="extraTechnicalSkills" className="block text-sm font-medium text-gray-700">
                                    Extra Technical Skills
                                </label>
                                <input id="extraTechnicalSkills" type="text" {...register('extraTechnicalSkills')} placeholder="Enter Extra Technical Skills" className="form-input mt-1" />
                                {errors.extraTechnicalSkills && <p className="text-red-500 text-sm">{errors.extraTechnicalSkills.message as string}</p>}
                            </div>

                            {/* Bank Details */}
                            <div className="col-span-2">
                                <h3 className="text-lg font-semibold text-gray-800">Bank Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* Name of Bank */}
                                    <div>
                                        <label htmlFor="nameOfBank" className="block text-sm font-medium text-gray-700">
                                            Name of Bank
                                        </label>
                                        <input id="nameOfBank" type="text" {...register('bankDetails.nameOfBank')} placeholder="Enter Name of Bank" className="form-input mt-1" />
                                    </div>

                                    {/* Branch Name */}
                                    <div>
                                        <label htmlFor="branchName" className="block text-sm font-medium text-gray-700">
                                            Branch Name
                                        </label>
                                        <input id="branchName" type="text" {...register('bankDetails.branchName')} placeholder="Enter Branch Name" className="form-input mt-1" />
                                    </div>

                                    {/* Account Number */}
                                    <div>
                                        <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">
                                            Account Number
                                        </label>
                                        <input id="accountNumber" type="text" {...register('bankDetails.accountNumber')} placeholder="Enter Account Number" className="form-input mt-1" />
                                    </div>

                                    {/* Account Holder Name */}
                                    <div>
                                        <label htmlFor="accountHolderName" className="block text-sm font-medium text-gray-700">
                                            Account Holder Name
                                        </label>
                                        <input id="accountHolderName" type="text" {...register('bankDetails.accountHolderName')} placeholder="Enter Account Holder Name" className="form-input mt-1" />
                                    </div>

                                    {/* IFSC Code */}
                                    <div>
                                        <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-700">
                                            IFSC Code
                                        </label>
                                        <input id="ifscCode" type="text" {...register('bankDetails.ifscCode')} placeholder="Enter IFSC Code" className="form-input mt-1" />
                                    </div>

                                    {/* PAN Number */}
                                    <div>
                                        <label htmlFor="panNumber" className="block text-sm font-medium text-gray-700">
                                            PAN Number
                                        </label>
                                        <input id="panNumber" type="text" {...register('bankDetails.panNumber')} placeholder="Enter PAN Number" className="form-input mt-1" />
                                    </div>

                                    {/* Aadhaar Number */}
                                    <div>
                                        <label htmlFor="aadhaarNumber" className="block text-sm font-medium text-gray-700">
                                            Aadhaar Number
                                        </label>
                                        <input id="aadhaarNumber" type="text" {...register('bankDetails.aadhaarNumber')} placeholder="Enter Aadhaar Number" className="form-input mt-1" />
                                    </div>

                                    {/* UPI ID */}
                                    <div>
                                        <label htmlFor="upiId" className="block text-sm font-medium text-gray-700">
                                            UPI ID
                                        </label>
                                        <input id="upiId" type="text" {...register('bankDetails.upiId')} placeholder="Enter UPI ID" className="form-input mt-1" />
                                    </div>

                                    {/* Google Pay Number */}
                                    <div>
                                        <label htmlFor="googlePayNumber" className="block text-sm font-medium text-gray-700">
                                            Google Pay Number
                                        </label>
                                        <input id="googlePayNumber" type="text" {...register('bankDetails.googlePayNumber')} placeholder="Enter Google Pay Number" className="form-input mt-1" />
                                    </div>

                                    {/* Phone Pay Number */}
                                    <div>
                                        <label htmlFor="phonePayNumber" className="block text-sm font-medium text-gray-700">
                                            Phone Pay Number
                                        </label>
                                        <input id="phonePayNumber" type="text" {...register('bankDetails.phonePayNumber')} placeholder="Enter Phone Pay Number" className="form-input mt-1" />
                                    </div>
                                </div>
                            </div>

                            {/* Address Details */}
                            <div className="col-span-2">
                                <h3 className="text-lg font-semibold text-gray-800">Address Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {/* House or Shop Number */}
                                    <div>
                                        <label htmlFor="houseOrShopNumber" className="block text-sm font-medium text-gray-700">
                                            House or Shop Number
                                        </label>
                                        <input id="houseOrShopNumber" type="text" {...register('addressDetails.houseOrShopNumber')} placeholder="Enter House or Shop Number" className="form-input mt-1" />
                                    </div>

                                    {/* Ward or GP Name */}
                                    <div>
                                        <label htmlFor="wardOrGpName" className="block text-sm font-medium text-gray-700">
                                            Ward or GP Name
                                        </label>
                                        <input id="wardOrGpName" type="text" {...register('addressDetails.wardOrGpName')} placeholder="Enter Ward or GP Name" className="form-input mt-1" />
                                    </div>

                                    {/* City or Town */}
                                    <div>
                                        <label htmlFor="cityOrTown" className="block text-sm font-medium text-gray-700">
                                            City or Town
                                        </label>
                                        <input id="cityOrTown" type="text" {...register('addressDetails.cityOrTown')} placeholder="Enter City or Town" className="form-input mt-1" />
                                    </div>

                                    {/* Lane Number or Name */}
                                    <div>
                                        <label htmlFor="laneNumberOrName" className="block text-sm font-medium text-gray-700">
                                            Lane Number or Name
                                        </label>
                                        <input id="laneNumberOrName" type="text" {...register('addressDetails.laneNumberOrName')} placeholder="Enter Lane Number or Name" className="form-input mt-1" />
                                    </div>

                                    {/* Post Office */}
                                    <div>
                                        <label htmlFor="postOffice" className="block text-sm font-medium text-gray-700">
                                            Post Office
                                        </label>
                                        <input id="postOffice" type="text" {...register('addressDetails.postOffice')} placeholder="Enter Post Office" className="form-input mt-1" />
                                    </div>

                                    {/* Police Station */}
                                    <div>
                                        <label htmlFor="policeStation" className="block text-sm font-medium text-gray-700">
                                            Police Station
                                        </label>
                                        <input id="policeStation" type="text" {...register('addressDetails.policeStation')} placeholder="Enter Police Station" className="form-input mt-1" />
                                    </div>

                                    {/* District */}
                                    <div>
                                        <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                                            District
                                        </label>
                                        <input id="district" type="text" {...register('addressDetails.district')} placeholder="Enter District" className="form-input mt-1" />
                                    </div>

                                    {/* State */}
                                    <div>
                                        <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                                            State
                                        </label>
                                        <input id="state" type="text" {...register('addressDetails.state')} placeholder="Enter State" className="form-input mt-1" />
                                    </div>

                                    {/* Pin */}
                                    <div>
                                        <label htmlFor="pin" className="block text-sm font-medium text-gray-700">
                                            Pin
                                        </label>
                                        <input id="pin" type="text" {...register('addressDetails.pin')} placeholder="Enter Pin" className="form-input mt-1" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center mt-8">
                        <button type="submit" className="bg-teal-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-teal-600">
                            Update Partner
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PartnerUpdateForm;