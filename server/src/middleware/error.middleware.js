import { ApiError } from '../utils/ApiError.js';

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, _req, res, _next) => {
  // Prisma unique constraint
  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'field';
    return res.status(409).json({ message: `${field} already exists` });
  }

  // Prisma record not found
  if (err.code === 'P2025') {
    return res.status(404).json({ message: 'Record not found' });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      message: err.message,
      ...(err.errors.length > 0 && { errors: err.errors }),
    });
  }

  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
};

export default errorHandler;
