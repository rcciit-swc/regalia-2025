import { supabase } from '../supabase-client';
import type { events } from '@/lib/types';
import { toast } from 'sonner';

const updateEventById = async (
  id: string,
  data: Partial<events>
): Promise<events | null> => {
  try {
    const { data: updatedData, error } = await supabase
      .from('events')
      .update(data)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating event:', error);
      return null;
    }
    toast.success('Event updated successfully');
    return updatedData && updatedData.length > 0 ? updatedData[0] : null;
  } catch (err) {
    console.error('Unexpected error:', err);
    toast.error('Error updating event');
    return null;
  }
};

export { updateEventById };
