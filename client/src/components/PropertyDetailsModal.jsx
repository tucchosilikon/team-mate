import { useState } from 'react';
import { X, Upload, Wifi, Key, FileText, Car, Trash, DollarSign, Home, Dog, Zap, Coffee, Sun, Umbrella, Lock, User } from 'lucide-react';
import useStore from '../store/useStore';

const PropertyDetailsModal = ({ property, onClose }) => {
    const { uploadPropertyImage } = useStore();
    const [uploading, setUploading] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const isProduction = typeof window !== 'undefined' && window.location.hostname.includes('onrender');
    const imageBase = isProduction ? 'https://teammate-backend-rk5a.onrender.com' : 'http://127.0.0.1:5001';

    const images = property.images ? JSON.parse(property.images) : [];
    const mainImage = images.length > 0 ? `${imageBase}${images[currentImageIndex]}` : 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            await uploadPropertyImage(property.id, file);
        } catch (error) {
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
                {/* Header Image */}
                <div className="relative h-64 md:h-80 bg-slate-100 group shrink-0">
                    <img
                        src={mainImage}
                        alt={property.name}
                        className="w-full h-full object-cover"
                    />
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors z-10"
                    >
                        <X size={20} />
                    </button>

                    {/* Image Controls */}
                    <div className="absolute bottom-4 right-4 flex space-x-2 z-10">
                        <label className="cursor-pointer flex items-center space-x-2 px-4 py-2 bg-black/70 text-white rounded-lg hover:bg-black/80 transition-colors backdrop-blur-sm">
                            <Upload size={18} />
                            <span className="text-sm font-medium">{uploading ? 'Uploading...' : 'Add Photo'}</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                        </label>
                    </div>

                    {images.length > 1 && (
                        <div className="absolute bottom-4 left-4 flex space-x-2 overflow-x-auto max-w-[60%] z-10 custom-scrollbar">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    className={`h-12 w-16 rounded-md overflow-hidden border-2 transition-all shrink-0 ${currentImageIndex === idx ? 'border-blue-500' : 'border-white/50'}`}
                                >
                                    <img src={`${imageBase}${img}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto">
                    <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-6">
                        <div>
                            <div className="flex items-center space-x-3 mb-1">
                                <h2 className="text-3xl font-bold text-slate-900">{property.name}</h2>
                                {property.code && <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-mono font-bold">{property.code}</span>}
                            </div>
                            <p className="text-slate-500 text-lg flex items-center gap-2">
                                {property.address}
                                {property.unit && <span className="text-slate-400">• {property.unit}</span>}
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <span className={`px-4 py-1.5 rounded-full text-sm font-bold ${property.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                                {property.status}
                            </span>
                            <div className="flex gap-2">
                                {property.listingUrl && <a href={property.listingUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 transition-colors" title="View on Hospitable"><img src="/hospitable.svg" alt="Hospitable" className="w-5 h-5" /></a>}
                                {property.vrboListingUrl && <a href={property.vrboListingUrl} target="_blank" rel="noreferrer" className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100">VRBO</a>}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* LEFT COLUMN */}
                        <div className="space-y-8">
                            <Section title="Property Specs" icon={Home}>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <Metric label="Max Occupancy" value={property.maxOccupancy} />
                                    <Metric label="Bedrooms" value={property.bedrooms} />
                                    <Metric label="Beds" value={property.beds} />
                                    <Metric label="Bathrooms" value={property.bathrooms} />
                                </div>
                                <InfoBlock label="Bed Setup" text={property.bedSetup} />
                                <div className="grid grid-cols-2 gap-4 mt-4 border-t pt-4 border-slate-100">
                                    <Metric label="Check-in" value={property.checkInTime} />
                                    <Metric label="Check-out" value={property.checkOutTime} />
                                </div>
                            </Section>

                            <Section title="Access & Entry" icon={Key}>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-slate-500">Method</span>
                                        <span className="text-sm font-bold text-slate-900">{property.entryMethod?.replace('_', ' ') || 'N/A'}</span>
                                    </div>
                                    {property.lockboxCode && (
                                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                                            <p className="text-xs text-slate-500 mb-1">Lockbox</p>
                                            <div className="flex justify-between">
                                                <span className="font-mono font-bold text-lg">{property.lockboxCode}</span>
                                                <span className="text-xs text-slate-400 self-center">{property.lockboxLocation}</span>
                                            </div>
                                        </div>
                                    )}
                                    <InfoBlock label="Instructions" text={property.accessInstructions} />

                                    {property.emergencyCode && (
                                        <div className="pt-2 border-t border-slate-200">
                                            <p className="font-medium text-red-600 text-xs mb-1">Emergency Code</p>
                                            <p className="text-slate-900 font-mono bg-red-50 inline-block px-2 py-1 rounded text-sm">{property.emergencyCode}</p>
                                        </div>
                                    )}
                                </div>
                                {(property.backupKeyLocation || property.backupKeyCode) && (
                                    <div className="mt-4 p-3 bg-slate-50 rounded-lg text-sm">
                                        <p className="font-bold text-slate-600 mb-1">Backup Access</p>
                                        <p className="text-slate-600">Key at: <span className="font-medium">{property.backupKeyLocation}</span></p>
                                        {property.backupKeyCode && <p className="text-slate-600">Code: <span className="font-mono">{property.backupKeyCode}</span></p>}
                                    </div>
                                )}
                            </Section>

                            <Section title="WiFi & Internet" icon={Wifi}>
                                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-3">
                                    <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-blue-100">
                                        <span className="text-sm text-blue-800 font-medium">Network</span>
                                        <span className="text-sm font-bold text-slate-900">{property.wifiName || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-white p-2 rounded-lg border border-blue-100">
                                        <span className="text-sm text-blue-800 font-medium">Password</span>
                                        <span className="font-mono font-bold text-slate-900 select-all">{property.wifiPassword || 'N/A'}</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Modem Location</p>
                                        <p className="text-sm font-medium">{property.modemLocation || 'N/A'}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${property.guestModemAccess ? 'bg-green-500' : 'bg-red-300'}`}></div>
                                        <span className="text-xs text-slate-500">Guest Access to Modem</span>
                                    </div>
                                </div>
                            </Section>
                        </div>

                        {/* MIDDLE COLUMN */}
                        <div className="space-y-8">
                            <Section title="Kitchen & Appliances" icon={Coffee}>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <StatusBadge label="Stove" active={property.hasStove} />
                                    <StatusBadge label="Dishwasher" active={property.hasDishwasher} />
                                </div>
                                <div className="space-y-3">
                                    <InfoBlock label="Coffee Maker" text={property.coffeeMakerType} />
                                    <InfoBlock label="Ice Maker" text={property.iceMakerStatus} />
                                    <InfoBlock label="Disposal" text={property.garbageDisposalInfo} />
                                    <InfoBlock label="Notes" text={property.applianceNotes} />
                                </div>
                            </Section>

                            <Section title="Utilities" icon={Zap}>
                                <InfoBlock label="Breaker Panel" text={property.breakerLocation} />
                                <div className="mt-3">
                                    <p className="text-xs font-medium text-slate-500 mb-1">Thermostat</p>
                                    <p className="text-sm text-slate-800">{property.thermostatLocation} ({property.thermostatControl})</p>
                                </div>
                            </Section>

                            <Section title="Parking & Waste" icon={Car}>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600">Max Vehicles</span>
                                        <span className="font-bold text-slate-900">{property.maxVehicles || 'N/A'}</span>
                                    </div>
                                    <StatusBadge label="Passes Needed" active={property.parkingPassesNeeded} />
                                    <InfoBlock label="Parking Instructions" text={property.parkingInstructions} />
                                    <div className="border-t border-slate-100 pt-3">
                                        <div className="flex items-center gap-2 mb-2 text-slate-700">
                                            <Trash size={14} />
                                            <span className="font-medium text-sm">Waste Management</span>
                                        </div>
                                        <p className="text-xs font-bold bg-yellow-100 text-yellow-800 inline-block px-2 py-1 rounded mb-2">{property.trashPickupDays || 'No days set'}</p>
                                        <p className="text-sm text-slate-600">{property.trashInstructions}</p>
                                    </div>
                                </div>
                            </Section>

                            <Section title="Pets" icon={Dog}>
                                <div className="flex justify-between items-center mb-3">
                                    <StatusBadge label="Pets Allowed" active={property.petsAllowed} />
                                    {property.petsAllowed && <span className="text-sm font-bold text-slate-900">${property.petFee} Fee</span>}
                                </div>
                                {property.petsAllowed && (
                                    <div className="space-y-2">
                                        <Metric label="Max Pets" value={property.maxPets} />
                                        <InfoBlock label="Policy" text={property.petPolicy} />
                                        <p className="text-xs text-slate-400">Pay via: {property.petPaymentMethod}</p>
                                    </div>
                                )}
                            </Section>
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="space-y-8">
                            <Section title="Outdoor & Beach" icon={Sun}>
                                <div className="space-y-3">
                                    <InfoBlock label="Outdoor Shower" text={property.outdoorShower} />
                                    <InfoBlock label="Grill" text={`${property.grillType || 'N/A'} at ${property.grillLocation || 'N/A'}`} />
                                    <StatusBadge label="Grill Fuel Provided" active={property.grillFuelProvided} />
                                    <div className="border-t border-slate-100 pt-3">
                                        <InfoBlock label="Beach Gear" text={property.beachGearLocation} />
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-sm text-slate-600">Bikes</span>
                                            <span className="font-bold">{property.bikeCount || 0} ({property.bikesProvided ? 'Yes' : 'No'})</span>
                                        </div>
                                    </div>
                                </div>
                            </Section>

                            <Section title="Lock Colors (Master)" icon={Lock}>
                                <div className="grid grid-cols-2 gap-2">
                                    <ColorCode label="Yellow" code={property.lockCodeYellow} color="bg-yellow-100 text-yellow-800 border-yellow-200" />
                                    <ColorCode label="Blue" code={property.lockCodeBlue} color="bg-blue-100 text-blue-800 border-blue-200" />
                                    <ColorCode label="White" code={property.lockCodeWhite} color="bg-slate-100 text-slate-800 border-slate-200" />
                                    <ColorCode label="Red" code={property.lockCodeRed} color="bg-red-100 text-red-800 border-red-200" />
                                </div>
                            </Section>

                            <Section title="Operations" icon={User}>
                                <InfoBlock label="Management Contact" text={property.managementContact} />
                                <InfoBlock label="Owner Notes" text={property.ownerNotes} />
                                <InfoBlock label="Lost & Found" text={property.lostAndFoundPolicy} />
                                <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="font-bold text-xs uppercase text-slate-400 mb-2">Internal Links</p>
                                    <div className="space-y-2">
                                        {property.guideUrl && <a href={property.guideUrl} target="_blank" rel="noreferrer" className="block text-sm text-blue-600 hover:underline">Staff Guide</a>}
                                        {property.photoFolderUrl && <a href={property.photoFolderUrl} target="_blank" rel="noreferrer" className="block text-sm text-blue-600 hover:underline">Photo Folder</a>}
                                        {property.otherLinks && <p className="text-xs text-slate-500 whitespace-pre-wrap">{property.otherLinks}</p>}
                                    </div>
                                </div>
                            </Section>

                            <Section title="Pricing" icon={DollarSign}>
                                <div className="flex justify-between items-center p-3 bg-green-50 rounded-xl border border-green-100">
                                    <div>
                                        <p className="text-xs text-green-700 uppercase font-bold">Nightly Min</p>
                                        <p className="text-lg font-bold text-green-900">${property.minNightlyRate || '0'}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-green-700 uppercase font-bold">Cleaning</p>
                                        <p className="text-lg font-bold text-green-900">${property.cleaningFee || '0'}</p>
                                    </div>
                                </div>
                            </Section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Section = ({ title, icon: Icon, children }) => (
    <div>
        <h3 className="flex items-center space-x-2 text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
            <Icon size={16} />
            <span>{title}</span>
        </h3>
        {children}
    </div>
);

const InfoBlock = ({ label, text }) => (
    text ? (
        <div className="mb-2">
            <p className="font-medium text-slate-900 text-xs mb-0.5">{label}</p>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{text}</p>
        </div>
    ) : null
);

const Metric = ({ label, value }) => (
    <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className="font-semibold text-slate-900">{value || '-'}</p>
    </div>
);

const StatusBadge = ({ label, active }) => (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${active ? 'bg-green-50 border-green-100 text-green-700' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
        <div className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-green-500' : 'bg-slate-300'}`}></div>
        <span className="text-xs font-bold">{label}</span>
    </div>
);

const ColorCode = ({ label, code, color }) => (
    <div className={`p-2 rounded-lg border ${color}`}>
        <p className="text-[10px] font-bold uppercase opacity-70 mb-1">{label}</p>
        <p className="font-mono font-bold text-sm tracking-widest">{code || '----'}</p>
    </div>
);

export default PropertyDetailsModal;
