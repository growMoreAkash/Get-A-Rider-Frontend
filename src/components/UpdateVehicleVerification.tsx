import React, { useState } from 'react';
import UpdateWrapper from './Wrapper/UpdateWrapper';
import { useSSR } from 'react-i18next';
import UserLegalDetailsVerify from '../pages/DriverVerification/UserLegalDetailsVerify';
import PersonalDetailsVerify from '../pages/DriverVerification/PersonalDetailsVerify';
import CommunicationDetailsVerify from '../pages/DriverVerification/CommunicationDetailsVerify';
import UploadDocumentVerify from '../pages/DriverVerification/UploadDocumentVerify';
import SubmissionVerify from '../pages/DriverVerification/SubmissionVerify';

interface UpdateVehicleVerification {
    vehicleEditData: any;
    setEdit: () => void;
}

const UpdateVehicleVerification = ({ vehicleEditData, setEdit } : any) => {
    const columns = ['User Legal Details', 'Personal Details ', 'Upload Documents', 'Live address verify', 'Quick look ( Stat )'];
    const [renderComponent, setRenderComponent] = useState(columns[0]);

    console.log(renderComponent, 'render component');
    console.log(vehicleEditData, 'vehicleEditData');
    console.log(setEdit, 'setEdit');

    return (
        <div className="flex gap-8">
            <div className="flex flex-col justify-start gap-4">
                <UpdateWrapper columns={columns} setRenderComponent={setRenderComponent} renderComponent={renderComponent} />
            </div>

            <div className="flex-1 shadow-md p-4">
                {renderComponent === columns[0] && <UserLegalDetailsVerify />}
                {renderComponent === columns[1] && <PersonalDetailsVerify />}
                {renderComponent === columns[2] && <UploadDocumentVerify />}
                {renderComponent === columns[3] && <CommunicationDetailsVerify />}
                {renderComponent === columns[4] && <SubmissionVerify />}
            </div>
        </div>
    );
};

export default UpdateVehicleVerification;
