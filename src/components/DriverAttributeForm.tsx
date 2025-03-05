import { useForm } from 'react-hook-form';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

const DriverAttributeForm = ({ title, firstCreateId, onFormSubmit }: any) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const host = 'https://api.getarider.in/api';

    const registerTitle = title?.toLowerCase().replace(/\s/g, '');

    const showMessage = (msg = '', type = 'success') => {
        const toast: any = Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
            customClass: { container: 'toast' },
        });
        toast.fire({
            icon: type,
            title: msg,
            padding: '10px 20px',
        });
    };

    const handleFormSubmit = async (data: any) => {
        try {
            const fieldValue = data[registerTitle];
            const description = data['description'];
            data.apiUrl ='/addDriverAttribute';
            var token = Cookies.get('token');

            // Check the attribute type and make the appropriate API call
            if (registerTitle === 'profession') {
                await axios.post(
                    `${host}/addDriverAttribute`,
                    {
                        MasterId: firstCreateId,
                        profession: fieldValue,
                        description: description,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            } else if (registerTitle === 'occupation') {
                await axios.post(
                    `${host}/addDriverAttribute`,
                    {
                        MasterId: firstCreateId,
                        occupation: fieldValue,
                        description: description,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            } else if (registerTitle === 'religion') {
                await axios.post(
                    `${host}/addDriverAttribute`,
                    {
                        MasterId: firstCreateId,
                        religion: fieldValue,
                        description: description,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            }

            // Reset the form, trigger callback, and show success message
            reset();
            onFormSubmit();
            showMessage('Added successfully', 'success');
        } catch (error) {
            console.error('Error submitting type:', error);
            showMessage('Error submitting data. Please try again.', 'error');
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-white shadow-md rounded-lg p-6">
            <h5 className="text-xl font-bold text-teal-500 mb-4">Add {title}</h5>
            <div className="flex flex-col gap-4">
                <div className="flex gap-4 flex-col">
                    <label htmlFor="typeName" className="text-md font-semibold">
                        {title}
                    </label>
                    <input id="typeName" type="text" {...register(registerTitle, { required: `${title} name is required` })} className="form-input w-full" />
                </div>

                <div>
                    <label htmlFor="description" className="block font-medium">
                        Short Description
                    </label>
                    <textarea
                        id="description"
                        {...register('description', { required: 'Description is required' })}
                        placeholder="Ex: Description"
                        rows={5}
                        maxLength={800}
                        className="w-full px-3 border rounded-md"
                    />
                </div>
                {errors?.description && <span className="text-red-500 text-sm">{errors.description.message as string}</span>}
            </div>

            <div className="flex justify-end mt-6">
                <button type="submit" className="border-[1px] hover:bg-teal-500 hover:text-white border-teal-600 text-teal-600 shadow-none px-4 py-2 rounded-md">
                    Submit
                </button>
            </div>
        </form>
    );
};

export default DriverAttributeForm;
