import { toast } from 'sonner';
import { supabase } from '../supabase-client';

export const handleSaveChanges = async (
  formData: FormData,
  userData: any,
  updateUserData: (updatedData: any) => Promise<void> | void,
  closeModal: () => void
) => {
  const formDataObj = Object.fromEntries(formData.entries());

  if (!formDataObj.gender) {
    toast.error('Gender is required');
    return;
  } else if (!formDataObj.fullName) {
    toast.error('Full name is required');
    return;
  } else if (!formDataObj.phone) {
    toast.error('Phone number is required');
    return;
  }

  if (!userData?.id) {
    toast.error('User data not found');
    return;
  }

  const updatedData = {
    id: userData.id,
    full_name: formDataObj.fullName,
    phone: formDataObj.phone,
    gender: formDataObj.gender,
  };

  try {
    await updateUserData(updatedData);
    toast.success('Profile updated successfully');
  } catch (error) {
    console.error('Error updating user data:', error);
    toast.error('Failed to update profile');
  } finally {
    closeModal();
  }
};

/**
 * Fetches registration details for a given event and authenticated user.
 */
export async function fetchRegistrationDetails(
  eventId: string,
  userId: string
): Promise<
  Array<{
    is_team: boolean;
    team_name: string;
    team_members: Array<{
      name: string;
      email: string;
      phone: string;
    }>;
  }>
> {
  const { data, error } = await supabase.rpc('get_registration_details', {
    p_event_id: eventId,
    p_user_id: userId,
  });

  if (error) {
    console.error('Error fetching registration details:', error);
    throw new Error('Failed to fetch registration details');
  }

  console.log('Registration Details:', data);
  return data;
}
