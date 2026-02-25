const prisma = require('../prisma/client');
const { z } = require('zod');

const projectSchema = z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    propertyId: z.string().uuid().optional(),
    assignedToId: z.string().uuid().optional(),
    dueDate: z.string().datetime().optional(), // Expect ISO string
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    status: z.enum(['TODO', 'IN_PROGRESS', 'DONE', 'BLOCKED']).optional(),
    importanceLevel: z.number().min(1).max(5).optional(),
    checkInDate: z.string().datetime().optional(),
    checkOutDate: z.string().datetime().optional(),
    customerName: z.string().optional(),
    nightStay: z.number().optional(),
});

const getProjects = async (req, res) => {
    try {
        // Auto-update status for projects within 30 days of check-in
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        await prisma.project.updateMany({
            where: {
                status: 'TODO',
                checkInDate: {
                    lte: thirtyDaysFromNow,
                    not: null
                }
            },
            data: {
                status: 'IN_PROGRESS'
            }
        });

        const projects = await prisma.project.findMany({
            include: {
                property: { select: { name: true } },
                assignedTo: { select: { name: true, email: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createProject = async (req, res) => {
    try {
        const data = projectSchema.parse(req.body);
        const project = await prisma.project.create({
            data: {
                ...data,
            },
            include: {
                property: { select: { name: true } },
                assignedTo: { select: { name: true } },
            },
        });

        if (req.io) {
            req.io.emit('project:created', project);
        }

        res.status(201).json(project);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        res.status(500).json({ message: error.message });
    }
};

const updateProjectStatus = async (req, res) => {
    try {
        const { status } = req.body;

        // Validate status enum
        const validStatuses = ['TODO', 'IN_PROGRESS', 'DONE', 'BLOCKED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const project = await prisma.project.update({
            where: { id: req.params.id },
            data: { status },
            include: {
                property: { select: { name: true } },
                assignedTo: { select: { name: true } },
            },
        });

        if (req.io) {
            req.io.emit('project:statusChanged', project);
            req.io.emit('project:updated', project);
        }

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProject = async (req, res) => {
    try {
        const data = projectSchema.partial().parse(req.body);

        // Handle empty strings for optional UUIDs if they slip through
        if (data.propertyId === '') data.propertyId = null;
        if (data.assignedToId === '') data.assignedToId = null;

        // Verify property exists if provided
        if (data.propertyId) {
            const propertyExists = await prisma.property.findUnique({ where: { id: data.propertyId } });
            if (!propertyExists) return res.status(400).json({ message: 'Invalid Property ID' });
        }

        // Verify user exists if provided
        if (data.assignedToId) {
            const userExists = await prisma.user.findUnique({ where: { id: data.assignedToId } });
            if (!userExists) return res.status(400).json({ message: 'Invalid User ID' });
        }

        const project = await prisma.project.update({
            where: { id: req.params.id },
            data,
            include: {
                property: { select: { name: true } },
                assignedTo: { select: { name: true } },
            },
        });

        if (req.io) {
            req.io.emit('project:updated', project);
        }

        res.json(project);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        res.status(500).json({ message: error.message });
    }
};

const deleteProject = async (req, res) => {
    try {
        const project = await prisma.project.delete({
            where: { id: req.params.id },
        });

        if (req.io) {
            req.io.emit('project:deleted', project.id);
        }

        res.json({ message: 'Project removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProjectById = async (req, res) => {
    try {
        const project = await prisma.project.findUnique({
            where: { id: req.params.id },
            include: {
                property: {
                    select: {
                        name: true,
                        address: true,
                        // Listing Links
                        airbnbUrl: true,
                        vrboUrl: true,
                        otherUrl: true,
                        // Access & Parking
                        lockboxCode: true,
                        parkingInstructions: true,
                        // Wifi
                        wifiName: true,
                        wifiPassword: true,
                        accessInstructions: true,
                        checkInTime: true,
                        checkOutTime: true,
                        // Amenities
                        hasStove: true,
                        hasDishwasher: true,
                        petsAllowed: true,
                        maxPets: true,
                        smokingPolicy: true,
                        quietHours: true,
                        // Property Stats
                        bedrooms: true,
                        bathrooms: true,
                        squareFeet: true,
                        isVerified: true,
                        activeYears: true,
                        reviewCount: true
                    }
                },
                assignedTo: { select: { id: true, name: true, email: true } },
                reservation: true, // properties: guestName, financials, etc.
                subProjects: {
                    include: {
                        assignedTo: { select: { id: true, name: true } }
                    },
                    orderBy: { createdAt: 'asc' }
                },
                notes: {
                    include: {
                        author: { select: { id: true, name: true } }
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (error) {
        console.error('Error in getProjectById:', error);
        res.status(500).json({ message: error.message });
    }
};

const createSubProject = async (req, res) => {
    try {
        const { title, assignedToId } = req.body;
        const subProject = await prisma.subProject.create({
            data: {
                title,
                projectId: req.params.id,
                assignedToId: assignedToId || null
            },
            include: {
                assignedTo: { select: { id: true, name: true } }
            }
        });
        res.status(201).json(subProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateSubProject = async (req, res) => {
    try {
        const { title, isCompleted, assignedToId } = req.body;
        const subProject = await prisma.subProject.update({
            where: { id: req.params.subProjectId },
            data: {
                title,
                isCompleted,
                assignedToId: assignedToId === '' ? null : assignedToId
            },
            include: {
                assignedTo: { select: { id: true, name: true } }
            }
        });
        res.json(subProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteSubProject = async (req, res) => {
    try {
        await prisma.subProject.delete({
            where: { id: req.params.subProjectId }
        });
        res.json({ message: 'Subproject deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addNote = async (req, res) => {
    try {
        const { content } = req.body;
        const note = await prisma.note.create({
            data: {
                content,
                projectId: req.params.id,
                authorId: req.user.id
            },
            include: {
                author: { select: { id: true, name: true } }
            }
        });
        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteNote = async (req, res) => {
    try {
        await prisma.note.delete({
            where: { id: req.params.noteId }
        });
        res.json({ message: 'Note deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProjectPriority = async (req, res) => {
    try {
        const { priority } = req.body;

        if (!['LOW', 'MEDIUM', 'HIGH'].includes(priority)) {
            return res.status(400).json({ message: 'Invalid priority value' });
        }

        const project = await prisma.project.update({
            where: { id: req.params.id },
            data: { priority },
            include: {
                property: true,
                assignedTo: {
                    select: { id: true, name: true, email: true }
                }
            }
        });

        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProjects,
    createProject,
    updateProject,
    updateProjectStatus,
    updateProjectPriority,
    deleteProject,
    getProjectById,
    createSubProject,
    updateSubProject,
    deleteSubProject,
    addNote,
    deleteNote
};
