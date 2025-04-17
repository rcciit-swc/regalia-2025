import { supabase } from '../supabase-client';
import { toast } from 'sonner';

const updateRegisterStatusDb = async (id: string, status: boolean) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .update({ reg_status: status })
      .eq('id', id);

    if (error) {
      console.error('Error updating event:', error);
      return null;
    }
    toast.success('Event updated successfully');
    return data;
  } catch (err) {
    console.error('Unexpected error:', err);
    toast.error('Error updating event');
    return null;
  }
};

export { updateRegisterStatusDb };
