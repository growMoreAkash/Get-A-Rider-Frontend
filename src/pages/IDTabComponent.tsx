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
    const { country, state, branch, zone, refetchData } = useGetIdCreation(); // Destructure refetchData
    const [activeTab, setActiveTab] = useState<string>('country');

    const tabs: { label: string; key: keyof IDState }[] = [
        { label: 'Country', key: 'country' },
        { label: 'State', key: 'state' },
        { label: 'Branch', key: 'branch' },
        { label: 'Zone', key: 'zone' },
    ];

    const enrichedStateData = state.map((s: any, index: number) => {
        const matchedCountry = country.find((c: any) => c._id === s.country);
        return {
            ...s,
            index: index + 1,
            country: matchedCountry ? matchedCountry.name : "Unknown Country"
        };
    });

    const enrichedBranchData = branch.map((b: any, index: number) => {
        const matchedState = state.find((s: any) => String(s._id) === String(b.state));
        const matchedCountry = country.find((c: any) => String(c._id) === String(b.country));

        return {
            ...b,
            index: index + 1,
            state: matchedState ? matchedState.name : "Unknown State",
            country: matchedCountry ? matchedCountry.name : "Unknown Country"
        };
    });

    const enrichedZoneData = zone.map((z: any, index: number) => {
        const matchedBranch = branch.find((b: any) => b.branchCode === z.branchCode);
        const matchedState = matchedBranch ? state.find((s: any) => s._id === matchedBranch.state) : null;
        const matchedCountry = matchedState ? country.find((c: any) => c._id === matchedState.country) : null;

        return {
            ...z,
            index: index + 1,
            branch: matchedBranch ? matchedBranch.branchName : "Unknown Branch",
            state: matchedState ? matchedState.name : "Unknown State",
            country: matchedCountry ? matchedCountry.name : "Unknown Country"
        };
    });

    const handleFormSubmit = async () => {
        // Call the parent's onFormSubmit if needed
        onFormSubmit();

        // Refetch data to update the state
        await refetchData();
    };

    const columns = {
        country: [
            { header: 'Index', key: 'index' },
            { header: 'Country Name', key: 'name' },
            { header: 'Country Code', key: 'code' },
        ],
        state: [
            { header: 'Index', key: 'index' },
            { header: 'State Name', key: 'name' },
            { header: 'Country', key: 'country' },
        ],
        branch: [
            { header: 'Index', key: 'index' },
            { header: 'Branch Name', key: 'branchName' },
            { header: 'State', key: 'state' },
            { header: 'Country', key: 'country' },
        ],
        zone: [
            { header: 'Index', key: 'index' },
            { header: 'Zone Name', key: 'zoneName' },
            { header: 'Branch', key: 'branch' },
            { header: 'State', key: 'state' },
            { header: 'Country', key: 'country' },
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
                            onFormSubmit={handleFormSubmit} // Use handleFormSubmit
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
                            onFormSubmit={handleFormSubmit} // Use handleFormSubmit
                        />
                        <div className="mt-6">
                            <TypeBrandCategoryList columns={columns.state} data={enrichedStateData} />
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
                            onFormSubmit={handleFormSubmit} // Use handleFormSubmit
                        />
                        <div className="mt-6">
                            <TypeBrandCategoryList columns={columns.branch} data={enrichedBranchData} />
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
                            onFormSubmit={handleFormSubmit} // Use handleFormSubmit
                        />
                        <div className="mt-6">
                            <TypeBrandCategoryList columns={columns.zone} data={enrichedZoneData} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IDTabComponent;