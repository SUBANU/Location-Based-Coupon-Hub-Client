
import React, { useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import customMarkerIcon from '../../Assets/custom-marker.png'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './style.css';

const customIcon = new L.Icon({
  iconUrl: customMarkerIcon,
  iconSize: [32, 32], // Adjust the size based on your image
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const Profile = () => {
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const handleSave = async () => {
    const userEmail = sessionStorage.getItem('merchentEmail');
    console.log(userEmail);
  
    console.log('userEmail:', userEmail);
    console.log('latitude:', latitude);
    console.log('longitude:', longitude);
    console.log('address:', address);
  
    try {
      await axios.post('http://localhost:8001/saveProfile', {
        email: userEmail,
        latitude: latitude,
        longitude: longitude,
        address: address,
      });
  
      console.log('Profile saved successfully!');
      alert('saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };
  
  const SearchBar = () => {
    const map = useMap();

    const handleSearch = (e) => {
      const searchText = e.target.value;

      // Implement your search logic here
      // For simplicity, let's assume searchText is a valid address
      const newLatitude = 48.8566; // Update with actual latitude from geocoding service
      const newLongitude = 2.3522; // Update with actual longitude from geocoding service

      setLatitude(newLatitude);
      setLongitude(newLongitude);

      // Center the map on the new location
      map.flyTo([newLatitude, newLongitude], map.getZoom());
    };

    return (
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by street name"
          onChange={(e) => handleSearch(e)}
        />
      </div>
    );
  };

  const MapEvents = () => {
    const map = useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        setLatitude(lat);
        setLongitude(lng);
        console.log('Latitude:', lat, 'Longitude:', lng);
      },
    });

    return null;
  };

  return (
    <div className="profile-container">
      <label htmlFor="address">Street Address:</label>
      <input
        type="text"
        id="address"
        name="address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required
      />

      <div className="map-container">
        <MapContainer
          center={[48.8566, 2.3522]}
          zoom={13}
          style={{ height: '400px', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {latitude && longitude && (
            <Marker position={[latitude, longitude]} icon={customIcon}>
              <Popup>{address}</Popup>
            </Marker>
          )}
          <SearchBar />
          <MapEvents />
        </MapContainer>
      </div>

      <button type="button" className='saveprofile' onClick={handleSave}>
        Save Profile
      </button>
    </div>
  );
};

export default Profile;
