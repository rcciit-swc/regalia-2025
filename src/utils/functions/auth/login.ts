import { supabase } from '../supabase-client';

export const login = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: location.origin + '/auth/callback?next=',
    },
  });
  if (error) {
    return null;
  }
  return data;
};
