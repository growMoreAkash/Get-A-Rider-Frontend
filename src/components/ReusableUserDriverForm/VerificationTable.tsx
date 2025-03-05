import React, { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Pagination from './Pagination';

interface Column {
    header: string;
    key: string;
    render?: (row: any) => React.ReactNode;
}

interface Action {
    icon: string;
    title: string;
    onClick: (row: any, activeTab?: string) => void;
    className?: string;
}

interface VerificationTableProps {
    columns: Column[];
    data: any[];
    actions?: Action[] | null;
    onRefresh?: () => void;
    onTrashed?: () => void;
    onViewLog?: () => void;
    activeTab?: string;
    setDataId: any;
    dataId: string[];
}

const VerificationTable: React.FC<VerificationTableProps> = ({ columns, data, actions, onRefresh, onTrashed, onViewLog, activeTab, setDataId, dataId }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const toggleDropdown = () => setIsOpen((prev) => !prev);
    const closeDropdown = () => setIsOpen(false);

    const filteredData = data.filter((row) => Object.values(row).some((value) => String(value).toLowerCase().includes(searchQuery.toLowerCase())));

    const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = 10;

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
        XLSX.writeFile(workbook, 'data.xlsx');
    };

    const exportToCSV = () => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'data.csv';
        link.click();
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text('Data Export', 20, 10);
        autoTable(doc, {
            head: [columns.map((col) => col.header)],
            body: filteredData.map((row) => columns.map((col) => row[col.key])),
            startY: 20,
        });
        doc.save('data.pdf');
    };

    const downloadOptions = [
        { label: 'Excel', onClick: exportToExcel },
        { label: 'PDF', onClick: exportToPDF },
        { label: 'CSV', onClick: exportToCSV },
    ];

    return (
        <div className="shadow-md rounded-sm">
            <div className="p-4">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                    <form className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search here"
                            className="w-full sm:w-auto pl-8 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
                        />
                    </form>

                    <div className="flex gap-3 flex-wrap">
                        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                            {onRefresh && (
                                <button className="btn hover:bg-teal-500 hover:text-white border-teal-600 text-teal-600 shadow-none px-3" onClick={onRefresh} title="Refresh">
                                    <i className="bi bi-arrow-repeat"></i>
                                </button>
                            )}
                            {onTrashed && (
                                <button
                                    className="btn hover:bg-teal-500 hover:text-white border-teal-600 text-teal-600 shadow-none px-3"
                                    onClick={() => alert('Manage Trashed Data is comming soon')}
                                    title="Manage Trashed Data"
                                >
                                    <i className="bi bi-recycle"></i>
                                </button>
                            )}
                            {onViewLog && (
                                <button
                                    className="btn  hover:bg-teal-500 hover:text-white border-teal-600 text-teal-600 shadow-none px-3"
                                    onClick={() => alert('Logs is comming soon')}
                                    title="View Log"
                                >
                                    <i className="bi bi-clock-fill"></i>
                                </button>
                            )}
                            {/* Download */}
                        </div>

                        <div className="relative w-full sm:w-auto">
                            <button onClick={toggleDropdown} className="btn hover:bg-teal-500 hover:text-white border-teal-600 text-teal-600 shadow-none flex items-center gap-1 w-full sm:w-auto">
                                <i className="bi bi-download"></i> Download <i className="bi bi-caret-down-fill"></i>
                            </button>

                            {isOpen && (
                                <ul className="absolute mt-2 bg-white border rounded shadow-md z-50 w-full sm:w-auto">
                                    {downloadOptions.map((option, index) => (
                                        <li key={index}>
                                            <button
                                                onClick={() => {
                                                    option.onClick();
                                                    closeDropdown();
                                                }}
                                                className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                                            >
                                                {option.label}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto mt-3">
                    <table className="w-full border-collapse border rounded-lg">
                        <thead className="bg-[#14b19e1a]">
                            <tr>
                                <th className="py-2 px-4 text-left text-teal-500">Select</th>
                                {columns.map((column, index) => (
                                    <th key={index} className="py-2 px-4 text-left text-teal-500">
                                        {column.header}
                                    </th>
                                ))}
                                {actions && <th className="py-2 px-4 text-center text-teal-500">Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((row, rowIndex) => (
                                <tr key={rowIndex} className="border-t">
                                    <td className="py-2 px-4">
                                        <input
                                            type="checkbox"
                                            checked={dataId.includes(row.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setDataId((prev: string[]) => [...prev, row.id]); // Add ID
                                                } else {
                                                    setDataId((prev: string[]) => prev.filter((id) => id !== row.id)); // Remove ID
                                                }
                                            }}
                                        />
                                    </td>
                                    {columns.map((column, colIndex) => (
                                        <td key={colIndex} className="py-2 px-4">
                                            {column.render ? column.render(row) : row[column.key]}
                                        </td>
                                    ))}
                                    {actions && (
                                        <td className="py-2 px-4 flex justify-center gap-2">
                                            {actions.map((action, actionIndex) => (
                                                <button key={actionIndex} onClick={() => action.onClick(row, activeTab)} className={`text-xl ${action.className}`} title={action.title}>
                                                    <i className={`bi ${action.icon}`}></i>
                                                </button>
                                            ))}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
                </div>
            </div>
        </div>
    );
};

export default VerificationTable;
