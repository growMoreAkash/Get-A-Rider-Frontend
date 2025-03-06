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
    const doc = new jsPDF();
    
    // Logo
    const imgLogo = icon1; // Update with actual path
    doc.addImage(imgLogo, 'PNG', 15, 10, 40, 15);

    // Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text('Driver-Vehicle Details', 80, 20);

    // Subtitle
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Get A Ride', 90, 28);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('by Get Your Homes', 92, 33);
    
    // Barcode (Placeholder, replace with actual barcode logic if needed)
    const barcodeImg = bar1; // Update with actual barcode image
    doc.addImage(barcodeImg, 'PNG', 160, 10, 30, 15);
    
    // Applicant Details
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Application Number: ${record.registrationNumber}`, 15, 45);
    doc.text(`Beneficiary Name: ${record.fullname}`, 15, 50);
    doc.text(`Branch: ${record.branch}`, 15, 55);
    doc.text(`Zone: ${record.zone}`, 15, 60);
    doc.text(`Centre ID: ${record.centreId}`, 15, 65);
   // doc.text(`Center Location: ${record.centerLocation}`, 15, 70);
    
    // Draw Box for Driver's Details
    doc.rect(10, 110, 190, 90); // (x, y, width, height)
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text("Driver's Details", 15, 120);

    // Inside Box
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${record.fullname}`, 15, 130);
    doc.text(`Phone: ${record.phone}`, 15, 140);
    doc.text(`WhatsApp: ${record.whatsapp}`, 15, 150);
    doc.text(`Care of: ${record.careof}`, 15, 160);
    doc.text(`Care of phone: ${record.careofPhone}`, 15, 170);
    doc.text(`Pincode: ${record.pincode}`, 15, 180);
    doc.text(`Street Address: ${record.street_address}`, 15, 190);
    
    // Footer Details
    doc.setFontSize(9);
    doc.text('Official Details', 15, doc.internal.pageSize.height - 30);
    doc.text('Get A Ride by Get Your Homes', 15, doc.internal.pageSize.height - 25);
    doc.text(`Address: ${record.address}`, 15, doc.internal.pageSize.height - 20);
    doc.text(`Phone: ${record.companyPhone}`, 15, doc.internal.pageSize.height - 15);
    doc.text(`WhatsApp: ${record.companyWhatsapp}`, 75, doc.internal.pageSize.height - 15);
    doc.text(`Email: ${record.companyEmail}`, 135, doc.internal.pageSize.height - 15);
    
    // Save the PDF
    doc.save(`driver_certificate_${record.index}.pdf`);
    
    // Update Printout Status
    try {
        const response = await fetch(`${host}/updateDriverPrintout/${record.id}`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${Cookies.get("token")}`,
            },
            body: JSON.stringify({ printout: true }),
        });
        if (!response.ok) throw new Error('Failed to update printout status');
        console.log('Printout status updated successfully');
    } catch (error) {
        console.error('Error updating printout status:', error);
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
        </div>
    );
};

export default TransferVerification;