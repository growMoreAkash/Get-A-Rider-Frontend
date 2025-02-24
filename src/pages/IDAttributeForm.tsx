import { useForm } from 'react-hook-form';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

interface IDAttributeFormProps {
    type: 'country' | 'state' | 'branch' | 'zone';
    masterId: string;
    countries?: any[];
    states?: any[];
    branches?: any[];
    onFormSubmit: () => void;
}

const IDAttributeForm: React.FC<IDAttributeFormProps> = ({ type, masterId, countries, states, branches, onFormSubmit }) => {
    const { register, handleSubmit, reset } = useForm();
    const token = Cookies.get('token');

    const showMessage = (msg = '', type = 'success') => {
        Swal.fire({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    const onSubmit = async (data: any) => {
        try {
            let payload: any = { masterId };
            switch (type) {
                case 'country':
                    payload = { ...payload, name: data.name, code: data.code };
                    break;
                case 'state':
                    payload = { ...payload, countryId: data.countryId, name: data.name };
                    break;
                case 'branch':
                    payload = { ...payload, stateId: data.stateId, branchName: data.branchName };
                    break;
                case 'zone':
                    payload = { ...payload, branchId: data.branchId, zoneName: data.zoneName };
                    break;
            }

            await axios.post(`http://localhost:8000/api/create${type.charAt(0).toUpperCase() + type.slice(1)}`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            reset();
            onFormSubmit();
            showMessage(`${type} created successfully`);
        } catch (error) {
            console.error(`Error creating ${type}:`, error);
            showMessage(`Error creating ${type}`, 'error');
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded-lg p-6">
            <h5 className="text-xl font-bold text-teal-500 mb-4">Add {type.charAt(0).toUpperCase() + type.slice(1)}</h5>

            {/* Country Form */}
            {type === 'country' && (
                <div className="flex flex-col gap-4">
                    <div>
                        <label>Country Name</label>
                        <input {...register('name', { required: true })} className="form-input w-full" />
                    </div>
                    <div>
                        <label>Country Code</label>
                        <input {...register('code', { required: true })} className="form-input w-full" />
                    </div>
                </div>
            )}

            {/* State Form */}
            {type === 'state' && (
                <div className="flex flex-col gap-4">
                    <div>
                        <label>Country</label>
                        <select {...register('countryId', { required: true })} className="form-select w-full">
                            {countries?.map((c) => (
                                <option key={c._id} value={c._id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>State Name</label>
                        <input {...register('name', { required: true })} className="form-input w-full" />
                    </div>
                </div>
            )}

            {/* Branch Form */}
            {type === 'branch' && (
                <div className="flex flex-col gap-4">
                    <div>
                        <label>State</label>
                        <select {...register('stateId', { required: true })} className="form-select w-full">
                            {states?.map((s) => (
                                <option key={s._id} value={s._id}>
                                    {s.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Branch Name</label>
                        <input {...register('branchName', { required: true })} className="form-input w-full" />
                    </div>
                </div>
            )}

            {/* Zone Form */}
            {type === 'zone' && (
                <div className="flex flex-col gap-4">
                    <div>
                        <label>Branch</label>
                        <select {...register('branchId', { required: true })} className="form-select w-full">
                            {branches?.map((b) => (
                                <option key={b._id} value={b._id}>
                                    {b.branchName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label>Zone Name</label>
                        <input {...register('zoneName', { required: true })} className="form-input w-full" />
                    </div>
                </div>
            )}

            
            <div className="flex justify-end mt-6">
                <button type="submit" className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600">
                    Submit
                </button>
            </div>
        </form>
    );
};

export default IDAttributeForm;