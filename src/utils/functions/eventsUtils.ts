import { EventData, events } from '@/lib/types/events';
import { supabase } from './supabase-client';
import { toast } from 'sonner';
import { supabaseServer } from './supabase-server';
import { getRoles } from './userUtils';

export const getEventCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('event_categories')
      .select('*')
      .eq('fest_id', '9b890292-2425-4c61-8753-9a1fcdd37acc');
    if (error) return error;
    return data;
  } catch (error: any) {
    toast.error(error.message);
  }
};

export async function createEvent(event: events) {
  const { data, error } = await supabase.from('events').insert(event);

  if (error) throw error;
  return data;
}

export const updateRegisterStatusDb = async (id: string, status: boolean) => {
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

export const getEventsData = async (all: boolean = true) => {
  try {
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError) {
      console.error('Error getting session:', sessionError);
      return null;
    }

    const p_user_id = sessionData?.session?.user?.id || null;
    const p_fest_id = '9b890292-2425-4c61-8753-9a1fcdd37acc';
    const rolesData: {
      role: string;
      event_category_id?: string;
      event_id?: string;
    }[] = (await getRoles()) || []; // Provide a default empty array if getRoles() returns null or undefined

    let data, error;

    if (all || !rolesData || rolesData.length === 0) {
      // Fetch all events if `all` is true or rolesData is empty/null
      ({ data, error } = await supabase.rpc('get_events_by_fest', {
        p_fest_id,
        p_user_id,
      }));
    } else {
      // Determine the highest privileged role
      const roles = rolesData.map((role: { role: string }) => role.role);
      if (roles.includes('super_admin') || roles.includes('registrar')) {
        ({ data, error } = await supabase.rpc('get_events_by_fest', {
          p_fest_id,
          p_user_id,
        }));
      } else if (roles.includes('convenor')) {
        const eventCategoryIds = rolesData
          .filter(
            (role: { role: string; event_category_id?: string }) =>
              role.role === 'convenor'
          )
          .map(
            (role: { role: string; event_category_id?: string }) =>
              role.event_category_id
          );

        ({ data, error } = await supabase
          .from('events')
          .select('*')
          .in('event_category_id', eventCategoryIds));
      } else if (roles.includes('coordinator')) {
        const eventIds = rolesData
          .filter(
            (role: { role: string; event_id?: string }) =>
              role.role === 'coordinator'
          )
          .map((role: { event_id?: string | null }) => role.event_id);

        ({ data, error } = await supabase
          .from('events')
          .select('*')
          .in('id', eventIds));
      } else {
        throw new Error('Invalid role');
      }
    }

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (err) {
    console.error('Unexpected error:', err);
    return null;
  }
};

export const getEventsForAdmin = async (
  id: string,
  p_fest_id?: string,
  p_user_id?: string
) => {
  try {
    const rolesData = await getRoles(); // Expecting an array of roles

    if (!rolesData || rolesData.length === 0) {
      throw new Error('No roles found');
    }

    let data, error;
    const roles = rolesData.map((role: { role: string }) => role.role);

    if (roles.includes('super_admin')) {
      if (!p_fest_id || !p_user_id) {
        throw new Error('Missing parameters for super_admin');
      }
      ({ data, error } = await supabase.rpc('get_events_by_fest', {
        p_fest_id,
        p_user_id,
      }));
    } else if (roles.includes('convenor')) {
      const eventCategoryIds = rolesData
        .filter(
          (role: { role: string; event_category_id?: string }) =>
            role.role === 'convenor'
        )
        .map(
          (role: { role: string; event_category_id?: string }) =>
            role.event_category_id
        );

      ({ data, error } = await supabase
        .from('events')
        .select('*')
        .in('event_category_id', eventCategoryIds));
    } else if (roles.includes('coordinator')) {
      const eventIds = rolesData
        .filter(
          (role: { role: string; event_id?: string }) =>
            role.role === 'coordinator'
        )
        .map((role: { event_id?: string | null }) => role.event_id);

      ({ data, error } = await supabase
        .from('events')
        .select('*')
        .in('id', eventIds));
    } else {
      throw new Error('Invalid role');
    }

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error: any) {
    console.error('Error fetching events:', error.message);
    return null;
  }
};

export const updateEventById = async (
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

export const getApprovalDashboardData = async (
  rangeStart: number,
  rangeEnd: number
): Promise<EventData[] | null> => {
  try {
    const rolesData = await getRoles();
    const isAdmin = rolesData?.find((role) => role.role === 'super_admin');
    const isCoordinator = rolesData?.find(
      (role) => role.role === 'coordinator'
    );
    // const roleCategory = rolesData?.map((roles: { event_category_id: string | null }) =>
    //   roles.event_category_id !== null ? roles.event_category_id : null
    // )[0];
    // const eventIds = rolesData
    //   ?.map((role: { event_id: string | null }) => (role.event_id !== null ? role.event_id : null))
    //   .filter((id: string | null) => id !== null);
    // const finalEventIds = eventIds!.length > 0 ? eventIds : null;

    const { data, error } = await supabase
      .rpc('get_registrations_by_event_ids', {
        p_fest_id: '9b890292-2425-4c61-8753-9a1fcdd37acc',
        p_event_category_id:
          isAdmin?.role === 'super_admin'
            ? 'bc21d159-b6f4-4f1d-9c4a-45b67e9971b3'
            : null,
        p_event_id:
          isCoordinator?.role === 'coordinator'
            ? [isCoordinator?.event_id]
            : null,
      })
      .range(rangeStart, rangeEnd);

    if (error) {
      console.error('Error fetching event table data:', error);
      toast.error('Error fetching event table data');
      return null;
    }

    return data as EventData[];
  } catch (err) {
    console.error('Unexpected error:', err);
    toast.error('Unexpected error occurred');
    return null;
  }
};

export const getEventByID = async (id: string): Promise<events | null> => {
  const serverClient = await supabaseServer();
  const p_event_id = id;
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();
  if (sessionError) {
    console.error('Error getting session:', sessionError);
    return null;
  }

  // const p_user_id = sessionData?.session?.user?.id || null;

  const { data, error } = await serverClient
    .from('events')
    .select('*')
    .eq('id', p_event_id);

  if (error) {
    console.error('Error fetching event:', error);
    return null;
  }

  // Return the first result, since the RPC returns a table (array)
  return data && data.length > 0 ? data[0] : null;
};
