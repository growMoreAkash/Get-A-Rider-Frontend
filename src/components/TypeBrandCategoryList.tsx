import React, { useState } from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Column {
    header: string;
    key: string;
    render?: (row: any) => React.ReactNode;
}

interface Action {
    icon: string;
    title: string;
    onClick: (row: any , activeTab? : string) => void;
    className?: string;
}

interface TypeBrandCategoryListProps {
    columns: Column[];
    data: any[];
    actions?: Action[] | null;
    onRefresh?: () => void;
    onTrashed?: () => void;
    onViewLog?: () => void;
    activeTab?: string;
}

const TypeBrandCategoryList: React.FC<TypeBrandCategoryListProps> = ({ columns, data, actions, onRefresh, onTrashed, onViewLog, activeTab }) => {
    const [searchQuery, setSearchQuery] = useState('');
    // this is for dropdown list (below)
    // console.log(data);

    const [isOpen, setIsOpen] = useState(false); // Track dropdown visibility

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev); // Toggle dropdown state
    };

    const closeDropdown = () => {
        setIsOpen(false); // Close dropdown when clicking outside
    };

    // the dropdown code ends here

    // filtering logic done here
    const filteredData = data.filter((row) => Object.values(row).some((value) => String(value).toLowerCase().includes(searchQuery.toLowerCase())));

    const transformedData = filteredData.map((item, index) => ({
        ...item,
        index: index + 1,
    }));
    // console.log(transformedData);
    // export to excel
    const exportToExcel = () => {
        // //.log(data)
        const updateData = data.map((item, index) => ({
            ...item,
            _id: index + 1,
        }));
        //.log(updateData)
        const worksheet = XLSX.utils.json_to_sheet(updateData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
        XLSX.writeFile(workbook, 'data.xlsx');
    };

    // export to csv
    const exportToCSV = () => {
        const updateData = data.map((item, index) => ({
            ...item,
            _id: index + 1,
        }));
        const worksheet = XLSX.utils.json_to_sheet(updateData);
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'data.csv';
        link.click();
    };

    // export to pdf
    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text('Data Export', 20, 10);

        const tableColumn = columns.map((col) => col.header);
        const tableRows = filteredData.map((row, index) => [
            index + 1, // Replace ID with a sequential number starting from 1
            row[1], // The Type Name
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });

        doc.save('data.pdf');
    };

    const downloadOptions = [
        { label: 'Excel', onClick: exportToExcel },
        { label: 'PDF', onClick: exportToPDF },
        { label: 'CSV', onClick: exportToCSV },
    ];
    // ////.log(transformedData)

    // console.log(transformedData, 'transformed data');
    return (
        <div className="shadow-md rounded-sm">
            <div className="p-4">
                {/* Search and Actions */}
                <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                    {/* Search */}
                    {/* {onSearch && (form)}   this is what is initally , but removed it just to render */}
                    {
                        <form
                            className="flex flex-wrap items-center gap-2 w-full sm:w-auto"
                            onSubmit={(e) => {
                                e.preventDefault();
                                // onSearch(searchQuery);
                            }}
                        >
                            <div className="relative w-full sm:w-auto">
                                <span className="absolute inset-y-0 left-2 flex items-center text-gray-500">
                                    <i className="bi bi-search"></i>
                                </span>
                                <input
                                    type="search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search here"
                                    className="w-full sm:w-auto pl-8 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-600"
                                />
                            </div>
                            <button type="submit" className="bg-teal-500 text-white px-4 py-2 rounded-md w-full sm:w-auto">
                                Search
                            </button>
                        </form>
                    }

                    {/* Action Buttons */}
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
                            <button className="btn  hover:bg-teal-500 hover:text-white border-teal-600 text-teal-600 shadow-none px-3" onClick={() => alert('Logs is comming soon')} title="View Log">
                                <i className="bi bi-clock-fill"></i>
                            </button>
                        )}
                        {/* Download */}

                        <div className="relative w-full sm:w-auto">
                            <button onClick={toggleDropdown} className="btn hover:bg-teal-500 hover:text-white border-teal-600 text-teal-600 shadow-none flex items-center gap-1 w-full sm:w-auto">
                                <i className="bi bi-download"></i> Download <i className="bi bi-caret-down-fill"></i>
                            </button>

                            {isOpen && ( // Show dropdown only when isOpen is true
                                <ul
                                    className="absolute mt-2 bg-white border rounded shadow-md z-50 w-full sm:w-auto"
                                    onMouseLeave={closeDropdown} // Close dropdown on mouse leave (optional)
                                >
                                    {downloadOptions.map((option, index) => (
                                        <li key={index}>
                                            <button
                                                onClick={() => {
                                                    option.onClick();
                                                    closeDropdown(); // Close dropdown after clicking an option
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

                {/* Table */}
                <div className="overflow-x-auto mt-3">
                    <table className="w-full border-collapse border rounded-lg">
                        <thead className="bg-[#14b19e1a]">
                            <tr>
                                {columns.map((column, index) => (
                                    <th key={index} className="py-2 px-4 text-left text-teal-500">
                                        {column.header}
                                    </th>
                                ))}
                                {actions && <th className="py-2 px-4 text-center text-teal-500">Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {transformedData.map((row, rowIndex) => (
                                <tr key={rowIndex} className="border-t">
                                    {columns.map((column, colIndex) => (
                                        <td key={colIndex} className="py-2 px-4">
                                            {column.render ? column.render(row) : row[column.key]}
                                        </td>
                                    ))}
                                    {/* Row Actions */}
                                    {actions && (
                                        <td className="py-2 px-4 flex justify-center gap-2">
                                            {actions.map((action, actionIndex) => (
                                                <button
                                                    key={actionIndex}
                                                    onClick={() => {
                                                        action.onClick( row , activeTab);
                                                    }}
                                                    className={`text-xl ${action.className}`}
                                                    title={action.title}
                                                >
                                                    <i className={`bi ${action.icon}`}></i>
                                                </button>
                                            ))}
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TypeBrandCategoryList;
