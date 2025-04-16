import { getEventsData } from '@/utils/functions';
import { updateEventById } from '@/utils/functions/events/getEventById';
import { updateRegisterStatusDb } from '@/utils/functions/events/updateRegisterStatus';

export const populateEventDetails = async (set: any) => {
  set({ eventsLoading: true });
  const data = await getEventsData();
  set({ eventsData: data, eventsLoading: false });
};

export const update_and_populate_events = async (
  set: any,
  id: string,
  data: any
) => {
  set({ eventsLoading: true });
  await updateEventById(id, data);
  const updatedData = await getEventsData();
  set({ eventsData: updatedData, eventsLoading: false });
};

export const updateRegisterStatus = async (
  set: any,
  id: string,
  status: boolean
) => {
  await updateRegisterStatusDb(id, status);
  const updatedData = await getEventsData();
  set({ eventsData: updatedData });
};