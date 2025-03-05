import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const useGetAllDrivers = (page : any) => {
    const host = 'http://localhost:8000/api';
    const token = Cookies.get('token');
    const [drivers, setDrivers] = useState();

    const getAllDrivers = async (page: any) => {
        try {
            const response = await axios.post(
                `${host}/getAllDrivers`,
                {
                    page: page,
                    limit: 0,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data && response.data.drivers) {
                const drivers = response.data.drivers.map((driver: any) => ({
                    id: driver._id,
                    fullname: driver.fullname.data || 'unknown',
                    phone: driver.phone.data,
                    driverPhoto: driver.driverPhoto.data,
                    identityType: driver.identity_Type.data || 'unknown',
                    maritialStatus: driver.maritial.data || 'unknown',
                    religion: driver.religion.data || 'unknown',
                    annualIncome: driver.annualIncome.data || 'unknown',
                    address: {
                        pincode: driver.pincode.data || 'unknown',
                        buildingName: driver.building_name.data || 'unknown',
                        landmark: driver.landmark.data || 'unknown',
                        streetAddress: driver.street_address.data || 'unknown',
                    },
                    careof: {
                        name: driver.careof.data || 'unknown',
                        phone: driver.careofPhone.data || 'unknown',
                    },
                    profession: driver.profession.data || 'unknown',
                    occupation: driver.occupation.data || 'unknown',
                    documents: {
                        aadhaarFront: driver.driverDocument.aadhaarFront.data,
                        aadhaarBack: driver.driverDocument.aadhaarBack.data,
                        panFront: driver.driverDocument.panFront.data,
                        panBack: driver.driverDocument.panBack.data,
                        drivingFront: driver.driverDocument.drivingFront.data,
                        drivingBack: driver.driverDocument.drivingBack.data,
                        addressProof: driver.driverDocument.addressProof.data,
                    },
                    owners: driver.owners.map((owner: any) => ({
                        ownerId: owner._id,
                        name: owner.ownerName.data,
                        age: owner.ownerAge.data,
                        address: {
                            buildingNumber: owner.ownerBuildingNumber.data,
                            pincode: owner.ownerPincode.data,
                            streetAddress: owner.ownerStreetAddress.data,
                            landmark: owner.ownerLandMark.data,
                        },
                        contact: {
                            phone: owner.ownerPhone.data,
                            whatsapp: owner.ownerWhatsapp.data,
                            careof: owner.careof.data,
                            careofPhone: owner.careofPhone.data,
                            careofWhatsapp: owner.careofWhatsapp.data,
                        },
                        documents: {
                            aadhaarFront: owner.documents.aadhaarFront.data,
                            aadhaarBack: owner.documents.aadhaarBack.data,
                            drivingFront: owner.documents.drivingFront.data,
                            drivingBack: owner.documents.drivingBack.data,
                            ownerPhoto: owner.documents.ownerPhoto.data,
                            addressProof: owner.documents.addressProof.data,
                            ownerVehicle: owner.documents.ownerVehicle.data,
                        },
                        date: owner.date,
                        time: owner.time,
                    })),
                    registrationNumber: driver.registrationNumber,
                    date: driver.date,
                    time: driver.time,
                    active: driver.active,
                }));
                // console.log(drivers);
                setDrivers(drivers);
            }
        } catch (error) {
            console.error('Error fetching drivers:', error);
            throw error;
        }
    };

    // console.log(drivers, 'drivers');

    useEffect(() => {
        getAllDrivers(page);
    }, []); 

    return { drivers, getAllDrivers };
};

export default useGetAllDrivers;
