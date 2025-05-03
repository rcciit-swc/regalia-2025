import {
  createEvent,
  getApprovalDashboardData,
  getEventByID,
  getEventCategories,
  getEventsData,
  updateEventById,
  updateRegisterStatusDb,
} from '@/utils/functions';
import { events } from '../types/events';
import { toast } from 'sonner';

export const populateEventDetails = async (set: any, all: boolean) => {
  set({ eventsLoading: true });
  const data = await getEventsData(all);
  set({ eventsData: data, eventsLoading: false });
};

export const populateCategories = async (set: any) => {
  set({ eventCategoriesLoading: true });
  // logic
  const data = await getEventCategories();
  if (!data) {
    set({ eventCategories: [], eventCategoriesLoading: false });
  } else {
    set({ eventCategories: data, eventCategoriesLoading: false });
  }
};

export const addEvent = async (set: any, eventData: events) => {
  try {
    set({ eventsLoading: true });
    await createEvent(eventData);
    set({ eventsLoading: false });
  } catch (error: any) {
    toast.error('Failed to create event. ' + error.message);
  }
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

export const updatePopulateEvents = async (set: any, id: string, data: any) => {
  set({ eventsLoading: true });
  await updateEventById(id, data);
  const updatedData = await getEventsData();
  set({ eventsData: updatedData, eventsLoading: false });
};

export const populateApprovalDashboard = async (
  set: any,
  rangeStart: number,
  rangeEnd: number
) => {
  try {
    set({ approvalDashboardLoading: true });
    const res = await getApprovalDashboardData(rangeStart, rangeEnd);
    set({ approvalDashboardData: res, approvalDashboardLoading: false });
    // if (!res) {
    //   set({ approvalDashboardData: [], approvalDashboardLoading: false });
    // } else {
    //   set({ approvalDashboardData: finalRes, approvalDashboardLoading: false });
    // }
  } catch (error: any) {
    console.log(error.message);
  }
};

export const populateEventDetailsByID = async (set: any, id: string) => {
  try {
    set({ eventsLoading: true });
    const eventData = await getEventByID(id);
    if (!eventData) {
      set({ eventData: {}, eventDetailsLoading: false });
    } else {
      set({ eventData, eventDetailsLoading: false });
    }
  } catch (error: any) {
    set({ eventData: {}, eventDetailsLoading: false });
  }
};
