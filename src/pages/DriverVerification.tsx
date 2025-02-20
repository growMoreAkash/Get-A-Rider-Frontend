import React from 'react';
import { useState, Fragment, useEffect } from 'react';
import sortBy from 'lodash/sortBy';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import IconBell from '../components/Icon/IconBell';
import IconPencil from '../components/Icon/IconPencil';
import IconTrashLines from '../components/Icon/IconTrashLines';
import Tippy from '@tippyjs/react';
import { Dialog, Transition } from '@headlessui/react';

import { getAllDrivers, getDriverById, verifyDriverAndOwnerFields, changeProcessingStatus, deleteDriver } from '../service/api';
import { useDriver } from '../context/DriverContext';

const ReusableInput = ({ label, id, type = 'text', placeholder, value, onChange, showVerifyButtons, onClick, verificationStatus }: any) => {
    return (
        <div>
            <label htmlFor={id}>{label}</label>
            <div className="flex items-center gap-2">
                <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className={`form-input ${type === 'email' ? 'ltr:rounded-l-none rtl:rounded-r-none' : ''} flex-grow`}
                    required
                />
                {showVerifyButtons && (
                    <button type="button" className="text-green-500 hover:text-green-700" onClick={onClick}>
                        ✔️
                    </button>
                )}
                {verificationStatus && <span className="text-green-500">verified</span>}
            </div>
        </div>
    );
};

