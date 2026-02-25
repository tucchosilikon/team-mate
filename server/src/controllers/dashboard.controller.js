const prisma = require('../prisma/client');

const getDashboardStats = async (req, res) => {
    try {
        // Run queries in parallel for performance
        const [
            activeProperties,
            totalRevenue,
            activeLeads,
            projectStats,
            urgentProjectsQuery,
            upcomingProjectsQuery
        ] = await Promise.all([
            prisma.property.count({ where: { status: 'ACTIVE' } }),
            prisma.transaction.aggregate({
                where: { type: 'INCOME' },
                _sum: { amount: true }
            }),
            prisma.lead.count({ where: { status: { not: 'ARCHIVED' } } }),
            prisma.project.groupBy({
                by: ['status', 'priority'],
                _count: { id: true }
            }),
            prisma.project.findMany({
                where: {
                    priority: 'HIGH',
                    status: { not: 'DONE' }
                },
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: { id: true, title: true, status: true, priority: true }
            }),
            prisma.project.findMany({
                where: {
                    status: 'IN_PROGRESS',
                    checkInDate: { not: null }
                },
                take: 10,
                orderBy: { checkInDate: 'asc' },
                select: {
                    id: true,
                    title: true,
                    checkInDate: true,
                    property: { select: { name: true } }
                }
            })
        ]);

        // Process Project Stats
        let pendingProjects = 0;
        let highPriorityPending = 0;

        projectStats.forEach(group => {
            const count = group._count.id;
            if (group.status !== 'DONE') {
                pendingProjects += count;
                if (group.priority === 'HIGH') {
                    highPriorityPending += count;
                }
            }
        });

        res.json({
            activeProperties,
            revenue: totalRevenue._sum.amount || 0,
            activeLeads,
            highPriorityPending,
            pendingTasks: pendingProjects,
            urgentTasks: urgentProjectsQuery,
            upcomingInProgressTasks: upcomingProjectsQuery
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getDashboardStats };
