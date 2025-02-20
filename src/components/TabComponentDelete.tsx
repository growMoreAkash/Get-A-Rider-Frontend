import { useState } from 'react';
import { useVehicleContext } from '../context/VehicleContext';
import TypeBrandCategoryList from './TypeBrandCategoryList';
import 'bootstrap-icons/font/bootstrap-icons.css';
import useDeleteVehicleAttributes from '../hooks/useDeleteVehicleAttributes';

const TabComponent = ({ typeArr, brandArr, modelArr }: any) => {
    // const { categories } = useVehicleContext();

    const { onDelete, onTypeDelete, onModelDelete, onBrandDelete, onCategoryDelete } = useDeleteVehicleAttributes();

    const { getTypeBrandModel, categories } = useVehicleContext();

    const { fetchVehicleOtherData } = useVehicleContext();

    const [activeTab, setActiveTab] = useState('type');


    const brandColumns = [
        { header: 'Index', key: 'index' },
        { header: 'Brand Name', key: 'name' },
        { header: 'Type Name', key: 'typeName' },
        { header: 'Date', key: 'date' },
        { header: 'Time', key: 'time' },
    ];

    const brandActions = [
        {
            icon: 'bi-trash-fill',
            title: 'Delete',
            onClick: async (row: any) => {
                await onBrandDelete(row._id);
            },
            className: 'text-red-400',
        },
    ];

    // global
    const onRefresh = () => {
        getTypeBrandModel();
        fetchVehicleOtherData();
    };

    const onViewLog = () => { };

    const onTrashed = () => { };

    // for brand above

    // for model below (reusable card display)

    const modelColumns = [
        { header: 'Index', key: 'index' },
        { header: 'Model Name', key: 'name' },
        { header: 'Brand Name', key: 'brandName' },
        { header: 'Date', key: 'date' },
        { header: 'Time', key: 'time' },
    ];

    const modelActions = [
        {
            icon: 'bi-trash-fill',
            title: 'Delete',
            onClick: async (row: any) => {
                await onModelDelete(row._id);
            },
            className: 'text-red-400',
        },
    ];

    // for model above (reusable card display)

    // for category below (reusable card display)
    const categoryColumns = [
        { header: 'Index', key: 'index' },
        { header: 'Category Name', key: 'name' },
        { header: 'Model Name', key: 'modelName' },
        { header: 'Date', key: 'date' },
        { header: 'Time', key: 'time' },
    ];

    const categoryActions = [
        {
            icon: 'bi-trash-fill',
            title: 'Delete',
            onClick: async (row: any) => {
                console.log(row, 'category data');
                await onCategoryDelete(row._id, row.modelId);
            },
            className: 'text-red-400',
        },
    ];

    // // for type below (reusable card display)--------------------------------------------------------------------

    const typeColumn = [
        { header: 'Index', key: 'index' },
        { header: 'Type Name', key: 'name' },
        { header: 'Date', key: 'date' },
        { header: 'Time', key: 'time' },
    ];

    const typeActions = [
        {
            icon: 'bi-trash-fill',
            title: 'Delete',
            onClick: async (row: any) => {
                await onTypeDelete(row._id);
            },
            className: 'text-red-400',
        },
    ];

    const onTypeRefresh = () => {
        getTypeBrandModel();
    };

    // const onViewLog = () => {};

    // const onTrashed = () => {};
    // // for type above (reusable card display)-------------------------------------------------------------------

    return (
        <div className="px-5">
            <div>
                <div className="bg-white rounded p-1">
                    <ul className="flex space-x-4">
                        <li>
                            <button
                                onClick={() => setActiveTab('type')}
                                className={`text-capitalize px-4 py-2 rounded-md ${activeTab === 'type' ? 'bg-teal-500 text-white font-semibold' : 'text-gray-700 hover:text-teal-500'}`}
                            >
                                Vehicle Type
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveTab('brand')}
                                className={`text-capitalize px-4 py-2 rounded-md ${activeTab === 'brand' ? 'bg-teal-500 text-white font-semibold' : 'text-gray-700 hover:text-teal-500'}`}
                            >
                                Vehicle Brand
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveTab('model')}
                                className={`text-capitalize px-4 py-2 rounded-md ${activeTab === 'model' ? 'bg-teal-500 text-white font-semibold' : 'text-gray-700 hover:text-teal-500'}`}
                            >
                                Vehicle Model
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveTab('category')}
                                className={`text-capitalize px-4 py-2 rounded-md ${activeTab === 'category' ? 'bg-teal-500 text-white font-semibold' : 'text-gray-700 hover:text-teal-500'}`}
                            >
                                Vehicle Category
                            </button>
                        </li>
                    </ul>
                </div>
                <div className="mt-4">
                    {activeTab === 'type' && (
                        <div>
                            <div className="mt-6">
                                <TypeBrandCategoryList
                                    columns={typeColumn}
                                    data={typeArr}
                                    actions={typeActions}
                                    onRefresh={onTypeRefresh}
                                    onViewLog={onViewLog}
                                    onTrashed={onTrashed}
                                    activeTab={activeTab}
                                />
                            </div>
                        </div>
                    )}
                    {activeTab === 'brand' && (
                        <div>
                            <div className="mt-6">
                                <TypeBrandCategoryList columns={brandColumns} data={brandArr} actions={brandActions} onRefresh={onRefresh} onViewLog={onViewLog} onTrashed={onTrashed} />
                            </div>
                        </div>
                    )}
                    {activeTab === 'model' && (
                        <div>
                            <div className="mt-6">
                                <TypeBrandCategoryList columns={modelColumns} data={modelArr} actions={modelActions} onRefresh={onRefresh} onViewLog={onViewLog} onTrashed={onTrashed} />
                            </div>
                        </div>
                    )}
                    {activeTab === 'category' && (
                        <div>
                            <div className="mt-6">
                                <TypeBrandCategoryList columns={categoryColumns} data={categories} actions={categoryActions} onRefresh={onRefresh} onViewLog={onViewLog} onTrashed={onTrashed} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TabComponent;
