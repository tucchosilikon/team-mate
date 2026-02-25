import { useEffect, useState } from 'react';
import useStore from '../store/useStore';
import {
    Plus, MapPin, ExternalLink, Edit, Trash2,
    Bed, Bath, Users, Flame, Utensils, Thermometer,
    Car, PawPrint, Cigarette, Calendar, Home, Soup,
    ChevronLeft, ChevronRight, Wifi, Sun, Umbrella, Wind,
    Bike, ShieldCheck, Key
} from 'lucide-react';
import PropertyDetailsModal from '../components/PropertyDetailsModal';
import PropertyForm from '../components/PropertyForm';

const ServiceIcon = ({ icon: Icon, active, label, details, color = "text-blue-500", onClick }) => (
    <div className="relative group">
        <button
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className={`p-1.5 rounded-full transition-colors ${active ? 'bg-slate-50 hover:bg-slate-100' : 'opacity-30 grayscale'}`}
            title={label}
        >
            <Icon size={16} className={active ? color : 'text-slate-400'} />
        </button>
    </div>
);

const PropertyCard = ({ property, onSelect, onEdit, onDelete, deleting }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [expandedService, setExpandedService] = useState(null);

    // Parse images
    let images = [];
    if (property.images) {
        try {
            if (Array.isArray(property.images)) images = property.images;
            else if (typeof property.images === 'string') images = JSON.parse(property.images);
        } catch (e) {
            images = [property.images];
        }
    }
    // Ensure at least one image/placeholder
    if (images.length === 0) images = ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'];

    const nextImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const apiBase = (import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001/api').replace('/api', '');
    const getImageUrl = (path) => path.startsWith('http') ? path : `${apiBase}${path}`;

    const toggleService = (service) => {
        if (expandedService === service) setExpandedService(null);
        else setExpandedService(service);
    };

    return (
        <div
            onClick={() => onSelect(property)}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group flex flex-col h-full"
        >
            {/* Image Carousel */}
            <div className="h-56 relative bg-slate-200">
                <img
                    src={getImageUrl(images[currentImageIndex])}
                    alt={property.name}
                    className="w-full h-full object-cover transition-transform duration-500"
                />

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold backdrop-blur-md ${property.status === 'ACTIVE' ? 'bg-green-500/90 text-white' : 'bg-slate-500/90 text-white'}`}>
                        {property.status}
                    </span>
                </div>

                {/* Listing Icons (Overlay Top Right?) User said: "only links should be rightside of each property names" - Oh, in the card content. 
                   But also "Show all Icons". Let's put them in content next to name.
                */}

                {/* Carousel Controls */}
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
                {/* Header: Name + Listing Icons */}
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-slate-900 leading-tight mr-2 flex-1">{property.name}</h3>

                    {/* Listing Icons Row */}
                    <div className="flex items-center gap-1.5 shrink-0">
                        {/* Hospitable - Always Show, dim if no URL */}
                        <a
                            href={property.hospitableUrl || property.listingUrl || '#'}
                            target={(property.hospitableUrl || property.listingUrl) ? "_blank" : "_self"}
                            rel="noreferrer"
                            onClick={(e) => !(property.hospitableUrl || property.listingUrl) && e.preventDefault()}
                            className={`w-6 h-6 rounded-full flex items-center justify-center transition-opacity ${(property.hospitableUrl || property.listingUrl) ? 'opacity-100 hover:opacity-80' : 'opacity-20 cursor-default'}`}
                            title={(property.hospitableUrl || property.listingUrl) ? "View on Hospitable" : "Not listed"}
                        >
                            <img src="/hospitable.svg" alt="Hospitable" className="w-full h-full" />
                        </a>

                        {/* Airbnb */}
                        <a
                            href={property.airbnbUrl || '#'}
                            target={property.airbnbUrl ? "_blank" : "_self"}
                            rel="noreferrer"
                            onClick={(e) => !property.airbnbUrl && e.preventDefault()}
                            className={`w-6 h-6 rounded-full flex items-center justify-center transition-opacity ${property.airbnbUrl ? 'opacity-100 hover:opacity-80' : 'opacity-20 cursor-default'}`}
                            title={property.airbnbUrl ? "View on Airbnb" : "Not listed"}
                        >
                            <img src="/airbnb.svg" alt="Airbnb" className="w-full h-full" />
                        </a>

                        {/* VRBO */}
                        <a
                            href={property.vrboListingUrl || '#'}
                            target={property.vrboListingUrl ? "_blank" : "_self"}
                            rel="noreferrer"
                            onClick={(e) => !property.vrboListingUrl && e.preventDefault()}
                            className={`w-6 h-6 rounded-full flex items-center justify-center transition-opacity ${property.vrboListingUrl ? 'opacity-100 hover:opacity-80' : 'opacity-20 cursor-default'}`}
                            title={property.vrboListingUrl ? "View on VRBO" : "Not listed"}
                        >
                            <img src="/vrbo.svg" alt="VRBO" className="w-full h-full" />
                        </a>
                    </div>
                </div>

                <div className="flex items-center text-slate-500 text-sm mb-4">
                    <MapPin size={14} className="mr-1 shrink-0" />
                    <span className="truncate">{property.address}</span>
                </div>

                {/* Specs Row */}
                <div className="flex items-center gap-3 text-xs text-slate-600 mb-4 border-b border-slate-50 pb-4">
                    <div className="flex items-center gap-1"><Users size={14} className="text-blue-500" /> <span>{property.maxOccupancy}</span></div>
                    <div className="flex items-center gap-1"><Bed size={14} className="text-blue-500" /> <span>{property.bedrooms}</span></div>
                    <div className="flex items-center gap-1"><Bath size={14} className="text-blue-500" /> <span>{property.bathrooms}</span></div>
                </div>

                {/* Service Icons Row */}
                <div className="mb-4 relative">
                    <div className="flex items-center gap-1 flex-wrap">
                        <ServiceIcon
                            icon={PawPrint}
                            active={property.petsAllowed}
                            label="Pets"
                            color="text-amber-600"
                            onClick={() => toggleService('pets')}
                        />
                        <ServiceIcon
                            icon={Wifi}
                            active={!!property.wifiName}
                            label="WiFi"
                            color="text-blue-600"
                            onClick={() => toggleService('wifi')}
                        />
                        <ServiceIcon
                            icon={Car}
                            active={property.parkingPassesNeeded || property.maxVehicles > 0}
                            label="Parking"
                            color="text-purple-600"
                            onClick={() => toggleService('parking')}
                        />
                        <ServiceIcon
                            icon={Flame}
                            active={property.hasStove}
                            label="Kitchen"
                            color="text-orange-600"
                            onClick={() => toggleService('kitchen')}
                        />
                        <ServiceIcon
                            icon={Sun}
                            active={property.outdoorShower || property.grillType}
                            label="Outdoor"
                            color="text-yellow-500"
                            onClick={() => toggleService('outdoor')}
                        />
                        <ServiceIcon
                            icon={Umbrella}
                            active={property.beachGearLocation}
                            label="Beach Gear"
                            color="text-cyan-500"
                            onClick={() => toggleService('beach')}
                        />
                        <ServiceIcon
                            icon={Key}
                            active={true}
                            label="Access"
                            color="text-slate-600"
                            onClick={() => toggleService('access')}
                        />
                    </div>

                    {/* Popover Detail View */}
                    {expandedService && (
                        <div onClick={(e) => e.stopPropagation()} className="mt-2 p-3 bg-slate-50 rounded-lg text-xs border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-1">
                            <div className="flex justify-between items-center mb-2 pb-1 border-b border-slate-200">
                                <span className="font-bold uppercase text-slate-500">{expandedService}</span>
                                <button onClick={() => setExpandedService(null)} className="text-slate-400 hover:text-slate-600"><Trash2 size={12} /></button>
                            </div>

                            {/* Content based on service */}
                            <div className="space-y-1 text-slate-700">
                                {expandedService === 'pets' && (
                                    <>
                                        <p>Max Pets: <span className="font-semibold">{property.maxPets || 0}</span></p>
                                        <p>Fee: <span className="font-semibold">${property.petFee || 0}</span></p>
                                        {property.petPolicy && <p className="italic">"{property.petPolicy}"</p>}
                                    </>
                                )}
                                {expandedService === 'wifi' && (
                                    <>
                                        <p>Network: <span className="select-all font-mono font-bold">{property.wifiName}</span></p>
                                        <p>Pass: <span className="select-all font-mono font-bold">{property.wifiPassword}</span></p>
                                    </>
                                )}
                                {expandedService === 'parking' && (
                                    <>
                                        <p>Max Vehicles: <span className="font-semibold">{property.maxVehicles || 'N/A'}</span></p>
                                        <p>Passes: <span className="font-semibold">{property.parkingPassesNeeded ? 'Required' : 'None'}</span></p>
                                        <p>{property.parkingInstructions}</p>
                                    </>
                                )}
                                {expandedService === 'kitchen' && (
                                    <>
                                        <p>Stove: {property.hasStove ? 'Yes' : 'No'}</p>
                                        <p>Dishwasher: {property.hasDishwasher ? 'Yes' : 'No'}</p>
                                        <p>Ice Maker: {property.iceMakerStatus}</p>
                                    </>
                                )}
                                {expandedService === 'outdoor' && (
                                    <>
                                        <p>Shower: {property.outdoorShower}</p>
                                        <p>Grill: {property.grillType} ({property.grillLocation})</p>
                                    </>
                                )}
                                {expandedService === 'beach' && (
                                    <>
                                        <p>Gear: {property.beachGearLocation}</p>
                                        <p>Bikes: {property.bikeCount} ({property.bikesProvided ? 'Yes' : 'No'})</p>
                                    </>
                                )}
                                {expandedService === 'access' && (
                                    <>
                                        <p>Entry: {property.entryMethod}</p>
                                        {property.lockboxCode && <p>Lockbox: <span className="font-mono">{property.lockboxCode}</span></p>}
                                        {property.emergencyCode && <p className="text-red-500">Emergency: {property.emergencyCode}</p>}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-auto flex space-x-2 pt-4 border-t border-slate-50">
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(property); }}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors text-xs font-bold"
                    >
                        <Edit size={14} />
                        <span>Edit</span>
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(property.id, property.name); }}
                        disabled={deleting === property.id}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs font-bold disabled:opacity-50"
                    >
                        <Trash2 size={14} />
                        <span>Delete</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

const Properties = () => {
    const { properties, fetchProperties, deleteProperty, isPropertiesLoading } = useStore();
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [propertyToEdit, setPropertyToEdit] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const [deleting, setDeleting] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProperties();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDelete = async (id, name) => {
        if (!confirm(`Are you sure you want to delete "${name}" ? This cannot be undone.`)) {
            return;
        }
        setDeleting(id);
        try {
            await deleteProperty(id);
        } catch (error) {
            alert('Failed to delete property');
        } finally {
            setDeleting(null);
        }
    };

    // Filter and sort properties
    const filteredProperties = (Array.isArray(properties) ? properties : [])
        .filter(property =>
            (property.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (property.address || '').toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    const handleEdit = (property) => {
        setPropertyToEdit(property);
        setShowForm(true);
    };

    const handleAdd = () => {
        setPropertyToEdit(null);
        setShowForm(true);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setPropertyToEdit(null);
        fetchProperties(); // Refresh properties after form close
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold text-slate-900">Properties</h2>

                <div className="flex gap-4 w-full md:w-auto">
                    {/* Search Bar */}
                    <div className="relative flex-1 md:w-64">
                        <input
                            type="text"
                            placeholder="Search properties..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="absolute left-3 top-2.5 text-slate-400">
                            <MapPin size={18} />
                        </div>
                    </div>

                    <button onClick={handleAdd} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 whitespace-nowrap">
                        <Plus size={18} />
                        <span>Add Property</span>
                    </button>
                </div>
            </div>

            {isPropertiesLoading && properties.length === 0 ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-500">Loading properties...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProperties.map((property) => (
                        <PropertyCard
                            key={property.id}
                            property={property}
                            onSelect={setSelectedProperty}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            deleting={deleting}
                        />
                    ))}
                </div>
            )}

            {selectedProperty && (
                <PropertyDetailsModal
                    property={selectedProperty}
                    onClose={() => {
                        setSelectedProperty(null);
                        fetchProperties();
                    }}
                />
            )}

            {showForm && (
                <PropertyForm
                    property={propertyToEdit}
                    onClose={() => {
                        setShowForm(false);
                        fetchProperties();
                    }}
                />
            )}
        </div>
    );
};

export default Properties;
