import bcrypt from 'bcryptjs';
import prisma from '../../lib/prisma.js';
import { ApiError } from '../../utils/ApiError.js';

const sanitizeUser = ({ password: _, ...user }) => user;

export const createUser = async ({ name, email, password, role }) => {
  const hashed = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { name, email, password: hashed, role: role || 'SALES' },
  });
  return sanitizeUser(user);
};

export const findByEmail = async (email) => {
  return prisma.user.findUnique({ where: { email } });
};

export const comparePassword = async (plain, hashed) => {
  return bcrypt.compare(plain, hashed);
};

export const findById = async (id) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new ApiError(404, 'User not found');
  return sanitizeUser(user);
};

export const listUsers = async () => {
  const users = await prisma.user.findMany({ orderBy: { name: 'asc' } });
  return users.map(sanitizeUser);
};
