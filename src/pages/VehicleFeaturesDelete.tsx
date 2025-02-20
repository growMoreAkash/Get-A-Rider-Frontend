import { useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import { useVehicleContext } from '../context/VehicleContext';
import TabComponent from '../components/TabComponentDelete';

const VehicleFeaturesDelete = () => {
    const { typeArr, brandArr, modelArr } = useVehicleContext();
    return (
        <div className="w-full h-full">
            <TabComponent typeArr={typeArr} brandArr={brandArr} modelArr={modelArr}  />
        </div>
    );
};

export default VehicleFeaturesDelete;
