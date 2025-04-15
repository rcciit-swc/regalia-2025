// File: src/utils/functions/events/registerSolo.ts
import { toast } from 'sonner';
import { supabase } from '../supabase-client';

export interface RegisterSoloParams {
  userId: string;
  eventId: string;
  transactionId: string;
  transactionScreenshot: string;
  college: string;
}

export async function registerSoloEvent(
  params: RegisterSoloParams
): Promise<any> {
  const { userId, eventId, transactionId, transactionScreenshot, college } =
    params;

  // Call the RPC named 'register_solo_event' with the required parameters.
  const { data, error } = await supabase.rpc('register_solo_event', {
    p_user_id: userId,
    p_event_id: eventId,
    p_transaction_id: transactionId,
    p_transaction_screenshot: transactionScreenshot,
    p_college: college,
  });

  if (error) {
    throw error;
  } else {
    toast.success('Registered successfully');
  }

  return data;
}
