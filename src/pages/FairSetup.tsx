import { DataTable } from 'mantine-datatable';
import { useState } from 'react';

function ReusableForm({ label, value, onChange }: any) {
    return (
        <div className="flex flex-col">
            <label className="text-base">{label}</label>
            <input type="text" placeholder={`Enter ${label}`} className="form-input mt-0.5" value={value} onChange={(e) => onChange(e.target.value)} />
        </div>
    );
}

const labels = ['Base Fare', 'Fare (Per km)', 'Cancellation Fee (%)', 'Minimum Cancellation Fee ($)', 'Idle Fee (Per min)', 'Trip Delay Fee (Per min)'];

const initialData = [
    { key: 'Base Fare ($)', defaultPrice: 60, finalPrice: 60 },
    { key: 'Fare Per Km ($)', defaultPrice: 8, finalPrice: 8 },
    { key: 'Cancellation Fee (%)', defaultPrice: 9, finalPrice: 9 },
    { key: 'Minimum Cancellation Fee ($)', defaultPrice: 88, finalPrice: 88 },
    { key: 'Idle Fee ($)', defaultPrice: 88, finalPrice: 88 },
    { key: 'Trip Delay Fee (Per min)', defaultPrice: 9, finalPrice: 9 },
];

const FairSetup = () => {
    const [tableData, setTableData] = useState(initialData);

    const handleInputChange = (index: number, field: string, value: string | number) => {
        setTableData((prevState) => {
            const updatedData: any = [...prevState];
            updatedData[index][field] = value;
            return updatedData;
        });
    };

    return (
        <div className="panel">
            <h1 className="text-blue-700 text-2xl font-bold">Fare default price</h1>
            <div className="mt-5">
                <h2 className="font-bold text-base">Available vehicle categories in this zone</h2>
                <div className="mt-3 flex gap-5 items-center">
                    <label className="inline-flex items-center">
                        <input type="checkbox" className="form-checkbox" checked />
                        <span className="text-md">Kalian-Tuktuk</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input type="checkbox" className="form-checkbox" />
                        <span className="text-base">Kalian-Auto</span>
                    </label>
                </div>
                <h2 className="font-bold text-base mt-4">Available vehicle categories in this zone</h2>
                <div className="mt-2 flex gap-5 items-center">
                    <label className="inline-flex items-center">
                        <input type="checkbox" className="form-checkbox rounded-full" checked />
                        <span className="text-base">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input type="checkbox" className="form-checkbox rounded-full" />
                        <span className="text-base">No</span>
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-3 mt-4 gap-3">
                {tableData.map((item, index) => (
                    <ReusableForm key={item.key} label={item.key} value={item.defaultPrice} onChange={(value: any) => handleInputChange(index, 'defaultPrice', value)} />
                ))}
            </div>

            <div className="mt-10 border p-6">
                <DataTable
                    records={tableData}
                    columns={[
                        {
                            accessor: 'key',
                            title: 'Fare',
                            width: 300,
                            render: (record) => <span className="text-base font-medium">{record.key}</span>,
                        },
                        {
                            accessor: 'defaultPrice',
                            title: 'Default Price',
                            render: (record, index) => (
                                <input
                                    value={record.defaultPrice}
                                    onChange={(e) => handleInputChange(index, 'defaultPrice', e.target.value)}
                                    className="w-full text-base p-1 border  rounded-md bg-gray-100"
                                    disabled
                                />
                            ),
                        },
                        {
                            accessor: 'finalPrice',
                            title: 'Kalain - tuktuk',
                            render: (record, index) => (
                                <input
                                    value={record.defaultPrice}
                                    onChange={(e) => handleInputChange(index, 'finalPrice', e.target.value)}
                                    className="w-full text-base p-1 border  rounded-md bg-gray-100"
                                    disabled
                                />
                            ),
                        },
                    ]}
                    highlightOnHover
                    minHeight={200}
                />
            </div>

            <div className="mt-3 relative">
                <button type="submit" className="btn btn-primary absolute right-0">
                    Submit
                </button>
            </div>
        </div>
    );
};

export default FairSetup;
