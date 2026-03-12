import { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import useStore from '../store/useStore';

const Section = ({ title, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border border-slate-200 rounded-xl overflow-hidden mb-4">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
            >
                <h3 className="font-semibold text-slate-800">{title}</h3>
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            {isOpen && <div className="p-4 bg-white border-t border-slate-200">{children}</div>}
        </div>
    );
};



const PropertyForm = ({ property, onClose }) => {
    const isEditing = !!property;
    const { createProperty, updateProperty, leads, fetchLeads } = useStore();

    useEffect(() => {
        fetchLeads();
    }, [fetchLeads]);

    const [formData, setFormData] = useState({
        name: property?.name || '',
        code: property?.code || '',
        unit: property?.unit || '',
        address: property?.address || '',
        ownerId: property?.ownerId || (Array.isArray(leads) && leads.length > 0 ? leads[0].id : ''),
        type: property?.type || 'HOUSE',
        status: property?.status || 'ACTIVE',

        // Listing
        listingUrl: property?.listingUrl || '',
        vrboListingUrl: property?.vrboListingUrl || '',
        hospitableUrl: property?.hospitableUrl || '',
        directBookingUrl: property?.directBookingUrl || '',
        otherUrl: property?.otherUrl || '',

        // Info
        maxOccupancy: property?.maxOccupancy || '',
        bedrooms: property?.bedrooms || '',
        beds: property?.beds || '',
        bedSetup: property?.bedSetup || '',
        bathrooms: property?.bathrooms || '',
        checkInTime: property?.checkInTime || '',
        checkOutTime: property?.checkOutTime || '',

        // Pets
        petsAllowed: property?.petsAllowed || false,
        maxPets: property?.maxPets || 0,
        petFee: property?.petFee || '',
        petPolicy: property?.petPolicy || '',
        petNotes: property?.petNotes || '',
        petPaymentMethod: property?.petPaymentMethod || '',

        // Access
        entryMethod: property?.entryMethod || '',
        accessInstructions: property?.accessInstructions || '',
        emergencyCode: property?.emergencyCode || '',
        lockboxLocation: property?.lockboxLocation || '',
        lockboxCode: property?.lockboxCode || '',
        keyWorksAt: property?.keyWorksAt || '',
        backupKeyLocation: property?.backupKeyLocation || '',
        backupKeyCode: property?.backupKeyCode || '',
        spareKeyContactNeeded: property?.spareKeyContactNeeded || false,

        // Parking
        maxVehicles: property?.maxVehicles || '',
        parkingPassesNeeded: property?.parkingPassesNeeded || false,
        parkingInstructions: property?.parkingInstructions || '',

        // WiFi
        wifiName: property?.wifiName || '',
        wifiPassword: property?.wifiPassword || '',
        modemLocation: property?.modemLocation || '',
        guestModemAccess: property?.guestModemAccess || false,
        ispProvider: property?.ispProvider || '',

        // Utilities
        breakerLocation: property?.breakerLocation || '',
        guestBreakerAccess: property?.guestBreakerAccess || false,
        thermostatLocation: property?.thermostatLocation || '',
        thermostatControl: property?.thermostatControl || '',

        // Kitchen/Appliances
        hasStove: property?.hasStove !== false,
        hasDishwasher: property?.hasDishwasher !== false,
        dishwasherNotes: property?.dishwasherNotes || '',
        iceMakerStatus: property?.iceMakerStatus || '',
        garbageDisposalInfo: property?.garbageDisposalInfo || '',
        coffeeMakerType: property?.coffeeMakerType || '',
        applianceNotes: property?.applianceNotes || '',

        // Outdoor
        outdoorShower: property?.outdoorShower || '',
        backyardAccess: property?.backyardAccess || '',
        porchPatioNotes: property?.porchPatioNotes || '',
        grillType: property?.grillType || '',
        grillLocation: property?.grillLocation || '',
        grillFuelProvided: property?.grillFuelProvided || false,
        outdoorNotes: property?.outdoorNotes || '',

        // Beach/Bikes
        beachTowels: property?.beachTowels || '',
        beachGearLocation: property?.beachGearLocation || '',
        bikesProvided: property?.bikesProvided || false,
        bikeCount: property?.bikeCount || 0,
        bikeLocation: property?.bikeLocation || '',
        bikesShared: property?.bikesShared || false,

        // Locks
        lockCodeYellow: property?.lockCodeYellow || '',
        lockCodeBlue: property?.lockCodeBlue || '',
        lockCodeWhite: property?.lockCodeWhite || '',
        lockCodeRed: property?.lockCodeRed || '',

        // Rules
        quietHours: property?.quietHours || '',
        smokingPolicy: property?.smokingPolicy || '',
        otherRestrictions: property?.otherRestrictions || '',

        // Ops
        otherKeyLocations: property?.otherKeyLocations || '',
        ownerNotes: property?.ownerNotes || '',
        managementContact: property?.managementContact || '',
        trashPickupDays: property?.trashPickupDays || '',
        trashInstructions: property?.trashInstructions || '',
        checkOutText: property?.checkOutText || '',
        checkOutNotes: property?.checkOutNotes || '',
        lostAndFoundPolicy: property?.lostAndFoundPolicy || '',

        // Links
        guideUrl: property?.guideUrl || '',
        photoFolderUrl: property?.photoFolderUrl || '',
        otherLinks: property?.otherLinks || '',
        generalNotes: property?.generalNotes || '',

        // Pricing
        minNightlyRate: property?.minNightlyRate || '',
        minStay: property?.minStay || 1,
        cleaningFee: property?.cleaningFee || '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [images, setImages] = useState([]);

    useEffect(() => {
        fetchLeads();
        if (property && property.images) {
            try {
                const parsed = JSON.parse(property.images);
                setImages(parsed.map(url => ({ url, file: null, preview: null })));
            } catch (e) {
                setImages([]);
            }
        }
    }, [fetchLeads, property]);

    useEffect(() => {
        if (images.length === 0 && !property) {
            setImages([{ url: '', file: null, preview: null }]);
        }
    }, [property, images.length]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) || 0 : value)
        }));
    };

    const handleImageUrlChange = (index, value) => {
        const newImages = [...images];
        newImages[index].url = value;
        newImages[index].preview = value;
        setImages(newImages);
    };

    const handleImageFileChange = async (index, e) => {
        const file = e.target.files[0];
        if (!file) return;

        const newImages = [...images];
        newImages[index].file = file;
        newImages[index].preview = URL.createObjectURL(file);
        newImages[index].url = '';
        setImages(newImages);

        if (isEditing && property?.id) {
            try {
                const formData = new FormData();
                formData.append('images', file);
                const token = localStorage.getItem('token');
                const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5001/api';
                const response = await fetch(`${apiUrl}/properties/${property.id}/images`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formData
                });
                const data = await response.json();
                if (data.images && data.images.length > 0) {
                    newImages[index].url = data.images[data.images.length - 1];
                    setImages([...newImages]);
                }
            } catch (err) {
                console.error('Upload failed:', err);
            }
        }
    };

    const addNewImage = () => {
        setImages([...images, { url: '', file: null, preview: null }]);
    };

    const removeImage = (index) => {
        const newImages = [...images];
        if (newImages[index].preview && newImages[index].preview.startsWith('blob:')) {
            URL.revokeObjectURL(newImages[index].preview);
        }
        newImages.splice(index, 1);
        setImages(newImages);
    };

    const moveImage = (index, direction) => {
        if (direction === -1 && index === 0) return;
        if (direction === 1 && index === images.length - 1) return;
        
        const newImages = [...images];
        const temp = newImages[index];
        newImages[index] = newImages[index + direction];
        newImages[index + direction] = temp;
        setImages(newImages);
    };

    const setAsFeatured = (index) => {
        const newImages = [...images];
        const [featured] = newImages.splice(index, 1);
        newImages.unshift(featured);
        setImages(newImages);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const finalImages = images
                .filter(img => img.url || img.preview)
                .map(img => img.url);

            const dataToSave = { ...formData, images: JSON.stringify(finalImages) };

            if (isEditing) {
                await updateProperty(property.id, dataToSave);
            } else {
                await createProperty(dataToSave);
            }
            onClose();
        } catch (err) {
            console.error('Failed to save property', err);
            const msg = err.response?.data?.message || 'Failed to save property';
            const validationErrors = err.response?.data?.errors;
            if (validationErrors) {
                const details = validationErrors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
                setError(`${msg}: ${details}`);
            } else {
                setError(msg);
            }
        } finally {
            setLoading(false);
        }
    };

    const Input = ({ label, name, type = "text", ...props }) => (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
            <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                {...props}
            />
        </div>
    );

    const Select = ({ label, name, options, ...props }) => (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
            <select
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                {...props}
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    );

    const Textarea = ({ label, name, rows = 2, ...props }) => (
        <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
            <textarea
                name={name}
                value={formData[name]}
                onChange={handleChange}
                rows={rows}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                {...props}
            />
        </div>
    );

    const Checkbox = ({ label, name }) => (
        <label className="flex items-center space-x-2 cursor-pointer mt-6">
            <input
                type="checkbox"
                name={name}
                checked={formData[name]}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-slate-700">{label}</span>
        </label>
    );

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
                <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center z-10 rounded-t-2xl">
                    <h2 className="text-2xl font-bold text-slate-900">
                        {isEditing ? 'Edit Property' : 'Add New Property'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm mb-4">
                            <p className="font-bold">{error}</p>
                            {/* Check if error actually has details from backend response */}
                        </div>
                    )}

                    {/* ALWAYS VISIBLE BASIC INFO */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <Input label="Property Name *" name="name" required placeholder="e.g., 1CD - 706 Canal Drive" />
                        <Input label="Property Code" name="code" placeholder="e.g., 1CD" />
                        <Input label="Address *" name="address" required />
                        <Input label="Unit / Level" name="unit" placeholder="e.g. Upstairs" />

                        <Select label="Owner *" name="ownerId" required options={[
                            { value: '', label: 'Select Owner' },
                            ...(Array.isArray(leads) ? leads.filter(l => l.type === 'OWNER').map(l => ({ value: l.id, label: l.name })) : [])
                        ]} />

                        <Select label="Type" name="type" options={[
                            { value: 'HOUSE', label: 'House' },
                            { value: 'APARTMENT', label: 'Apartment' },
                            { value: 'CONDO', label: 'Condo' }
                        ]} />
                        <Select label="Status" name="status" options={[
                            { value: 'ACTIVE', label: 'Active' },
                            { value: 'INACTIVE', label: 'Inactive' }
                        ]} />
                    </div>

                    <Section title="Images" defaultOpen>
                        <div className="space-y-3">
                            {images.map((img, index) => (
                                <div key={index} className="flex items-center gap-3 p-2 border border-gray-200 rounded-lg">
                                    {img.preview && (
                                        <img 
                                            src={img.preview} 
                                            alt={`Preview ${index + 1}`} 
                                            className="h-12 w-16 object-cover rounded"
                                        />
                                    )}
                                    
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                                        <input
                                            type="text"
                                            value={img.url}
                                            onChange={(e) => handleImageUrlChange(index, e.target.value)}
                                            placeholder="Image URL"
                                            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageFileChange(index, e)}
                                            className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                    
                                    <button
                                        type="button"
                                        onClick={() => setAsFeatured(index)}
                                        className={`p-1 rounded ${index === 0 ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-500'}`}
                                        title="Set as featured"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="p-1 text-red-500 hover:bg-red-50 rounded"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            ))}
                            
                            <button
                                type="button"
                                onClick={addNewImage}
                                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
                            >
                                + Add Another Image
                            </button>
                        </div>
                    </Section>

                    <Section title="Listing Info" defaultOpen>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Airbnb URL" name="listingUrl" />
                            <Input label="VRBO URL" name="vrboListingUrl" />
                            <Input label="Hospitable URL" name="hospitableUrl" />
                            <Input label="Direct Booking URL" name="directBookingUrl" />
                            <Input label="Other Listing URL" name="otherUrl" />
                        </div>
                    </Section>

                    <Section title="Property Specs">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Input label="Max Occupancy" name="maxOccupancy" type="number" />
                            <Input label="Bedrooms" name="bedrooms" type="number" />
                            <Input label="Beds" name="beds" type="number" />
                            <Input label="Bathrooms" name="bathrooms" type="number" step="0.5" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <Textarea label="Bed Setup" name="bedSetup" placeholder="e.g. King in master, 2 twins in guest..." />
                            <div className="space-y-4">
                                <Input label="Check-in Time" name="checkInTime" placeholder="4:00 PM" />
                                <Input label="Check-out Time" name="checkOutTime" placeholder="10:00 AM" />
                            </div>
                        </div>
                    </Section>

                    <Section title="Access & Entry">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Select label="Entry Method" name="entryMethod" options={[
                                { value: 'SMART_LOCK', label: 'Smart Lock' },
                                { value: 'LOCKBOX', label: 'Lockbox' },
                                { value: 'KEYPAD', label: 'Keypad' },
                                { value: 'HIDDEN_KEY', label: 'Hidden Key' }
                            ]} />
                            <Input label="Lockbox Code" name="lockboxCode" />
                            <Input label="Lockbox Location" name="lockboxLocation" />
                            <Input label="Emergency Code" name="emergencyCode" />
                            <Textarea label="Access Instructions" name="accessInstructions" />
                            <Input label="Key Works At" name="keyWorksAt" />

                            <div className="border-t border-slate-100 mt-2 pt-2 md:col-span-2">
                                <h4 className="text-sm font-bold text-slate-500 mb-2">Backup Access</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input label="Backup Key Location" name="backupKeyLocation" />
                                    <Input label="Backup Key Code" name="backupKeyCode" />
                                    <Checkbox label="Needs Management Contact?" name="spareKeyContactNeeded" />
                                </div>
                            </div>
                        </div>
                    </Section>

                    <Section title="WiFi & Utilities">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="WiFi Name" name="wifiName" />
                            <Input label="WiFi Password" name="wifiPassword" />
                            <Input label="Modem Location" name="modemLocation" />
                            <Input label="ISP Provider" name="ispProvider" />
                            <Checkbox label="Guest can access modem?" name="guestModemAccess" />

                            <div className="md:col-span-2 border-t pt-4 mt-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input label="Breaker Location" name="breakerLocation" />
                                    <Input label="Thermostat Location" name="thermostatLocation" />
                                    <Input label="Thermostat Control" name="thermostatControl" />
                                    <Checkbox label="Guest can access breaker?" name="guestBreakerAccess" />
                                </div>
                            </div>
                        </div>
                    </Section>

                    <Section title="Pets">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Checkbox label="Pets Allowed?" name="petsAllowed" />
                            {formData.petsAllowed && (
                                <>
                                    <Input label="Max Pets" name="maxPets" type="number" />
                                    <Input label="Pet Fee ($)" name="petFee" type="number" />
                                    <Input label="Payment Method" name="petPaymentMethod" placeholder="Airbnb, Venmo..." />
                                    <Textarea label="Pet Policy / Notes" name="petNotes" />
                                </>
                            )}
                        </div>
                    </Section>

                    <Section title="Parking & Waste">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Max Vehicles" name="maxVehicles" type="number" />
                            <Checkbox label="Parking Passes Needed?" name="parkingPassesNeeded" />
                            <Textarea label="Parking Instructions" name="parkingInstructions" />

                            <Input label="Trash Pickup Days" name="trashPickupDays" />
                            <Textarea label="Trash Instructions" name="trashInstructions" />
                        </div>
                    </Section>

                    <Section title="Kitchen & Appliances">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Checkbox label="Has Stove" name="hasStove" />
                            <Checkbox label="Has Dishwasher" name="hasDishwasher" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <Input label="Dishwasher Notes" name="dishwasherNotes" />
                            <Input label="Ice Maker Status" name="iceMakerStatus" />
                            <Input label="Garbage Disposal" name="garbageDisposalInfo" />
                            <Input label="Coffee Maker Type" name="coffeeMakerType" />
                            <Textarea label="Appliance Notes" name="applianceNotes" />
                        </div>
                    </Section>

                    <Section title="Outdoor & Amenities">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Outdoor Shower" name="outdoorShower" />
                            <Input label="Backyard Access" name="backyardAccess" />
                            <Input label="Grill Type" name="grillType" />
                            <Input label="Grill Location" name="grillLocation" />
                            <Checkbox label="Fuel Provided?" name="grillFuelProvided" />
                            <Textarea label="Porch/Patio Notes" name="porchPatioNotes" />
                            <Textarea label="Outdoor Notes" name="outdoorNotes" />
                        </div>
                    </Section>

                    <Section title="Beach & Bicycles">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Beach Towels Count" name="beachTowels" type="number" />
                            <Input label="Beach Gear Location" name="beachGearLocation" />

                            <div className="md:col-span-2 border-t pt-4">
                                <Checkbox label="Bikes Provided?" name="bikesProvided" />
                                {formData.bikesProvided && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                                        <Input label="Count" name="bikeCount" type="number" />
                                        <Input label="Location" name="bikeLocation" />
                                        <Checkbox label="Shared?" name="bikesShared" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </Section>

                    <Section title="Color Codes (Locks)">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Input label="Yellow" name="lockCodeYellow" />
                            <Input label="Blue" name="lockCodeBlue" />
                            <Input label="White" name="lockCodeWhite" />
                            <Input label="Red" name="lockCodeRed" />
                        </div>
                    </Section>

                    <Section title="Operations & Check-out">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Management Contact" name="managementContact" />
                            <Textarea label="Owner Notes" name="ownerNotes" />
                            <Textarea label="Lost & Found Policy" name="lostAndFoundPolicy" />
                            <Textarea label="Check-out Text" name="checkOutText" />
                            <Textarea label="Check-out Notes" name="checkOutNotes" />
                            <Textarea label="Other Key Locations" name="otherKeyLocations" />
                        </div>
                    </Section>

                    <Section title="Internal Links">
                        <div className="grid grid-cols-1 gap-4">
                            <Input label="Staff Guide URL" name="guideUrl" />
                            <Input label="Photo Folder URL" name="photoFolderUrl" />
                            <Textarea label="Other Links" name="otherLinks" />
                        </div>
                    </Section>

                    <Section title="Pricing">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Input label="Min Nightly Rate" name="minNightlyRate" type="number" step="0.01" />
                            <Input label="Min Stay" name="minStay" type="number" />
                            <Input label="Cleaning Fee" name="cleaningFee" type="number" step="0.01" />
                        </div>
                    </Section>

                </form>

                <div className="border-t border-slate-200 p-6 flex justify-end space-x-3 bg-white rounded-b-2xl">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : (isEditing ? 'Update Property' : 'Create Property')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PropertyForm;
