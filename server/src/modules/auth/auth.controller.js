import * as authService from './auth.service.js';
import { signToken } from '../../utils/jwt.js';
import { ApiError } from '../../utils/ApiError.js';
import asyncHandler from '../../utils/asyncHandler.js';

export const register = asyncHandler(async (req, res) => {
  const user = await authService.createUser(req.body);
  const token = signToken({ id: user.id, role: user.role });
  res.status(201).json({ token, user });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.findByEmail(email);
  if (!user || !(await authService.comparePassword(password, user.password))) {
    throw new ApiError(401, 'Invalid email or password');
  }
  const { password: _, ...safeUser } = user;
  const token = signToken({ id: safeUser.id, role: safeUser.role });
  res.json({ token, user: safeUser });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await authService.findById(req.user.id);
  res.json(user);
});

export const getUsers = asyncHandler(async (_req, res) => {
  const users = await authService.listUsers();
  res.json(users);
});
