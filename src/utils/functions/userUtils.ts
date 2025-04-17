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

const updateUserData = async (data: any) => {
  try {
    const { error } = await supabase
      .from('users')
      .update({
        name: data.full_name,
        phone: data.phone,
        gender: data.gender,
      })
      .eq('id', data.id);
    if (error) {
      throw error;
    }
    return;
  } catch (error) {
    console.log('error is ', error);
    throw error;
  }
};

export { updateUserData };