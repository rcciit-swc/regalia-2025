'use client';

import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { useUser } from '@/lib/stores';

interface TeamMember {
  name: string;
  email: string;
  phone: string;
}

interface ViewTeamMembersProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  teamMembers: TeamMember[];
  teamLeadData?: any;
  onEditMember: (index: number) => void;
  onEditTeamLead: () => void;
  confirmTeam: () => void;
  onRemoveMember: (index: number) => void;
  showConfirmTeam: boolean;
  registerLoading: boolean;
}

export function ViewTeamMembers({
  isOpen,
  onOpenChange,
  teamMembers,
  onEditMember,
  teamLeadData,
  onEditTeamLead,
  onRemoveMember,
  confirmTeam,
  registerLoading,
  showConfirmTeam,
}: ViewTeamMembersProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const Content = () => (
    <div className="mt-6  font-antolia tracking-widest">
      <div className="mb-4 p-4 bg-gray-900 rounded-lg text-xl tracking-widest">
        <h1 className="text-green-500 text-2xl tracking-widest">Team Lead :</h1>
        <p className="text-white font-semibold">
          Name: {teamLeadData?.name || ''}
        </p>
        <p className="text-gray-400">Email: {teamLeadData?.email || ''}</p>
        <p className="text-gray-400">Phone: {teamLeadData?.phone || ''}</p>
        <Button
          onClick={onEditTeamLead}
          className="mt-2 bg-yellow-200 text-black hover:bg-yellow-200/90 border-0"
        >
          Edit
        </Button>
      </div>
      {teamMembers.map((member, index) => (
        <div key={index} className="mb-4 p-4 bg-gray-900 rounded-lg">
          <p className="text-white font-semibold">Name: {member.name}</p>
          <p className="text-gray-400">Email: {member.email}</p>
          <p className="text-gray-400">Phone: {member.phone}</p>
          <div className="flex flex-row items-center gap-5">
            <Button
              onClick={() => onEditMember(index)}
              className="mt-2 bg-yellow-200 text-black hover:bg-yellow-200/90 border-0"
            >
              Edit
            </Button>
            <Button
              onClick={() => onRemoveMember(index)}
              className="mt-2 bg-yellow-200 text-black hover:bg-yellow-200/90 border-0"
            >
              Remove
            </Button>
          </div>
        </div>
      ))}
      {showConfirmTeam && (
        <Button
          onClick={confirmTeam}
          disabled={registerLoading}
          className="mt-2 bg-yellow-200 text-black hover:bg-yellow-200/90 border-0"
        >
          {registerLoading
              ? 'Loading...'
            : 'Proceed to Payment'}
        </Button>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent className="bg-black border-t border-yellow-200">
          <DrawerHeader>
            <DrawerTitle className="text-white text-3xl font-antolia tracking-wider">
              Added Team Members
            </DrawerTitle>
            <DrawerDescription className="text-yellow-200 text-xl font-kagitingan tracking-wider">
              Total members: {teamMembers.length}
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4 overflow-y-auto max-h-[calc(100vh-10rem)]">
            <Content />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="bg-black border-l border-yellow-200 w-[400px] sm:w-[540px]"
      >
        <SheetHeader>
          <SheetTitle className="text-white text-3xl font-antolia tracking-wider">
            Added Team Members
          </SheetTitle>
          <SheetDescription className="text-yellow-200 text-xl font-kagitingan tracking-wider">
            Total members: {teamMembers.length}
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 overflow-y-auto max-h-[calc(100vh-10rem)]">
          <Content />
        </div>
      </SheetContent>
    </Sheet>
  );
}
