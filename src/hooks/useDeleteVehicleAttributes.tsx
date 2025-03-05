import axios from 'axios';
import Swal from 'sweetalert2';
import { useFirstCreate } from '../context/FirstCreateContext';
import { useVehicleContext } from '../context/VehicleContext';
import Cookies from 'js-cookie';

const useDeleteVehicleAttributes = () => {
    const host = 'http://localhost:8000/api';
    const { firstCreateId } = useFirstCreate();
    const { fetchVehicleOtherData } = useVehicleContext();
    const { getTypeBrandModel,fetchCategories } = useVehicleContext();

    const onDelete = async (id: string, activeTab?: string) => {
        const requestBody = {
            name: activeTab,
            id: id,
            firstCreate: firstCreateId,
        };

        try {
            await axios.put(`${host}/deleteVehicleOtherData/`,
                requestBody,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Cookies.get("token")}`
                    }
                }
            );
            fetchVehicleOtherData();

            Swal.fire({
                icon: 'success',
                title: 'Deleted successfully',
                timer: 2000,
            });
        } catch (error) {
            console.error('Failed to delete:', error);
            Swal.fire('Error', 'Failed to delete. Try again.', 'error');
        }
    };

    const onTypeDelete = async (id: string) => {
        const requestBody = {
            typeId: id,
        };

        try {
            await axios.put(`${host}/deleteType/`,
                requestBody,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Cookies.get("token")}`
                    }
                }
            );

            getTypeBrandModel();

            Swal.fire({
                icon: 'success',
                title: 'Deleted successfully',
                timer: 2000,
            });
        } catch (error) {
            console.error('Failed to delete:', error);
            Swal.fire('Error', 'Failed to delete. Try again.', 'error');
        }
    };

    const onBrandDelete = async (id: string) => {
        const requestBody = {
            brandId: id,
        };

        try {
            await axios.put(`${host}/deleteBrand/`,
                requestBody,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Cookies.get("token")}`
                    }
                }
            );
            getTypeBrandModel();

            Swal.fire({
                icon: 'success',
                title: 'Deleted successfully',
                timer: 2000,
            });
        } catch (error) {
            console.error('Failed to delete:', error);
            Swal.fire('Error', 'Failed to delete. Try again.', 'error');
        }
    };

    const onModelDelete = async (id: string) => {
        const requestBody = {
            modelId: id,
        };

        try {
            await axios.put(`${host}/deleteModel/`,
                requestBody,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Cookies.get("token")}`
                    }
                }
            );
            getTypeBrandModel();

            Swal.fire({
                icon: 'success',
                title: 'Deleted successfully',
                timer: 2000,
            });
        } catch (error) {
            console.error('Failed to delete:', error);
            Swal.fire('Error', 'Failed to delete. Try again.', 'error');
        }
    };

    const onCategoryDelete = async (id: string, modelId : string) => {
        const requestBody = {
            categoryId: id,
            modelId: modelId
        };

        try {
            await axios.put(`${host}/deleteCategory/`,
                requestBody,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${Cookies.get("token")}`
                    }
                }
            );
            fetchCategories();

            Swal.fire({
                icon: 'success',
                title: 'Deleted successfully',
                timer: 2000,
            });
        } catch (error) {
            console.error('Failed to delete:', error);
            Swal.fire('Error', 'Failed to delete. Try again.', 'error');
        }
    };

    return { onDelete, onTypeDelete, onBrandDelete, onCategoryDelete,onModelDelete };
};

export default useDeleteVehicleAttributes;
