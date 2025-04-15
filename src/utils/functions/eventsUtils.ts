import { supabase } from './supabase-client';

const getEventsData = async () => {
  try {
    // Get the current session which holds the logged-in user's details.
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();
    if (sessionError) {
      console.error('Error getting session:', sessionError);
      return null;
    }

    const p_user_id = sessionData?.session?.user?.id || null;

    const { data, error } = await supabase.rpc('get_events_with_registration', {
      p_user_id,
    });
    if (error) {
      console.error('Error fetching events:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Unexpected error:', err);
    return null;
  }
};

export { getEventsData };
