// MapSearch.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMapEvents } from 'react-leaflet';
import axios from 'axios';
import MerchantCouponsDetails from '../MerchantCoupanDetails/MerchantCouponsDetails.js'; // Import the new component
import customMarkerIcon from '../../Assets/custom-marker.png';
import L from 'leaflet';
import couponMarkerIcon from '../../Assets/coupon-marker.png';


import 'leaflet/dist/leaflet.css';
import './style.css';

const MapSearch = () => {
  const [userLocation, setUserLocation] = useState({ latitude: null, longitude: null });
  const [nearbyCoupons, setNearbyCoupons] = useState([]);
  const [merchantCouponCounts, setMerchantCouponCounts] = useState({});
  const [selectedMerchant, setSelectedMerchant] = useState(null);

  useEffect(() => {
    fetchUserLocation();
    fetchNearbyCoupons();
  }, []);

  const fetchUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  const fetchNearbyCoupons = async () => {
    try {
      const response = await axios.post('http://localhost:8001/getNearbyCoupons', {
        userLatitude: userLocation.latitude,
        userLongitude: userLocation.longitude,
      });

      setNearbyCoupons(response.data);

      // Calculate and update merchant coupon counts
      const counts = {};
      response.data.forEach((coupon) => {
        counts[coupon.merchantEmail] = (counts[coupon.merchantEmail] || 0) + 1;
      });
      setMerchantCouponCounts(counts);
    } catch (error) {
      console.error('Error fetching nearby coupons:', error);
    }
  };

  const MapEvents = () => {
    const map = useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        setUserLocation({ latitude: lat, longitude: lng });
        fetchNearbyCoupons();
      },
    });

    return null;
  };

  const customIcon = new L.Icon({
    iconUrl: customMarkerIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const couponIcon = new L.Icon({
    iconUrl: couponMarkerIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const handleMarkerClick = (merchantEmail) => {
    setSelectedMerchant(merchantEmail);
  };

  return (
    <div className="map-container">
      <h1 className="title">Discover exclusive deals around you!</h1>
      <MapContainer
        center={[userLocation.latitude || 0, userLocation.longitude || 0]}
        zoom={13}
        style={{ height: '400px', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {userLocation.latitude && userLocation.longitude && (
          <Marker position={[userLocation.latitude, userLocation.longitude]} icon={customIcon}>
            <Popup>Your Location</Popup>
          </Marker>
        )}
        {nearbyCoupons.map((coupon) => (
          <Marker
            key={coupon._id}
            position={[coupon.latitude, coupon.longitude]}
            icon={couponIcon}
            eventHandlers={{
              click: () => handleMarkerClick(coupon.merchantEmail),
            }}
          >
            <Popup>{`${coupon.address}, ${coupon.merchantEmail}`}</Popup>
            { <Tooltip>{`${coupon.address}`}</Tooltip>  /*${merchantCouponCounts[coupon.merchantEmail] || 0} */}
          </Marker>
        ))}
        <MapEvents />
      </MapContainer>

      {/* Display selected merchant's coupons details */}
      {selectedMerchant && <MerchantCouponsDetails merchantEmail={selectedMerchant} />}
    </div>
  );
};


export default MapSearch;
