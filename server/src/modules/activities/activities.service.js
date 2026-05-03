import prisma from '../../lib/prisma.js';
import { ApiError } from '../../utils/ApiError.js';

export const findByLead = async (leadId) => {
  return prisma.activity.findMany({
    where: { leadId },
    orderBy: { createdAt: 'desc' },
  });
};

export const create = async (leadId, data) => {
  return prisma.activity.create({ data: { ...data, leadId } });
};

export const update = async (id, data) => {
  const activity = await prisma.activity.findUnique({ where: { id } });
  if (!activity) throw new ApiError(404, 'Activity not found');
  return prisma.activity.update({ where: { id }, data });
};

export const remove = async (id) => {
  const activity = await prisma.activity.findUnique({ where: { id } });
  if (!activity) throw new ApiError(404, 'Activity not found');
  await prisma.activity.delete({ where: { id } });
};
