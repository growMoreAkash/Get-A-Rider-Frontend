import React, { useEffect, useState } from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';

import VehicleDownload from './VehicleDownload';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toPng } from 'html-to-image';
// import { createRoot } from 'react-dom/client';
import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import barcode from "../assets/barcode1.svg";
import icon from "../assets/icon_home.svg";
import GYH from "../assets/gyh_logo.png";

interface Vehicle {
    _id: string;
    registrationNumber: {
        data: string;
        verified: boolean;
    };
    details: {
        model: {
            data: string;
            verified: boolean;
        };
    };
    driverId: {
        phone: {
            data: string;
            verified: boolean;
        };
        fullname: {
            data: string;
            verified: boolean;
        };
        driverPhoto: {
            data: string;
            verified: boolean;
        };
        identity_Type: {
            data: string;
            verified: boolean;
        };
        maritial: {
            data: string;
            verified: boolean;
        };
        religion: {
            data: string;
            verified: boolean;
        };
        annualIncome: {
            data: string;
            verified: boolean;
        };
        identity_Number: {
            data: string;
            verified: boolean;
        };
        whatsapp: {
            data: string;
            verified: boolean;
        };
        pincode: {
            data: string;
            verified: boolean;
        };
        building_name: {
            data: string;
            verified: boolean;
        };
        landmark: {
            data: string;
            verified: boolean;
        };
        street_address: {
            data: string;
            verified: boolean;
        };
        careof: {
            data: string;
            verified: boolean;
        };
        gender: {
            data: string;
            verified: boolean;
        };
        careofPhone: {
            data: string;
            verified: boolean;
        };
        profession: {
            data: string;
            verified: boolean;
        };
        occupation: {
            data: string;
            verified: boolean;
        };
        _id: string;
        processingSection: string;
    } | null;
    date: string;
    time: string;
    processingSection: string;
    isDriver: boolean;
    active: boolean;
    payment?: string;
}

interface APIResponse {
    message: string;
    vehicles: Vehicle[];
    totalVehicles: number;
    currentPage: number;
    totalPages: number;
}

interface TableRecord {
    id: string;
    date: string;
    time: string;
    vehicleRegistrationNumber: string;
    driverName: string;
    phoneNumber: string;
    driverId: string;
    vehicleId: string;
    vehicleModel: string;
    driverProfilePercentage: number;
    driverDocumentsPercentage: number;
    vehicleProfilePercentage: number;
    vehicleDocumentsPercentage: number;
    payment: string; // Add payment field
}

