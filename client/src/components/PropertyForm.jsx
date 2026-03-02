import { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp, Star, Upload } from 'lucide-react';
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
    const { createProperty, updateProperty, leads, fetchLeads, uploadPropertyImage } = useStore();
    const [selectedImages, setSelectedImages] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);

    useEffect(() => {
        fetchLeads();
        if (property && property.images) {
            try {
                const parsed = JSON.parse(property.images);
                setExistingImages(parsed);
            } catch (e) {
                setExistingImages([]);
            }
        }
    }, [fetchLeads, property]);

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
        otherListingUrl: property?.otherListingUrl || '',

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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) || 0 : value)
        }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedImages([...selectedImages, ...files]);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviewImages([...previewImages, ...newPreviews]);
    };

    const removeNewImage = (index) => {
        const newSelected = [...selectedImages];
        newSelected.splice(index, 1);
        setSelectedImages(newSelected);

        const newPreviews = [...previewImages];
        URL.revokeObjectURL(newPreviews[index]);
        newPreviews.splice(index, 1);
        setPreviewImages(newPreviews);
    };

    const removeExistingImage = (index) => {
        const newExisting = [...existingImages];
        newExisting.splice(index, 1);
        setExistingImages(newExisting);
    };

    const makeFeatureExisting = (index) => {
        const newExisting = [...existingImages];
        const [moved] = newExisting.splice(index, 1);
        newExisting.unshift(moved);
        setExistingImages(newExisting);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            let propertyId = property?.id;

            if (isEditing) {
                let uploadedPaths = [];
                if (selectedImages.length > 0) {
                    const uploadRes = await uploadPropertyImage(property.id, selectedImages);
                    const allServerImages = uploadRes.images;
                    const count = selectedImages.length;
                    uploadedPaths = allServerImages.slice(-count);
                }

                const finalImages = [...existingImages, ...uploadedPaths];

                const dataToUpdate = { ...formData, images: JSON.stringify(finalImages) };
                await updateProperty(property.id, dataToUpdate);

            } else {
                const newProperty = await createProperty(formData);
                propertyId = newProperty.id;

                if (selectedImages.length > 0) {
                    await uploadPropertyImage(propertyId, selectedImages);
                }
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
                        <div className="space-y-4">
                            {/* Image Upload Section */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Property Images</label>

                                {/* Existing Images Reordering/Deletion */}
                                {existingImages.length > 0 && (
                                    <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {existingImages.map((img, index) => (
                                            <div key={index} className={`relative group border-2 rounded-lg overflow-hidden ${index === 0 ? 'border-indigo-500' : 'border-gray-200'}`}>
                                                <img src={`${import.meta.env.VITE_API_URL}${img}`} alt="" className="h-32 w-full object-cover" />
                                                <div className="absolute top-1 left-1 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                                    {index === 0 ? 'Feature' : `#${index + 1}`}
                                                </div>
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 gap-2">
                                                    {index !== 0 && (
                                                        <button type="button" onClick={() => makeFeatureExisting(index)} className="p-1 bg-white rounded-full text-yellow-500 hover:bg-yellow-50" title="Make Feature">
                                                            <Star size={16} fill="currentColor" />
                                                        </button>
                                                    )}
                                                    <button type="button" onClick={() => removeExistingImage(index)} className="p-1 bg-white rounded-full text-red-500 hover:bg-red-50" title="Remove">
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* New Images Preview */}
                                {previewImages.length > 0 && (
                                    <div className="mb-2">
                                        <p className="text-xs text-gray-500 mb-2">New Images to Upload:</p>
                                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                                            {previewImages.map((url, index) => (
                                                <div key={index} className="relative h-20 w-20 rounded border border-gray-300 overflow-hidden">
                                                    <img src={url} alt="" className="h-full w-full object-cover" />
                                                    <button type="button" onClick={() => removeNewImage(index)} className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl">
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="w-8 h-8 mb-4 text-gray-500" />
                                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                            <p className="text-xs text-gray-500">PNG, JPG or GIF</p>
                                        </div>
                                        <input type="file" className="hidden" multiple accept="image/*" onChange={handleFileChange} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </Section>

                    <Section title="Listing Info" defaultOpen>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Airbnb URL" name="listingUrl" />
                            <Input label="VRBO URL" name="vrboListingUrl" />
                            <Input label="Hospitable URL" name="hospitableUrl" />
                            <Input label="Direct Booking URL" name="directBookingUrl" />
                            <Input label="Other Listing URL" name="otherListingUrl" />
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
