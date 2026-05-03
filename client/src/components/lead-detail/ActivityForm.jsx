import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Input from '../ui/Input.jsx';
import Select from '../ui/Select.jsx';
import Button from '../ui/Button.jsx';

const TYPE_OPTIONS = ['CALL','EMAIL','MEETING','NOTE','FOLLOW_UP'].map((v) => ({
  value: v,
  label: v.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
}));

export default function ActivityForm({ onSubmit, loading }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: { type: 'FOLLOW_UP' } });
  const [apiError, setApiError] = useState('');

  const submit = async (data) => {
    setApiError('');
    try {
      await onSubmit(data);
      reset({ type: 'FOLLOW_UP' });
    } catch (e) {
      setApiError(e.response?.data?.message || 'Failed to add activity');
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      {apiError && (
        <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {apiError}
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <Select label="Type" options={TYPE_OPTIONS} {...register('type')} />
        <Input
          label="Due Date *"
          type="date"
          error={errors.dueDate?.message}
          {...register('dueDate', { required: 'Due date is required' })}
        />
      </div>
      <Input
        label="Title *"
        placeholder="e.g. Follow-up call with stakeholder"
        error={errors.title?.message}
        {...register('title', { required: 'Title is required' })}
      />
      <Input
        label="Description"
        placeholder="Optional notes…"
        {...register('description')}
      />
      <div className="flex justify-end gap-2">
        <Button type="submit" loading={loading}>Add Activity</Button>
      </div>
    </form>
  );
}
