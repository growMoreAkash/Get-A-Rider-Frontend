import React, { useState, useEffect } from 'react';
import IDAttributeForm from './IDAttributeForm';
import TypeBrandCategoryList from '../components/TypeBrandCategoryList';
import useGetIdCreation from '../hooks/useGetIdCreation'; 



interface IDTabComponentProps {
    firstCreateId: string;
    onFormSubmit: () => void;
}

interface IDState {
    country: any;
    state: any;
    branch: any;
    zone: any;
}

const IDTabComponent: React.FC<IDTabComponentProps> = ({ firstCreateId, onFormSubmit }) => {
    const { country, state, branch, zone } = useGetIdCreation(); 
    const [activeTab, setActiveTab] = useState<string>('country');

    const tabs: { label: string; key: keyof IDState }[] = [
        { label: 'Country', key: 'country' },
        { label: 'State', key: 'state' },
        { label: 'Branch', key: 'branch' },
        { label: 'Zone', key: 'zone' },
    ];

    const columns = {
        country: [
            { header: 'Index', key: 'index' },
            { header: 'Country Name', key: 'name' },
            { header: 'Country Code', key: 'code' },
        ],
        state: [
            { header: 'Index', key: 'index' },
            { header: 'State Name', key: 'name' },
            { header: 'Country', key: 'countryId' },
        ],
        branch: [
            { header: 'Index', key: 'index' },
            { header: 'Branch Name', key: 'branchName' },
            { header: 'State', key: 'stateId' },
        ],
        zone: [
            { header: 'Index', key: 'index' },
            { header: 'Zone Name', key: 'zoneName' },
            { header: 'Branch', key: 'branchId' },
        ],
    };

    return (
        <div className="px-5">
            {/* Tab Navigation */}
            <div className="bg-white rounded p-1 overflow-x-hidden py-4">
                <ul className="flex overflow-x-scroll space-x-4 justify-center px-2">
                    {tabs.map((tab, index) => (
                        <li key={index}>
                            <button
                                onClick={() => setActiveTab(tab.key)}
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
                {activeTab === 'country' && (
                    <div>
                        <IDAttributeForm
                            type="country"
                            masterId={firstCreateId}
                            onFormSubmit={() => {
                                onFormSubmit(); 
                            }}
                        />
                        <div className="mt-6">
                            <TypeBrandCategoryList columns={columns.country} data={country} />
                        </div>
                    </div>
                )}

                {activeTab === 'state' && (
                    <div>
                        <IDAttributeForm
                            type="state"
                            masterId={firstCreateId}
                            countries={country}
                            onFormSubmit={() => {
                                onFormSubmit(); 
                            }}
                        />
                        <div className="mt-6">
                            <TypeBrandCategoryList columns={columns.state} data={state} />
                        </div>
                    </div>
                )}

                {activeTab === 'branch' && (
                    <div>
                        <IDAttributeForm
                            type="branch"
                            masterId={firstCreateId}
                            countries={country} 
                            states={state} 
                            onFormSubmit={() => {
                                onFormSubmit(); 
                            }}
                        />
                        <div className="mt-6">
                            <TypeBrandCategoryList columns={columns.branch} data={branch} />
                        </div>
                    </div>
                )}

                {activeTab === 'zone' && (
                    <div>
                        <IDAttributeForm
                            type="zone"
                            masterId={firstCreateId}
                            countries={country} 
                            states={state} 
                            branches={branch} 
                            onFormSubmit={() => {
                                onFormSubmit(); 
                            }}
                        />
                        <div className="mt-6">
                            <TypeBrandCategoryList columns={columns.zone} data={zone} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IDTabComponent;