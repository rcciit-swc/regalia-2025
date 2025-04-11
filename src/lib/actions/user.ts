import { getUserData } from '@/utils/functions';

export const populateUserDetails = async (set: any) => {
  set({ userLoading: true });
  const data = await getUserData();
  set({ userData: data, userLoading: false });
};