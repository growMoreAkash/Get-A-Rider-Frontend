import React, { useState } from 'react';
import useGetAllDrivers from '../hooks/useGetAllDrivers';
import VerificationTable from '../components/ReusableUserDriverForm/VerificationTable';
import useProcessingSectionVerify from '../hooks/useProcessingSectionVerify';
import UpdateVehicleVerification from '../components/UpdateVehicleVerification';

const DriverVerification = () => {
    const [index, setIndex] = useState(0);
    const { drivers, getAllDrivers } = useGetAllDrivers(index);
    const [dataId, setDataId] = useState([]);
    const { verifyDriverIds } = useProcessingSectionVerify();
    const [edit, setEdit] = useState(false);
    const [vehicleEditData, setVehicleEditData] = useState();

    // Define columns for the driver table
    const columns = [
        {
            header: 'Full Name',
            key: 'fullname',
        },
        {
            header: 'Phone',
            key: 'phone',
        },
        {
            header: 'Registration Number',
            key: 'registrationNumber',
        },
    ];

    // Example actions (optional) - customize as needed
    const actions = [
        {
            icon: 'bi-pencil',
            title: 'Edit',
            className: 'text-teal-400 border-none',
            onClick: (row: any) => {
                setVehicleEditData(row);
                setEdit(true);
            },
        },
        {
            icon: 'bi-trash',
            title: 'Delete',
            className: 'text-red-400 border-none',
            onClick: (row: any) => alert(`Delete driver: ${row.fullName}`),
        },
    ];

    const onDriverRefresh = async () => {
        await getAllDrivers(index);
    };
    const onDriverTrashed = () => {};
    const onDriverLog = () => {};

    const handleVerify = () => {
        verifyDriverIds(dataId);
    };

    return (
        <div>
            {edit ? (
                <>
                    <UpdateVehicleVerification vehicleEditData={vehicleEditData} setEdit={setEdit} />
                </>
            ) : (
                <>
                    <div>
                        <div className="flex items-center mb-4 justify-between p-4">
                            <h1 className="text-xl font-bold mb-4">Driver Verification</h1>
                            <button className="btn hover:bg-teal-500 hover:text-white border-teal-600 text-teal-600 shadow-none" onClick={handleVerify}>
                                Verify{' '}
                            </button>
                        </div>
                        <VerificationTable
                            columns={columns}
                            data={drivers || []}
                            dataId={dataId}
                            setDataId={setDataId}
                            actions={actions}
                            onRefresh={onDriverRefresh}
                            onTrashed={onDriverTrashed}
                            onViewLog={onDriverLog}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default DriverVerification;
