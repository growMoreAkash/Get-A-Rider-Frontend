import React from 'react';

interface VehicleDownloadProps {
    driverId: string;
    vehicleId: string;
    vehicleModel: string;
}

const VehicleDownload: React.FC<VehicleDownloadProps> = ({ driverId, vehicleId, vehicleModel }) => {
    return (
        <div style={{ width: '800px', padding: '20px', backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }}>
            <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Vehicle Details</h1>
            <p><strong>Driver ID:</strong> {driverId}</p>
            <p><strong>Vehicle ID:</strong> {vehicleId}</p>
            <p><strong>Vehicle Model:</strong> {vehicleModel}</p>
        </div>
    );
};

export default VehicleDownload;