const VehicleTransferVerification = () => {
    const host = 'http://localhost:8000/api';
    const [page, setPage] = useState<number>(1);
    const PAGE_SIZES = [10, 20, 30, 50];
    const [pageSize, setPageSize] = useState<number>(PAGE_SIZES[0]);
    const [recordsData, setRecordsData] = useState<TableRecord[]>([]);
    const [selectedRecords, setSelectedRecords] = useState<TableRecord[]>([]);
    const [search, setSearch] = useState<string>('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'vehicleRegistrationNumber',
        direction: 'asc',
    });
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedVehicle, setSelectedVehicle] = useState<TableRecord | null>(null);
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState<boolean>(false);
    const [selectedDownloadVehicle, setSelectedDownloadVehicle] = useState<TableRecord | null>(null);
    
    const token = Cookies.get('token');

    const calculatePercentage = (fields: Record<string, any>, totalFields: number): number => {
        const filledFields = Object.values(fields).filter((field) => (field.data && field.data !== '') || field.verified).length;
        return Math.round((filledFields / totalFields) * 100);
    };

    const getAllVehicle = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post<APIResponse>(
                `${host}/getAllVehicle`,
                {
                    apiUrl: '/getAllVehicle',
                    page,
                    limit: pageSize,
                   // processingSection: 'REGISTER',
                    
                   // driverid.processingSection ='VERIFY',
                    ...(search && { registrationNumber: search }),
                    sortBy: sortStatus.columnAccessor,
                    sortOrder: sortStatus.direction,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const { vehicles, totalVehicles } = response.data;

            const formattedData = vehicles.map((vehicle) => {
                // Driver Profile Percentage
                const driverProfileFields = vehicle.driverId
                    ? {
                          phone: vehicle.driverId.phone,
                          fullname: vehicle.driverId.fullname,
                          driverPhoto: vehicle.driverId.driverPhoto,
                          identity_Type: vehicle.driverId.identity_Type,
                          maritial: vehicle.driverId.maritial,
                          religion: vehicle.driverId.religion,
                          annualIncome: vehicle.driverId.annualIncome,
                          identity_Number: vehicle.driverId.identity_Number,
                          whatsapp: vehicle.driverId.whatsapp,
                          pincode: vehicle.driverId.pincode,
                          building_name: vehicle.driverId.building_name,
                          landmark: vehicle.driverId.landmark,
                          street_address: vehicle.driverId.street_address,
                          careof: vehicle.driverId.careof,
                          gender: vehicle.driverId.gender,
                          careofPhone: vehicle.driverId.careofPhone,
                          profession: vehicle.driverId.profession,
                          occupation: vehicle.driverId.occupation,
                      }
                    : {};
                const driverProfilePercentage = calculatePercentage(driverProfileFields, 18);

                // Driver Documents Percentage
                const driverDocumentsFields = vehicle.driverId?.driverDocument || {};
                const driverDocumentsPercentage = calculatePercentage(driverDocumentsFields, 13);
                console.log(vehicle.driverId?.driverDocument);
                // Vehicle Profile Percentage
                const vehicleProfileFields = {
                    model: vehicle.details.model,
                    brand: vehicle.details.brand,
                    typ: vehicle.details.typ,
                    category: vehicle.details.category,
                    color: vehicle.otherDetails.color,
                    fuelType: vehicle.otherDetails.fuelType,
                    maxEnginePower: vehicle.otherDetails.maxEnginePower,
                    fuelPerLiter: vehicle.otherDetails.fuelPerLiter,
                    mode: vehicle.otherDetails.mode,
                    capacity: vehicle.otherDetails.capacity,
                    gearType: vehicle.otherDetails.gearType,
                    regYear: vehicle.otherDetails.regYear,
                };
                const vehicleProfilePercentage = calculatePercentage(vehicleProfileFields, 12);

                // Vehicle Documents Percentage
                const vehicleDocumentsFields = vehicle.documents;
                console.log(vehicle.documents);
                const vehicleDocumentsPercentage = calculatePercentage(vehicleDocumentsFields, 9);

                return {
                    id: vehicle._id,
                    date: vehicle.date,
                    time: vehicle.time,
                    vehicleRegistrationNumber: vehicle.registrationNumber.data,
                    driverName: vehicle.driverId?.fullname.data || 'Unknown',
                    phoneNumber: vehicle.driverId?.phone.data || 'N/A',
                    driverId: vehicle.driverId?.registrationNumber || 'N/A',
                    vehicleId: vehicle._id,
                    vehicleModel: vehicle.details.model.data,
                    driverProfilePercentage,
                    DriverTransfer: vehicle.driverId?.processingSection || 'N/A',
                    driverDocumentsPercentage,
                    vehicleProfilePercentage,
                    vehicleDocumentsPercentage,
                    payment: vehicle.payment || 'Pending',
                    documents: vehicle.documents,
                };
            });

            setRecordsData(formattedData);
            setTotalRecords(totalVehicles);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to fetch vehicles. Please try again.',
            });
            setRecordsData([]);
            setTotalRecords(0);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getAllVehicle();
    }, [page, pageSize, search, sortStatus]);

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    const handleDownloadClick = (vehicleId: string) => {
        const vehicle = recordsData.find((v) => v.id === vehicleId);
        if (!vehicle) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Vehicle details not found.',
            });
            return;
        }
    
        setSelectedDownloadVehicle(vehicle);
        setIsDownloadModalOpen(true);
    };
    

    

