import React, { useEffect, useState } from 'react';
import TypeBrandCategoryList from './TypeBrandCategoryList';
import axios from 'axios';
import Cookies from 'js-cookie';

interface DriverTabComponentProps {
    firstCreateId: string;
    onFormSubmit: () => void;
}

interface VehicleState {
    profession: any;
    occupation: any;
    religion: any;
}

const DriverTabComponent: React.FC<DriverTabComponentProps> = ({ firstCreateId, onFormSubmit }) => {
    const [professionArr, setProfessionArr] = useState<any[]>([]);
    const [occupationArr, setOccupationArr] = useState<any[]>([]);
    const [religionArr, setReligionArr] = useState<any[]>([]);

    var token = Cookies.get('token');

    const tabs: { label: string; key: keyof VehicleState }[] = [
        { label: 'Profession', key: 'profession' },
        { label: 'Occupation', key: 'occupation' },
        { label: 'Religion', key: 'religion' },
    ];

    const [activeTab, setActiveTab] = useState<string>('profession');

    const pofessionActions = [
        { icon: 'bi-trash-fill', title: 'Delete', onClick: (row: any) => alert(`Delete ${row.name}`), className: 'text-red-400' },
    ];
    const religionActions = [
        { icon: 'bi-trash-fill', title: 'Delete', onClick: (row: any) => alert(`Delete ${row.name}`), className: 'text-red-400' },
    ];
    const occupationActions = [
        { icon: 'bi-trash-fill', title: 'Delete', onClick: (row: any) => alert(`Delete ${row.name}`), className: 'text-red-400' },
    ];

    const onViewLog = () => {};

    const onTrashed = () => {};

    const pofessionColumn = [
        { header: 'Index', key: 'index' },
        { header: 'Profession Name', key: 'name' },
        { header: 'Date', key: 'date' },
        { header: 'Time', key: 'time' },
    ];
    const occupationColumn = [
        { header: 'Index', key: 'index' },
        { header: 'Mode Name', key: 'name' },
        { header: 'Date', key: 'date' },
        { header: 'Time', key: 'time' },
    ];
    const religionColumn = [
        { header: 'Index', key: 'index' },
        { header: 'Religion', key: 'name' },
        { header: 'Date', key: 'date' },
        { header: 'Time', key: 'time' },
    ];

    const fetchData = async () => {
        try {
            var response = await axios.post(`https://api.getarider.in/api/getDriverAttribute/${firstCreateId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProfessionArr(response.data.driverAttribute.profession);
            setOccupationArr(response.data.driverAttribute.occupation);
            setReligionArr(response.data.driverAttribute.religion);
        } catch (error) {
            console.log('Error fetching data:', error);
        }
    };

    useEffect(() => {
        if (firstCreateId != '') fetchData();
    }, [firstCreateId]);

    return (
        <div className="px-5">
            {/* Tab Navigation */}
            <div className="bg-white rounded p-1 overflow-x-hidden py-4">
                <ul
                    className="flex"
                    style={{
                        msOverflowStyle: 'none',
                        // scrollbarWidth: 'none',
                        WebkitOverflowScrolling: 'touch',
                    }}
                >
                    {tabs.map((tab, index) => (
                        <li key={index}>
                            <button
                                onClick={() => setActiveTab(tab.key as string)}
                                className={`w-36 text-capitalize px-4 mx-5 py-2 rounded-md ${activeTab === tab.key ? 'bg-teal-500 text-white font-semibold' : 'text-gray-700 hover:text-teal-500'}`}
                            >
                                {tab.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Tab Content */}
            <div className="mt-4">
                {activeTab === 'profession' && (
                    <div>
                        <div className="mt-6">
                            <TypeBrandCategoryList columns={pofessionColumn} data={professionArr} actions={pofessionActions} onRefresh={fetchData} onViewLog={onViewLog} onTrashed={onTrashed} />
                        </div>
                    </div>
                )}
                {activeTab === 'occupation' && (
                    <div>
                        <div className="mt-6">
                            <TypeBrandCategoryList columns={occupationColumn} data={occupationArr} actions={occupationActions} onRefresh={fetchData} onViewLog={onViewLog} onTrashed={onTrashed} />
                        </div>
                    </div>
                )}
                {activeTab === 'religion' && (
                    <div>
                        <div className="mt-6">
                            <TypeBrandCategoryList columns={religionColumn} data={religionArr} actions={religionActions} onRefresh={fetchData} onViewLog={onViewLog} onTrashed={onTrashed} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DriverTabComponent;
