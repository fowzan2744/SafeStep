import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import { EMERGENCY_SERVICES_ENDPOINTS } from '../services/api';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons for different emergency services
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        width: 8px;
        height: 8px;
        background-color: white;
        border-radius: 50%;
      "></div>
    </div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

// Map center component to handle user location updates
function MapCenter({ userLocation }) {
  const map = useMap();
  
  useEffect(() => {
    if (userLocation) {
      map.setView([userLocation.lat, userLocation.lng], 13);
    }
  }, [userLocation, map]);
  
  return null;
}

// Map reference component to access map instance
function MapRef({ mapRef }) {
  const map = useMap();
  
  useEffect(() => {
    if (mapRef) {
      mapRef.current = map;
    }
  }, [map, mapRef]);
  
  return null;
}

const EmergencyServicesMap = ({ userLocation }) => {
  const [emergencyServices, setEmergencyServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [poiServices, setPoiServices] = useState([]);
  const [isSearchingPOI, setIsSearchingPOI] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    // Fetch nearby emergency services from API
    const fetchEmergencyServices = async () => {
      if (!userLocation) return;

      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/emergency-services`, {
          params: {
            lat: userLocation.lat,
            lng: userLocation.lng,
            radius: 5000
          }
        });

        if (response.data && response.data.length > 0) {
          setEmergencyServices(response.data);
        } else {
          // Fallback to hardcoded services if none found
          setEmergencyServices(fallbackEmergencyServices);
        }
      } catch (error) {
        console.error('Error fetching emergency services:', error);
        // Fallback to hardcoded services on error
        setEmergencyServices(fallbackEmergencyServices);
      } finally {
        setLoading(false);
      }
    };

    fetchEmergencyServices();
  }, [userLocation]);

  // POI Search function using Overpass API
  const searchPOIEmergencyServices = async () => {
    if (!mapRef.current) return;
    
    setIsSearchingPOI(true);
    try {
      const map = mapRef.current;
      const bounds = map.getBounds();
      
      // Overpass API query for emergency services in current map view
      const query = `
        [out:json][timeout:25];
        (
          node["amenity"="police"](${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()});
          node["amenity"="hospital"](${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()});
          node["amenity"="fire_station"](${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()});
          way["amenity"="police"](${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()});
          way["amenity"="hospital"](${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()});
          way["amenity"="fire_station"](${bounds.getSouth()},${bounds.getWest()},${bounds.getNorth()},${bounds.getEast()});
        );
        out body;
        >;
        out skel qt;
      `;
      
      const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      // Check if we have valid data
      if (!data.elements || !Array.isArray(data.elements)) {
        setPoiServices([]);
        return;
      }
      
      // Process the POI data
      const validElements = data.elements.filter(element => 
        element.type === 'node' && 
        element.lat && 
        element.lon && 
        element.tags && 
        element.tags.amenity
      );
      
      const processedPOI = validElements.map(element => ({
        _id: `poi_${element.id}`,
        name: element.tags.name || `${element.tags.amenity} Station`,
        type: element.tags.amenity,
        address: element.tags.address || element.tags['addr:street'] || 'Address not available',
        phone: element.tags.phone || element.tags['contact:phone'] || '999',
        location: {
          coordinates: [element.lon, element.lat]
        },
        distance: 'POI Service',
        isPOI: true
      }));
      
      setPoiServices(processedPOI);
      
    } catch (error) {
      console.error('Error searching POI services:', error);
    } finally {
      setIsSearchingPOI(false);
    }
  };

  const getServiceIcon = (type) => {
    switch (type) {
      case 'police':
        return createCustomIcon('#3B82F6'); // Blue
      case 'fire':
        return createCustomIcon('#EF4444'); // Red
      case 'hospital':
        return createCustomIcon('#10B981'); // Green
      case 'poison_control':
        return createCustomIcon('#8B5CF6'); // Purple
      case 'domestic_violence':
        return createCustomIcon('#EC4899'); // Pink
      case 'suicide_prevention':
        return createCustomIcon('#6366F1'); // Indigo
      default:
        return createCustomIcon('#6B7280'); // Gray
    }
  };

  const getServiceColor = (type) => {
    switch (type) {
      case 'police':
        return 'text-blue-600';
      case 'fire':
        return 'text-red-600';
      case 'hospital':
        return 'text-green-600';
      case 'poison_control':
        return 'text-purple-600';
      case 'domestic_violence':
        return 'text-pink-600';
      case 'suicide_prevention':
        return 'text-indigo-600';
      default:
        return 'text-gray-600';
    }
  };

  if (!userLocation) {
    return (
      <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <svg className="h-12 w-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p>Location access required to show emergency services</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-2"></div>
          <p>Loading emergency services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* POI Search Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Emergency Services Map</h3>
        <button
          onClick={searchPOIEmergencyServices}
          disabled={isSearchingPOI}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          {isSearchingPOI ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Searching...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Find More Services
            </span>
          )}
        </button>
      </div>

      {/* Map Container */}
      <div className="bg-white rounded-lg overflow-hidden shadow-md" style={{ height: '350px' }}>
        <MapContainer
          center={[userLocation.lat, userLocation.lng]}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* User location marker */}
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={createCustomIcon('#8B5CF6')} // Purple for user
          >
            <Popup>
              <div className="text-center">
                <p className="font-semibold text-purple-600">Your Location</p>
                <p className="text-sm text-gray-600">
                  {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>

          {/* Emergency services markers */}
          {emergencyServices.map((service) => {
            // Handle both API response format (location.coordinates) and fallback format (lat/lng)
            const lat = service.location?.coordinates?.[1] || service.lat;
            const lng = service.location?.coordinates?.[0] || service.lng;
            
            return (
              <Marker
                key={service._id || service.id}
                position={[lat, lng]}
                icon={getServiceIcon(service.type)}
              >
                <Popup>
                  <div className="text-center min-w-[200px]">
                    <h3 className={`font-semibold ${getServiceColor(service.type)}`}>
                      {service.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{service.address}</p>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-sm font-medium">{service.phone}</span>
                    </div>
                    <p className="text-xs text-gray-500">{service.distance} away</p>
                    <button
                      onClick={() => window.open(`tel:${service.phone}`, '_self')}
                      className="mt-2 px-3 py-1 bg-indigo-500 text-white text-xs rounded hover:bg-indigo-600 transition-colors"
                    >
                      Call Now
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* POI Emergency services markers */}
          {poiServices.map((service) => {
            const lat = service.location.coordinates[1];
            const lng = service.location.coordinates[0];
            
            return (
              <Marker
                key={service._id}
                position={[lat, lng]}
                icon={getServiceIcon(service.type)}
              >
                <Popup>
                  <div className="text-center min-w-[200px]">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <h3 className={`font-semibold ${getServiceColor(service.type)}`}>
                        {service.name}
                      </h3>
                      <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">POI</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{service.address}</p>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-sm font-medium">{service.phone}</span>
                    </div>
                    <p className="text-xs text-gray-500">{service.distance}</p>
                    <button
                      onClick={() => window.open(`tel:${service.phone}`, '_self')}
                      className="mt-2 px-3 py-1 bg-indigo-500 text-white text-xs rounded hover:bg-indigo-600 transition-colors"
                    >
                      Call Now
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          <MapCenter userLocation={userLocation} />
          <MapRef mapRef={mapRef} />
        </MapContainer>
      </div>

      {/* Compact Legend and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Legend */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4">
          <h4 className="font-semibold text-gray-900 mb-3 text-sm flex items-center gap-2">
            <svg className="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
            </svg>
            Legend
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full border border-white shadow-sm"></div>
              <span className="text-gray-700">Police</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full border border-white shadow-sm"></div>
              <span className="text-gray-700">Fire</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full border border-white shadow-sm"></div>
              <span className="text-gray-700">Hospital</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-purple-500 rounded-full border border-white shadow-sm"></div>
              <span className="text-gray-700">Your Location</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
          <h4 className="font-semibold text-blue-900 mb-3 text-sm flex items-center gap-2">
            <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Nearby Services
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-blue-800">Police:</span>
              <span className="font-bold text-blue-600 bg-blue-200 px-2 py-1 rounded-full text-xs">
                {emergencyServices.filter(s => s.type === 'police').length + poiServices.filter(s => s.type === 'police').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-800">Fire:</span>
              <span className="font-bold text-red-600 bg-red-200 px-2 py-1 rounded-full text-xs">
                {emergencyServices.filter(s => s.type === 'fire').length + poiServices.filter(s => s.type === 'fire_station').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-800">Medical:</span>
              <span className="font-bold text-green-600 bg-green-200 px-2 py-1 rounded-full text-xs">
                {emergencyServices.filter(s => s.type === 'hospital').length + poiServices.filter(s => s.type === 'hospital').length}
              </span>
            </div>
            {poiServices.length > 0 && (
              <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                <span className="text-blue-800">POI Found:</span>
                <span className="font-bold text-orange-600 bg-orange-200 px-2 py-1 rounded-full text-xs">{poiServices.length}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyServicesMap; 