import React, { useState, useRef } from 'react';
import { GoogleMap, DrawingManager, useLoadScript } from '@react-google-maps/api';
import GeoFenceMap from '../components/GeoFenceMap';

function createBranch() {
    
    return (
        <div>
            <GeoFenceMap />
        </div>
    );
}

export default createBranch;
