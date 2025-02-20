import 'react-quill/dist/quill.snow.css';
import { useVehicleContext } from '../context/VehicleContext';
import TabComponent from '../components/TabComponent';

const VehicleFeatures = () => {
    const { typeArr, brandArr, modelArr } = useVehicleContext();

    return (
        <div className="w-full h-full">
            <TabComponent typeArr={typeArr} brandArr={brandArr} modelArr={modelArr}  />
        </div>
    );
};

export default VehicleFeatures;
