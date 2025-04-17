import { Suspense } from 'react';
import ProfileContent from './ProfilePageContent';
import ProfileSkeleton from './ProfileSkeleton';

export default function ProfilePage() {
  return (
    // do not remove this Suspense component ( yes i am talking to you and i am not ai )
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileContent />
    </Suspense>
  );
}