const handleDownload = async () => {
    if (!selectedDownloadVehicle) return;

    try {
        // Get the modal content element
        const modalContent = document.getElementById('download-modal-content');
        if (!modalContent) {
            throw new Error('Modal content not found.');
        }

        // Use html-to-image to capture the modal content as a PNG
        const image = await toPng(modalContent);

        // Create a temporary link element to trigger the download
        const link = document.createElement('a');
        link.href = image;
        link.download = `Vehicle_Details_${selectedDownloadVehicle.vehicleRegistrationNumber}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Close the download modal after successful download
        setIsDownloadModalOpen(false);
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to download modal as PNG. Please try again.',
        });
    }
};
    const isTransferDisabled = selectedRecords.some((record) => record.vehicleProfilePercentage !== 100 || record.vehicleDocumentsPercentage !== 100 || record.DriverTransfer !== 'VERIFY');

    const handleTransfer = async () => {
        if (selectedRecords.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: 'Please select at least one record to transfer.',
            });
            return;
        }

        const selectedVehicleIds = selectedRecords.map((record) => record.vehicleId);

        try {
            const response = await axios.post(
                `${host}/changeVehicleProcessingSection`,
                {
                    vehicles: selectedVehicleIds,
                    processingSection: 'VERIFY',
                    apiUrl: '/changeVehicleProcessingSection',
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Vehicles transferred successfully!',
            });
            getAllVehicle(); // Refresh the data after transfer
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to transfer vehicles. Please try again.',
            });
        }
    };

     // Open modal and set selected vehicle
     const handlePaymentClick = (vehicleId: string) => {
        const vehicle = recordsData.find((v) => v.id === vehicleId);
        if (!vehicle) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Vehicle details not found.',
            });
            return;
        }

        setSelectedVehicle(vehicle);
        setIsModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedVehicle(null);
    };

    // Handle payment inside the modal
    const handlePayment = async () => {
        if (!selectedVehicle) return;

        try {
            const response = await axios.post(
                `${host}/vehiclePayment`,
                {
                    vehicleId: selectedVehicle.id,
                    phone: selectedVehicle.phoneNumber,
                    email: 'example@example.com', // Replace with actual email if available
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Check if the response contains the short_url
            if (response.data && response.data.short_url) {
                // Redirect to the provided short URL
                window.location.href = response.data.short_url;
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Payment processed successfully!',
                });
                getAllVehicle(); // Refresh the data after payment
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to process payment. Please try again.',
            });
        }
    };

    

    return (
        <div>
            <div className="panel mt-6">
                <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">Vehicle List</h5>
                    <div className="ltr:ml-auto rtl:mr-auto">
                        <input
                            type="text"
                            className="form-input w-auto p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Search by Vehicle Registration Number..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div>
                        <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={handleTransfer} disabled={isTransferDisabled || selectedRecords.length === 0}>
                            Transfer
                        </button>
                    </div>
                </div>
                <div className="datatables">
                    {isLoading ? (
                        <div className="text-center">Loading...</div>
                    ) : (
                        <DataTable
                            className="whitespace-nowrap table-hover"
                            records={recordsData}
                            columns={[
                                {
                                    accessor: 'date',
                                    title: 'Date',
                                    sortable: true,
                                },
                                {
                                    accessor: 'time',
                                    title: 'Time',
                                    sortable: true,
                                },
                                {
                                    accessor: 'vehicleRegistrationNumber',
                                    title: 'Vehicle Registration No.',
                                    sortable: true,
                                },
                                {
                                    accessor: 'driverName',
                                    title: 'Driver Name',
                                    sortable: true,
                                },
                                {
                                    accessor: 'phoneNumber',
                                    title: 'Phone Number',
                                    sortable: true,
                                },
                                {
                                    accessor: 'driverId',
                                    title: 'Driver ID',
                                    sortable: true,
                                },
                                {
                                    accessor: 'vehicleModel',
                                    title: 'Vehicle Model',
                                    sortable: true,
                                },
                                {
                                    accessor: 'driverProfilePercentage',
                                    title: 'Driver Profile %',
                                    sortable: true,
                                    render: ({ driverProfilePercentage }) => `${driverProfilePercentage}%`,
                                },
                                {
                                    accessor: 'driverDocumentsPercentage',
                                    title: 'Driver Documents %',
                                    sortable: true,
                                    render: ({ driverDocumentsPercentage }) => `${driverDocumentsPercentage}%`,
                                },
                                {
                                    accessor: 'vehicleProfilePercentage',
                                    title: 'Vehicle Profile %',
                                    sortable: true,
                                    render: ({ vehicleProfilePercentage }) => `${vehicleProfilePercentage}%`,
                                },
                                {
                                    accessor: 'vehicleDocumentsPercentage',
                                    title: 'Vehicle Documents %',
                                    sortable: true,
                                    render: ({ vehicleDocumentsPercentage }) => `${vehicleDocumentsPercentage}%`,
                                },
                                {
                                    accessor: 'DriverTransfer',
                                    title: 'Driver Transfer',
                                    sortable: true,
                                },
                                {
                                    accessor: 'payment',
                                    title: 'Payment',
                                    render: ({ id, payment }) => (
                                        <button
                                            type="button"
                                            className={`btn ${payment === 'Paid' ? 'bg-green-500' : 'bg-red-500'} text-white`}
                                            onClick={() => handlePaymentClick(id)} // Open modal instead of handling payment
                                            disabled={payment === 'Paid'}
                                        >
                                            {payment === 'Paid' ? 'Paid' : 'Pay Now'}
                                        </button>
                                    ),
                                },
                                {
                                    accessor: 'download',
                                    title: 'Download',
                                    render: ({ id }) => (
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={() => handleDownloadClick(id)} // Open download modal
                                        >
                                            Download
                                        </button>
                                    ),
                                }
                            ]}
                            highlightOnHover
                            totalRecords={totalRecords}
                            recordsPerPage={pageSize}
                            page={page}
                            onPageChange={setPage}
                            recordsPerPageOptions={PAGE_SIZES}
                            onRecordsPerPageChange={setPageSize}
                            sortStatus={sortStatus}
                            onSortStatusChange={setSortStatus}
                            selectedRecords={selectedRecords}
                            onSelectedRecordsChange={setSelectedRecords}
                            minHeight={200}
                            paginationText={({ from, to, totalRecords }) => `Showing ${from} to ${to} of ${totalRecords} entries`}
                        />
                    )}
                </div>
            </div>
            {/* Custom Modal with Tailwind CSS */}
            {isModalOpen && selectedVehicle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 p-6">
                        <div className="flex justify-between items-center border-b pb-4">
                            <h2 className="text-xl font-semibold">Vehicle and Driver Details</h2>
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={closeModal}
                            >
                                &times;
                            </button>
                        </div>
                        <div className="mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-800"><strong>Driver ID:</strong> {selectedVehicle.driverId}</p>
                                    <p className="text-sm text-gray-800"><strong>Driver Name:</strong> {selectedVehicle.driverName}</p>
                                    <p className="text-sm text-gray-800"><strong>Vehicle ID:</strong> {selectedVehicle.vehicleId}</p>
                                    <p className="text-sm text-gray-800"><strong>Vehicle Model:</strong> {selectedVehicle.vehicleModel}</p>
                                    <p className="text-sm text-gray-800"><strong>Vehicle Registration Number:</strong> {selectedVehicle.vehicleRegistrationNumber}</p>
                                </div>
                                <div className="flex justify-center items-center">
                                    {selectedVehicle.documents?.vehicleFrontRight?.data ? (
                                        <img
                                            src={selectedVehicle.documents.vehicleFrontRight.data}
                                            alt="Vehicle Front Right"
                                            className="w-32 h-32 rounded-lg object-cover"
                                        />
                                    ) : (
                                        <p className="text-sm text-gray-800">No photo available</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                onClick={handlePayment} // Call payment API
                                disabled={selectedVehicle.payment === 'Paid'}
                            >
                                {selectedVehicle.payment === 'Paid' ? 'Paid' : 'Pay Now'}
                            </button>
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                                onClick={closeModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}


{/* {isDownloadModalOpen && selectedDownloadVehicle && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 p-6" id="download-modal-content">
            <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-xl font-semibold">Download Vehicle Details</h2>
                <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setIsDownloadModalOpen(false)}
                >
                    &times;
                </button>
            </div>
            <div className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-800"><strong>Driver ID:</strong> {selectedDownloadVehicle.driverId}</p>
                        <p className="text-sm text-gray-800"><strong>Driver Name:</strong> {selectedDownloadVehicle.driverName}</p>
                        <p className="text-sm text-gray-800"><strong>Vehicle ID:</strong> {selectedDownloadVehicle.vehicleId}</p>
                        <p className="text-sm text-gray-800"><strong>Vehicle Model:</strong> {selectedDownloadVehicle.vehicleModel}</p>
                        <p className="text-sm text-gray-800"><strong>Vehicle Registration Number:</strong> {selectedDownloadVehicle.vehicleRegistrationNumber}</p>
                    </div>
                    <div className="flex justify-center items-center">
                        {selectedDownloadVehicle.documents?.vehicleFrontRight?.data ? (
                            <img
                                src={selectedDownloadVehicle.documents.vehicleFrontRight.data}
                                alt="Vehicle Front Right"
                                className="w-32 h-32 rounded-lg object-cover"
                            />
                        ) : (
                            <p className="text-sm text-gray-800">No photo available</p>
                        )}
                    </div>
                </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    onClick={handleDownload} // Call the download function
                >
                    Download as PNG
                </button>
                <button
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    onClick={() => setIsDownloadModalOpen(false)}
                >
                    Close
                </button>
            </div>
        </div>
    </div>
)} */}

{isDownloadModalOpen && selectedDownloadVehicle && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 p-4 md:p-6" >
            <div className="flex justify-between items-center border-b pb-4">
                <h2 className="text-lg md:text-xl font-semibold">Download Vehicle Details</h2>
                <button
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setIsDownloadModalOpen(false)}
                >
                    &times;
                </button>
            </div>
            <div className="mt-4 p-10 bg-white" id="download-modal-content">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 text-center">
                    <img src={icon} alt="Icon" className="h-12 md:h-16 mb-2 md:mb-0" />
                    <div>
                        <p className="text-lg md:text-xl font-normal">Driver Vehicle details</p>
                        <h1 className="text-xl md:text-2xl font-extrabold">Get A Ride</h1>
                        <p className="text-sm italic">by Get Your Homes</p>
                    </div>
                    <img src={barcode} alt="Barcode" className="h-12 md:h-16 mt-2 md:mt-0" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 shadow-md rounded mb-4">
                    <div>
                        <p className="text-sm text-gray-800"><strong>Driver ID :</strong> {selectedDownloadVehicle.driverId}</p>
                        <p className="text-sm text-gray-800"><strong>Driver Name :</strong> {selectedDownloadVehicle.driverName}</p>
                        <p className="text-sm text-gray-800"><strong>Vehicle ID :</strong> {selectedDownloadVehicle.vehicleId}</p>
                        <p className="text-sm text-gray-800"><strong>Vehicle Model :</strong> {selectedDownloadVehicle.vehicleModel}</p>
                        <p className="text-sm text-gray-800"><strong>Vehicle Registration Number :</strong> {selectedDownloadVehicle.vehicleRegistrationNumber}</p>
                    </div>
                    <div className="flex justify-center items-center">
                        {selectedDownloadVehicle.documents?.vehicleFrontRight?.data ? (
                            <img
                                src={selectedDownloadVehicle.documents.vehicleFrontRight.data}
                                alt="Vehicle Front Right"
                                className="w-24 h-24 md:w-32 md:h-32 rounded-lg object-cover"
                            />
                        ) : (
                            <p className="text-sm text-gray-800">No photo available</p>
                        )}
                    </div>
                </div>
                 {/* Footer Section */}
      <div className="flex justify-around">
        <div className="text-center text-sm text-gray-800 mt-4">
          <p><span className="font-bold">Company - Get A Ride</span></p>
          <p><span className="font-bold">Parent Company - Get Your Homes</span></p>
          <p>Address: Mamoni Enterprise, Opposite to Kalain HS Road, Kalain, Cachar, Assam</p>
          <p>Approved by Founder & CEO</p>
        </div>
        <div>
          <img src={GYH} alt="Icon" className="h-16" />
        </div>
      </div>
            </div>
            <div className="mt-6 flex justify-center md:flex-row  gap-2">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    onClick={handleDownload}
                >
                    Download
                </button>
                <button
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    onClick={() => setIsDownloadModalOpen(false)}
                >
                    Close
                </button>
            </div>
        </div>
    </div>
)}
        </div>
    );
};

export default VehicleTransferVerification;
// import React, { useEffect, useState } from 'react';
// import { DataTable, DataTableSortStatus } from 'mantine-datatable';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import Swal from 'sweetalert2';

// interface Vehicle {
//     _id: string;
//     registrationNumber: {
//         data: string;
//         verified: boolean;
//     };
//     details: {
//         model: {
//             data: string;
//             verified: boolean;
//         };
//     };
//     driverId: {
//         fullname: {
//             data?: string;
//             verified: boolean;
//         };
//         phone: {
//             data?: string;
//             verified: boolean;
//         };
//         _id: string;
//     } | null;
//     date: string;
//     time: string;
//     processingSection: string;
//     isDriver: boolean;
//     active: boolean;
// }

// interface APIResponse {
//     message: string;
//     vehicles: Vehicle[];
//     totalVehicles: number;
//     currentPage: number;
//     totalPages: number;
// }

// interface TableRecord {
//     id: string;
//     date: string;
//     time: string;
//     vehicleRegistrationNumber: string;
//     driverName: string;
//     phoneNumber: string;
//     driverId: string;
//     vehicleId: string;
//     vehicleModel: string;
// }

// const VehicleTransferVerification = () => {
//     const host = 'http://localhost:8000/api';
//     const [page, setPage] = useState<number>(1);
//     const PAGE_SIZES = [10, 20, 30, 50];
//     const [pageSize, setPageSize] = useState<number>(PAGE_SIZES[0]);
//     const [recordsData, setRecordsData] = useState<TableRecord[]>([]);
//     const [selectedRecords, setSelectedRecords] = useState<TableRecord[]>([]);
//     const [search, setSearch] = useState<string>('');
//     const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
//         columnAccessor: 'vehicleRegistrationNumber',
//         direction: 'asc',
//     });
//     const [totalRecords, setTotalRecords] = useState<number>(0);
//     const [isLoading, setIsLoading] = useState<boolean>(false);

//     const token = Cookies.get('token');

//     const getAllVehicle = async () => {
//         setIsLoading(true);
//         try {
//             const response = await axios.post<APIResponse>(
//                 `${host}/getAllVehicle`,
//                 {
//                     page, // Current page
//                     limit: pageSize, // Number of records per page
//                      processingSection: 'REGISTER',
//                     ...(search && { registrationNumber: search }), // Add search filter if applicable
//                     sortBy: sortStatus.columnAccessor,
//                     sortOrder: sortStatus.direction,
//                 },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         'Content-Type': 'application/json', // Explicitly set Content-Type
//                     },
//                 }
//             );

//             // Check if the API response is valid
//             if (!response.data || !response.data.vehicles) {
//                 throw new Error('Invalid API response');
//             }

//             const { vehicles, totalVehicles } = response.data;

//             const formattedData = vehicles.map((vehicle) => ({
//                 id: vehicle._id,
//                 date: vehicle.date,
//                 time: vehicle.time,
//                 vehicleRegistrationNumber: vehicle.registrationNumber.data,
//                 driverName: vehicle.driverId?.fullname.data || 'Unknown',
//                 phoneNumber: vehicle.driverId?.phone.data || 'N/A',
//                 driverId: vehicle.driverId?._id || 'N/A',
//                 vehicleId: vehicle._id,
//                 vehicleModel: vehicle.details.model.data,
//             }));

//             setRecordsData(formattedData);
//             setTotalRecords(totalVehicles);
//         } catch (error) {
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Error',
//                 text: 'Failed to fetch vehicles. Please try again.',
//             });
//             setRecordsData([]);
//             setTotalRecords(0);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     useEffect(() => {
//         getAllVehicle();
//     }, [page, pageSize, search, sortStatus]);

//     useEffect(() => {
//         setPage(1);
//     }, [pageSize]);

//     const handleTransfer = async () => {
//         if (selectedRecords.length === 0) {
//             Swal.fire({
//                 icon: 'warning',
//                 title: 'Warning',
//                 text: 'Please select at least one record to transfer.',
//             });
//             return;
//         }

//         const selectedVehicleIds = selectedRecords.map((record) => record.vehicleId);

//         try {
//             const response = await axios.post(
//                 `${host}/changeVehicleProcessingSection`,
//                 {
//                     vehicles: selectedVehicleIds,
//                     processingSection: 'VERIFY',
//                     apiUrl: '/changeVehicleProcessingSection',
//                 },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );

//             Swal.fire({
//                 icon: 'success',
//                 title: 'Success',
//                 text: 'Vehicles transferred successfully!',
//             });
//             getAllVehicle(); // Refresh the data after transfer
//         } catch (error) {
//             Swal.fire({
//                 icon: 'error',
//                 title: 'Error',
//                 text: 'Failed to transfer vehicles. Please try again.',
//             });
//         }
//     };

//     return (
//         <div>
//             <div className="panel mt-6">
//                 <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
//                     <h5 className="font-semibold text-lg dark:text-white-light">Vehicle List</h5>
//                     <div className="ltr:ml-auto rtl:mr-auto">
//                         <input
//                             type="text"
//                             className="form-input w-auto p-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             placeholder="Search by Vehicle Registration Number..."
//                             value={search}
//                             onChange={(e) => setSearch(e.target.value)}
//                         />
//                     </div>
//                     <div>
//                         <button
//                             type="button"
//                             className="btn btn-primary ltr:ml-4 rtl:mr-4"
//                             onClick={handleTransfer}
//                         >
//                             Transfer
//                         </button>
//                     </div>
//                 </div>
//                 <div className="datatables">
//                     {isLoading ? (
//                         <div className="text-center">Loading...</div>
//                     ) : (
//                         <DataTable
//                             className="whitespace-nowrap table-hover"
//                             records={recordsData}
//                             columns={[
//                                 {
//                                     accessor: 'date',
//                                     title: 'Date',
//                                     sortable: true,
//                                 },
//                                 {
//                                     accessor: 'time',
//                                     title: 'Time',
//                                     sortable: true,
//                                 },
//                                 {
//                                     accessor: 'vehicleRegistrationNumber',
//                                     title: 'Vehicle Registration No.',
//                                     sortable: true,
//                                 },
//                                 {
//                                     accessor: 'driverName',
//                                     title: 'Driver Name',
//                                     sortable: true,
//                                 },
//                                 {
//                                     accessor: 'phoneNumber',
//                                     title: 'Phone Number',
//                                     sortable: true,
//                                 },
//                                 {
//                                     accessor: 'driverId',
//                                     title: 'Driver ID',
//                                     sortable: true,
//                                 },
//                                 {
//                                     accessor: 'vehicleId',
//                                     title: 'Vehicle ID',
//                                     sortable: true,
//                                 },
//                                 {
//                                     accessor: 'vehicleModel',
//                                     title: 'Vehicle Model',
//                                     sortable: true,
//                                 },
//                             ]}
//                             highlightOnHover
//                             totalRecords={totalRecords}
//                             recordsPerPage={pageSize}
//                             page={page}
//                             onPageChange={setPage}
//                             recordsPerPageOptions={PAGE_SIZES}
//                             onRecordsPerPageChange={setPageSize}
//                             sortStatus={sortStatus}
//                             onSortStatusChange={setSortStatus}
//                             selectedRecords={selectedRecords}
//                             onSelectedRecordsChange={setSelectedRecords}
//                             minHeight={200}
//                             paginationText={({ from, to, totalRecords }) => `Showing ${from} to ${to} of ${totalRecords} entries`}
//                         />
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default VehicleTransferVerification;
