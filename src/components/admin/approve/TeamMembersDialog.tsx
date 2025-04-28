'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TeamMember } from '@/lib/types/events';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Users,
  User,
  Phone,
  Mail,
  Building,
  X,
  UserCheck,
  UserCircle,
  Edit,
} from 'lucide-react';
import { EditTeamMemberDialog } from '@/components/Events/EditTeamMemberDialog';
import { supabase } from '@/utils/functions/supabase-client';

export function TeamMembersDialog({
  members,
  teamID,
}: {
  members: TeamMember[];
  teamID: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(members);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const fadeVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  const memberVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  const handleEditMember = (member: TeamMember) => {
    setEditingMember(member);
    setIsEditDialogOpen(true);
  };

  const handleSaveMember = async (
    updatedMember: TeamMember,
    teamID: string
  ): Promise<void> => {
    try {
      const { data, error } = await supabase.from('participants').update({
        team_id: teamID,
        name: updatedMember.name,
        email: updatedMember.email,
        phone: updatedMember.phone,
      }).eq('team_id', teamID).eq('email', updatedMember.email);
    } catch (error) {
      toast.error('Failed to save member details. Please try again.');
    }
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingMember(null);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="bg-[#210000]/60 border-yellow-500/30 hover:bg-[#310000] hover:border-yellow-400 text-yellow-200 transition-all duration-300"
          >
            <Users className="w-4 h-4 mr-2 text-yellow-400" />
            View Team
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[750px] my-scrollbar bg-gradient-to-br from-[#210000] to-[#3a0000] border-2 border-yellow-500/30 rounded-xl p-8 shadow-xl overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-yellow-300 blur-3xl"></div>
            <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-red-600 blur-3xl"></div>
          </div>

          <DialogHeader className="relative z-10">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center gap-3 mb-4"
            >
              <UserCheck size={32} className="text-yellow-300" />
              <Users size={32} className="text-yellow-300" />
              <UserCircle size={32} className="text-yellow-300" />
            </motion.div>
            <DialogTitle className="text-center text-white font-antolia tracking-widest font-bold text-3xl bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-500 pb-2">
              Team Members
            </DialogTitle>
            <div className="flex justify-center mt-2">
              <div className="h-1 w-32 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full"></div>
            </div>
          </DialogHeader>

          <motion.div
            variants={fadeVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="overflow-y-auto my-scrollbar max-h-[65vh] relative z-10 mt-6"
          >
            {teamMembers && teamMembers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={index}
                    custom={index}
                    variants={memberVariants}
                    initial="hidden"
                    animate="visible"
                    className="relative bg-[#210000]/80 border border-yellow-500/20 p-6 rounded-xl hover:border-yellow-500/40 transition-all duration-300 transform hover:-translate-y-1 group"
                  >
                    {/* Edit button */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button
                        onClick={() => handleEditMember(member)}
                        variant="ghost"
                        className="h-8 w-8 p-0 flex items-center justify-center rounded-full bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-400"
                      >
                        <Edit size={16} />
                      </Button>
                    </div>

                    <div className="grid gap-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-r from-yellow-400 to-red-500 rounded-full p-0.5">
                          <div className="bg-[#210000] rounded-full p-2">
                            <User size={24} className="text-yellow-400" />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-yellow-200/70">Name</p>
                          <p className="font-antolia tracking-wider text-xl text-white">
                            {member.name}
                          </p>
                        </div>
                      </div>

                      <div className="pl-12 grid gap-4">
                        <div className="flex items-center gap-3">
                          <Mail size={18} className="text-yellow-500/70" />
                          <div>
                            <p className="text-sm text-yellow-200/70">Email</p>
                            <p className="font-medium text-white break-all">
                              {member.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Phone size={18} className="text-yellow-500/70" />
                          <div>
                            <p className="text-sm text-yellow-200/70">Phone</p>
                            <p className="font-medium text-white">
                              {member.phone}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-yellow-500/10 rounded-full">
                    <Users size={48} className="text-yellow-300/50" />
                  </div>
                </div>
                <p className="text-yellow-200/70 text-lg">
                  No team members found
                </p>
              </div>
            )}
          </motion.div>

          <div className="flex justify-center mt-6">
            <Button
              onClick={() => setIsOpen(false)}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-medium flex items-center gap-2 px-6 py-2 rounded-md border-0 transition-all duration-300"
            >
              <X size={18} />
              <span>Close</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Team Member Dialog */}
      {editingMember && (
        <EditTeamMemberDialog
          isOpen={isEditDialogOpen}
          teamID={teamID}
          onClose={handleCloseEditDialog}
          member={editingMember}
          onSave={handleSaveMember}
        />
      )}
    </>
  );
}
