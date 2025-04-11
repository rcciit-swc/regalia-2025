import { supabase } from './supabase-client';

const getUserData = async () => {
  try {
    const { data } = await supabase.auth.getSession();
    const userdetails = await supabase
      .from('users')
      .select('*')
      .eq('id', data?.session?.user?.id);
    if (userdetails && userdetails.data && userdetails.data.length > 0) {
      return userdetails.data[0];
    }
  } catch (err) {
    console.log(err);
  }
};

export { getUserData };