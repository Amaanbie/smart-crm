import * as leadsService from './leads.service.js';
import asyncHandler from '../../utils/asyncHandler.js';

export const getLeads = asyncHandler(async (req, res) => {
  const { status, priority, source, search, assignedToId, page, limit } = req.query;
  const result = await leadsService.findAll({
    status, priority, source, search, assignedToId,
    page: page ? parseInt(page, 10) : 1,
    limit: limit ? parseInt(limit, 10) : 20,
  });
  res.json(result);
});

export const getLead = asyncHandler(async (req, res) => {
  const lead = await leadsService.findById(req.params.id);
  res.json(lead);
});

export const createLead = asyncHandler(async (req, res) => {
  const lead = await leadsService.create(req.body, req.user.id);
  res.status(201).json(lead);
});

export const updateLead = asyncHandler(async (req, res) => {
  const lead = await leadsService.update(req.params.id, req.body);
  res.json(lead);
});

export const patchStatus = asyncHandler(async (req, res) => {
  const lead = await leadsService.updateStatus(req.params.id, req.body.status);
  res.json(lead);
});

export const deleteLead = asyncHandler(async (req, res) => {
  await leadsService.remove(req.params.id);
  res.status(204).end();
});
