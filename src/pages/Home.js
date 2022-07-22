import React, { useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import Map from '../components/Map';

export default function Home() {
    const [libraries] = useState(["places", "geometry"]);
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, 
        libraries
    });

    if (!isLoaded) {
        return(<div>Loading...</div>);
    }

    return(
        <Map />
    );
}