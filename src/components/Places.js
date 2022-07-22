import React, { useState } from 'react';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { Input, Dropdown, DropdownToggle, DropdownItem, DropdownMenu } from 'reactstrap';

export default function Places({ setLocation }) {
    const {value, setValue, suggestions: {status, data}, clearSuggestions} = usePlacesAutocomplete();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleSelect = async (val) => {
        setValue(val, false);
        clearSuggestions();

        const results = await getGeocode({address: val});
        const {lat, lng} = await getLatLng(results[0]);
        setLocation({lat, lng});
    };

    return(
        <div>
            <div className="search-input">
                <Dropdown toggle={() => setDropdownOpen((prevState) => (!prevState))} isOpen={dropdownOpen}>
                    <DropdownToggle>
                        <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter your current location" />
                    </DropdownToggle>
                    <DropdownMenu>
                        {status === "OK" && data.map(({description}) => (<DropdownItem onClick={() => (handleSelect(description))}>{description}</DropdownItem>))}                        
                    </DropdownMenu>
                </Dropdown>
            </div>
        </div>
    );
}