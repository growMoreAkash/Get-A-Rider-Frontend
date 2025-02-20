import React from 'react';

const TabWrapper = ({ list, activeTab, setActiveTab, children }: any) => {
    return (
        <button
            onClick={() => setActiveTab('addOwner')}
            className={`text-capitalize px-4 py-2 rounded-md ${activeTab === list[children] ? 'bg-teal-500 text-white font-semibold' : 'text-gray-700 hover:text-teal-500'}`}
        >
            {children}
        </button>
    );
};

export default TabWrapper;
