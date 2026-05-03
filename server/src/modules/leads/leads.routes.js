import { Router } from 'express';
import verifyAuth from '../../middleware/auth.middleware.js';
import validate from '../../middleware/validate.middleware.js';
import { createLeadSchema, updateLeadSchema, statusSchema } from './leads.schema.js';
import { getLeads, getLead, createLead, updateLead, patchStatus, deleteLead } from './leads.controller.js';

import { activitiesSubRouter } from '../activities/activities.routes.js';
import { subRouter as notesSubRouter } from '../notes/notes.routes.js';

const router = Router();
router.use(verifyAuth);

router.use('/:leadId/activities', activitiesSubRouter);
router.use('/:leadId/notes', notesSubRouter);

router.get('/', getLeads);
router.get('/:id', getLead);
router.post('/', validate(createLeadSchema), createLead);
router.patch('/:id', validate(updateLeadSchema), updateLead);
router.patch('/:id/status', validate(statusSchema), patchStatus);
router.delete('/:id', deleteLead);

export default router;
