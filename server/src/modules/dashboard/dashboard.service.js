import prisma from '../../lib/prisma.js';

export const getSummary = async () => {
  const now = new Date();

  const [
    totalLeads,
    valueAgg,
    wonValueAgg,
    wonCount,
    lostCount,
    leadsByStatus,
    leadsBySource,
    overdueFollowUps,
    highPriorityLeads,
  ] = await Promise.all([
    prisma.lead.count(),

    prisma.lead.aggregate({ _sum: { estimatedValue: true } }),

    prisma.lead.aggregate({
      where: { status: 'WON' },
      _sum: { estimatedValue: true },
    }),

    prisma.lead.count({ where: { status: 'WON' } }),

    prisma.lead.count({ where: { status: 'LOST' } }),

    prisma.lead.groupBy({
      by: ['status'],
      _count: { status: true },
    }),

    prisma.lead.groupBy({
      by: ['source'],
      _count: { source: true },
      where: { source: { not: null } },
    }),

    prisma.activity.findMany({
      where: { dueDate: { lt: now }, completed: false },
      include: {
        lead: { select: { id: true, name: true, company: true } },
      },
      orderBy: { dueDate: 'asc' },
      take: 10,
    }),

    prisma.lead.findMany({
      where: {
        priority: 'HIGH',
        status: { notIn: ['WON', 'LOST'] },
      },
      select: {
        id: true, name: true, company: true, estimatedValue: true,
        status: true, expectedCloseDate: true,
      },
      orderBy: { estimatedValue: 'desc' },
      take: 5,
    }),
  ]);

  const closed = wonCount + lostCount;
  const conversionRate = closed > 0 ? Math.round((wonCount / closed) * 100) : 0;

  return {
    totalLeads,
    totalPipelineValue: valueAgg._sum.estimatedValue || 0,
    wonRevenue: wonValueAgg._sum.estimatedValue || 0,
    conversionRate,
    leadsByStatus: leadsByStatus.map((g) => ({ status: g.status, count: g._count.status })),
    leadsBySource: leadsBySource.map((g) => ({ source: g.source || 'Unknown', count: g._count.source })),
    overdueFollowUps,
    highPriorityLeads,
  };
};
