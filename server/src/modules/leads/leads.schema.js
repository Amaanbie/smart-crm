import { z } from 'zod';

const LeadStatus = z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'WON', 'LOST']);
const LeadPriority = z.enum(['LOW', 'MEDIUM', 'HIGH']);

// Coerce empty strings to undefined so optional FK / date / number fields don't
// reach Prisma as "" (which causes P2003 / invalid date / coercion errors).
const emptyToUndef = (v) => (v === '' || v === null ? undefined : v);

export const createLeadSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.preprocess(emptyToUndef, z.string().email('Invalid email').optional()),
  phone: z.preprocess(emptyToUndef, z.string().optional()),
  company: z.preprocess(emptyToUndef, z.string().optional()),
  source: z.preprocess(emptyToUndef, z.string().optional()),
  status: LeadStatus.default('NEW'),
  priority: LeadPriority.default('MEDIUM'),
  estimatedValue: z.preprocess(emptyToUndef, z.coerce.number().positive().optional()),
  expectedCloseDate: z.preprocess(emptyToUndef, z.coerce.date().optional()),
  assignedToId: z.preprocess(emptyToUndef, z.string().cuid().optional()),
});

export const updateLeadSchema = createLeadSchema.partial();

export const statusSchema = z.object({
  status: LeadStatus,
});
