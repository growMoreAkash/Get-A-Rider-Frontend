import React, { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import axios from 'axios';
import { host } from '../secret';
import Cookies from 'js-cookie';

// Define interfaces for better TypeScript integration
interface Vehicle {
    _id: string;
    registrationNumber: {
        data: string;
        verified: boolean;
    };
    driverId: {
        fullname: {
            data?: string; // Assuming fullname has a 'data' field
            verified: boolean;
        };
        registrationNumber: string;
        _id: string;
    };
    processingSection: string;
    isDriver: boolean;
    active: boolean;
    // Add other fields if necessary
}

interface APIResponse {
    message: string;
    vehicles: Vehicle[];
    totalVehicles: number;
    currentPage: number;
    totalPages: number;
}

const VehicleTransferVerification = () => {
    const host = 'http://localhost:8000/api';
    const [page, setPage] = useState<number>(1);
    const PAGE_SIZES = [10, 20, 30, 50];
    const [pageSize, setPageSize] = useState<number>(PAGE_SIZES[0]);
    const [recordsData, setRecordsData] = useState<any[]>([]);
    const [selectedRecords, setSelectedRecords] = useState<any[]>([]);
    const [search, setSearch] = useState<string>('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'vehicleRegistrationNumber',
        direction: 'asc',
    });
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const apiUrl = import.meta.env.VITE_API_URL;

    var token = Cookies.get('token');

    // Fetch data from API
    const getAllVehicle = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post<APIResponse>(
                `${host}/getAllVehicle`,
                {
                    apiUrl: '/getAllVehicle',
                    page,
                    limit: pageSize,
                    processingSection: 'REGISTER',
                    ...(search && { registrationNumber: search }),
                    // Optionally, include sorting parameters if your API supports them
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

            const formattedData = vehicles.map((vehicle) => ({
                id: vehicle._id,
                vehicleRegistrationNumber: vehicle.registrationNumber.data,
                driverRegistrationNumber: vehicle.driverId.registrationNumber,
                driverFullName: vehicle.driverId.fullname.data || 'Unknown',
            }));

            // Apply client-side sorting if API does not support it
            let sortedData = formattedData;
            if (sortStatus.columnAccessor) {
                sortedData = sortBy(formattedData, sortStatus.columnAccessor);
                if (sortStatus.direction === 'desc') {
                    sortedData.reverse();
                }
            }

            setRecordsData(sortedData);
            setTotalRecords(totalVehicles);
        } catch (error) {
            //.error('Error fetching vehicles:', error);
            setRecordsData([]);
            setTotalRecords(0);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getAllVehicle();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pageSize, search, sortStatus]);

    // Reset to first page when page size changes
    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    // Handle Transfer Functionality
    const handleTransfer = async () => {
        if (selectedRecords.length === 0) {
            alert('Please select at least one record to transfer.');
            return;
        }

        const selectedVehicleIds = selectedRecords.map((record) => record.id);

        try {
            const response = await axios.post(
                `/changeVehicleProcessingSection`,
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

            //////.log('Transfer Response:', response.data);
            alert('Vehicles transferred successfully!');
            // Refetch data to reflect changes
            getAllVehicle();
        } catch (error) {
            //.error('Error during transfer:', error);
            alert('Failed to transfer vehicles.');
        }
    };

    return (
        <div>
            <div className="panel mt-6">
                <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">Transfer Vehicles</h5>
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
                        <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={handleTransfer}>
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
                                    accessor: 'vehicleRegistrationNumber',
                                    title: 'Vehicle Registration No.',
                                    sortable: true,
                                },
                                {
                                    accessor: 'driverRegistrationNumber',
                                    title: 'Driver Registration No.',
                                    sortable: true,
                                },
                                {
                                    accessor: 'driverFullName',
                                    title: 'Driver Full Name',
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
