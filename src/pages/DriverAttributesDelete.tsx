import { useEffect, useState } from 'react';
import DriverTabComponent from '../components/DriverTabComponentsDelete';
import axios from 'axios';
import Cookies from 'js-cookie';

const DriverAttributesDelete = () => {
    const [firstCreateId, setFirstCreateId] = useState<string>('');

    var token = Cookies.get('token');

    const fetchFirstCreateId = async () => {
        try {
            var response = await axios.post('https://api.getarider.in/api/firstCreateMaster', {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setFirstCreateId(response.data.id);
        } catch (error) {
            console.error('Error fetching first create id:', error);
        }
    };

    useEffect(() => {
        fetchFirstCreateId();
    }, []);

    const onFormSubmit = () => {
        console.log('Type form submitted');
    };
    return (
        <div>
            <DriverTabComponent firstCreateId={firstCreateId} onFormSubmit={onFormSubmit} />
        </div>
    );
};

export default DriverAttributesDelete;
