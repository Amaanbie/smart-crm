import { Router } from 'express';
import validate from '../../middleware/validate.middleware.js';
import { createNoteSchema } from './notes.schema.js';
import { getNotes, createNote, deleteNote } from './notes.controller.js';

// Sub-resource router: mounted at /api/leads/:leadId/notes
const subRouter = Router({ mergeParams: true });
subRouter.get('/', getNotes);
subRouter.post('/', validate(createNoteSchema), createNote);

// Standalone router: mounted at /api/notes
const standaloneRouter = Router();
standaloneRouter.delete('/:id', deleteNote);

export { standaloneRouter as default, subRouter };
