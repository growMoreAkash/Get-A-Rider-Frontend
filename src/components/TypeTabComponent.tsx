import React, { useState } from 'react';
import TypeReusableForm from './TypeReusableForm';
import { useVehicleContext } from '../context/VehicleContext';
import TypeBrandCategoryList from './TypeBrandCategoryList';
import VehicleDataUpdateForm from './ReusableUserDriverForm/VehicleDataUpdateForm';

interface TypeTabComponentProps {
    firstCreateId: string | null;
    handleTypeFormSubmit: () => void;
}

interface VehicleState {
    type: any;
    mode: any;
    color: any;
    capacity: any;
    gearType: any;
    fuelType: any;
    regYear: any;
    maxEnginePower: any;
    fuelPerLiter: any;
    maxSpeed: any;
    acceleration: any;
}

const TypeTabComponent: React.FC<TypeTabComponentProps> = ({ firstCreateId, handleTypeFormSubmit }) => {
    const [selectedTab, setSelectedTab] = useState(0);

    const tabs: { label: string; key: keyof VehicleState }[] = [
        { label: 'Mode', key: 'mode' },
        { label: 'Color', key: 'color' },
        { label: 'Capacity', key: 'capacity' },
        { label: 'Gear Type', key: 'gearType' },
        { label: 'Fuel Type', key: 'fuelType' },
        { label: 'Reg Year', key: 'regYear' },
        { label: 'Engine Power', key: 'maxEnginePower' },
        { label: 'Mileage', key: 'fuelPerLiter' },
        { label: 'Max Speed', key: 'maxSpeed' },
        { label: 'Acceleration', key: 'acceleration' },
    ];

    const { vehicleData, fetchVehicleOtherData, typeArr, getTypeBrandModel, categories } = useVehicleContext();

    const [activeTab, setActiveTab] = useState<string>('mode');

    const [onEdit, setOnEdit] = useState(false);
    const [data, setData] = useState();

    const editFunction = (data: any) => {
        setOnEdit(true);
        setData(data);
    };

    //////.log(typeArr, 'typeArr');

    // // for type below (reusable card display)--------------------------------------------------------------------

    const typeColumn = [
        { header: 'Index', key: 'index' },
        { header: 'Type Name', key: 'name' },
        { header: 'Date', key: 'date' },
        { header: 'Time', key: 'time' },
    ];

    const typeActions = [
        { icon: 'bi-pencil-fill', title: 'Edit', onClick: (row: any) => editFunction(row), className: 'text-teal-400' },
    ];

    const onTypeRefresh = () => {
        getTypeBrandModel();
    };

    const onRefresh = () => {
        fetchVehicleOtherData();
    };

    const onViewLog = () => {};

    const onTrashed = () => {};
    // // for type above (reusable card display)-------------------------------------------------------------------

    //    for mode below (reusable card display)

    const modeColumn = [
        { header: 'Index', key: 'index' },
        { header: 'Mode Name', key: 'name' },
        { header: 'Date', key: 'date' },
        { header: 'Time', key: 'time' },
    ];

    const modeActions = [
        { icon: 'bi-pencil-fill', title: 'Edit', onClick: (row: any) => editFunction(row), className: 'text-teal-400' },
    ];

    //    for mode above (reusable card display)------------------------------------

    // // for color below (reusable card display)-------------------------------------------------------------------

    const colorColumn = [
        { header: 'Index', key: 'index' },
        { header: 'Color Name', key: 'name' },
        { header: 'Date', key: 'date' },
        { header: 'Time', key: 'time' },
    ];

    // global actions for now for the time being

    // for capacity (tired of writing comments so will write in shortcut for the resuable card ie TypeBrandCategoryList)
    const capacityColumn = [
        { header: 'Index', key: 'index' },
        { header: 'Capacity', key: 'name' },
        { header: 'Date', key: 'date' },
        { header: 'Time', key: 'time' },
    ];

    const fuelTypeColumn = [
        { header: 'Index', key: 'index' },
        { header: 'Fuel Type', key: 'name' },
        { header: 'Date', key: 'date' },
        { header: 'Time', key: 'time' },
    ];

    const gearColumn = [
        { header: 'Index', key: 'index' },
        { header: 'Gear Name', key: 'name' },
        { header: 'Date', key: 'date' },
        { header: 'Time', key: 'time' },
    ];

    const registrationColumn = [
        { header: 'Index', key: 'index' },
        { header: 'Registration Year', key: 'name' },
        { header: 'Date', key: 'date' },
        { header: 'Time', key: 'time' },
    ];

    const maxEnginePowerColumn = [
        { header: 'Index', key: 'index' },
        { header: 'Max Engine Power', key: 'name' },
        { header: 'Date', key: 'date' },
        { header: 'Time', key: 'time' },
    ];

    const fuelPerLiterColumn = [
        { header: 'Index', key: 'index' },
        { header: 'Fuel Per Litre', key: 'name' },
        { header: 'Date', key: 'date' },
        { header: 'Time', key: 'time' },
    ];

    const globalActions = [
        { icon: 'bi-pencil-fill', title: 'Edit', onClick: (row: any) => editFunction(row), className: 'text-teal-400' },
    ];

    // for max speed
    const maxSpeedColumn = [
        { header: 'Index', key: 'index' },
        { header: 'Max Speed', key: 'name' },
        { header: 'Date', key: 'date' },
        { header: 'Time', key: 'time' },
    ];

    //for accelaration
    const accelerationColumn = [
        { header: 'Index', key: 'index' },
        { header: 'Acceleration/Time', key: 'name' },
        { header: 'Date', key: 'date' },
        { header: 'Time', key: 'time' },
    ];

    return (
        <div className="px-5">
            {onEdit ? (
                <VehicleDataUpdateForm data={data} title={activeTab} setOnEdit={setOnEdit} />
            ) : (
                <>
                    <div>
                        {/* Tab Navigation */}
                        <div className="bg-white rounded p-1 overflow-x-hidden pt-3">
                            <ul
                                className="flex overflow-x-scroll"
                                style={{
                                    msOverflowStyle: 'none',
                                    // scrollbarWidth: 'none',
                                    WebkitOverflowScrolling: 'touch',
                                }}
                            >
                                {tabs.map((tab, index) => (
                                    <li key={index} className="mb-6">
                                        <button
                                            onClick={() => setActiveTab(tab.key as string)}
                                            className={`w-36 text-capitalize px-4 mx-5 py-2 rounded-md ${
                                                activeTab === tab.key ? 'bg-teal-500 text-white font-semibold' : 'text-gray-700 hover:text-teal-500'
                                            }`}
                                        >
                                            {tab.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Tab Content */}
                        <div className="mt-4">
                            {activeTab === 'mode' && (
                                <div>
                                    <TypeReusableForm title="Mode" firstCreateId={firstCreateId} handleTypeFormSubmit={handleTypeFormSubmit} />
                                    <div className="mt-6">
                                        <TypeBrandCategoryList
                                            columns={modeColumn}
                                            data={vehicleData?.mode || 'No data'}
                                            actions={modeActions}
                                            onRefresh={onRefresh}
                                            onViewLog={onViewLog}
                                            onTrashed={onTrashed}
                                            activeTab={activeTab}
                                        />
                                    </div>
                                </div>
                            )}
                            {activeTab === 'color' && (
                                <div>
                                    <TypeReusableForm title="Color" firstCreateId={firstCreateId} handleTypeFormSubmit={handleTypeFormSubmit} />
                                    <div className="mt-6">
                                        <TypeBrandCategoryList
                                            columns={colorColumn}
                                            data={vehicleData?.color || 'No data'}
                                            actions={globalActions}
                                            onRefresh={onRefresh}
                                            onViewLog={onViewLog}
                                            onTrashed={onTrashed}
                                            activeTab={activeTab}
                                        />
                                    </div>
                                </div>
                            )}
                            {activeTab === 'capacity' && (
                                <div>
                                    <TypeReusableForm title="Capacity" firstCreateId={firstCreateId} handleTypeFormSubmit={handleTypeFormSubmit} />
                                    <div className="mt-6">
                                        <TypeBrandCategoryList
                                            columns={capacityColumn}
                                            data={vehicleData?.capacity || 'No data'}
                                            actions={globalActions}
                                            onRefresh={onRefresh}
                                            onViewLog={onViewLog}
                                            onTrashed={onTrashed}
                                            activeTab={activeTab}
                                        />
                                    </div>
                                </div>
                            )}
                            {activeTab === 'gearType' && (
                                <div>
                                    <TypeReusableForm title="Gear Type" firstCreateId={firstCreateId} handleTypeFormSubmit={handleTypeFormSubmit} />
                                    <div className="mt-6">
                                        <TypeBrandCategoryList
                                            columns={gearColumn}
                                            data={vehicleData?.gearType || 'No data'}
                                            actions={globalActions}
                                            onRefresh={onRefresh}
                                            onViewLog={onViewLog}
                                            onTrashed={onTrashed}
                                            activeTab={activeTab}
                                        />
                                    </div>
                                </div>
                            )}
                            {activeTab === 'fuelType' && (
                                <div>
                                    <TypeReusableForm title="Fuel Type" firstCreateId={firstCreateId} handleTypeFormSubmit={handleTypeFormSubmit} />
                                    <div className="mt-6">
                                        <TypeBrandCategoryList
                                            columns={fuelTypeColumn}
                                            data={vehicleData?.fuelType || 'No data'}
                                            actions={globalActions}
                                            onRefresh={onRefresh}
                                            onViewLog={onViewLog}
                                            onTrashed={onTrashed}
                                            activeTab={activeTab}
                                        />
                                    </div>
                                </div>
                            )}
                            {activeTab === 'regYear' && (
                                <div>
                                    <TypeReusableForm title="Registration Year" firstCreateId={firstCreateId} handleTypeFormSubmit={handleTypeFormSubmit} />
                                    <div className="mt-6">
                                        <TypeBrandCategoryList
                                            columns={registrationColumn}
                                            data={vehicleData?.regYear || 'No data'}
                                            actions={globalActions}
                                            onRefresh={onRefresh}
                                            onViewLog={onViewLog}
                                            onTrashed={onTrashed}
                                            activeTab={activeTab}
                                        />
                                    </div>
                                </div>
                            )}
                            {activeTab === 'maxEnginePower' && (
                                <div>
                                    <TypeReusableForm title="Max Engine Power" firstCreateId={firstCreateId} handleTypeFormSubmit={handleTypeFormSubmit} />
                                    <div className="mt-6">
                                        <TypeBrandCategoryList
                                            columns={maxEnginePowerColumn}
                                            data={vehicleData?.maxEnginePower || 'No data'}
                                            actions={globalActions}
                                            onRefresh={onRefresh}
                                            onViewLog={onViewLog}
                                            onTrashed={onTrashed}
                                            activeTab={activeTab}
                                        />
                                    </div>
                                </div>
                            )}
                            {activeTab === 'fuelPerLiter' && (
                                <div>
                                    <TypeReusableForm title="Fuel Per Litre" firstCreateId={firstCreateId} handleTypeFormSubmit={handleTypeFormSubmit} />
                                    <div className="mt-6">
                                        <TypeBrandCategoryList
                                            columns={fuelPerLiterColumn}
                                            data={vehicleData?.fuelPerLiter || 'No data'}
                                            actions={globalActions}
                                            onRefresh={onRefresh}
                                            onViewLog={onViewLog}
                                            onTrashed={onTrashed}
                                            activeTab={activeTab}
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'maxSpeed' && (
                                <div>
                                    <TypeReusableForm title="Max Speed" firstCreateId={firstCreateId} handleTypeFormSubmit={handleTypeFormSubmit} />
                                    <div className="mt-6">
                                        <TypeBrandCategoryList
                                            columns={maxSpeedColumn}
                                            data={vehicleData?.maxSpeed || 'No data'}
                                            actions={globalActions}
                                            onRefresh={onRefresh}
                                            onViewLog={onViewLog}
                                            onTrashed={onTrashed}
                                            activeTab={activeTab}
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'acceleration' && (
                                <div>
                                    <TypeReusableForm title="Acceleration" firstCreateId={firstCreateId} handleTypeFormSubmit={handleTypeFormSubmit} />
                                    <div className="mt-6">
                                        <TypeBrandCategoryList
                                            columns={accelerationColumn}
                                            data={vehicleData?.acceleration || 'No data'}
                                            actions={globalActions}
                                            onRefresh={onRefresh}
                                            onViewLog={onViewLog}
                                            onTrashed={onTrashed}
                                            activeTab={activeTab}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default TypeTabComponent;
