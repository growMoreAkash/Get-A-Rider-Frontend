import React, { useEffect, useState } from 'react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

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
    } | null;
    date: string;
    time: string;
    processingSection: string;
    isDriver: boolean;
    active: boolean;
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

    const token = Cookies.get('token');

  
    const calculatePercentage = (fields: Record<string, any>, totalFields: number): number => {
        const filledFields = Object.values(fields).filter(
            (field) => (field.data && field.data !== '') || field.verified
        ).length;
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
                    // processingSection : 'REGISTER',
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
    
                
                const driverDocumentsFields = vehicle.driverId?.driverDocument || {};
                const driverDocumentsPercentage = calculatePercentage(driverDocumentsFields, 12); 
    
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
    
                //  Vehicle Documents Percentage
                const vehicleDocumentsFields = vehicle.documents;
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
                    driverDocumentsPercentage,
                    vehicleProfilePercentage,
                    vehicleDocumentsPercentage,
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
                        <button
                            type="button"
                            className="btn btn-primary ltr:ml-4 rtl:mr-4"
                            onClick={handleTransfer}
                        >
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
                                // {
                                //     accessor: 'vehicleId',
                                //     title: 'Vehicle ID',
                                //     sortable: true,
                                // },
                                
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
                                     accessor: 'vehicleId',
                                    title: 'payment',
                                    sortable: true,
                                },
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