import React, { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import axios from 'axios';
import { host } from '../secret';
import Cookies from 'js-cookie';

const TransferVerification = () => {
    const host = "http://localhost:8000/api"
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [recordsData, setRecordsData] = useState<any[]>([]);
    const [selectedRecords, setSelectedRecords] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'id',
        direction: 'asc',
    });
    const [totalRecords, setTotalRecords] = useState(0);

    const API_URL = import.meta.env.VITE_API_URL;

    const fetchData = async () => {
        try {
            const response = await axios.post(`${host}/getAllDrivers`, {
                page,
                limit: pageSize,
                processingSection: 'REGISTER',
                ...(search && { registrationNumber: search }),
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get("token")}`
                }
            });

            const { drivers, totalDrivers } = response.data;
            console.log(drivers)

            const formattedData = drivers.map((driver: any, index: number) => ({
                id: driver._id,
                index: index + 1,
                fullname: driver.fullname.data || 'Unknown',
                date: driver.date,
                time: driver.time,
                registrationNumber: driver.registrationNumber,
                phone: driver.phone?.data || 'N/A',
            }));

            // Apply sorting
            const sortedData = sortStatus.columnAccessor ? sortBy(formattedData, sortStatus.columnAccessor) : formattedData;

            if (sortStatus.direction === 'desc') {
                sortedData.reverse();
            }
            setRecordsData(sortedData);
            setTotalRecords(totalDrivers);
        } catch (error) {
            //.error('Error fetching drivers:', error);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, pageSize, search, sortStatus]);

    const handleTransfer = async () => {
        if (selectedRecords.length === 0) {
            alert('Please select at least one record to transfer.');
            return;
        }

        const selectedDriverIds = selectedRecords.map((record) => record.id);

        try {
            const response = await axios.post(`${host}/changeProcessingSection`, {
                drivers: selectedDriverIds,
                processingSection: 'VERIFY',
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get("token")}`
                }
            });

            //////.log('Transfer Response:', response.data);
            alert('Drivers transferred successfully!');
            // Optionally, refetch data to reflect changes
            fetchData();
        } catch (error) {
            //.error('Error during transfer:', error);
            alert('Failed to transfer drivers.');
        }
    };

    return (
        <div>
            <div className="panel mt-6">
                <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                    <div className="ltr:ml-auto rtl:mr-auto">
                        <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>

                    <div>
                        <button type="button" className="btn bg-teal-500 text-white hover:bg-teal-600 ltr:ml-4 rtl:mr-4" onClick={handleTransfer}>
                            Transfer
                        </button>
                    </div>
                </div>
                <div className="datatables">
                    <DataTable
                        className="whitespace-nowrap table-hover"
                        records={recordsData}
                        columns={[
                            { accessor: 'index', title: 'Index', sortable: true },
                            { accessor: 'registrationNumber', title: 'Registration No.', sortable: true },
                            { accessor: 'date', title: 'Date', sortable: true },
                            { accessor: 'time', title: 'Time', sortable: true },
                            { accessor: 'fullname', title: 'Full Name', sortable: true },
                            { accessor: 'phone', title: 'Phone' },
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
                </div>
            </div>
        </div>
    );
};

export default TransferVerification;
