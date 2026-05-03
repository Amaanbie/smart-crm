import * as dashboardService from './dashboard.service.js';
import asyncHandler from '../../utils/asyncHandler.js';

export const getSummary = asyncHandler(async (_req, res) => {
  const summary = await dashboardService.getSummary();
  res.json(summary);
});
