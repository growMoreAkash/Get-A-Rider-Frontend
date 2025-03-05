import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import { downloadExcel } from 'react-export-table-to-excel';
import IconFile from '../components/Icon/IconFile';
import IconPrinter from '../components/Icon/IconPrinter';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { host } from '../secret';
import Cookies from 'js-cookie';



interface TypeCardProps {
    dataArr: any[];
    handleTypeFormSubmit: () => void;
}

const TypeCard: React.FC<TypeCardProps> = ({ dataArr = [], handleTypeFormSubmit }) => {
    const host = "https://api.getarider.in/api"
    const [recordsData, setRecordsData] = useState(dataArr);
    const [search, setSearch] = useState('');
    const [editingItem, setEditingItem] = useState<any | null>(null);
    const [updatedName, setUpdatedName] = useState('');

    const apiUrl = import.meta.env.VITE_API_URL;

    // Normalize data on load or data change
    useEffect(() => {
        const normalizedData = dataArr.map((item: any) => ({
            id: item.id || item._id,
            name: item.name,
        }));

        setRecordsData(() =>
            normalizedData.filter(
                (item: any) =>
                    item.name.toLowerCase().includes(search.toLowerCase()) ||
                    item.id.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, dataArr]);

    const header = ['Id', 'Name', 'Actions'];

    // Download Excel
    const handleDownloadExcel = () => {
        downloadExcel({
            fileName: 'type-data',
            sheet: 'data',
            tablePayload: {
                header,
               body: recordsData,
            }
        });
    };

    // Edit Handler
    const handleEdit = (item: any) => {
        setEditingItem(item);
        setUpdatedName(item.name); // Pre-fill the input with the selected type name
    };

    // Save Handler (Update API Call)
    const handleSave = async () => {
        try {
            await axios.put(`${host}/updateType/${editingItem.id}`, {
                name: updatedName,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get("token")}`
                }
            });
            alert('Type updated successfully');
            setEditingItem(null);
            setUpdatedName('');
            handleTypeFormSubmit(); // Refresh data after update
        } catch (error) {
            //.error('Error updating type:', error);
            alert('Failed to update type');
        }
    };

    // Delete Handler
    const handleDelete = async (id: string) => {
        const confirmDelete = confirm('Are you sure you want to delete this type?');
        if (confirmDelete) {
            try {
                await axios.put(`${host}/deleteType/${id}`, {}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Cookies.get("token")}`
                    }
                });
                alert('Type deleted successfully');
                handleTypeFormSubmit(); // Refresh data after delete
            } catch (error) {
                //.error('Error deleting type:', error);
                alert('Failed to delete type');
            }
        }
    };

    return (
        <div>
            <div className="panel mt-6 w-full">
                {/* Header Controls */}
                <div className="flex md:items-center justify-between md:flex-row flex-col mb-4.5 gap-5">
                    <div className="flex items-center flex-wrap">
                        <button type="button" onClick={handleDownloadExcel} className="btn btn-primary btn-sm m-1">
                            <IconFile className="w-5 h-5 ltr:mr-2 rtl:ml-2" />
                            EXCEL
                        </button>
                        <button type="button" onClick={() => window.print()} className="btn btn-primary btn-sm m-1">
                            <IconPrinter className="ltr:mr-2 rtl:ml-2" />
                            PRINT
                        </button>
                    </div>
                    <input
                        type="text"
                        className="form-input w-auto"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Data Table */}
                <div className="datatables">
                    <DataTable
                        highlightOnHover
                        className="whitespace-nowrap table-hover"
                        records={recordsData}
                        columns={[
                            { accessor: 'id', title: 'ID' },
                            { accessor: 'name', title: 'Name' },
                            {
                                accessor: 'actions',
                                title: 'Actions',
                                render: (item: any) => (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                ),
                            },
                        ]}
                        minHeight={200}
                    />
                </div>
            </div>

            {/* Edit Form */}
            {editingItem && (
                <div className="modal bg-white p-6 rounded-lg shadow-lg mt-6">
                    <h2 className="text-xl font-bold mb-4">Edit Type</h2>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="mb-4">
                            <label htmlFor="typeName" className="block text-md font-semibold mb-2">
                                Type Name
                            </label>
                            <input
                                id="typeName"
                                type="text"
                                value={updatedName}
                                onChange={(e) => setUpdatedName(e.target.value)}
                                className="form-input w-full"
                            />
                        </div>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={() => setEditingItem(null)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={handleSave}
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default TypeCard;
