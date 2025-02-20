import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

interface PartnerDetails {
    partnerName: string;
    careOf: string;
    sex: string;
    maritalStatus: string;
    age: string;
    highestQualification: string;
    occupation: string;
    alternatePhoneNumber: string;
    personalEmailId: string;
    yearOfOpening: string;
    phoneNumber: string;
    whatsappNumber: string;
    registrationNumber: string;
    averageCustomersPerDay: string;
    technicalSkills: string;
    extraTechnicalSkills: string;
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
        laneNameOrNumber: string;
        postOffice: string;
        policeStation: string;
        district: string;
        state: string;
        pin: string;
    };
}

interface CareCenterFormFields {
    ownerPartnerStatus: 'SOP' | 'NOP';
    shopDetails: {
        shopName: string;
        ownerName: string;
        careOf: string;
        sex: "Male" | "Female" | "Others";
        maritalStatus: "Married" | "Unmarried";
        age: number;
        highestQualification: string;
        occupation: string;
        annualIncome: number;
        alternatePhoneNumber: string;
        personalEmailId: string;
        yearOfOpening: number;
        whatsappNumber: string;
        registrationNumber: string;
        computersInOkCondition: number;
        averageCustomersPerDay: number;
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
        laneNameOrNumber: string;
        postOffice: string;
        policeStation: string;
        district: string;
        state: string;
        pin: string;
    };
    officialDetails: {
        partnerId: string;
        securePin: string;
        email: string;
        phoneNumber: string;
        whatsappNumber: string;
        branchCovered: string;
        zoneCovered: string;
        franchiseConnected: string;
        amountReceivedFromCustomer: number;
    };
    ownershipDetails: {
        ownerOfShop: string;
    };
    partnerDetails: PartnerDetails;
}
function isObjectEmpty(obj: any): boolean {
    // A recursive check that returns false if *any* value is non-empty
    if (!obj || typeof obj !== 'object') return true;

    for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            if (!isObjectEmpty(obj[key])) {
                return false;
            }
        } else {
            // Convert to string and trim; if not empty => it's filled
            if (String(obj[key] ?? '').trim() !== '') {
                return false;
            }
        }
    }
    return true;
}
const CareCenterUpdateForm = ({ careCenter, onSave, onCancel }: any) => {
    const host = 'http://localhost:8000/api';

    const partnerDetailsFromApi = careCenter?.partnerDetails ?? {};
    const partnerIsEmpty = isObjectEmpty(partnerDetailsFromApi);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        setValue,
        reset,
        control
    } = useForm({
        defaultValues: {
            ownerPartnerStatus: partnerIsEmpty ? 'SOP' : 'NOP',
            shopDetails: {
                shopName: careCenter?.shopDetails?.shopName || '',
                ownerName: careCenter?.shopDetails?.ownerName || '',
                careOf: careCenter?.shopDetails?.careOf || '',
                sex: careCenter?.shopDetails?.sex || '',
                maritalStatus: careCenter?.shopDetails?.maritalStatus || '',
                age: careCenter?.shopDetails?.age || '',
                highestQualification: careCenter?.shopDetails?.highestQualification || '',
                occupation: careCenter?.shopDetails?.occupation || '',
                annualIncome: careCenter?.shopDetails?.annualIncome || '',
                alternatePhoneNumber: careCenter?.shopDetails?.alternatePhoneNumber || '',
                personalEmailId: careCenter?.shopDetails?.personalEmailId || '',
                yearOfOpening: careCenter?.shopDetails?.yearOfOpening || '',
                whatsappNumber: careCenter?.shopDetails?.whatsappNumber || '',
                registrationNumber: careCenter?.shopDetails?.registrationNumber || '',
                computersInOkCondition: careCenter?.shopDetails?.computersInOkCondition || '',
                averageCustomersPerDay: careCenter?.shopDetails?.averageCustomersPerDay || '',
            },
            bankingDetails: {
                bankName: careCenter?.bankingDetails?.bankName || '',
                branchName: careCenter?.bankingDetails?.branchName || '',
                accountNumber: careCenter?.bankingDetails?.accountNumber || '',
                accountHolderName: careCenter?.bankingDetails?.accountHolderName || '',
                ifscCode: careCenter?.bankingDetails?.ifscCode || '',
                panNumber: careCenter?.bankingDetails?.panNumber || '',
                aadhaarNumber: careCenter?.bankingDetails?.aadhaarNumber || '',
                upiId: careCenter?.bankingDetails?.upiId || '',
                googlePayNumber: careCenter?.bankingDetails?.googlePayNumber || '',
                phonePayNumber: careCenter?.bankingDetails?.phonePayNumber || '',
            },
            addressDetails: {
                houseOrShopNumber: careCenter?.addressDetails?.houseOrShopNumber || '',
                wardOrGPName: careCenter?.addressDetails?.wardOrGPName || '',
                cityOrTown: careCenter?.addressDetails?.cityOrTown || '',
                laneNameOrNumber: careCenter?.addressDetails?.laneNameOrNumber || '',
                postOffice: careCenter?.addressDetails?.postOffice || '',
                policeStation: careCenter?.addressDetails?.policeStation || '',
                district: careCenter?.addressDetails?.district || '',
                state: careCenter?.addressDetails?.state || '',
                pin: careCenter?.addressDetails?.pin || '',
            },
            officialDetails: {
                partnerId: careCenter?.officialDetails?.partnerId || '',
                securePin: careCenter?.officialDetails?.securePin || '',
                email: careCenter?.officialDetails?.email || '',
                phoneNumber: careCenter?.officialDetails?.phoneNumber || '',
                whatsappNumber: careCenter?.officialDetails?.whatsappNumber || '',
                branchCovered: careCenter?.officialDetails?.branchCovered || '',
                zoneCovered: careCenter?.officialDetails?.zoneCovered || '',
                franchiseConnected: careCenter?.officialDetails?.franchiseConnected || '',
                amountReceivedFromCustomer: careCenter?.officialDetails?.amountReceivedFromCustomer || '',
            },
            ownershipDetails: {
                ownerOfShop: careCenter?.ownershipDetails?.ownerOfShop || '',
            },
            partnerDetails: {
                partnerName: careCenter?.partnerDetails?.partnerName || '',
                careOf: careCenter?.partnerDetails?.careOf || '',
                sex: careCenter?.partnerDetails?.sex || '',
                maritalStatus: careCenter?.partnerDetails?.maritalStatus || '',
                age: careCenter?.partnerDetails?.age || '',
                highestQualification: careCenter?.partnerDetails?.highestQualification || '',
                occupation: careCenter?.partnerDetails?.occupation || '',
                alternatePhoneNumber: careCenter?.partnerDetails?.alternatePhoneNumber || '',
                personalEmailId: careCenter?.partnerDetails?.personalEmailId || '',
                yearOfOpening: careCenter?.partnerDetails?.yearOfOpening || '',
                phoneNumber: careCenter?.partnerDetails?.phoneNumber || '',
                whatsappNumber: careCenter?.partnerDetails?.whatsappNumber || '',
                registrationNumber: careCenter?.partnerDetails?.registrationNumber || '',
                averageCustomersPerDay: careCenter?.partnerDetails?.averageCustomersPerDay || '',
                technicalSkills: careCenter?.partnerDetails?.technicalSkills || '',
                extraTechnicalSkills: careCenter?.partnerDetails?.extraTechnicalSkills || '',
                bankingDetails: {
                    bankName: careCenter?.partnerDetails?.bankingDetails?.bankName || '',
                    branchName: careCenter?.partnerDetails?.bankingDetails?.branchName || '',
                    accountNumber: careCenter?.partnerDetails?.bankingDetails?.accountNumber || '',
                    accountHolderName: careCenter?.partnerDetails?.bankingDetails?.accountHolderName || '',
                    ifscCode: careCenter?.partnerDetails?.bankingDetails?.ifscCode || '',
                    panNumber: careCenter?.partnerDetails?.bankingDetails?.panNumber || '',
                    aadhaarNumber: careCenter?.partnerDetails?.bankingDetails?.aadhaarNumber || '',
                    upiId: careCenter?.partnerDetails?.bankingDetails?.upiId || '',
                    googlePayNumber: careCenter?.partnerDetails?.bankingDetails?.googlePayNumber || '',
                    phonePayNumber: careCenter?.partnerDetails?.bankingDetails?.phonePayNumber || '',
                },
                addressDetails: {
                    houseOrShopNumber: careCenter?.partnerDetails?.addressDetails?.houseOrShopNumber || '',
                    wardOrGPName: careCenter?.partnerDetails?.addressDetails?.wardOrGPName || '',
                    cityOrTown: careCenter?.partnerDetails?.addressDetails?.cityOrTown || '',
                    laneNameOrNumber: careCenter?.partnerDetails?.addressDetails?.laneNameOrNumber || '',
                    postOffice: careCenter?.partnerDetails?.addressDetails?.postOffice || '',
                    policeStation: careCenter?.partnerDetails?.addressDetails?.policeStation || '',
                    district: careCenter?.partnerDetails?.addressDetails?.district || '',
                    state: careCenter?.partnerDetails?.addressDetails?.state || '',
                    pin: careCenter?.partnerDetails?.addressDetails?.pin || '',
                },
            },
        },
    });
    const partnerData = watch('partnerDetails');
    const isPartnerDataEmpty = isObjectEmpty(partnerData);
    const watchOwnerPartnerStatus = watch('ownerPartnerStatus');

    useEffect(() => {
        if (careCenter) {
            reset({
                ownerPartnerStatus: 'SOP',
                shopDetails: {
                    shopName: careCenter?.shopDetails?.shopName || '',
                    ownerName: careCenter?.shopDetails?.ownerName || '',
                    careOf: careCenter?.shopDetails?.careOf || '',
                    sex: careCenter?.shopDetails?.sex || '',
                    maritalStatus: careCenter?.shopDetails?.maritalStatus || '',
                    age: careCenter?.shopDetails?.age || '',
                    highestQualification: careCenter?.shopDetails?.highestQualification || '',
                    occupation: careCenter?.shopDetails?.occupation || '',
                    annualIncome: careCenter?.shopDetails?.annualIncome || '',
                    alternatePhoneNumber: careCenter?.shopDetails?.alternatePhoneNumber || '',
                    personalEmailId: careCenter?.shopDetails?.personalEmailId || '',
                    yearOfOpening: careCenter?.shopDetails?.yearOfOpening || '',
                    whatsappNumber: careCenter?.shopDetails?.whatsappNumber || '',
                    registrationNumber: careCenter?.shopDetails?.registrationNumber || '',
                    computersInOkCondition: careCenter?.shopDetails?.computersInOkCondition || '',
                    averageCustomersPerDay: careCenter?.shopDetails?.averageCustomersPerDay || '',
                },
                bankingDetails: {
                    bankName: careCenter?.bankingDetails?.bankName || '',
                    branchName: careCenter?.bankingDetails?.branchName || '',
                    accountNumber: careCenter?.bankingDetails?.accountNumber || '',
                    accountHolderName: careCenter?.bankingDetails?.accountHolderName || '',
                    ifscCode: careCenter?.bankingDetails?.ifscCode || '',
                    panNumber: careCenter?.bankingDetails?.panNumber || '',
                    aadhaarNumber: careCenter?.bankingDetails?.aadhaarNumber || '',
                    upiId: careCenter?.bankingDetails?.upiId || '',
                    googlePayNumber: careCenter?.bankingDetails?.googlePayNumber || '',
                    phonePayNumber: careCenter?.bankingDetails?.phonePayNumber || '',
                },
                addressDetails: {
                    houseOrShopNumber: careCenter?.addressDetails?.houseOrShopNumber || '',
                    wardOrGPName: careCenter?.addressDetails?.wardOrGPName || '',
                    cityOrTown: careCenter?.addressDetails?.cityOrTown || '',
                    laneNameOrNumber: careCenter?.addressDetails?.laneNameOrNumber || '',
                    postOffice: careCenter?.addressDetails?.postOffice || '',
                    policeStation: careCenter?.addressDetails?.policeStation || '',
                    district: careCenter?.addressDetails?.district || '',
                    state: careCenter?.addressDetails?.state || '',
                    pin: careCenter?.addressDetails?.pin || '',
                },
                officialDetails: {
                    partnerId: careCenter?.officialDetails?.partnerId || '',
                    securePin: careCenter?.officialDetails?.securePin || '',
                    email: careCenter?.officialDetails?.email || '',
                    phoneNumber: careCenter?.officialDetails?.phoneNumber || '',
                    whatsappNumber: careCenter?.officialDetails?.whatsappNumber || '',
                    branchCovered: careCenter?.officialDetails?.branchCovered || '',
                    zoneCovered: careCenter?.officialDetails?.zoneCovered || '',
                    franchiseConnected: careCenter?.officialDetails?.franchiseConnected || '',
                    amountReceivedFromCustomer: careCenter?.officialDetails?.amountReceivedFromCustomer || '',
                },
                ownershipDetails: {
                    ownerOfShop: careCenter?.ownershipDetails?.ownerOfShop || '',
                },
                partnerDetails: {
                    partnerName: careCenter?.partnerDetails?.partnerName || '',
                    careOf: careCenter?.partnerDetails?.careOf || '',
                    sex: careCenter?.partnerDetails?.sex || '',
                    maritalStatus: careCenter?.partnerDetails?.maritalStatus || '',
                    age: careCenter?.partnerDetails?.age || '',
                    highestQualification: careCenter?.partnerDetails?.highestQualification || '',
                    occupation: careCenter?.partnerDetails?.occupation || '',
                    alternatePhoneNumber: careCenter?.partnerDetails?.alternatePhoneNumber || '',
                    personalEmailId: careCenter?.partnerDetails?.personalEmailId || '',
                    yearOfOpening: careCenter?.partnerDetails?.yearOfOpening || '',
                    phoneNumber: careCenter?.partnerDetails?.phoneNumber || '',
                    whatsappNumber: careCenter?.partnerDetails?.whatsappNumber || '',
                    registrationNumber: careCenter?.partnerDetails?.registrationNumber || '',
                    averageCustomersPerDay: careCenter?.partnerDetails?.averageCustomersPerDay || '',
                    technicalSkills: careCenter?.partnerDetails?.technicalSkills || '',
                    extraTechnicalSkills: careCenter?.partnerDetails?.extraTechnicalSkills || '',
                    bankingDetails: {
                        bankName: careCenter?.partnerDetails?.bankingDetails?.bankName || '',
                        branchName: careCenter?.partnerDetails?.bankingDetails?.branchName || '',
                        accountNumber: careCenter?.partnerDetails?.bankingDetails?.accountNumber || '',
                        accountHolderName: careCenter?.partnerDetails?.bankingDetails?.accountHolderName || '',
                        ifscCode: careCenter?.partnerDetails?.bankingDetails?.ifscCode || '',
                        panNumber: careCenter?.partnerDetails?.bankingDetails?.panNumber || '',
                        aadhaarNumber: careCenter?.partnerDetails?.bankingDetails?.aadhaarNumber || '',
                        upiId: careCenter?.partnerDetails?.bankingDetails?.upiId || '',
                        googlePayNumber: careCenter?.partnerDetails?.bankingDetails?.googlePayNumber || '',
                        phonePayNumber: careCenter?.partnerDetails?.bankingDetails?.phonePayNumber || '',
                    },
                    addressDetails: {
                        houseOrShopNumber: careCenter?.partnerDetails?.addressDetails?.houseOrShopNumber || '',
                        wardOrGPName: careCenter?.partnerDetails?.addressDetails?.wardOrGPName || '',
                        cityOrTown: careCenter?.partnerDetails?.addressDetails?.cityOrTown || '',
                        laneNameOrNumber: careCenter?.partnerDetails?.addressDetails?.laneNameOrNumber || '',
                        postOffice: careCenter?.partnerDetails?.addressDetails?.postOffice || '',
                        policeStation: careCenter?.partnerDetails?.addressDetails?.policeStation || '',
                        district: careCenter?.partnerDetails?.addressDetails?.district || '',
                        state: careCenter?.partnerDetails?.addressDetails?.state || '',
                        pin: careCenter?.partnerDetails?.addressDetails?.pin || '',
                    },
                },
            });
        }
    }, [careCenter, reset]);

    var token = Cookies.get('token');

    const onSubmit = async (data: any) => {
        try {
            await axios.put(
                `${host}/updateCareCenterProfile/${careCenter._id}`,
                JSON.stringify(data),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            Swal.fire({
                icon: 'success',
                title: 'CareCenter profile updated successfully',
                timer: 3000,
            });
        } catch (error) {
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
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-5">
                            {/* Shop Details */}
                            <div>
                                <label
                                    htmlFor="ownerPartnerStatus"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Select one
                                </label>
                                <select
                                    id="ownerPartnerStatus"
                                    {...register('ownerPartnerStatus')}
                                    className="px-4 py-2 w-full rounded-sm"
                                >
                                    {/* Disable "SOP" if partner data is not empty */}
                                    <option value="SOP" disabled={!isPartnerDataEmpty}>
                                        Shop owner &amp; partner is same
                                    </option>
                                    <option value="NOP">Shop owner is not the partner</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-4">
                                <h5 className="text-lg font-semibold text-teal-500">Section-1A (Shop owner’s Personal Details)</h5>
                                {/* CareCenter Name */}
                                <div>
                                    <label htmlFor="CareCentername" className="block text-sm font-medium text-gray-700">
                                        CareCenter Name
                                    </label>
                                    <input id="CareCentername" type="text" {...register('shopDetails.shopName')} placeholder="Enter CareCenter Name" className="form-input mt-1" />
                                </div>
                                {/* Owner Name */}
                                <div>
                                    <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700">
                                        Owner Name
                                    </label>
                                    <input id="ownerName" type="text" {...register('shopDetails.ownerName')} placeholder="Enter Owner Name" className="form-input mt-1" />
                                </div>
                                {/* Care Of */}
                                <div>
                                    <label htmlFor="careOf" className="block text-sm font-medium text-gray-700">
                                        Care Of
                                    </label>
                                    <input id="careOf" type="text" {...register('shopDetails.careOf')} placeholder="Enter Care Of" className="form-input mt-1" />
                                </div>
                                {/* Sex */}
                                <div>
                                    <label htmlFor="sex" className="block text-sm font-medium text-gray-700">
                                        Sex
                                    </label>
                                    <select id="sex" {...register('shopDetails.sex')} className='form-select mt-1'>
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Custom">Custom</option>
                                    </select>
                                </div>
                                {/* Marital Status */}
                                <div>
                                    <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700">
                                        Marital Status
                                    </label>
                                    <select id="maritalStatus" {...register('shopDetails.maritalStatus')} className='form-select mt-1'>
                                        <option value="">Select</option>
                                        <option value="Married">Married</option>
                                        <option value="Unmarried">Unmarried</option>
                                        <option value="Divorced">Divorced</option>
                                    </select>
                                </div>
                                {/* Age */}
                                <div>
                                    <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                                        Age
                                    </label>
                                    <input id="age" type="number" {...register('shopDetails.age')} placeholder="Enter Age" className="form-input mt-1" />
                                </div>
                                {/* Highest Qualification */}
                                <div>
                                    <label htmlFor="highestQualification" className="block text-sm font-medium text-gray-700">
                                        Highest Qualification
                                    </label>
                                    <input id="highestQualification" type="text" {...register('shopDetails.highestQualification')} placeholder="Enter Highest Qualification" className="form-input mt-1" />
                                </div>
                                {/* Occupation */}
                                <div>
                                    <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">
                                        Occupation
                                    </label>
                                    <input id="occupation" type="text" {...register('shopDetails.occupation')} placeholder="Enter Occupation" className="form-input mt-1" />
                                </div>
                                {/* Annual Income */}
                                <div>
                                    <label htmlFor="annualIncome" className="block text-sm font-medium text-gray-700">
                                        Annual Income
                                    </label>
                                    <input id="annualIncome" type="number" {...register('shopDetails.annualIncome')} placeholder="Enter Annual Income" className="form-input mt-1" />
                                </div>
                                {/* Alternate Phone Number */}
                                <div>
                                    <label htmlFor="alternatePhoneNumber" className="block text-sm font-medium text-gray-700">
                                        Alternate Phone Number
                                    </label>
                                    <input id="alternatePhoneNumber" type="text" {...register('shopDetails.alternatePhoneNumber')} placeholder="Enter Alternate Phone Number" className="form-input mt-1" />
                                </div>
                                {/* Personal Email Id */}
                                <div>
                                    <label htmlFor="personalEmailId" className="block text-sm font-medium text-gray-700">
                                        Personal Email Id
                                    </label>
                                    <input id="personalEmailId" type="email" {...register('shopDetails.personalEmailId')} placeholder="Enter Personal Email Id" className="form-input mt-1" />
                                </div>
                                {/* Year Of Opening */}
                                <div>
                                    <label htmlFor="yearOfOpening" className="block text-sm font-medium text-gray-700">
                                        Year Of Opening
                                    </label>
                                    <input id="yearOfOpening" type="number" {...register('shopDetails.yearOfOpening')} placeholder="Enter Year Of Opening" className="form-input mt-1" />
                                </div>
                                {/* Whatsapp Number */}
                                <div>
                                    <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700">
                                        Whatsapp Number
                                    </label>
                                    <input id="whatsappNumber" type="text" {...register('shopDetails.whatsappNumber')} placeholder="Enter Whatsapp Number" className="form-input mt-1" />
                                </div>
                                {/* Registration Number */}
                                <div>
                                    <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700">
                                        Registration Number
                                    </label>
                                    <input id="registrationNumber" type="text" {...register('shopDetails.registrationNumber')} placeholder="Enter Registration Number" className="form-input mt-1" />
                                </div>
                                {/* Computers In Ok Condition */}
                                <div>
                                    <label htmlFor="computersInOkCondition" className="block text-sm font-medium text-gray-700">
                                        Computers In Ok Condition
                                    </label>
                                    <input id="computersInOkCondition" type="number" {...register('shopDetails.computersInOkCondition')} placeholder="Enter Computers In Ok Condition" className="form-input mt-1" />
                                </div>
                                {/* Average Customers Per Day */}
                                <div>
                                    <label htmlFor="averageCustomersPerDay" className="block text-sm font-medium text-gray-700">
                                        Average Customers Per Day
                                    </label>
                                    <input id="averageCustomersPerDay" type="number" {...register('shopDetails.averageCustomersPerDay')} placeholder="Enter Average Customers Per Day" className="form-input mt-1" />
                                </div>
                            </div>

                            {/* Banking Details */}
                            <div className="flex flex-col gap-4">
                                <h5 className="text-lg font-semibold text-teal-500">Section-2A (Shop owner’s Banking Details)</h5>
                                {/* Bank Name */}
                                <div>
                                    <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
                                        Bank Name
                                    </label>
                                    <input id="bankName" type="text" {...register('bankingDetails.bankName')} placeholder="Enter Bank Name" className="form-input mt-1" />
                                </div>
                                {/* Branch Name */}
                                <div>
                                    <label htmlFor="branchName" className="block text-sm font-medium text-gray-700">
                                        Branch Name
                                    </label>
                                    <input id="branchName" type="text" {...register('bankingDetails.branchName')} placeholder="Enter Branch Name" className="form-input mt-1" />
                                </div>
                                {/* Account Number */}
                                <div>
                                    <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">
                                        Account Number
                                    </label>
                                    <input id="accountNumber" type="text" {...register('bankingDetails.accountNumber')} placeholder="Enter Account Number" className="form-input mt-1" />
                                </div>
                                {/* Account Holder Name */}
                                <div>
                                    <label htmlFor="accountHolderName" className="block text-sm font-medium text-gray-700">
                                        Account Holder Name
                                    </label>
                                    <input id="accountHolderName" type="text" {...register('bankingDetails.accountHolderName')} placeholder="Enter Account Holder Name" className="form-input mt-1" />
                                </div>
                                {/* IFSC Code */}
                                <div>
                                    <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-700">
                                        IFSC Code
                                    </label>
                                    <input id="ifscCode" type="text" {...register('bankingDetails.ifscCode')} placeholder="Enter IFSC Code" className="form-input mt-1" />
                                </div>
                                {/* PAN Number */}
                                <div>
                                    <label htmlFor="panNumber" className="block text-sm font-medium text-gray-700">
                                        PAN Number
                                    </label>
                                    <input id="panNumber" type="text" {...register('bankingDetails.panNumber')} placeholder="Enter PAN Number" className="form-input mt-1" />
                                </div>
                                {/* Aadhaar Number */}
                                <div>
                                    <label htmlFor="aadhaarNumber" className="block text-sm font-medium text-gray-700">
                                        Aadhaar Number
                                    </label>
                                    <input id="aadhaarNumber" type="text" {...register('bankingDetails.aadhaarNumber')} placeholder="Enter Aadhaar Number" className="form-input mt-1" />
                                </div>
                                {/* UPI ID */}
                                <div>
                                    <label htmlFor="upiId" className="block text-sm font-medium text-gray-700">
                                        UPI ID
                                    </label>
                                    <input id="upiId" type="text" {...register('bankingDetails.upiId')} placeholder="Enter UPI ID" className="form-input mt-1" />
                                </div>
                                {/* Google Pay Number */}
                                <div>
                                    <label htmlFor="googlePayNumber" className="block text-sm font-medium text-gray-700">
                                        Google Pay Number
                                    </label>
                                    <input id="googlePayNumber" type="text" {...register('bankingDetails.googlePayNumber')} placeholder="Enter Google Pay Number" className="form-input mt-1" />
                                </div>
                                {/* Phone Pay Number */}
                                <div>
                                    <label htmlFor="phonePayNumber" className="block text-sm font-medium text-gray-700">
                                        Phone Pay Number
                                    </label>
                                    <input id="phonePayNumber" type="text" {...register('bankingDetails.phonePayNumber')} placeholder="Enter Phone Pay Number" className="form-input mt-1" />
                                </div>
                            </div>

                            {/* Address Details */}
                            <div className="flex flex-col gap-4">
                                <h5 className="text-lg font-semibold text-teal-500">Section-3A (Shop owner’s Address Details)</h5>
                                {/* House Or Shop Number */}
                                <div>
                                    <label htmlFor="houseOrShopNumber" className="block text-sm font-medium text-gray-700">
                                        House Or Shop Number
                                    </label>
                                    <input id="houseOrShopNumber" type="text" {...register('addressDetails.houseOrShopNumber')} placeholder="Enter House Or Shop Number" className="form-input mt-1" />
                                </div>
                                {/* Ward Or GP Name */}
                                <div>
                                    <label htmlFor="wardOrGPName" className="block text-sm font-medium text-gray-700">
                                        Ward Or GP Name
                                    </label>
                                    <input id="wardOrGPName" type="text" {...register('addressDetails.wardOrGPName')} placeholder="Enter Ward Or GP Name" className="form-input mt-1" />
                                </div>
                                {/* City Or Town */}
                                <div>
                                    <label htmlFor="cityOrTown" className="block text-sm font-medium text-gray-700">
                                        City Or Town
                                    </label>
                                    <input id="cityOrTown" type="text" {...register('addressDetails.cityOrTown')} placeholder="Enter City Or Town" className="form-input mt-1" />
                                </div>
                                {/* Lane Name Or Number */}
                                <div>
                                    <label htmlFor="laneNameOrNumber" className="block text-sm font-medium text-gray-700">
                                        Lane Name Or Number
                                    </label>
                                    <input id="laneNameOrNumber" type="text" {...register('addressDetails.laneNameOrNumber')} placeholder="Enter Lane Name Or Number" className="form-input mt-1" />
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

                            {/* Official Details */}
                            {/* <div className="flex flex-col gap-4">
                                <h5 className="text-lg font-semibold text-teal-500">Official Details</h5>
                                <div>
                                    <label htmlFor="partnerId" className="block text-sm font-medium text-gray-700">
                                        Partner Id
                                    </label>
                                    <input id="partnerId" type="text" {...register('officialDetails.partnerId')} placeholder="Enter Partner Id" className="form-input mt-1" />
                                </div>
                                <div>
                                    <label htmlFor="securePin" className="block text-sm font-medium text-gray-700">
                                        Secure Pin
                                    </label>
                                    <input id="securePin" type="text" {...register('officialDetails.securePin')} placeholder="Enter Secure Pin" className="form-input mt-1" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input id="email" type="email" {...register('officialDetails.email')} placeholder="Enter Email" className="form-input mt-1" />
                                </div>
                                <div>
                                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                                        Phone Number
                                    </label>
                                    <input id="phoneNumber" type="text" {...register('officialDetails.phoneNumber')} placeholder="Enter Phone Number" className="form-input mt-1" />
                                </div>
                                <div>
                                    <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700">
                                        Whatsapp Number
                                    </label>
                                    <input id="whatsappNumber" type="text" {...register('officialDetails.whatsappNumber')} placeholder="Enter Whatsapp Number" className="form-input mt-1" />
                                </div>
                                <div>
                                    <label htmlFor="branchCovered" className="block text-sm font-medium text-gray-700">
                                        Branch Covered
                                    </label>
                                    <input id="branchCovered" type="text" {...register('officialDetails.branchCovered')} placeholder="Enter Branch Covered" className="form-input mt-1" />
                                </div>
                                <div>
                                    <label htmlFor="zoneCovered" className="block text-sm font-medium text-gray-700">
                                        Zone Covered
                                    </label>
                                    <input id="zoneCovered" type="text" {...register('officialDetails.zoneCovered')} placeholder="Enter Zone Covered" className="form-input mt-1" />
                                </div>
                                <div>
                                    <label htmlFor="franchiseConnected" className="block text-sm font-medium text-gray-700">
                                        Franchise Connected
                                    </label>
                                    <input id="franchiseConnected" type="text" {...register('officialDetails.franchiseConnected')} placeholder="Enter Franchise Connected" className="form-input mt-1" />
                                </div>
                                <div>
                                    <label htmlFor="amountReceivedFromCustomer" className="block text-sm font-medium text-gray-700">
                                        Amount Received From Customer
                                    </label>
                                    <input id="amountReceivedFromCustomer" type="number" {...register('officialDetails.amountReceivedFromCustomer')} placeholder="Enter Amount Received From Customer" className="form-input mt-1" />
                                </div>
                            </div> */}

                            {/* Ownership Details */}
                            {/* <div className="flex flex-col gap-4">
                                <h5 className="text-lg font-semibold text-teal-500">Ownership Details</h5>
                                <div>
                                    <label htmlFor="ownerOfShop" className="block text-sm font-medium text-gray-700">
                                        Owner Of Shop
                                    </label>
                                    <input id="ownerOfShop" type="text" {...register('ownershipDetails.ownerOfShop')} placeholder="Enter Owner Of Shop" className="form-input mt-1" />
                                </div>
                            </div> */}

                            {/* Partner Details */}

                            {watch('ownerPartnerStatus') === 'NOP' && (
                                <div className="flex flex-col gap-4">
                                    <div>
                                        <h5 className="text-lg font-semibold text-teal-500">Section-1B (Registered person’s Personal Details)</h5>
                                        {/* Partner Name */}
                                        <div>
                                            <label htmlFor="partnerName" className="block text-sm font-medium text-gray-700">
                                                Partner Name
                                            </label>
                                            <input id="partnerName" type="text" {...register('partnerDetails.partnerName')} placeholder="Enter Partner Name" className="form-input mb-3" />
                                        </div>
                                        {/* Care Of */}
                                        <div>
                                            <label htmlFor="partnercareOf" className="block text-sm font-medium text-gray-700">
                                                Care Of
                                            </label>
                                            <input id="partnercareOf" type="text" {...register('partnerDetails.careOf')} placeholder="Enter Care Of" className="form-input mt-1 mb-3" />
                                        </div>
                                        {/* Sex */}
                                        <div>
                                            <label htmlFor="partnersex" className="block text-sm font-medium text-gray-700">
                                                Sex
                                            </label>
                                            <select id="partnersex" {...register('partnerDetails.sex')} className='form-select mt-1 mb-3'>
                                                <option value="">Select</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Custom">Custom</option>
                                            </select>
                                        </div>
                                        {/* Marital Status */}
                                        <div>
                                            <label htmlFor="partnermaritalStatus" className="block text-sm font-medium text-gray-700 mb-3">
                                                Marital Status
                                            </label>
                                            <select id="partnermaritalStatus" {...register('partnerDetails.maritalStatus')} className='form-select mt-1'>
                                                <option value="">Select</option>
                                                <option value="Married">Married</option>
                                                <option value="Unmarried">Unmarried</option>
                                                <option value="Divorced">Divorced</option>
                                            </select>
                                        </div>
                                        {/* Age */}
                                        <div>
                                            <label htmlFor="partnerage" className="block text-sm font-medium text-gray-700">
                                                Age
                                            </label>
                                            <input id="partnerage" type="number" {...register('partnerDetails.age')} placeholder="Enter Age" className="form-input mt-1 mb-3" />
                                        </div>
                                        {/* Highest Qualification */}
                                        <div>
                                            <label htmlFor="partnerhighestQualification" className="block text-sm font-medium text-gray-700">
                                                Highest Qualification
                                            </label>
                                            <input id="partnerhighestQualification" type="text" {...register('partnerDetails.highestQualification')} placeholder="Enter Highest Qualification" className="form-input mt-1 mb-3" />
                                        </div>
                                        {/* Occupation */}
                                        <div>
                                            <label htmlFor="partneroccupation" className="block text-sm font-medium text-gray-700">
                                                Occupation
                                            </label>
                                            <input id="partneroccupation" type="text" {...register('partnerDetails.occupation')} placeholder="Enter Occupation" className="form-input mt-1 mb-3" />
                                        </div>
                                        {/* Alternate Phone Number */}
                                        <div>
                                            <label htmlFor="partneralternatePhoneNumber" className="block text-sm font-medium text-gray-700">
                                                Alternate Phone Number
                                            </label>
                                            <input id="partneralternatePhoneNumber" type="text" {...register('partnerDetails.alternatePhoneNumber')} placeholder="Enter Alternate Phone Number" className="form-input mt-1 mb-3" />
                                        </div>
                                        {/* Personal Email Id */}
                                        <div>
                                            <label htmlFor="partnerpersonalEmailId" className="block text-sm font-medium text-gray-700">
                                                Personal Email Id
                                            </label>
                                            <input id="partnerpersonalEmailId" type="email" {...register('partnerDetails.personalEmailId')} placeholder="Enter Personal Email Id" className="form-input mt-1 mb-3" />
                                        </div>
                                        {/* Year Of Opening */}
                                        <div>
                                            <label htmlFor="partneryearOfOpening" className="block text-sm font-medium text-gray-700">
                                                Year Of Opening
                                            </label>
                                            <input id="partneryearOfOpening" type="number" {...register('partnerDetails.yearOfOpening')} placeholder="Enter Year Of Opening" className="form-input mt-1 mb-3" />
                                        </div>
                                        {/* Phone Number */}
                                        <div>
                                            <label htmlFor="partnerphoneNumber" className="block text-sm font-medium text-gray-700">
                                                Phone Number
                                            </label>
                                            <input id="partnerphoneNumber" type="text" {...register('partnerDetails.phoneNumber')} placeholder="Enter Phone Number" className="form-input mt-1 mb-3" />
                                        </div>
                                        {/* Whatsapp Number */}
                                        <div>
                                            <label htmlFor="partnerwhatsappNumber" className="block text-sm font-medium text-gray-700">
                                                Whatsapp Number
                                            </label>
                                            <input id="partnerwhatsappNumber" type="text" {...register('partnerDetails.whatsappNumber')} placeholder="Enter Whatsapp Number" className="form-input mt-1 mb-3" />
                                        </div>
                                        {/* Registration Number */}
                                        <div>
                                            <label htmlFor="partnerregistrationNumber" className="block text-sm font-medium text-gray-700">
                                                Registration Number
                                            </label>
                                            <input id="partnerregistrationNumber" type="text" {...register('partnerDetails.registrationNumber')} placeholder="Enter Registration Number" className="form-input mt-1 mb-3" />
                                        </div>
                                        {/* Average Customers Per Day */}
                                        <div>
                                            <label htmlFor="partneraverageCustomersPerDay" className="block text-sm font-medium text-gray-700">
                                                Average Customers Per Day
                                            </label>
                                            <input id="partneraverageCustomersPerDay" type="number" {...register('partnerDetails.averageCustomersPerDay')} placeholder="Enter Average Customers Per Day" className="form-input mt-1 mb-3" />
                                        </div>
                                        {/* Technical Skills */}
                                        <div>
                                            <label htmlFor="partnertechnicalSkills" className="block text-sm font-medium text-gray-700">
                                                Technical Skills
                                            </label>
                                            <input id="partnertechnicalSkills" type="text" {...register('partnerDetails.technicalSkills')} placeholder="Enter Technical Skills" className="form-input mt-1 mb-3" />
                                        </div>
                                        {/* Extra Technical Skills */}
                                        <div>
                                            <label htmlFor="partnerextraTechnicalSkills" className="block text-sm font-medium text-gray-700">
                                                Extra Technical Skills
                                            </label>
                                            <input id="partnerextraTechnicalSkills" type="text" {...register('partnerDetails.extraTechnicalSkills')} placeholder="Enter Extra Technical Skills" className="form-input mt-1 mb-3" />
                                        </div>
                                    </div>
                                    {/* Banking Details */}
                                    <div className="flex flex-col gap-4">
                                        <h5 className="text-lg font-semibold text-teal-500">Section-2A (Registered person’s Banking Details)</h5>
                                        {/* Bank Name */}
                                        <div>
                                            <label htmlFor="partnerbankName" className="block text-sm font-medium text-gray-700">
                                                Bank Name
                                            </label>
                                            <input id="partnerbankName" type="text" {...register('partnerDetails.bankingDetails.bankName')} placeholder="Enter Bank Name" className="form-input mt-1" />
                                        </div>
                                        {/* Branch Name */}
                                        <div>
                                            <label htmlFor="partnerbranchName" className="block text-sm font-medium text-gray-700">
                                                Branch Name
                                            </label>
                                            <input id="partnerbranchName" type="text" {...register('partnerDetails.bankingDetails.branchName')} placeholder="Enter Branch Name" className="form-input mt-1" />
                                        </div>
                                        {/* Account Number */}
                                        <div>
                                            <label htmlFor="partneraccountNumber" className="block text-sm font-medium text-gray-700">
                                                Account Number
                                            </label>
                                            <input id="partneraccountNumber" type="text" {...register('partnerDetails.bankingDetails.accountNumber')} placeholder="Enter Account Number" className="form-input mt-1" />
                                        </div>
                                        {/* Account Holder Name */}
                                        <div>
                                            <label htmlFor="partneraccountHolderName" className="block text-sm font-medium text-gray-700">
                                                Account Holder Name
                                            </label>
                                            <input id="partneraccountHolderName" type="text" {...register('partnerDetails.bankingDetails.accountHolderName')} placeholder="Enter Account Holder Name" className="form-input mt-1" />
                                        </div>
                                        {/* IFSC Code */}
                                        <div>
                                            <label htmlFor="partnerifscCode" className="block text-sm font-medium text-gray-700">
                                                IFSC Code
                                            </label>
                                            <input id="partnerifscCode" type="text" {...register('partnerDetails.bankingDetails.ifscCode')} placeholder="Enter IFSC Code" className="form-input mt-1" />
                                        </div>
                                        {/* PAN Number */}
                                        <div>
                                            <label htmlFor="partnerpanNumber" className="block text-sm font-medium text-gray-700">
                                                PAN Number
                                            </label>
                                            <input id="partnerpanNumber" type="text" {...register('partnerDetails.bankingDetails.panNumber')} placeholder="Enter PAN Number" className="form-input mt-1" />
                                        </div>
                                        {/* Aadhaar Number */}
                                        <div>
                                            <label htmlFor="partneraadhaarNumber" className="block text-sm font-medium text-gray-700">
                                                Aadhaar Number
                                            </label>
                                            <input id="partneraadhaarNumber" type="text" {...register('partnerDetails.bankingDetails.aadhaarNumber')} placeholder="Enter Aadhaar Number" className="form-input mt-1" />
                                        </div>
                                        {/* UPI ID */}
                                        <div>
                                            <label htmlFor="partnerupiId" className="block text-sm font-medium text-gray-700">
                                                UPI ID
                                            </label>
                                            <input id="partnerupiId" type="text" {...register('partnerDetails.bankingDetails.upiId')} placeholder="Enter UPI ID" className="form-input mt-1" />
                                        </div>
                                        {/* Google Pay Number */}
                                        <div>
                                            <label htmlFor="partnergooglePayNumber" className="block text-sm font-medium text-gray-700">
                                                Google Pay Number
                                            </label>
                                            <input id="partnergooglePayNumber" type="text" {...register('partnerDetails.bankingDetails.googlePayNumber')} placeholder="Enter Google Pay Number" className="form-input mt-1" />
                                        </div>
                                        {/* Phone Pay Number */}
                                        <div>
                                            <label htmlFor="partnerphonePayNumber" className="block text-sm font-medium text-gray-700">
                                                Phone Pay Number
                                            </label>
                                            <input id="partnerphonePayNumber" type="text" {...register('partnerDetails.bankingDetails.phonePayNumber')} placeholder="Enter Phone Pay Number" className="form-input mt-1" />
                                        </div>
                                    </div>
                                    {/* Address Details */}
                                    <div className="flex flex-col gap-4">
                                        <h5 className="text-lg font-semibold text-teal-500">Section-3A (Registered person’s Address Details)</h5>
                                        {/* House Or Shop Number */}
                                        <div>
                                            <label htmlFor="partnerhouseOrShopNumber" className="block text-sm font-medium text-gray-700">
                                                House Or Shop Number
                                            </label>
                                            <input id="partnerhouseOrShopNumber" type="text" {...register('partnerDetails.addressDetails.houseOrShopNumber')} placeholder="Enter House Or Shop Number" className="form-input mt-1" />
                                        </div>
                                        {/* Ward Or GP Name */}
                                        <div>
                                            <label htmlFor="partnerwardOrGPName" className="block text-sm font-medium text-gray-700">
                                                Ward Or GP Name
                                            </label>
                                            <input id="partnerwardOrGPName" type="text" {...register('partnerDetails.addressDetails.wardOrGPName')} placeholder="Enter Ward Or GP Name" className="form-input mt-1" />
                                        </div>
                                        {/* City Or Town */}
                                        <div>
                                            <label htmlFor="partnercityOrTown" className="block text-sm font-medium text-gray-700">
                                                City Or Town
                                            </label>
                                            <input id="partnercityOrTown" type="text" {...register('partnerDetails.addressDetails.cityOrTown')} placeholder="Enter City Or Town" className="form-input mt-1" />
                                        </div>
                                        {/* Lane Name Or Number */}
                                        <div>
                                            <label htmlFor="partnerlaneNameOrNumber" className="block text-sm font-medium text-gray-700">
                                                Lane Name Or Number
                                            </label>
                                            <input id="partnerlaneNameOrNumber" type="text" {...register('partnerDetails.addressDetails.laneNameOrNumber')} placeholder="Enter Lane Name Or Number" className="form-input mt-1" />
                                        </div>
                                        {/* Post Office */}
                                        <div>
                                            <label htmlFor="partnerpostOffice" className="block text-sm font-medium text-gray-700">
                                                Post Office
                                            </label>
                                            <input id="partnerpostOffice" type="text" {...register('partnerDetails.addressDetails.postOffice')} placeholder="Enter Post Office" className="form-input mt-1" />
                                        </div>
                                        {/* Police Station */}
                                        <div>
                                            <label htmlFor="partnerpoliceStation" className="block text-sm font-medium text-gray-700">
                                                Police Station
                                            </label>
                                            <input id="partnerpoliceStation" type="text" {...register('partnerDetails.addressDetails.policeStation')} placeholder="Enter Police Station" className="form-input mt-1" />
                                        </div>
                                        {/* District */}
                                        <div>
                                            <label htmlFor="partnerdistrict" className="block text-sm font-medium text-gray-700">
                                                District
                                            </label>
                                            <input id="partnerdistrict" type="text" {...register('partnerDetails.addressDetails.district')} placeholder="Enter District" className="form-input mt-1" />
                                        </div>
                                        {/* State */}
                                        <div>
                                            <label htmlFor="partnerstate" className="block text-sm font-medium text-gray-700">
                                                State
                                            </label>
                                            <input id="partnerstate" type="text" {...register('partnerDetails.addressDetails.state')} placeholder="Enter State" className="form-input mt-1" />
                                        </div>
                                        {/* Pin */}
                                        <div>
                                            <label htmlFor="partnerpin" className="block text-sm font-medium text-gray-700">
                                                Pin
                                            </label>
                                            <input id="partnerpin" type="text" {...register('partnerDetails.addressDetails.pin')} placeholder="Enter Pin" className="form-input mt-1" />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center mt-8">
                        <button type="submit" className="bg-teal-500 text-white font-semibold px-6 py-2 rounded-md hover:bg-teal-600">
                            Update CareCenter
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CareCenterUpdateForm;