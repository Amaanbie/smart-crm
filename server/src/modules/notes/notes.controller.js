import * as notesService from './notes.service.js';
import asyncHandler from '../../utils/asyncHandler.js';

export const getNotes = asyncHandler(async (req, res) => {
  const notes = await notesService.findByLead(req.params.leadId);
  res.json(notes);
});

export const createNote = asyncHandler(async (req, res) => {
  const note = await notesService.create(req.params.leadId, req.body.content);
  res.status(201).json(note);
});

export const deleteNote = asyncHandler(async (req, res) => {
  await notesService.remove(req.params.id);
  res.status(204).end();
});