const DriverVerification = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [initialRecords, setInitialRecords] = useState();
    const [recordsData, setRecordsData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [selectedRecords, setSelectedRecords] = useState<any>([]);
    const [selectedUserIds, setSelectedUserIds] = useState<any>([]);
    const [filteredData, setFilteredData] = useState([]);

    const {getAllDrivers} = useDriver()

    const handleSelectedRecordsChange = (newSelectedRecords: any[]) => {
        setSelectedRecords(newSelectedRecords);
        // Extract user IDs from selected records and update the array
        const userIds = newSelectedRecords.map((record) => record.id);
        setSelectedUserIds(userIds);
        //////.log(selectedUserIds);
    };

    const [search, setSearch] = useState('');
    const searchByRegistration = async () => {
        try {
            const response = await getAllDrivers({
                registrationNumber: search,
            });
            const drivers = response?.drivers || [];
            // Map the drivers data to match the table requirements
            const formattedData = drivers.map((driver: any) => ({
                id: driver._id,
                registrationNumber: driver.registrationNumber || 'N/A',
                fullname: driver.fullname?.data || 'Akash',
                profile: driver, // Pass the full driver object for actions like Edit
                verify: driver, // Pass the full driver object for actions like Verify
                delete: driver, // Pass the full driver object for actions like Delete
            }));

            setFilteredData(formattedData);

            //////.log('pages :: DriverVerification :: searchByRegistration :: response', response.data);
            alert("Successfull")
        } catch (error) {
            //////.log('pages :: DriverVerification :: searchByRegistration :: error', error);
        }
    };
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'id',
        direction: 'asc',
    });

    // profile modal
    const [profileModal, setProfileModal] = useState(false);
    const [showVerifyButtons, setShowVerifyButtons] = useState(false);
    const handleProfileModalClose = () => {
        setProfileModal(false);
        setShowVerifyButtons(false); // reset the verify buttons state
    };

    const [user, setUser] = useState({});
    // final verification modal - (when 90% of the driver attribute is verified then only this modal will open)
    const [finalSubmitModel, setFinalSubmitModel] = useState(false);
    const [finalVerificationDriverId, setFinalVerificationDriverId] = useState<any>([]);
    // delete modal
    const [showDeleteModel, setShowDeleteModel] = useState(false);

    const handleStartVerify = () => {
        setShowVerifyButtons(true);
    };

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    useEffect(() => {
        const from = (page - 1) * pageSize;
        const to = from + pageSize;
        // setRecordsData([...initialRecords.slice(from, to)]);
    }, [page, pageSize]);

    //     setInitialRecords(() => {
    //         return rowData.filter((item) => {
    //             return (
    //                 item.id.toString().includes(search.toLowerCase()) ||
    //                 item.firstName.toLowerCase().includes(search.toLowerCase()) ||
    //                 item.lastName.toLowerCase().includes(search.toLowerCase()) ||
    //                 item.email.toLowerCase().includes(search.toLowerCase()) ||
    //                 item.phone.toLowerCase().includes(search.toLowerCase())
    //             );
    //         });
    //     });
    // }, [search]);

    // useEffect(() => {
    //     const data = sortBy(initialRecords, sortStatus.columnAccessor);
    //     setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
    // }, [sortStatus]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await getAllDrivers();
                const drivers = response?.drivers || [];

                // Map the drivers data to match the table requirements
                const formattedData = drivers.map((driver: any) => ({
                    id: driver._id,
                    registrationNumber: driver.registrationNumber || 'N/A',
                    fullname: driver.fullname?.data || 'Akash',
                    profile: driver, // Pass the full driver object for actions like Edit
                    verify: driver, // Pass the full driver object for actions like Verify
                    delete: driver, // Pass the full driver object for actions like Delete
                }));

                setRecordsData(formattedData);
                alert("Successfull")
            } catch (error) {
                //////.log('pages :: DriverVerification :: useEffect :: fetchData :: error', error);
                alert("Error")
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const profileButtonClickHandler = async (driverId: any) => {
        try {
            setLoading(true);
            const response = await getDriverById(driverId);

            setUser(response);
            setProfileModal(true);
            alert('Successfull');
        } catch (error) {
            //////.log('pages :: DriverVerification :: profileButtonClickHandler :: error', error);
            alert('Error');
        } finally {
            setLoading(false);
        }
    };
    const [verifiedFields, setVerifiedFields] = useState<any>({
        driverId: '', // Assuming driverData has the _id field
        driver: [],
        owner: [],
    });
    const profileVerificationSaveChangesHandler = async (data: any) => {
        try {
            const response = await verifyDriverAndOwnerFields(data);

            // //////.log("pages :: DriverVerification :: profileVerificationSaveChangesHandler :: response", response);
            alert('Successfull');
        } catch (error) {
            //////.log('pages :: DriverVerification :: profileVerificationSaveChangesHandler :: error', error);
            alert('Error');
        }
    };
    const cancelButtonClickHandler = () => {
        setProfileModal(false);
        setVerifiedFields({
            driverId: '',
            driver: [],
            owner: [],
        });
        setShowVerifyButtons(false);
    };

    const changeProcessingStatusToReturn = async (processingSection: any) => {
        try {
            const response = await changeProcessingStatus(selectedUserIds, processingSection);

            //////.log('pages :: DriverVerification :: changeProcessingStatusToReturn :: response', response);
            alert('Successfull');
        } catch (error) {
            //////.log('pages :: DriverVerification :: changeProcessingStatusToReturn :: error', error);
            alert('Error');
        }
    };

    const [deleteUserId, setDeleteUserId] = useState<string>('');
    const deleteDriverHandler = async (driverId: any) => {
        try {
            const response = await deleteDriver(deleteUserId);

            //////.log('pages :: DriverVerification :: deleteButtonHandler :: response', response);
            alert('Successfull');
        } catch (error) {
            //////.log('pages :: DriverVerification :: deleteButtonHandler :: error', error);
            alert('Error');
        }
    };

    // open up the final verification model and set the driver id to
    const finalVerificationModelHandler = (userId: any) => {
        //////.log('pages :: DriverVerification :: finalVerificationModelHandler :: userId', userId);
        setFinalSubmitModel(true);
        setFinalVerificationDriverId((prev: any) => [...prev, userId]);
    };
    const finalVerificationDriverHandler = async (processingSection: any) => {
        try {
            const response = await changeProcessingStatus(finalVerificationDriverId, processingSection);

            //////.log('pages :: DriverVerification :: finalVerificationDriverHandler :: response', response);
            alert('Successful');
        } catch (error) {
            //////.log('pages :: DriverVerification :: finalVerificationDriverHandler :: error', error);
            alert('Error');
        }
    };

    return (
        <div>
            <div className="panel mt-6">
                <div className="flex md:items-center md:flex-row flex-col justify-between items-center mb-5 gap-5">
                    <h5 className="font-semibold text-lg dark:text-white-light">Drivers Data</h5>

                    <div>
                        <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={() => changeProcessingStatusToReturn('RETURN')}>
                            Return
                        </button>
                    </div>
                </div>
                <div className="datatables">
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <DataTable
                            className="whitespace-nowrap table-hover"
                            records={recordsData} // conatins the data to display in the table
                            columns={[
                                { accessor: 'registrationNumber', title: 'Regn No.' },
                                { accessor: 'fullname', title: 'Name' },
                                {
                                    accessor: 'profile',
                                    title: 'Profile',
                                    titleClassName: '!text-center',
                                    render: (user) => (
                                        <div className="flex items-center w-max mx-auto gap-2">
                                            {selectedRecords.some((record: any) => record.id === user.id) && (
                                                <Tippy content="Edit">
                                                    <button type="button" onClick={() => profileButtonClickHandler(user.id)}>
                                                        <IconPencil />
                                                    </button>
                                                </Tippy>
                                            )}
                                        </div>
                                    ),
                                },
                                {
                                    accessor: 'verify',
                                    title: 'Verify',
                                    titleClassName: '!text-center',
                                    render: (user) => {
                                        const attributesToCheck = [
                                            user.profile.phone?.verified,
                                            user.profile.fullname?.verified,
                                            // user.profile.driverPhoto?.verified,
                                            // user.profile.whatsapp?.verified,
                                            user.profile.permanentAddress?.verified,
                                            user.profile.pincode?.verified,
                                            user.profile.careof?.verified,
                                            user.profile.careofPhone?.verified,
                                        ];

                                        // Calculate the percentage of verified attributes
                                        const verifiedCount = attributesToCheck.filter(Boolean).length;
                                        const totalAttributes = attributesToCheck.length;
                                        const verificationPercentage = (verifiedCount / totalAttributes) * 100;
                                        return (
                                            <div className="flex items-center w-max mx-auto gap-2">
                                                {verificationPercentage >= 80 && (
                                                    <Tippy content="Verify Driver">
                                                        <button type="button" onClick={() => finalVerificationModelHandler(user.id)}>
                                                            <IconPencil />
                                                        </button>
                                                    </Tippy>
                                                )}
                                            </div>
                                        );
                                    },
                                },
                                {
                                    accessor: 'delete',
                                    title: 'Delete',
                                    titleClassName: '!text-center',
                                    render: (user) => (
                                        <div className="flex items-center w-max mx-auto gap-2">
                                            <Tippy content="">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setDeleteUserId(user.id);
                                                        setShowDeleteModel(true);
                                                    }}
                                                >
                                                    <IconTrashLines />
                                                </button>
                                            </Tippy>
                                        </div>
                                    ),
                                },
                            ]}
                            highlightOnHover
                            totalRecords={recordsData.length}
                            recordsPerPage={pageSize}
                            page={page}
                            onPageChange={(p) => setPage(p)}
                            recordsPerPageOptions={[10]}
                            onRecordsPerPageChange={setPageSize}
                            sortStatus={sortStatus}
                            onSortStatusChange={setSortStatus}
                            selectedRecords={selectedRecords}
                            onSelectedRecordsChange={handleSelectedRecordsChange}
                            minHeight={200}
                            paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                        />
                    )}
                </div>

                <hr />
                <div className="flex flex-wrap justify-between items-center">
                    <div className="ltr:ml-auto rtl:mr-auto flex flex-row gap-5 justify-center items-center m-5">
                        <input type="text" className="form-input w-auto" placeholder="Search by registration" value={search} onChange={(e) => setSearch(e.target.value)} />
                        <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={searchByRegistration}>
                            search
                        </button>
                    </div>
                    <div className="ltr:ml-auto rtl:mr-auto flex flex-row gap-5 justify-center items-center m-5">
                        <input type="text" className="form-input w-auto" placeholder="Search by name" />
                        {/* <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={searchByRegistration}>
                            search
                        </button> */}
                    </div>
                </div>
                <p className="font-medium text-lg mb-[8px]">Search result appear here</p>
                {filteredData && (
                    <DataTable
                        className="whitespace-nowrap table-hover"
                        records={filteredData} // Use filtered data here
                        columns={[
                            { accessor: 'registrationNumber', title: 'Regn No.' },
                            { accessor: 'fullname', title: 'Name' },
                            {
                                accessor: 'profile',
                                title: 'Profile',
                                titleClassName: '!text-center',
                                render: (user) => (
                                    <div className="flex items-center w-max mx-auto gap-2">
                                        {selectedRecords.some((record: any) => record.id === user.id) && (
                                            <Tippy content="Edit">
                                                <button type="button" onClick={() => profileButtonClickHandler(user.id)}>
                                                    <IconPencil />
                                                </button>
                                            </Tippy>
                                        )}
                                    </div>
                                ),
                            },
                            {
                                accessor: 'verify',
                                title: 'Verify',
                                titleClassName: '!text-center',
                                render: (user) => {
                                    const attributesToCheck = [
                                        user.profile.phone?.verified,
                                        user.profile.fullname?.verified,
                                        // user.profile.driverPhoto?.verified,
                                        // user.profile.whatsapp?.verified,
                                        user.profile.permanentAddress?.verified,
                                        user.profile.pincode?.verified,
                                        user.profile.careof?.verified,
                                        user.profile.careofPhone?.verified,
                                    ];

                                    // Calculate the percentage of verified attributes
                                    const verifiedCount = attributesToCheck.filter(Boolean).length;
                                    const totalAttributes = attributesToCheck.length;
                                    const verificationPercentage = (verifiedCount / totalAttributes) * 100;
                                    return (
                                        <div className="flex items-center w-max mx-auto gap-2">
                                            {verificationPercentage >= 80 && (
                                                <Tippy content="Verify Driver">
                                                    <button type="button" onClick={() => finalVerificationModelHandler(user.id)}>
                                                        <IconPencil />
                                                    </button>
                                                </Tippy>
                                            )}
                                        </div>
                                    );
                                },
                            },
                            {
                                accessor: 'delete',
                                title: 'Delete',
                                titleClassName: '!text-center',
                                render: (user) => (
                                    <div className="flex items-center w-max mx-auto gap-2">
                                        <Tippy content="">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setDeleteUserId(user.id);
                                                    setShowDeleteModel(true);
                                                }}
                                            >
                                                <IconTrashLines />
                                            </button>
                                        </Tippy>
                                    </div>
                                ),
                            },
                        ]}
                        highlightOnHover
                        totalRecords={filteredData.length} // Update totalRecords to match filteredData
                        recordsPerPage={pageSize}
                        page={page}
                        onPageChange={(p) => setPage(p)}
                        recordsPerPageOptions={[]}
                        onRecordsPerPageChange={setPageSize}
                        sortStatus={sortStatus}
                        onSortStatusChange={setSortStatus}
                        selectedRecords={selectedRecords}
                        onSelectedRecordsChange={handleSelectedRecordsChange}
                        minHeight={200}
                        paginationText={({ from, to, totalRecords }) => ` Showing ${from} to ${to} of ${totalRecords} entries`}
                    />
                )}
            </div>

            {/* profile verification modal */}
            <Transition appear show={profileModal} as={Fragment}>
                <Dialog as="div" open={profileModal} onClose={handleProfileModalClose}>
                    <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                        <div className="flex items-start justify-center min-h-screen px-4">
                            <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden my-8 w-full max-w-4xl text-black dark:text-white-dark">
                                <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                    <div className="flex items-center gap-4">
                                        <div className="text-lg font-bold">Edit Record</div>
                                        <button type="button" className="btn btn-dark" onClick={handleStartVerify}>
                                            Start Verify
                                        </button>
                                    </div>
                                    <button type="button" className="text-white-dark hover:text-dark" onClick={handleProfileModalClose}>
                                        ✕
                                    </button>
                                </div>
                                <div className="p-5 space-y-4">
                                    <form>
                                        {/* Driver Details */}
                                        <h2 className="text-lg font-bold mb-4">Driver Details</h2>
                                        <button
                                            type="button"
                                            className="btn btn-dark"
                                            onClick={() => {
                                                setVerifiedFields((prev: any) => ({
                                                    ...prev,
                                                    driverId: (user as any)._id,
                                                }));
                                            }}
                                        >
                                            Add driver Id
                                        </button>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <ReusableInput
                                                label="Phone"
                                                id="driver-phone"
                                                value={(user as any).phone?.data || ''}
                                                onChange={(e: any) => setUser((prev: any) => ({ ...prev, phone: { ...prev.phone, data: e.target.value } }))}
                                                placeholder="Enter phone number"
                                                showVerifyButtons={showVerifyButtons}
                                                onClick={() => {
                                                    setVerifiedFields((prev: any) => ({
                                                        ...prev,
                                                        driver: [...prev.driver, 'phone'],
                                                        // driverId: (user as any)._id
                                                    }));
                                                }}
                                                verificationStatus={(user as any).phone?.verified}
                                            />
                                            <ReusableInput
                                                label="Full Name"
                                                id="driver-fullname"
                                                value={(user as any).fullname?.data || ''}
                                                onChange={(e: any) => setUser((prev: any) => ({ ...prev, fullname: { ...prev.fullname, data: e.target.value } }))}
                                                placeholder="Enter full name"
                                                showVerifyButtons={showVerifyButtons}
                                                onClick={() => {
                                                    setVerifiedFields((prev: any) => ({
                                                        ...prev,
                                                        driver: [...prev.driver, 'fullname'],
                                                    }));
                                                }}
                                                verificationStatus={(user as any).fullname?.verified}
                                            />
                                            <ReusableInput
                                                label="Permanent Address"
                                                id="driver-address"
                                                value={(user as any).permanentAddress?.data || ''}
                                                onChange={(e: any) => setUser((prev: any) => ({ ...prev, permanentAddress: { ...prev.permanentAddress, data: e.target.value } }))}
                                                placeholder="Enter address"
                                                showVerifyButtons={showVerifyButtons}
                                                onClick={() => {
                                                    setVerifiedFields((prev: any) => ({
                                                        ...prev,
                                                        driver: [...prev.driver, 'permanentAddress'],
                                                    }));
                                                }}
                                                verificationStatus={(user as any).permanentAddress?.verified}
                                            />
                                            <ReusableInput
                                                label="Pincode"
                                                id="driver-pincode"
                                                value={(user as any).pincode?.data || ''}
                                                onChange={(e: any) => setUser((prev: any) => ({ ...prev, pincode: { ...prev.pincode, data: e.target.value } }))}
                                                placeholder="Enter pincode"
                                                showVerifyButtons={showVerifyButtons}
                                                onClick={() => {
                                                    setVerifiedFields((prev: any) => ({
                                                        ...prev,
                                                        driver: [...prev.driver, 'pincode'],
                                                    }));
                                                }}
                                                verificationStatus={(user as any).pincode?.verified}
                                            />
                                            <ReusableInput
                                                label="Care Of"
                                                id="driver-careof"
                                                value={(user as any).careof?.data || ''}
                                                onChange={(e: any) => setUser((prev: any) => ({ ...prev, careof: { ...prev.careof, data: e.target.value } }))}
                                                placeholder="Enter care of"
                                                showVerifyButtons={showVerifyButtons}
                                                onClick={() => {
                                                    setVerifiedFields((prev: any) => ({
                                                        ...prev,
                                                        driver: [...prev.driver, 'careof'],
                                                    }));
                                                }}
                                                verificationStatus={(user as any).careof?.verified}
                                            />
                                            <ReusableInput
                                                label="Care Of Phone"
                                                id="driver-careof-phone"
                                                value={(user as any).careofPhone?.data || ''}
                                                onChange={(e: any) => setUser((prev: any) => ({ ...prev, careofPhone: { ...prev.careofPhone, data: e.target.value } }))}
                                                placeholder="Enter care of phone"
                                                showVerifyButtons={showVerifyButtons}
                                                onClick={() => {
                                                    setVerifiedFields((prev: any) => ({
                                                        ...prev,
                                                        driver: [...prev.driver, 'careofPhone'],
                                                    }));
                                                }}
                                                verificationStatus={(user as any).careofPhone?.verified}
                                            />
                                        </div>

                                        {/* Owners Details */}
                                        {(user as any).owners?.length > 0 && (
                                            <>
                                                <h2 className="text-lg font-bold mt-6 mb-4">Owners Details</h2>
                                                {(user as any).owners.map((owner: any, index: number) => (
                                                    <div key={owner._id || index} className="mb-6">
                                                        <h3 className="font-bold mb-2">Owner {index + 1}</h3>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            <ReusableInput
                                                                label="Owner Name"
                                                                id={`owner-name-${index}`}
                                                                value={owner.ownerName?.data || ''}
                                                                onChange={(e: any) =>
                                                                    setUser((prev) => {
                                                                        const updatedOwners = [...(prev as any).owners];
                                                                        updatedOwners[index].ownerName.data = e.target.value;
                                                                        return { ...prev, owners: updatedOwners };
                                                                    })
                                                                }
                                                                placeholder="Enter owner name"
                                                                showVerifyButtons={showVerifyButtons}
                                                            />
                                                            <ReusableInput
                                                                label="Owner Age"
                                                                id={`owner-age-${index}`}
                                                                type="number"
                                                                value={owner.ownerAge?.data || ''}
                                                                onChange={(e: any) =>
                                                                    setUser((prev) => {
                                                                        const updatedOwners = [...(prev as any).owners];
                                                                        updatedOwners[index].ownerAge.data = e.target.value;
                                                                        return { ...prev, owners: updatedOwners };
                                                                    })
                                                                }
                                                                placeholder="Enter owner age"
                                                                showVerifyButtons={showVerifyButtons}
                                                            />
                                                            <ReusableInput
                                                                label="Owner Address"
                                                                id={`owner-address-${index}`}
                                                                value={owner.ownerParmanentAddress?.data || ''}
                                                                onChange={(e: any) =>
                                                                    setUser((prev) => {
                                                                        const updatedOwners = [...(prev as any).owners];
                                                                        updatedOwners[index].ownerParmanentAddress.data = e.target.value;
                                                                        return { ...prev, owners: updatedOwners };
                                                                    })
                                                                }
                                                                placeholder="Enter owner address"
                                                                showVerifyButtons={showVerifyButtons}
                                                            />
                                                            <ReusableInput
                                                                label="Owner Phone"
                                                                id={`owner-phone-${index}`}
                                                                value={owner.ownerPhone?.data || ''}
                                                                onChange={(e: any) =>
                                                                    setUser((prev) => {
                                                                        const updatedOwners = [...(prev as any).owners];
                                                                        updatedOwners[index].ownerPhone.data = e.target.value;
                                                                        return { ...prev, owners: updatedOwners };
                                                                    })
                                                                }
                                                                placeholder="Enter owner phone"
                                                                showVerifyButtons={showVerifyButtons}
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </>
                                        )}
                                    </form>
                                </div>
                                <div className="flex justify-end items-center px-5 py-3 border-t">
                                    <button type="button" className="btn btn-outline-danger" onClick={cancelButtonClickHandler}>
                                        Cancel
                                    </button>
                                    <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={() => profileVerificationSaveChangesHandler(verifiedFields)}>
                                        Save Changes
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* final verification modal */}
            <Transition appear show={finalSubmitModel} as={Fragment}>
                <Dialog as="div" open={finalSubmitModel} onClose={() => setFinalSubmitModel(false)}>
                    <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                        <div className="flex items-start justify-center min-h-screen px-4">
                            <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden my-8 w-full max-w-sm text-black dark:text-white-dark">
                                <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                    <button type="button" className="text-white-dark hover:text-dark" onClick={() => setFinalSubmitModel(false)}>
                                        ✕
                                    </button>
                                </div>
                                <div className="p-5 space-y-4">Are you sure ??</div>
                                <div className="flex justify-end items-center px-5 py-3 border-t">
                                    <button type="button" className="btn btn-outline-danger" onClick={() => setFinalSubmitModel(false)}>
                                        Cancel
                                    </button>
                                    <button type="button" className="btn btn-primary ltr:ml-4 rtl:mr-4" onClick={() => finalVerificationDriverHandler('VERIFY')}>
                                        Final Submit
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* delete modal */}
            <Transition appear show={showDeleteModel} as={Fragment}>
                <Dialog as="div" open={showDeleteModel} onClose={() => setShowDeleteModel(false)}>
                    <div className="fixed inset-0 bg-[black]/60 z-[999] overflow-y-auto">
                        <div className="flex items-start justify-center min-h-screen px-4">
                            <Dialog.Panel className="panel border-0 p-0 rounded-lg overflow-hidden my-8 w-full max-w-sm text-black dark:text-white-dark">
                                <div className="flex bg-[#fbfbfb] dark:bg-[#121c2c] items-center justify-between px-5 py-3">
                                    <button type="button" className="text-white-dark hover:text-dark" onClick={() => setShowDeleteModel(false)}>
                                        ✕
                                    </button>
                                </div>
                                <div className="p-5 space-y-4">You sure you want to delete the user??</div>
                                <div className="flex justify-end items-center px-5 py-3 border-t">
                                    <button type="button" className="btn btn-outline-danger" onClick={() => setShowDeleteModel(false)}>
                                        Cancel
                                    </button>
                                    <button type="button" className="btn btn-danger ltr:ml-4 rtl:mr-4" onClick={() => deleteDriverHandler(deleteUserId)}>
                                        Delete
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
};

export default DriverVerification;
