import prisma from '../../lib/prisma.js';
import { ApiError } from '../../utils/ApiError.js';

const leadInclude = {
  assignedTo: { select: { id: true, name: true, email: true } },
  createdBy: { select: { id: true, name: true, email: true } },
  _count: { select: { activities: true, notes: true } },
};

export const findAll = async ({ status, priority, source, search, assignedToId, page = 1, limit = 20 } = {}) => {
  const where = {
    ...(status && { status }),
    ...(priority && { priority }),
    ...(source && { source }),
    ...(assignedToId && { assignedToId }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
      ],
    }),
  };

  const skip = (page - 1) * limit;
  const [data, total] = await prisma.$transaction([
    prisma.lead.findMany({
      where,
      include: leadInclude,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.lead.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const findById = async (id) => {
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: {
      ...leadInclude,
      activities: { orderBy: { createdAt: 'desc' } },
      notes: { orderBy: { createdAt: 'desc' } },
    },
  });
  if (!lead) throw new ApiError(404, 'Lead not found');
  return lead;
};

export const create = async (data, createdById) => {
  return prisma.lead.create({
    data: { ...data, createdById },
    include: leadInclude,
  });
};

export const update = async (id, data) => {
  await findById(id);
  return prisma.lead.update({ where: { id }, data, include: leadInclude });
};

export const updateStatus = async (id, status) => {
  await findById(id);
  return prisma.lead.update({ where: { id }, data: { status }, include: leadInclude });
};

export const remove = async (id) => {
  await findById(id);
  await prisma.lead.delete({ where: { id } });
};
