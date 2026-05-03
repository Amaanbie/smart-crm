import prisma from '../../lib/prisma.js';
import { ApiError } from '../../utils/ApiError.js';

export const findByLead = async (leadId) => {
  return prisma.dealNote.findMany({
    where: { leadId },
    orderBy: { createdAt: 'desc' },
  });
};

export const create = async (leadId, content) => {
  return prisma.dealNote.create({ data: { leadId, content } });
};

export const remove = async (id) => {
  const note = await prisma.dealNote.findUnique({ where: { id } });
  if (!note) throw new ApiError(404, 'Note not found');
  await prisma.dealNote.delete({ where: { id } });
};
