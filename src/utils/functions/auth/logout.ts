import { supabase } from '../supabase-client';

export const logout = async () => {
  const { data: session } = await supabase.auth.getSession();

  if (!session || !session.session) {
    console.warn('No active session found.');
    window.location.href = '/'; // Redirect anyway
    return;
  }

  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Logout failed:', error.message);
  }

  window.location.href = '/';
};
