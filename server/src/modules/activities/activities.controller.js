import * as activitiesService from './activities.service.js';
import asyncHandler from '../../utils/asyncHandler.js';

export const getActivities = asyncHandler(async (req, res) => {
  const leadId = req.params.leadId;
  const activities = await activitiesService.findByLead(leadId);
  res.json(activities);
});

export const createActivity = asyncHandler(async (req, res) => {
  const leadId = req.params.leadId;
  const activity = await activitiesService.create(leadId, req.body);
  res.status(201).json(activity);
});

export const updateActivity = asyncHandler(async (req, res) => {
  const activity = await activitiesService.update(req.params.id, req.body);
  res.json(activity);
});

export const deleteActivity = asyncHandler(async (req, res) => {
  await activitiesService.remove(req.params.id);
  res.status(204).end();
});
