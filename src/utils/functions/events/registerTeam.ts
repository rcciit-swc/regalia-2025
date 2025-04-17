import { toast } from 'sonner';
import { supabase } from '../supabase-client';

export interface TeamMember {
  name: string;
  phone: string;
  email: string;
}

export interface RegisterTeamParams {
  userId: string;
  eventId: string;
  transactionId: string;
  teamName: string;
  college: string;
  transactionScreenshot: string;
  teamLeadName: string;
  teamLeadPhone: string;
  teamLeadEmail: string;
  teamMembers: TeamMember[];
}

export async function registerTeamWithParticipants(params: RegisterTeamParams) {
  console.log('Registering team with participants:', params);

  // Validate required fields. If any validation fails, throw immediately.
  const validations = [
    { value: params.userId, message: 'User ID is required.' },
    { value: params.eventId, message: 'Event ID is required.' },
    { value: params.transactionId, message: 'Transaction ID is required.' },
    { value: params.teamName, message: 'Team name is required.' },
    { value: params.college, message: 'College is required.' },
    {
      value: params.transactionScreenshot,
      message: 'Transaction screenshot is required.',
    },
    { value: params.teamLeadName, message: 'Team lead name is required.' },
    { value: params.teamLeadPhone, message: 'Team lead phone is required.' },
    { value: params.teamLeadEmail, message: 'Team lead email is required.' },
  ];

  for (const { value, message } of validations) {
    if (!value) {
      toast.error(message);
      console.error('Validation failed:', message);
      throw new Error(message);
    }
  }

  const {
    userId,
    eventId,
    transactionId,
    teamName,
    college,
    transactionScreenshot,
    teamLeadName,
    teamLeadPhone,
    teamLeadEmail,
    teamMembers,
  } = params;

  // Call the RPC function 'register_team_with_participants'
  const { data, error } = await supabase.rpc(
    'register_team_with_participants',
    {
      p_user_id: userId,
      p_event_id: eventId,
      p_transaction_id: transactionId,
      p_team_name: teamName,
      p_college: college,
      p_transaction_screenshot: transactionScreenshot,
      p_team_lead_name: teamLeadName,
      p_team_lead_phone: teamLeadPhone,
      p_team_lead_email: teamLeadEmail,
      p_team_members: teamMembers || [],
    }
  );

  if (error) {
    // Check for the specific error message
    if (error.message.includes('User already registered for this event')) {
      toast.error('You are already registered for this event.');
    } else {
      toast.error(`Registration failed: ${error.message}`);
    }
    console.error('Error registering team:', error);
    throw new Error(error.message);
  } else {
    toast.success('Registration successful!');
    console.log('Team registered successfully:', data);
    return data;
  }
}
