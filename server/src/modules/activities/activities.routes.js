import { Router } from 'express';
import validate from '../../middleware/validate.middleware.js';
import { createActivitySchema, updateActivitySchema } from './activities.schema.js';
import { getActivities, createActivity, updateActivity, deleteActivity } from './activities.controller.js';

// Sub-resource router: mounted at /api/leads/:leadId/activities
const subRouter = Router({ mergeParams: true });
subRouter.get('/', getActivities);
subRouter.post('/', validate(createActivitySchema), createActivity);

// Standalone router: mounted at /api/activities
const standaloneRouter = Router();
standaloneRouter.patch('/:id', validate(updateActivitySchema), updateActivity);
standaloneRouter.delete('/:id', deleteActivity);

export { standaloneRouter as default, subRouter };
export { subRouter as activitiesSubRouter };
