const prisma = require('../prisma/client');
const { z } = require('zod');

const transactionSchema = z.object({
    description: z.string().min(1),
    amount: z.number(), // Frontend should send number, will be stored as Decimal
    type: z.enum(['INCOME', 'EXPENSE']),
    category: z.string().optional(),
    date: z.coerce.date().optional(), // Allow various date string formats
    propertyId: z.string().uuid().optional().nullable(),
    leadId: z.string().uuid().optional().nullable(),
});

const getTransactions = async (req, res) => {
    try {
        const transactions = await prisma.transaction.findMany({
            orderBy: { date: 'desc' },
            include: {
                property: { select: { name: true } },
                lead: { select: { name: true } }
            }
        });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSummary = async (req, res) => {
    try {
        const income = await prisma.transaction.aggregate({
            where: { type: 'INCOME' },
            _sum: { amount: true }
        });
        const expense = await prisma.transaction.aggregate({
            where: { type: 'EXPENSE' },
            _sum: { amount: true }
        });

        res.json({
            totalIncome: income._sum.amount || 0,
            totalExpense: expense._sum.amount || 0,
            balance: (income._sum.amount || 0) - (expense._sum.amount || 0)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createTransaction = async (req, res) => {
    try {
        const payload = { ...req.body };
        // Handle empty strings before validation
        if (payload.propertyId === '') payload.propertyId = null;
        if (payload.leadId === '') payload.leadId = null;
        if (payload.category === '') delete payload.category;

        const data = transactionSchema.parse(payload);

        const transaction = await prisma.transaction.create({
            data,
            include: {
                property: { select: { name: true } },
                lead: { select: { name: true } }
            }
        });
        res.status(201).json(transaction);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        res.status(500).json({ message: error.message });
    }
};

const updateTransaction = async (req, res) => {
    try {
        const payload = { ...req.body };
        if (payload.propertyId === '') payload.propertyId = null;
        if (payload.leadId === '') payload.leadId = null;
        if (payload.category === '') delete payload.category;

        const data = transactionSchema.partial().parse(payload);

        const transaction = await prisma.transaction.update({
            where: { id: req.params.id },
            data,
            include: {
                property: { select: { name: true } },
                lead: { select: { name: true } }
            }
        });
        res.json(transaction);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        res.status(500).json({ message: error.message });
    }
}

const deleteTransaction = async (req, res) => {
    try {
        await prisma.transaction.delete({
            where: { id: req.params.id }
        });
        res.json({ message: 'Transaction deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTransactions,
    getSummary,
    createTransaction,
    updateTransaction,
    deleteTransaction
};
