const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload.middleware');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const {
    getProperties,
    getProperty,
    createProperty,
    updateProperty,
    deleteProperty,
    uploadImage,
    getPublicProperties,
    getPublicProperty
} = require('../controllers/property.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Public routes (no auth required)
router.get('/public', getPublicProperties);
router.get('/public/:id', getPublicProperty);

// Bulk import route (protected)
router.post('/bulk-import', protect, authorize('ADMIN', 'TEAM'), async (req, res) => {
    try {
        const { properties } = req.body;
        
        if (!Array.isArray(properties) || properties.length === 0) {
            return res.status(400).json({ error: 'No properties provided' });
        }

        // Get or create default owner
        let owner = await prisma.lead.findFirst({
            where: { name: 'Property Manager' }
        });

        if (!owner) {
            owner = await prisma.lead.create({
                data: {
                    name: 'Property Manager',
                    type: 'OWNER',
                    status: 'NEW'
                }
            });
        }

        const results = {
            created: [],
            updated: [],
            errors: []
        };

        for (const prop of properties) {
            try {
                const propertyData = {
                    name: prop.title || prop.name || 'Unnamed Property',
                    address: prop.address || prop.location || '',
                    unit: prop.unit || null,
                    type: prop.type || 'HOUSE',
                    bedrooms: prop.bedrooms || prop.beds || 1,
                    bathrooms: prop.bathrooms || 1,
                    beds: prop.beds || null,
                    maxOccupancy: prop.guestCapacity || prop.maxGuests || 2,
                    description: prop.description || null,
                    checkInTime: prop.checkInTime || '4:00 PM',
                    checkOutTime: prop.checkOutTime || '10:00 AM',
                    petsAllowed: prop.petsAllowed || false,
                    maxPets: prop.maxPets || 0,
                    petFee: prop.petFee || null,
                    wifiName: prop.wifiName || null,
                    wifiPassword: prop.wifiPassword || null,
                    entryMethod: prop.entryMethod || null,
                    lockboxLocation: prop.lockboxLocation || null,
                    lockboxCode: prop.lockboxCode || null,
                    parkingInstructions: prop.parkingInstructions || null,
                    maxVehicles: prop.maxVehicles || null,
                    houseRules: prop.houseRules || null,
                    amenities: prop.amenities ? JSON.stringify(prop.amenities) : null,
                    images: prop.images ? JSON.stringify(prop.images) : null,
                    status: 'ACTIVE',
                    airbnbUrl: prop.airbnbUrl || prop.airbnbLink || null,
                    listingUrl: prop.listingUrl || null,
                    hospitableId: prop.hospitableId || null,
                    ownerId: owner.id
                };

                // Check if property exists
                const existing = await prisma.property.findFirst({
                    where: {
                        OR: [
                            { airbnbUrl: prop.airbnbUrl },
                            { name: propertyData.name }
                        ]
                    }
                });

                if (existing) {
                    const updated = await prisma.property.update({
                        where: { id: existing.id },
                        data: propertyData
                    });
                    results.updated.push({ id: updated.id, name: updated.name });
                } else {
                    const created = await prisma.property.create({
                        data: propertyData
                    });
                    results.created.push({ id: created.id, name: created.name });
                }
            } catch (err) {
                results.errors.push({ property: prop.title || 'Unknown', error: err.message });
            }
        }

        res.json(results);
    } catch (error) {
        console.error('Bulk import error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Protected routes
router.route('/')
    .get(protect, getProperties)
    .post(protect, authorize('ADMIN', 'TEAM'), createProperty);

router.route('/:id')
    .get(protect, getProperty)
    .put(protect, authorize('ADMIN', 'TEAM'), updateProperty)
    .delete(protect, authorize('ADMIN'), deleteProperty);

router.route('/:id/images')
    .post(protect, authorize('ADMIN', 'TEAM'), upload.array('images', 10), uploadImage);

module.exports = router;
