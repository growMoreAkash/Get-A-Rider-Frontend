import React from 'react';
import TypeTabComponent from '../components/TypeTabComponentDelete';
import { useFirstCreate } from '../context/FirstCreateContext';
import { useVehicleContext } from '../context/VehicleContext';

const VehicleAttributesDelete = () => {
    const { firstCreateId } = useFirstCreate();

    const { getTypeBrandModel } = useVehicleContext();

    const handleTypeFormSubmit = () => {
        getTypeBrandModel();
    };
    return (
        <div>
            <TypeTabComponent firstCreateId={firstCreateId} handleTypeFormSubmit={handleTypeFormSubmit} />
        </div>
    );
};

export default VehicleAttributesDelete;
