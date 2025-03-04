import React from 'react';

interface VehicleDownloadProps {
    driverId: string;
    vehicleId: string;
    vehicleModel: string;
}

const VehicleDownload: React.FC<VehicleDownloadProps> = ({ driverId, vehicleId, vehicleModel }) => {
    return (
        <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif', width: '100%', padding: '20px', backgroundColor: '#ffffff' }}>
            <div style={{ flex: 1 }}>
                <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Vehicle Details</h1>
                <p><strong>Driver ID:</strong> {driverId}</p>
                <p><strong>Vehicle ID:</strong> {vehicleId}</p>
                <p><strong>Vehicle Model:</strong> {vehicleModel}</p>
            </div>
        </div>
    );
};

export default VehicleDownload;