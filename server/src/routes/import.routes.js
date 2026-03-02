const express = require('express');
const router = express.Router();
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const { protect, authorize } = require('../middleware/auth.middleware');

const prisma = new PrismaClient();

// Import data endpoint (admin only, one-time use)
router.post('/import-data', protect, authorize('ADMIN'), async (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync('./local_data_export.json', 'utf8'));
        
        console.log('=== Importing Data ===');
        
        // Import Users
        let usersImported = 0;
        for (const user of data.users) {
            try {
                await prisma.user.upsert({
                    where: { email: user.email },
                    update: {},
                    create: {
                        email: user.email,
                        name: user.name,
                        password: user.password,
                        role: user.role || 'TEAM'
                    }
                });
                usersImported++;
            } catch (e) {
                console.log(`User ${user.email}: ${e.message}`);
            }
        }
        
        // Import Leads
        let leadsImported = 0;
        for (const lead of data.leads) {
            try {
                await prisma.lead.create({
                    data: {
                        name: lead.name,
                        email: lead.email,
                        email2: lead.email2,
                        phone: lead.phone,
                        phone2: lead.phone2,
                        type: lead.type,
                        status: lead.status || 'ACTIVE',
                        address: lead.address,
                        notes: lead.notes
                    }
                });
                leadsImported++;
            } catch (e) {
                console.log(`Lead ${lead.name}: ${e.message}`);
            }
        }
        
        // Import Properties
        let propsImported = 0;
        for (const property of data.properties) {
            try {
                await prisma.property.create({
                    data: {
                        name: property.name,
                        code: property.code,
                        unit: property.unit,
                        address: property.address,
                        ownerId: property.ownerId,
                        status: property.status || 'ACTIVE',
                        type: property.type,
                        listingUrl: property.listingUrl,
                        vrboListingUrl: property.vrboListingUrl,
                        airbnbUrl: property.airbnbUrl,
                        vrboUrl: property.vrboUrl,
                        otherUrl: property.otherUrl,
                        hospitableUrl: property.hospitableUrl,
                        directBookingUrl: property.directBookingUrl,
                        images: property.images,
                        description: property.description,
                        maxOccupancy: property.maxOccupancy,
                        bedrooms: property.bedrooms,
                        beds: property.beds,
                        bedSetup: property.bedSetup,
                        bathrooms: property.bathrooms,
                        squareFeet: property.squareFeet,
                        checkInTime: property.checkInTime,
                        checkOutTime: property.checkOutTime,
                        petsAllowed: property.petsAllowed || false,
                        maxPets: property.maxPets || 0,
                        petFee: property.petFee,
                        petPolicy: property.petPolicy,
                        petNotes: property.petNotes,
                        petPaymentMethod: property.petPaymentMethod,
                        entryMethod: property.entryMethod,
                        accessInstructions: property.accessInstructions,
                        lockboxLocation: property.lockboxLocation,
                        lockboxCode: property.lockboxCode,
                        keyWorksAt: property.keyWorksAt,
                        backupKeyLocation: property.backupKeyLocation,
                        backupKeyCode: property.backupKeyCode,
                        spareKeyContactNeeded: property.spareKeyContactNeeded || false,
                        emergencyCode: property.emergencyCode,
                        parkingInstructions: property.parkingInstructions,
                        maxVehicles: property.maxVehicles,
                        parkingPassesNeeded: property.parkingPassesNeeded || false,
                        wifiName: property.wifiName,
                        wifiPassword: property.wifiPassword,
                        modemLocation: property.modemLocation,
                        guestModemAccess: property.guestModemAccess || false,
                        ispProvider: property.ispProvider,
                        breakerLocation: property.breakerLocation,
                        guestBreakerAccess: property.guestBreakerAccess || false,
                        thermostatLocation: property.thermostatLocation,
                        thermostatControl: property.thermostatControl,
                        hasStove: property.hasStove,
                        hasDishwasher: property.hasDishwasher,
                        dishwasherNotes: property.dishwasherNotes,
                        iceMakerStatus: property.iceMakerStatus,
                        garbageDisposalInfo: property.garbageDisposalInfo,
                        coffeeMakerType: property.coffeeMakerType,
: property.coffeeMakerType,
                        applianceNotes: property.applianceNotes,
                        outdoorShower: property.outdoorShower,
                        backyardAccess: property.backyardAccess,
                        porchPatioNotes: property.porchPatioNotes,
                        grillType: property.grillType,
                        grillLocation: property.grillLocation,
                        grillFuelProvided: property.grillFuelProvided || false,
                        outdoorNotes: property.outdoorNotes,
                        beachTowels: property.beachTowels,
                        beachGearLocation: property.beachGearLocation,
                        bikesProvided: property.bikesProvided || false,
                        bikeCount: property.bikeCount,
                        bikeLocation: property.bikeLocation,
                        bikesShared: property.bikesShared || false,
                        lockCodeYellow: property.lockCodeYellow,
                        lockCodeBlue: property.lockCodeBlue,
                        lockCodeWhite: property.lockCodeWhite,
                        lockCodeRed: property.lockCodeRed,
                        quietHours: property.quietHours,
                        smokingPolicy: property.smokingPolicy,
                        otherRestrictions: property.otherRestrictions,
                        otherKeyLocations: property.otherKeyLocations,
                        ownerNotes: property.ownerNotes,
                        managementContact: property.managementContact,
                        trashPickupDays: property.trashPickupDays,
                        trashInstructions: property.trashInstructions,
                        checkOutText: property.checkOutText,
                        checkOutNotes: property.checkOutNotes,
                        lostAndFoundPolicy: property.lostAndFoundPolicy,
                        guideUrl: property.guideUrl,
                        photoFolderUrl: property.photoFolderUrl,
                        otherLinks: property.otherLinks,
                        generalNotes: property.generalNotes,
                        minNightlyRate: property.minNightlyRate,
                        minStay: property.minStay,
                        cleaningFee: property.cleaningFee,
                        tvLocations: property.tvLocations,
                        smartTv: property.smartTv,
                        hospitableId: property.hospitableId,
                        isVerified: property.isVerified,
                        activeYears: property.activeYears,
                        reviewCount: property.reviewCount
                    }
                });
                propsImported++;
            } catch (e) {
                console.log(`Property ${property.name}: ${e.message.substring(0, 50)}`);
            }
        }
        
        // Import Projects
        let projectsImported = 0;
        for (const project of data.projects) {
            try {
                await prisma.project.create({
                    data: {
                        title: project.title,
                        description: project.description,
                        status: project.status,
                        priority: project.priority,
                        propertyId: project.propertyId,
                        checkInDate: project.checkInDate,
                        checkOutDate: project.checkOutDate,
                        createdById: project.createdById,
                        assignedToId: project.assignedToId,
                        type: project.type
                    }
                });
                projectsImported++;
            } catch (e) {
                console.log(`Project ${project.title}: ${e.message.substring(0, 50)}`);
            }
        }
        
        res.json({
            message: 'Data imported successfully',
            users: usersImported,
            leads: leadsImported,
            properties: propsImported,
            projects: projectsImported
        });
    } catch (error) {
        console.error('Import error:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
