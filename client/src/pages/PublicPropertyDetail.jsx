import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import api from '../api/axios';
import {
    MapPin, Bed, Bath, Users, ChevronLeft, ChevronRight,
    Wifi, PawPrint, Car, Flame, Sun, Umbrella, Key, ArrowLeft
} from 'lucide-react';

const PublicPropertyDetail = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const isProduction = typeof window !== 'undefined' && window.location.hostname.includes('onrender');
                const baseUrl = isProduction 
                    ? 'https://teammate-backend-rk5a.onrender.com'
                    : 'http://127.0.0.1:5001';
                const { data } = await api.get(`${baseUrl}/api/properties/public/${id}`);
                setProperty(data);
            } catch (error) {
                console.error('Error fetching property:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id]);

    if (loading) {
        return (
            <PublicLayout>
                <div style={{ textAlign: 'center', padding: '60px' }}>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                </div>
            </PublicLayout>
        );
    }

    if (!property) {
        return (
            <PublicLayout>
                <div style={{ textAlign: 'center', padding: '60px' }}>
                    <p style={{ color: '#666', marginBottom: '20px' }}>Property not found.</p>
                    <Link to="/properties" style={{ color: 'var(--landing-primary)' }}>← Back to Properties</Link>
                </div>
            </PublicLayout>
        );
    }

    let images = [];
    if (property.images) {
        try {
            if (Array.isArray(property.images)) images = property.images;
            else if (typeof property.images === 'string') images = JSON.parse(property.images);
        } catch (e) {
            images = [property.images];
        }
    }
    if (images.length === 0) images = ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'];

    const isProduction = typeof window !== 'undefined' && window.location.hostname.includes('onrender');
    const apiBase = isProduction 
        ? 'https://teammate-backend-rk5a.onrender.com'
        : ((import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001/api').replace('/api', ''));
    const getImageUrl = (path) => path.startsWith('http') ? path : `${apiBase}${path}`;

    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
    const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

    return (
        <PublicLayout>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
                <Link to="/properties" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#666', marginBottom: '24px' }}>
                    <ArrowLeft size={20} /> Back to Properties
                </Link>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginBottom: '60px' }}>
                    <div>
                        <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', height: '400px', background: '#f3f4f6' }}>
                            <img
                                src={getImageUrl(images[currentImageIndex])}
                                alt={property.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            {images.length > 1 && (
                                <>
                                    <button onClick={prevImage} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', padding: '12px', background: 'rgba(0,0,0,0.5)', borderRadius: '50%', color: 'white', border: 'none', cursor: 'pointer' }}>
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button onClick={nextImage} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', padding: '12px', background: 'rgba(0,0,0,0.5)', borderRadius: '50%', color: 'white', border: 'none', cursor: 'pointer' }}>
                                        <ChevronRight size={24} />
                                    </button>
                                    <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
                                        {images.map((_, idx) => (
                                            <div key={idx} style={{ width: '10px', height: '10px', borderRadius: '50%', background: idx === currentImageIndex ? 'white' : 'rgba(255,255,255,0.5)' }} />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '16px', color: 'var(--landing-navy)' }}>{property.name}</h1>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666', marginBottom: '24px' }}>
                            <MapPin size={20} />
                            <span>{property.address}</span>
                        </div>

                        <div style={{ display: 'flex', gap: '24px', marginBottom: '32px', padding: '20px', background: '#f9fafb', borderRadius: '12px' }}>
                            <div style={{ textAlign: 'center' }}>
                                <Users size={24} className="text-blue-500" style={{ margin: '0 auto 8px' }} />
                                <div style={{ fontWeight: '600' }}>{property.maxOccupancy}</div>
                                <div style={{ fontSize: '0.875rem', color: '#666' }}>Guests</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <Bed size={24} className="text-blue-500" style={{ margin: '0 auto 8px' }} />
                                <div style={{ fontWeight: '600' }}>{property.bedrooms}</div>
                                <div style={{ fontSize: '0.875rem', color: '#666' }}>Bedrooms</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <Bath size={24} className="text-blue-500" style={{ margin: '0 auto 8px' }} />
                                <div style={{ fontWeight: '600' }}>{property.bathrooms}</div>
                                <div style={{ fontSize: '0.875rem', color: '#666' }}>Bathrooms</div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '32px' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px' }}>Amenities</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                {property.petsAllowed && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#fef3c7', borderRadius: '8px', fontSize: '0.875rem' }}>
                                        <PawPrint size={16} className="text-amber-600" /> Pets Allowed
                                    </span>
                                )}
                                {property.wifiName && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#dbeafe', borderRadius: '8px', fontSize: '0.875rem' }}>
                                        <Wifi size={16} className="text-blue-600" /> WiFi
                                    </span>
                                )}
                                {(property.parkingPassesNeeded || property.maxVehicles > 0) && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#f3e8ff', borderRadius: '8px', fontSize: '0.875rem' }}>
                                        <Car size={16} className="text-purple-600" /> Parking
                                    </span>
                                )}
                                {property.hasStove && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#ffedd5', borderRadius: '8px', fontSize: '0.875rem' }}>
                                        <Flame size={16} className="text-orange-600" /> Kitchen
                                    </span>
                                )}
                                {(property.outdoorShower || property.grillType) && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#fef9c3', borderRadius: '8px', fontSize: '0.875rem' }}>
                                        <Sun size={16} className="text-yellow-500" /> Outdoor
                                    </span>
                                )}
                                {property.beachGearLocation && (
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#cffafe', borderRadius: '8px', fontSize: '0.875rem' }}>
                                        <Umbrella size={16} className="text-cyan-500" /> Beach Gear
                                    </span>
                                )}
                            </div>
                        </div>

                        {(property.listingUrl || property.airbnbUrl || property.vrboListingUrl) && (
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px' }}>Book Now</h3>
                                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                    {property.airbnbUrl && (
                                        <a href={property.airbnbUrl} target="_blank" rel="noopener noreferrer" style={{ padding: '12px 24px', background: '#ff5a5f', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: '500' }}>
                                            Airbnb
                                        </a>
                                    )}
                                    {property.vrboListingUrl && (
                                        <a href={property.vrboListingUrl} target="_blank" rel="noopener noreferrer" style={{ padding: '12px 24px', background: '#0c5a9d', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: '500' }}>
                                            VRBO
                                        </a>
                                    )}
                                    {property.listingUrl && (
                                        <a href={property.listingUrl} target="_blank" rel="noopener noreferrer" style={{ padding: '12px 24px', background: 'var(--landing-primary)', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: '500' }}>
                                            Book Now
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {property.generalNotes && (
                    <div style={{ marginTop: '40px' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '16px' }}>About this property</h3>
                        <p style={{ lineHeight: '1.8', color: '#444', whiteSpace: 'pre-wrap' }}>{property.generalNotes}</p>
                    </div>
                )}

                {property.accessInstructions && (
                    <div style={{ marginTop: '40px' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '16px' }}>Access Information</h3>
                        <p style={{ lineHeight: '1.8', color: '#444', whiteSpace: 'pre-wrap' }}>{property.accessInstructions}</p>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
};

export default PublicPropertyDetail;
