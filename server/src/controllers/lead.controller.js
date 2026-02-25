const prisma = require('../prisma/client');
const { z } = require('zod');

const leadSchema = z.object({
    name: z.string().min(2),
    type: z.enum(['OWNER', 'CUSTOMER', 'VENDOR', 'CLEANER', 'PLUMBER', 'EMPLOYEE']),
    contactInfo: z.object({}).passthrough().optional(), // Allow any JSON
    status: z.enum(['NEW', 'CONTACTED', 'SIGNED', 'ARCHIVED']).optional(),
});

const getLeads = async (req, res) => {
    try {
        const leads = await prisma.lead.findMany({
            orderBy: { createdAt: 'desc' },
        });
        const parsedLeads = leads.map(lead => {
            if (lead.contactInfo) {
                try { lead.contactInfo = JSON.parse(lead.contactInfo) } catch (e) { }
            }
            return lead;
        });
        res.json(parsedLeads);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createLead = async (req, res) => {
    try {
        const data = leadSchema.parse(req.body);
        if (data.contactInfo) {
            data.contactInfo = JSON.stringify(data.contactInfo);
        }
        const lead = await prisma.lead.create({
            data,
        });
        if (lead.contactInfo) {
            try { lead.contactInfo = JSON.parse(lead.contactInfo) } catch (e) { }
        }

        res.status(201).json(lead);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        res.status(500).json({ message: error.message });
    }
};

const updateLeadStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        // Validate status
        const validStatuses = ['NEW', 'CONTACTED', 'SIGNED', 'ARCHIVED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        // Get current lead to check previous state if needed, or just proceed
        const currentLead = await prisma.lead.findUnique({ where: { id } });
        if (!currentLead) return res.status(404).json({ message: 'Lead not found' });

        const updatedLead = await prisma.lead.update({
            where: { id },
            data: { status },
        });

        // AUTOMATION: If Lead is OWNER and status changes to SIGNED
        if (updatedLead.type === 'OWNER' && status === 'SIGNED' && currentLead.status !== 'SIGNED') {
            try {
                const checkValues = {
                    title: `Property Setup - ${updatedLead.name}`,
                    description: `Automated project created because owner ${updatedLead.name} signed the contract.`,
                    priority: 'HIGH',
                    status: 'TODO',
                    importanceLevel: 5,
                }

                const newProject = await prisma.project.create({
                    data: checkValues
                });

                if (req.io) {
                    req.io.emit('project:created', newProject);
                }
            } catch (err) {
                console.error('Automation failed:', err);
                // Do not fail the request if automation fails, just log it
            }
        }

        if (updatedLead.contactInfo) {
            try { updatedLead.contactInfo = JSON.parse(updatedLead.contactInfo) } catch (e) { }
        }
        res.json(updatedLead);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateLead = async (req, res) => {
    try {
        if (req.body.contactInfo) {
            req.body.contactInfo = JSON.stringify(req.body.contactInfo);
        }
        const lead = await prisma.lead.update({
            where: { id: req.params.id },
            data: req.body,
        });
        if (lead.contactInfo) {
            try { lead.contactInfo = JSON.parse(lead.contactInfo) } catch (e) { }
        }
        res.json(lead);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getLeads,
    createLead,
    updateLead,
    updateLeadStatus,
};
