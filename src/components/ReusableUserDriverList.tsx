import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { downloadExcel } from 'react-export-table-to-excel';
import { DataTable } from 'mantine-datatable';

interface ReusableUserDriverListProps {
    title: string;
    data: any[];
    fields: string[];
    onEdit?: (item: any) => void;
    onDelete?: (id: string) => void;
}

const ReusableUserDriverList: React.FC<ReusableUserDriverListProps> = ({ title, data, fields, onEdit, onDelete }) => {
    const [filteredData, setFilteredData] = useState(data);
    const [search, setSearch] = useState('');

    useEffect(() => {
        setFilteredData(
            data.filter((item) =>
                fields.some((field) =>
                    String(item[field] || '')
                        .toLowerCase()
                        .includes(search.toLowerCase())
                )
            )
        );
    }, [search, data, fields]);

    // //////.log(filteredData,"inside reusableuserdriverList")

    const handleDownloadExcel = () => {
        downloadExcel({
            fileName: `${title.replace(/\s+/g, '_')}-data`,
            sheet: 'data',
            tablePayload: {
                header: fields,
                body: filteredData,
            },
        });
    };

    return (
        <div className="panel mt-6 w-full p-4 bg-white shadow-md rounded-md">
            {/* Header Section */}
            <div className="flex md:items-center justify-between md:flex-row flex-col mb-4 gap-5">
                <h2 className="text-xl font-semibold">{title}</h2>
                {/* <div className="flex items-center gap-2">
                    <button type="button" onClick={handleDownloadExcel} className="btn btn-primary btn-sm">
                        EXCEL
                    </button>
                    <button type="button" onClick={() => window.print()} className="btn btn-primary btn-sm">
                        PRINT
                    </button>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="form-input w-auto"
                    />
                </div> */}
            </div>

            {/* Data Table */}
            <div className="datatables">
                <DataTable
                    highlightOnHover
                    className="whitespace-nowrap table-hover"
                    records={filteredData}
                    columns={[
                        ...fields.map((field) => ({
                            accessor: field,
                            title: field.charAt(0).toUpperCase() + field.slice(1),
                        })),
                        // {
                        //     accessor: 'actions',
                        //     title: 'Actions',
                        //     render: (item: any) => (
                        //         <div className="flex gap-2">
                        //             {onView && (
                        //                 <button onClick={() => onView(item)} className="text-green-500 hover:text-green-700">
                        //                     <FaEye />
                        //                 </button>
                        //             )}
                        //             {onEdit && (
                        //                 <button onClick={() => onEdit(item)} className="text-blue-500 hover:text-blue-700">
                        //                     <FaEdit />
                        //                 </button>
                        //             )}
                        //             {onDelete && (
                        //                 <button onClick={() => onDelete(item.id)} className="text-red-500 hover:text-red-700">
                        //                     <FaTrash />
                        //                 </button>
                        //             )}
                        //         </div>
                        //     ),
                        // },
                    ]}
                    minHeight={200}
                />
            </div>
        </div>
    );
};

export default ReusableUserDriverList;
