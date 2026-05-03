import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getUsers } from '../../api/auth.api.js';
import Input from '../ui/Input.jsx';
import Select from '../ui/Select.jsx';
import Button from '../ui/Button.jsx';

const STATUS_OPTIONS = ['NEW','CONTACTED','QUALIFIED','PROPOSAL','WON','LOST'].map((v) => ({ value: v, label: v.charAt(0) + v.slice(1).toLowerCase() }));
const PRIORITY_OPTIONS = ['LOW','MEDIUM','HIGH'].map((v) => ({ value: v, label: v.charAt(0) + v.slice(1).toLowerCase() }));
const SOURCE_OPTIONS = ['WEBSITE','REFERRAL','COLD_EMAIL','LINKEDIN','EVENT','PARTNER'].map((v) => ({ value: v, label: v.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()) }));

export default function LeadForm({ defaultValues, onSubmit, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers().then(setUsers).catch(() => {});
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full Name *"
          placeholder="John Smith"
          error={errors.name?.message}
          {...register('name', { required: 'Name is required' })}
        />
        <Input
          label="Email"
          type="email"
          placeholder="john@company.com"
          error={errors.email?.message}
          {...register('email')}
        />
        <Input label="Phone" placeholder="+1 555-000-0000" {...register('phone')} />
        <Input label="Company" placeholder="Acme Corp" {...register('company')} />
        <Select
          label="Source"
          options={SOURCE_OPTIONS}
          placeholder="Select source"
          {...register('source')}
        />
        <Select
          label="Status"
          options={STATUS_OPTIONS}
          {...register('status')}
        />
        <Select
          label="Priority"
          options={PRIORITY_OPTIONS}
          {...register('priority')}
        />
        <Input
          label="Estimated Value ($)"
          type="number"
          min="0"
          step="100"
          placeholder="50000"
          {...register('estimatedValue', { valueAsNumber: true })}
        />
        <Input
          label="Expected Close Date"
          type="date"
          {...register('expectedCloseDate')}
        />
        <Select
          label="Assigned To"
          options={users.map((u) => ({ value: u.id, label: `${u.name} (${u.role})` }))}
          placeholder="Unassigned"
          {...register('assignedToId')}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={loading}>
          Save Lead
        </Button>
      </div>
    </form>
  );
}
