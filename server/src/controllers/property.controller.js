const prisma = require('../prisma/client');
const { z } = require('zod');

const propertySchema = z.object({
    name: z.string().min(2),
    address: z.string().min(5),
    ownerId: z.string().min(1),
    status: z.enum(['ACTIVE', 'MAINTENANCE', 'INACTIVE']).optional(),
    type: z.string().optional(),

    // Identifiers
    code: z.string().optional(),
    unit: z.string().optional(),

    // Listing
    listingUrl: z.string().url().optional().or(z.literal('')),
    vrboListingUrl: z.string().url().optional().or(z.literal('')),
    otherListingUrl: z.string().optional(),

    // Info
    maxOccupancy: z.coerce.number().int().optional(),
    bedrooms: z.coerce.number().int().optional(),
    beds: z.coerce.number().int().optional(),
    bedSetup: z.string().optional(),
    bathrooms: z.coerce.number().optional(),
    checkInTime: z.string().optional(),
    checkOutTime: z.string().optional(),

    // Pets
    petsAllowed: z.boolean().optional(),
    maxPets: z.coerce.number().int().optional(),
    petFee: z.coerce.number().optional(),
    petPolicy: z.string().optional(),
    petNotes: z.string().optional(),
    petPaymentMethod: z.string().optional(),

    // Access
    entryMethod: z.string().optional(),
    accessInstructions: z.string().optional(),
    lockboxLocation: z.string().optional(),
    lockboxCode: z.string().optional(),
    keyWorksAt: z.string().optional(),
    backupKeyLocation: z.string().optional(),
    backupKeyCode: z.string().optional(),
    spareKeyContactNeeded: z.boolean().optional(),
    emergencyCode: z.string().optional(),

    // Parking & Utilities
    maxVehicles: z.coerce.number().int().optional(),
    parkingPassesNeeded: z.boolean().optional(),
    parkingInstructions: z.string().optional(),

    wifiName: z.string().optional(),
    wifiPassword: z.string().optional(),
    modemLocation: z.string().optional(),
    guestModemAccess: z.boolean().optional(),
    ispProvider: z.string().optional(),

    breakerLocation: z.string().optional(),
    guestBreakerAccess: z.boolean().optional(),
    thermostatLocation: z.string().optional(),
    thermostatControl: z.string().optional(),

    // Appliances / Features
    hasStove: z.boolean().optional(),
    hasDishwasher: z.boolean().optional(),
    dishwasherNotes: z.string().optional(),
    iceMakerStatus: z.string().optional(),
    garbageDisposalInfo: z.string().optional(),
    coffeeMakerType: z.string().optional(),
    applianceNotes: z.string().optional(),

    // Outdoor
    outdoorShower: z.string().optional(),
    backyardAccess: z.string().optional(),
    porchPatioNotes: z.string().optional(),
    grillType: z.string().optional(),
    grillLocation: z.string().optional(),
    grillFuelProvided: z.boolean().optional(),
    outdoorNotes: z.string().optional(),

    // Beach/Bikes
    beachTowels: z.coerce.number().int().optional(),
    beachGearLocation: z.string().optional(),
    bikesProvided: z.boolean().optional(),
    bikeCount: z.coerce.number().int().optional(),
    bikeLocation: z.string().optional(),
    bikesShared: z.boolean().optional(),

    // Locks
    lockCodeYellow: z.string().optional(),
    lockCodeBlue: z.string().optional(),
    lockCodeWhite: z.string().optional(),
    lockCodeRed: z.string().optional(),

    // Rules & Ops
    quietHours: z.string().optional(),
    smokingPolicy: z.string().optional(),
    otherRestrictions: z.string().optional(),

    otherKeyLocations: z.string().optional(),
    ownerNotes: z.string().optional(),
    managementContact: z.string().optional(),
    trashPickupDays: z.string().optional(),
    trashInstructions: z.string().optional(),
    checkOutText: z.string().optional(),
    checkOutNotes: z.string().optional(),
    lostAndFoundPolicy: z.string().optional(),

    // Links
    guideUrl: z.string().optional(),
    photoFolderUrl: z.string().optional(),
    otherLinks: z.string().optional(),
    generalNotes: z.string().optional(),

    // Pricing
    minNightlyRate: z.coerce.number().optional(),
    minStay: z.coerce.number().int().optional(),
    cleaningFee: z.coerce.number().optional(),
    images: z.string().optional(),
});

const getProperties = async (req, res) => {
    try {
        const properties = await prisma.property.findMany({
            include: {
                owner: true,
                projects: {
                    where: { status: { not: 'DONE' } },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(properties);
    } catch (error) {
        console.error('Error in getProperties:', error);
        res.status(500).json({ message: error.message });
    }
};

const getProperty = async (req, res) => {
    try {
        const property = await prisma.property.findUnique({
            where: { id: req.params.id },
            include: {
                owner: true,
                projects: true,
                rentRecords: true,
            },
        });
        if (property) {
            res.json(property);
        } else {
            res.status(404).json({ message: 'Property not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createProperty = async (req, res) => {
    try {
        const data = propertySchema.parse(req.body);
        const property = await prisma.property.create({
            data,
            include: { owner: true }
        });
        res.status(201).json(property);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        res.status(500).json({ message: error.message });
    }
};

const updateProperty = async (req, res) => {
    try {
        const data = propertySchema.partial().parse(req.body);

        // Extract ownerId and handle it separately
        const { ownerId, otherListingUrl, ...rest } = data;

        // Map fields to match schema
        const updateData = {
            ...rest,
            otherUrl: otherListingUrl, // Map to correct schema field
        };

        const property = await prisma.property.update({
            where: { id: req.params.id },
            data: {
                ...updateData,
                ...(ownerId && { owner: { connect: { id: ownerId } } })
            },
            include: {
                owner: true,
            },
        });
        res.json(property);
    } catch (error) {
        console.error('Update Property Error:', error);
        if (error instanceof z.ZodError) {
            console.error('Validation Errors:', error.errors);
            return res.status(400).json({ errors: error.errors });
        }
        res.status(500).json({ message: error.message });
    }
};

const deleteProperty = async (req, res) => {
    try {
        await prisma.property.delete({
            where: { id: req.params.id },
        });
        res.json({ message: 'Property removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const uploadImage = async (req, res) => {
    try {
        console.log('[uploadImage] Files received:', req.files);
        console.log('[uploadImage] Property ID:', req.params.id);
        
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const { id } = req.params;
        
        // Check if property exists
        const property = await prisma.property.findUnique({ where: { id } });
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
        
        const newImages = req.files.map(file => `/uploads/${file.filename}`);

        // Parse existing images
        let images = [];
        if (property.images) {
            try { images = JSON.parse(property.images); } catch (e) { }
        }

        // Append new images
        images = [...images, ...newImages];

        const updatedProperty = await prisma.property.update({
            where: { id },
            data: { images: JSON.stringify(images) }
        });

        // Parse for response
        updatedProperty.images = images;
        res.json(updatedProperty);
    } catch (error) {
        console.error('[uploadImage] Error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProperties,
    getProperty,
    createProperty,
    updateProperty,
    deleteProperty,
    uploadImage,
};
