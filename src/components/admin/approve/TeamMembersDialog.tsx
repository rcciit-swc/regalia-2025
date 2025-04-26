import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { TeamMember } from '@/lib/types/events';
import { Users } from 'lucide-react';

export function TeamMembersDialog({ members }: { members: TeamMember[] }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-[#1F2937] border-gray-700 hover:bg-[#2D3748] hover:text-white text-gray-300"
        >
          <Users className="w-4 h-4 mr-2" />
          View Members
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[#0B0F17] max-w-fit text-gray-100 border-gray-800 ">
        <DialogHeader>
          <DialogTitle>Team Members</DialogTitle>
        </DialogHeader>
        <div>
          {members && members.length > 0 ? (
            <div className="flex flex-wrap gap-4">
              {members.map((member, index) => (
                <div
                  key={index}
                  className="bg-[#1F2937] p-4 rounded-lg w-[300px]"
                >
                  <div className="grid gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Name</p>
                      <p className="font-medium">{member.name}</p>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <p className="text-sm text-gray-400">Email</p>
                        <p className="font-medium break-all">{member.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Phone</p>
                        <p className="font-medium">{member.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center">
              <p className="text-gray-400">No team members</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
