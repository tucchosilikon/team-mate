import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import api from '../api/axios';
import {
    MapPin, Bed, Bath, Users, ChevronLeft, ChevronRight,
    Wifi, PawPrint, Car, Flame, Sun, Umbrella, Key
} from 'lucide-react';

const ServiceIcon = ({ icon: Icon, active, label, color = "text-blue-500" }) => (
    <div className={`p-1.5 rounded-full ${active ? 'bg-slate-50' : 'opacity-30 grayscale'}`} title={label}>
        <Icon size={16} className={active ? color : 'text-slate-400'} />
    </div>
);

const PropertyCard = ({ property }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

    const nextImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const isProduction = typeof window !== 'undefined' && window.location.hostname.includes('onrender');
    const apiBase = isProduction 
        ? 'https://teammate-backend-rk5a.onrender.com'
        : ((import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001/api').replace('/api', ''));
    const getImageUrl = (path) => path.startsWith('http') ? path : `${apiBase}${path}`;

    return (
        <Link
            to={`/properties/${property.id}`}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group flex flex-col h-full"
        >
            <div className="h-56 relative bg-slate-200">
                <img
                    src={getImageUrl(images[currentImageIndex])}
                    alt={property.name}
                    className="w-full h-full object-cover transition-transform duration-500"
                />

                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-1 bg-black/30 hover:bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-black/30 hover:bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronRight size={20} />
                        </button>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                            {images.map((_, idx) => (
                                <div key={idx} className={`w-1.5 h-1.5 rounded-full ${idx === currentImageIndex ? 'bg-white' : 'bg-white/50'}`} />
                            ))}
                        </div>
                    </>
                )}
            </div>

            <div className="p-4 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-slate-900 leading-tight mb-2">{property.name}</h3>

                <div className="flex items-center text-slate-500 text-sm mb-4">
                    <MapPin size={14} className="mr-1 shrink-0" />
                    <span className="truncate">{property.address}</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-600 mb-4 border-b border-slate-50 pb-4">
                    <div className="flex items-center gap-1"><Users size={14} className="text-blue-500" /> <span>{property.maxOccupancy}</span></div>
                    <div className="flex items-center gap-1"><Bed size={14} className="text-blue-500" /> <span>{property.bedrooms}</span></div>
                    <div className="flex items-center gap-1"><Bath size={14} className="text-blue-500" /> <span>{property.bathrooms}</span></div>
                </div>

                <div className="flex items-center gap-1 flex-wrap">
                    <ServiceIcon icon={PawPrint} active={property.petsAllowed} label="Pets" color="text-amber-600" />
                    <ServiceIcon icon={Wifi} active={!!property.wifiName} label="WiFi" color="text-blue-600" />
                    <ServiceIcon icon={Car} active={property.parkingPassesNeeded || property.maxVehicles > 0} label="Parking" color="text-purple-600" />
                    <ServiceIcon icon={Flame} active={property.hasStove} label="Kitchen" color="text-orange-600" />
                    <ServiceIcon icon={Sun} active={property.outdoorShower || property.grillType} label="Outdoor" color="text-yellow-500" />
                    <ServiceIcon icon={Umbrella} active={property.beachGearLocation} label="Beach Gear" color="text-cyan-500" />
                </div>

                <div className="mt-auto pt-4">
                    <span className="text-blue-600 font-semibold text-sm">View Details →</span>
                </div>
            </div>
        </Link>
    );
};

const PublicProperties = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const isProduction = typeof window !== 'undefined' && window.location.hostname.includes('onrender');
                const baseUrl = isProduction 
                    ? 'https://teammate-backend-rk5a.onrender.com'
                    : 'http://127.0.0.1:5001';
                const { data } = await api.get(`${baseUrl}/api/properties/public`);
                setProperties(data);
            } catch (error) {
                console.error('Error fetching properties:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProperties();
    }, []);

    return (
        <PublicLayout>
            <div className="landing-container" style={{ padding: '60px 20px' }}>
                <div style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '16px', color: 'var(--landing-navy)' }}>
                        Our Properties
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
                        Explore our curated collection of premium rental properties
                    </p>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px' }}>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    </div>
                ) : properties.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', background: '#f9fafb', borderRadius: '8px' }}>
                        <p style={{ color: '#666' }}>No properties available at the moment.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '40px' }}>
                        {properties.map((property) => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
};

export default PublicProperties;
