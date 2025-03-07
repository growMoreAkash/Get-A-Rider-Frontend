import React, { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import axios from 'axios';
import Cookies from 'js-cookie';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import barcode from "../assets/barcode1.svg";
import icon from "../assets/icon_home.svg";
import GYH from "../assets/gyh_logo.png";
import { toPng } from 'html-to-image';
import bar1 from "../assets/bar1.png";
import icon1 from "../assets/icon1.png";

const TransferVerification = () => {
    const host = "http://localhost:8000/api";
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
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
    const [selectedDownloadRecord, setSelectedDownloadRecord] = useState<any>(null);

    const API_URL = import.meta.env.VITE_API_URL;

    // Function to calculate profile completion percentage
    const calculateProfilePercentage = (driver: any) => {
        const profileFields = [
            driver.fullname.data,
            driver.phone.data,
            driver.driverPhoto.data,
            driver.identity_Type.data,
            driver.maritial.data,
            driver.religion.data,
            driver.annualIncome.data,
            driver.identity_Number.data,
            driver.whatsapp.data,
            driver.pincode.data,
            driver.building_name.data,
            driver.landmark.data,
            driver.street_address.data,
            driver.careof.data,
            driver.gender.data,
            driver.careofPhone.data,
            driver.profession.data,
            driver.occupation.data,
        ];
        const filledFields = profileFields.filter((field) => field).length;
        const totalFields = profileFields.length;
        return ((filledFields / totalFields) * 100).toFixed(2);
    };

    // Function to calculate document completion percentage
    const calculateDocumentPercentage = (driver: any) => {
        const documentFields = [
            driver.driverDocument.aadhaarFront.data,
            driver.driverDocument.aadhaarBack.data,
            driver.driverDocument.panFront.data,
            driver.driverDocument.panBack.data,
            driver.driverDocument.drivingFront.data,
            driver.driverDocument.drivingBack.data,
            driver.driverDocument.addressProof.data,
            driver.driverDocument.vehicleDriver.data,
            driver.driverDocument.numberDriver.data,
            driver.driverDocument.passBook.data,
            driver.driverDocument.qrCode.data,
            driver.driverDocument.pollution.data,
            driver.driverDocument.care.data,
        ];
        const filledFields = documentFields.filter((field) => field).length;
        const totalFields = documentFields.length;
        return ((filledFields / totalFields) * 100).toFixed(2);
    };

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
            console.log(drivers);

            const formattedData = drivers.map((driver: any, index: number) => ({
                id: driver._id,
                index: index + 1,
                fullname: driver.fullname.data || 'Unknown',
                date: driver.date,
                time: driver.time,
                registrationNumber: driver.registrationNumber,
                phone: driver.phone?.data || 'N/A',
                profilePercentage: calculateProfilePercentage(driver),
                documentPercentage: calculateDocumentPercentage(driver),
            }));

            const sortedData = sortStatus.columnAccessor ? sortBy(formattedData, sortStatus.columnAccessor) : formattedData;

            if (sortStatus.direction === 'desc') {
                sortedData.reverse();
            }
            setRecordsData(sortedData);
            setTotalRecords(totalDrivers);
        } catch (error) {
            console.error('Error fetching drivers:', error);
        }
    };

    useEffect(() => {
        fetchData();
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

            console.log('Transfer Response:', response.data);
            alert('Drivers transferred successfully!');
            fetchData();
        } catch (error) {
            console.error('Error during transfer:', error);
            alert('Failed to transfer drivers.');
        }
    };

    const handleDownload = async (record) => {
        setSelectedDownloadRecord(record);
        setIsDownloadModalOpen(true);
    };

    const handleDownloadImage = async () => {
        const modalContent = document.getElementById('download-modal-content');
        if (modalContent) {
            try {
                const dataUrl = await toPng(modalContent);
                const link = document.createElement('a');
                link.download = `${selectedDownloadRecord.registrationNumber}_details.png`;
                link.href = dataUrl;
                link.click();
            } catch (error) {
                console.error('Error downloading image:', error);
            }
        }
    };

    const isTransferDisabled = selectedRecords.some(
        (record) => record.profilePercentage !== '100.00' || record.documentPercentage !== '100.00'
    );

    return (
        <div>
            <div className="panel mt-6">
                <div className="flex md:items-center md:flex-row flex-col mb-5 gap-5">
                    <div className="ltr:ml-auto rtl:mr-auto">
                        <input type="text" className="form-input w-auto" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>

                    <div>
                        <button
                            type="button"
                            className="btn bg-teal-500 text-white hover:bg-teal-600 ltr:ml-4 rtl:mr-4"
                            onClick={handleTransfer}
                            disabled={isTransferDisabled}
                        >
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
                            { accessor: 'profilePercentage', title: 'Driver Profile %', sortable: true },
                            { accessor: 'documentPercentage', title: 'Driver Document %', sortable: true },
                            {
                                accessor: 'actions',
                                title: 'Actions',
                                render: (record) => (
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleDownload(record)}
                                    >
                                        Download
                                    </button>
                                ),
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
                </div>
            </div>

            {/* Download Modal */}
            {isDownloadModalOpen && selectedDownloadRecord && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 lg:w-1/3 p-6" >
                        <div className="flex justify-between items-center border-b pb-4">
                            <h2 className="text-xl font-semibold">Download Vehicle Details</h2>
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
                                    <p className="text-lg md:text-xl font-normal">Driver Details</p>
                                    <h1 className="text-xl md:text-2xl font-extrabold">Get A Ride</h1>
                                    <p className="text-sm italic">by Get Your Homes</p>
                                </div>
                                <img src={barcode} alt="Barcode" className="h-12 md:h-16 mt-2 md:mt-0" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 shadow-md rounded mb-4">
                                <div>
                                    <p className="text-sm text-gray-800"><strong>Driver ID:</strong> {selectedDownloadRecord.id}</p>
                                    <p className="text-sm text-gray-800"><strong>Driver Name:</strong> {selectedDownloadRecord.fullname}</p>
                                    <p className="text-sm text-gray-800"><strong>Registration Number:</strong> {selectedDownloadRecord.registrationNumber}</p>
                                    <p className="text-sm text-gray-800"><strong>Phone:</strong> {selectedDownloadRecord.phone}</p>
                                </div>
                                <div className="flex justify-center items-center">
                                    <p className="text-sm text-gray-800">No photo available</p>
                                </div>
                            </div>
                            {/* Footer Section */}
                            <div className="flex flex-col md:flex-row justify-around items-center">
                                <div className="text-center text-sm text-gray-800 mt-4">
                                    <p><span className="font-bold">Company - Get A Ride</span></p>
                                    <p><span className="font-bold">Parent Company - Get Your Homes</span></p>
                                    <p>Address: Mamoni Enterprise, Opposite to Kalain HS Road, Kalain, Cachar, Assam</p>
                                    <p>Approved by Founder & CEO</p>
                                </div>
                                <div>
                                    <img src={GYH} alt="Icon" className="h-12 md:h-16 mt-4 md:mt-0" />
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex flex-col md:flex-row justify-end gap-2">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                onClick={handleDownloadImage}
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
            )}
        </div>
    );
};

export default TransferVerification;