import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, Marker, Circle, DirectionsRenderer } from '@react-google-maps/api';
import Places from './Places';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Map() {
    const google = window.google;
    const center = useMemo(() => ({lat: 37.77, lng: -122.41}), []);
    const [location, setLocation] = useState(null);
    const [directions, setDirections] = useState(null);
    const options = useMemo(() => ({
        mapId: "bef5dc09de25cc32",
        disableDefaultUI: true,
    }), []);
    const mapRef = useRef();
    let placesOfInterest = [];
    const radius = 4828;

    const onLoad = useCallback((map) => (mapRef.current = map), []);

    const generateStores = (position) => {
        let _stores = [];
        if (position) {
            for (let i = 0; i < 50; i++) {
                const direction = Math.random() < 0.5 ? -2 : 2;
                _stores.push({
                  lat: position.lat + Math.random() / direction,
                  lng: position.lng + Math.random() / direction
                });
            }
        }
        return _stores;
    };

    const stores = useMemo(() => (generateStores(location)), [location]);
    
    const fetchDirections = (store) => {
        if (!location) {
            return;
        }
        
        const service = new google.maps.DirectionsService();
        service.route(
          {
            origin: location,
            destination: store,
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === "OK" && result) {
              setDirections(result);
            }
          }
        );
    };

        
    const notify = () => {
        let content = placesOfInterest.length === 1 ? "There is 1 point of interest " : "There are " + placesOfInterest.length + " points of interest ";
        toast(content +  "in your vicinity", {
            position: toast.POSITION.TOP_RIGHT
        });
    };

    useEffect(() => {
        if (placesOfInterest.length > 0) {
            notify();
        }
    });

    return(
        <div className="container">
            <div className="controls">
                Search
                <Places setLocation={(position) => {
                    setLocation(position);
                    mapRef.current?.panTo(position);
                    placesOfInterest = [];
                }} />
                <p>You will be alerted if there is a place of interest within a 3 mile radius from your location.</p>
                <ToastContainer />
            </div>
            <div className="map">
                <GoogleMap zoom={13} center={center} options={options} onLoad={onLoad} mapContainerClassName="map-container">
                    {location && 
                        <>
                            <Marker position={location} />
                            <Circle center={location} radius={radius} />
                            {stores.map((store) => {
                                if (google.maps.geometry.spherical.computeDistanceBetween(location, store) <= radius) {
                                    placesOfInterest = [...placesOfInterest, store];
                                }
                                return (<Marker key={store.lat} position={store} onClick={() => {fetchDirections(store)}} />);
                            })}
                        </>
                    }
                    {directions && <DirectionsRenderer directions={directions} />}
                </GoogleMap>
            </div>
        </div>
    );
}