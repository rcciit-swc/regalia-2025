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

interface TeamMember {
  name: string;
  email: string;
  phone: string;
}

interface ViewTeamMembersProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  teamMembers: TeamMember[];
  onEditMember: (index: number) => void;
}

export function ViewTeamMembers({
  isOpen,
  onOpenChange,
  teamMembers,
  onEditMember,
}: ViewTeamMembersProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const Content = () => (
    <div className="mt-6">
      {teamMembers.map((member, index) => (
        <div key={index} className="mb-4 p-4 bg-gray-900 rounded-lg">
          <p className="text-white font-semibold">Name: {member.name}</p>
          <p className="text-gray-400">Email: {member.email}</p>
          <p className="text-gray-400">Phone: {member.phone}</p>
          <Button
            onClick={() => onEditMember(index)}
            className="mt-2 bg-[#8B5CF6] text-white hover:bg-[#8B5CF6]/90 border-0"
          >
            Edit
          </Button>
        </div>
      ))}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent className="bg-black border-t border-[#8B5CF6]">
          <DrawerHeader>
            <DrawerTitle className="text-white">Added Team Members</DrawerTitle>
            <DrawerDescription className="text-gray-400">
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
        className="bg-black border-l border-[#8B5CF6] w-[400px] sm:w-[540px]"
      >
        <SheetHeader>
          <SheetTitle className="text-white">Added Team Members</SheetTitle>
          <SheetDescription className="text-gray-400">
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
