import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import useStore from '../store/useStore';

const SearchResults = () => {
  const { properties, fetchProperties } = useStore();
  const [searchParams] = useSearchParams();
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  const location = searchParams.get('location') || '';
  const checkIn = searchParams.get('checkIn') || '';
  const checkOut = searchParams.get('checkOut') || '';

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  useEffect(() => {
    const active = properties.filter(p => p.status === 'ACTIVE');
    
    if (location) {
      const searchTerm = location.toLowerCase();
      const filtered = active.filter(p => 
        (p.address && p.address.toLowerCase().includes(searchTerm)) ||
        (p.city && p.city.toLowerCase().includes(searchTerm)) ||
        (p.name && p.name.toLowerCase().includes(searchTerm))
      );
      setFilteredProperties(filtered);
    } else {
      setFilteredProperties(active);
    }
  }, [properties, location]);

  const getImageUrl = (path) => {
    if (!path) return 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&q=80';
    if (path.startsWith('http')) return path;
    const isProduction = typeof window !== 'undefined' && window.location.hostname.includes('onrender');
    const base = isProduction ? 'https://teammate-backend-rk5a.onrender.com' : 'http://127.0.0.1:5001';
    return `${base}${path}`;
  };

  const getPropertyCoordinates = (property) => {
    return {
      lat: property.latitude || 23.8103 + (Math.random() - 0.5) * 0.1,
      lng: property.longitude || 90.4125 + (Math.random() - 0.5) * 0.1
    };
  };

  useEffect(() => {
    const loadMap = () => {
      if (typeof google !== 'undefined' && google.maps) {
        setMapLoaded(true);
        return;
      }
      
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=&callback=initMap`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);
    };
    loadMap();
  }, []);

  useEffect(() => {
    if (mapLoaded && filteredProperties.length > 0 && typeof google !== 'undefined') {
      const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 23.8103, lng: 90.4125 },
        zoom: 12
      });

      filteredProperties.forEach(property => {
        const coords = getPropertyCoordinates(property);
        new google.maps.Marker({
          position: coords,
          map,
          title: property.name,
          label: {
            text: `$${property.pricePerNight || 100}`,
            color: 'white',
            fontSize: '12px',
            fontWeight: 'bold'
          }
        });
      });

      if (filteredProperties.length > 0) {
        const firstProp = filteredProperties[0];
        const coords = getPropertyCoordinates(firstProp);
        map.setCenter(coords);
      }
    }
  }, [mapLoaded, filteredProperties]);

  return (
    <PublicLayout>
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 200px)' }}>
        <div style={{ flex: '1', padding: '24px', overflowY: 'auto' }}>
          <div style={{ marginBottom: '24px' }}>
            <h1 className="landing-h2" style={{ marginBottom: '8px' }}>Search Results</h1>
            <p style={{ color: '#666' }}>
              {filteredProperties.length} properties found
              {location && ` in "${location}"`}
              {checkIn && ` (Check-in: ${checkIn})`}
              {checkOut && ` - Check-out: ${checkOut})`}
            </p>
          </div>

          {filteredProperties.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
              {filteredProperties.map((property) => {
                let images = [];
                try {
                  images = property.images ? JSON.parse(property.images) : [];
                } catch (e) { images = []; }
                
                return (
                  <Link to={`/properties/${property.id}`} key={property.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className="landing-service-card" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', height: '100%' }}>
                      <img 
                        src={getImageUrl(images[0])} 
                        alt={property.name}
                        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                      />
                      <div style={{ padding: '16px' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px' }}>{property.name}</h3>
                        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '8px' }}>{property.address}</p>
                        <div style={{ display: 'flex', gap: '12px', fontSize: '0.85rem', color: '#888', marginBottom: '12px' }}>
                          {property.bedrooms && <span>🛏️ {property.bedrooms} beds</span>}
                          {property.bathrooms && <span>🛁 {property.bathrooms} baths</span>}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--landing-primary)' }}>
                            ${property.pricePerNight || 100}<span style={{ fontSize: '0.9rem', fontWeight: '400', color: '#666' }}>/night</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '20px' }}>No properties found matching your criteria.</p>
              <Link to="/properties" className="landing-btn landing-btn-primary">Browse All Properties</Link>
            </div>
          )}
        </div>

        <div style={{ width: '50%', minHeight: '500px', position: 'sticky', top: '0' }}>
          <div id="map" style={{ width: '100%', height: '100%', minHeight: '500px', background: '#e5e5e5' }}>
            {!mapLoaded && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>
                <p>Loading map...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default SearchResults;
