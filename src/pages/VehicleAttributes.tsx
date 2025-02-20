import TypeTabComponent from '../components/TypeTabComponent';
import { useFirstCreate } from '../context/FirstCreateContext';
import { useVehicleContext } from '../context/VehicleContext';

const VehicleAttributes = () => {
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

export default VehicleAttributes;
