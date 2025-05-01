'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { useUser } from '@/lib/stores';
import { toast, Toaster } from 'sonner';
import { useEvents } from '@/lib/stores';
import confetti from 'canvas-confetti';
import { ViewTeamMembers } from './ViewTeamMembers';
import {
  RegisterTeamParams,
  registerTeamWithParticipants,
  uploadPaymentScreenshot,
} from '@/utils/functions/register-services';
import {
  User,
  Phone,
  Mail,
  Building,
  CreditCard,
  Upload,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Users,
  Pencil,
  Plus,
  UserCheck,
  UserPlus,
  Ticket,
  Music,
  Trophy,
  UsersRound,
  Eye,
} from 'lucide-react';
import { whatsAppLinks } from '@/utils/constraints/constants/whatsApp';

interface EventRegistrationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  eventName: string;
  minTeamSize: number; // includes team lead
  maxTeamSize: number;
  eventID: string;
  eventFees: number;
}

// Zod schema for the Team Lead (Step 1)
const teamLeadSchema = z.object({
  teamName: z.string().min(1, 'Team name is required'),
  name: z.string().min(1, 'Team lead name is required'),
  phone: z.string().min(1, 'Team lead phone is required'),
  email: z.string().email('Invalid email'),
  collegeName: z.string().min(1, 'College name is required'),
});
type TeamLeadFormValues = z.infer<typeof teamLeadSchema>;

export function TeamEventRegistration({
  isOpen,
  onClose,
  eventName,
  minTeamSize,
  maxTeamSize,
  eventID,
  eventFees,
}: EventRegistrationDialogProps) {
  const { userData } = useUser();
  const { markEventAsRegistered, eventsData } = useEvents();

  const teamMemberSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    phone: z.string().regex(/^\d{10,}$/, 'Phone must be at least 10 digits'),
    email: z.string().email('Invalid email'),
  });
  type TeamMemberFormValues = z.infer<typeof teamMemberSchema>;

  // Zod schema for Payment Details (Step 3)
  const paymentSchema = z.object({
    transactionId: z.string().min(1, 'Transaction ID is required'),
    paymentScreenshot: z
      .any()
      .refine(
        (files) => files && files.length > 0,
        'Payment screenshot is required'
      )
      .transform((files) => files[0]),
  });
  type PaymentFormValues = z.infer<typeof paymentSchema>;

  // step: 1 = Team Lead, 2 = Manage Team Members, 3 = Payment Details
  const [step, setStep] = useState(1);
  // Store validated team lead details
  const [teamLeadData, setTeamLeadData] = useState<TeamLeadFormValues | null>(
    null
  );
  // Store added team members (without a college field)
  const [teamMembers, setTeamMembers] = useState<TeamMemberFormValues[]>([]);
  // For displaying the added team members via the ViewTeamMembers component
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isConfirmedTeam, setIsConfirmedTeam] = useState(false);
  const [showConfirmTeam, setShowConfirmTeam] = useState(false);
  // Toggle for showing the add team member form
  const [isAddingMember, setIsAddingMember] = useState(false);
  // Added state to track which member is being edited
  const [editingMemberIndex, setEditingMemberIndex] = useState<number | null>(
    null
  );
  // State to track registration process
  const [isRegistering, setIsRegistering] = useState(false);
  // Success state
  const [showSuccess, setShowSuccess] = useState(false);

  // ----------- Step 1: Team Lead Form -----------
  const {
    register: registerTeamLead,
    handleSubmit: handleTeamLeadSubmit,
    formState: { errors: teamLeadErrors },
    reset: resetTeamLead,
  } = useForm<TeamLeadFormValues>({
    resolver: zodResolver(teamLeadSchema),
    defaultValues: {
      name: userData?.name,
      phone: userData?.phone,
      email: userData?.email,
      collegeName: userData?.college,
    },
  });

  const onTeamLeadSubmit = (data: TeamLeadFormValues) => {
    setTeamLeadData(data);
    setStep(2);
    resetTeamLead();
  };

  // ----------- Step 2: Add Team Member Form -----------
  const {
    register: registerTeamMember,
    handleSubmit: handleTeamMemberSubmit,
    formState: { errors: teamMemberErrors },
    reset: resetTeamMember,
  } = useForm<TeamMemberFormValues>({
    resolver: zodResolver(teamMemberSchema),
  });

  const onAddTeamMember = (data: TeamMemberFormValues) => {
    // Validate duplicate email: check against already added team members and the team lead.
    if (teamLeadData && teamLeadData.email === data.email) {
      toast.error(
        'Team member email cannot be the same as the team lead email.'
      );
      return;
    }
    if (teamMembers.some((member) => member.email === data.email)) {
      toast.error('This email has already been added as a team member.');
      return;
    }
    setTeamMembers((prev) => [...prev, data]);
    resetTeamMember();
    setIsAddingMember(false);
  };

  useEffect(() => {
    if (editingMemberIndex !== null) {
      const memberToEdit = teamMembers[editingMemberIndex];
      resetTeamMember(memberToEdit);
    }
  }, [editingMemberIndex, teamMembers, resetTeamMember]);

  // Total team count (team lead is counted if teamLeadData is set)
  const totalTeamCount = (teamLeadData ? 1 : 0) + teamMembers.length;

  const handleProceedToPayment = () => {
    if (totalTeamCount < minTeamSize) {
      toast.error(
        `Minimum team size is ${minTeamSize}. Please add more team members.`
      );
    } else if (totalTeamCount > maxTeamSize) {
      toast.error(
        `Maximum team size is ${maxTeamSize}. Please remove some team members.`
      );
    } else {
      setShowConfirmTeam(true);
      setIsSheetOpen(true);
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  // ----------- Step 3: Payment Form -----------
  const {
    register: registerPayment,
    handleSubmit: handlePaymentSubmit,
    formState: { errors: paymentErrors },
    reset: resetPayment,
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
  });

  const onPaymentSubmit = async (data: PaymentFormValues) => {
    setIsRegistering(true);
    let screenshotUrl = '';
    try {
      // Upload the payment screenshot using the integrated Supabase function.
      screenshotUrl = await uploadPaymentScreenshot(
        data.paymentScreenshot,
        eventName
      );
    } catch (error) {
      console.error('Failed to upload screenshot:', error);
      toast.error('Failed to upload screenshot. Please try again.');
      setIsRegistering(false);
      return;
    }
    const eventData = eventsData?.find((event) => event.id === eventID);
    // Combine all registration data.
    const registrationParams: RegisterTeamParams = {
      userId: userData?.id!, // non-null assertion since we expect this to be set
      eventId: eventID,
      transactionId: data.transactionId || null,
      teamName: teamLeadData!.teamName,
      college: teamLeadData!.collegeName,
      transactionScreenshot: screenshotUrl,
      teamLeadName: teamLeadData!.name,
      teamLeadPhone: teamLeadData!.phone,
      teamLeadEmail: teamLeadData!.email,
      teamMembers: teamMembers,
      ref: userData?.referral_code || 'TECHTRIX2025',
    };
    const emailData = {
      eventName: eventData?.name,
      year: '2025',
      festName: 'Regalia',
      teamName: teamLeadData!.teamName,
      leaderName: teamLeadData!.name,
      leaderPhone: teamLeadData!.phone,
      email: teamLeadData!.email,
      teamMembers: teamMembers,
      coordinators: eventData?.coordinators || [],
      contactEmail: 'regalia.rcciit.official@gmail.com',
      logoUrl: 'https://i.postimg.cc/dQZZWTRd/regalia-2025-2.png',
      transactionId: data.transactionId, 
      college: teamLeadData!.collegeName, 
      verificationDays: 2, 
    };
    try {
      // Call the registerTeamWithParticipants function.
      const result = await registerTeamWithParticipants(
        registrationParams,
        false
      );
      const emailResponse = await fetch('/api/sendMail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: [
            teamLeadData!.email,
            ...teamMembers.map((member) => member.email),
          ],
          subject: `🎉 Registration Confirmed: ${eventData?.name.charAt(0).toUpperCase()} ${eventData?.name.slice(1).toLowerCase()} - REGALIA 2025`,
          fileName: 'verify-email.ejs',
          data: emailData,
        }),
      });
      toast.success('Registered successfully');
      markEventAsRegistered(eventID);
      setIsRegistering(false);
      setShowSuccess(true);
      triggerConfetti();
      setTimeout(() => {
        handleDialogClose();
      }, 3000);
    } catch (error) {
      console.error('Failed to register team:', error);
      toast.error('Failed to register team. Please try again.');
      setIsRegistering(false);
      return;
    }
  };

  const [registerLoading, setRegisterLoading] = useState(false);

  // Reset all internal state and forms
  const resetForm = () => {
    setTeamLeadData(null);
    setTeamMembers([]);
    setStep(1);
    setIsAddingMember(false);
    setIsSheetOpen(false);
    resetTeamLead();
    resetTeamMember();
    resetPayment();
    setEditingMemberIndex(null);
    setIsRegistering(false);
    setShowSuccess(false);
  };

  // Wrap onClose to also reset the form state
  const handleDialogClose = () => {
    resetForm();
    onClose();
  };

  const onRemoveMember = (index: number) => {
    const updatedMembers = [...teamMembers];
    updatedMembers.splice(index, 1);
    setTeamMembers(updatedMembers);
  };

  // Animation variants
  const fadeVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleDialogClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-[550px] max-h-[80vh] my-scrollbar bg-gradient-to-br from-[#210000] to-[#3a0000] border-2 border-yellow-500/30 rounded-xl p-8 shadow-xl overflow-y-scroll">
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
            <Trophy size={32} className="text-yellow-300" />
            <UsersRound size={32} className="text-yellow-300" />
            <Music size={32} className="text-yellow-300" />
          </motion.div>
          <DialogTitle className="text-center text-white font-antolia tracking-widest font-bold text-3xl bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-500 pb-2">
            Team Registration
          </DialogTitle>
          <div className="flex justify-center">
            <h2 className="text-white font-antolia tracking-widest text-xl">
              {eventName}
            </h2>
          </div>
          <div className="flex justify-center mt-2">
            <div className="h-1 w-32 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full"></div>
          </div>

          <div className="flex flex-col items-center mt-4">
            <div className="flex gap-4 mb-2">
              <div
                className={`w-3 h-3 rounded-full ${step === 1 ? 'bg-yellow-400' : 'bg-gray-600'} transition-colors duration-300`}
              ></div>
              <div
                className={`w-3 h-3 rounded-full ${step === 2 ? 'bg-yellow-400' : 'bg-gray-600'} transition-colors duration-300`}
              ></div>
              <div
                className={`w-3 h-3 rounded-full ${step === 3 ? 'bg-yellow-400' : 'bg-gray-600'} transition-colors duration-300`}
              ></div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 bg-yellow-900/30 px-4 py-2 rounded-full mt-2"
            >
              <Users size={18} className="text-yellow-300" />
              <p className="text-white font-antolia tracking-widest text-sm">
                Team Members:{' '}
                <span className="text-yellow-300">{totalTeamCount}</span>
                <span className="text-gray-400">
                  {' '}
                  (Min: {minTeamSize}, Max: {maxTeamSize})
                </span>
              </p>
            </motion.div>
          </div>

          {teamMembers.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center mt-2"
            >
              <div
                className="flex items-center gap-1 text-yellow-200 font-antolia cursor-pointer text-sm hover:underline"
                onClick={() => {
                  setShowConfirmTeam(false);
                  setIsSheetOpen(true);
                }}
              >
                <Eye size={16} />
                <span>View & Edit Added Members</span>
              </div>
            </motion.div>
          )}
        </DialogHeader>

        <AnimatePresence mode="wait">
          {showSuccess ? (
            <motion.div
              key="success"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6">
                <Check size={40} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Registration Successful!
              </h2>
              <p className="text-gray-300 text-center mb-4">
                Your team "{teamLeadData?.teamName}" has been registered for{' '}
                {eventName}
              </p>
              <p className="text-yellow-300 font-medium">
                We're excited to see your team at the fest!
              </p>
            </motion.div>
          ) : (
            <>
              {/* Step 1: Team Lead Details */}
              {step === 1 && (
                <motion.form
                  key="step1"
                  variants={fadeVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onSubmit={handleTeamLeadSubmit(onTeamLeadSubmit)}
                  className="overflow-y-auto my-scrollbar relative z-10 mt-4"
                >
                  <div className="grid gap-6 py-4">
                    {/* Team Name Field */}
                    <div className="grid gap-2">
                      <label
                        htmlFor="teamName"
                        className="flex items-center gap-2 text-yellow-200 font-medium"
                      >
                        <Users size={18} />
                        <span>Team Name</span>
                      </label>
                      <div className="relative">
                        <input
                          id="teamName"
                          {...registerTeamLead('teamName')}
                          defaultValue={teamLeadData?.teamName}
                          className="w-full bg-[#210000]/60 border font-antolia tracking-wider text-xl border-yellow-500/30 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none text-white rounded-md p-3 pl-10 transition-all duration-300"
                          placeholder="Enter your team name"
                          autoFocus
                        />
                        <Users
                          size={18}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-500/70"
                        />
                      </div>
                      {teamLeadErrors.teamName && (
                        <p className="text-red-400 text-sm ml-2">
                          {teamLeadErrors.teamName.message}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <label
                        htmlFor="name"
                        className="flex items-center gap-2 text-yellow-200 font-medium"
                      >
                        <UserCheck size={18} />
                        <span>Team Lead Name</span>
                      </label>
                      <div className="relative">
                        <input
                          id="name"
                          readOnly
                          {...registerTeamLead('name')}
                          className="w-full bg-[#210000]/60 border font-antolia tracking-wider text-xl border-yellow-500/30 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none text-white rounded-md p-3 pl-10 transition-all duration-300"
                          placeholder="Enter team lead name"
                          defaultValue={userData?.name}
                        />
                        <UserCheck
                          size={18}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-500/70"
                        />
                      </div>
                      {teamLeadErrors.name && (
                        <p className="text-red-400 text-sm ml-2">
                          {teamLeadErrors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <label
                        htmlFor="phone"
                        className="flex items-center gap-2 text-yellow-200 font-medium"
                      >
                        <Phone size={18} />
                        <span>Team Lead Phone</span>
                      </label>
                      <div className="relative">
                        <input
                          id="phone"
                          type="tel"
                          readOnly
                          defaultValue={userData?.phone}
                          {...registerTeamLead('phone')}
                          className="w-full bg-[#210000]/60 border font-antolia tracking-wider text-xl border-yellow-500/30 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none text-white rounded-md p-3 pl-10 transition-all duration-300"
                          placeholder="Enter team lead phone number"
                        />
                        <Phone
                          size={18}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-500/70"
                        />
                      </div>
                      {teamLeadErrors.phone && (
                        <p className="text-red-400 text-sm ml-2">
                          {teamLeadErrors.phone.message}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <label
                        htmlFor="email"
                        className="flex items-center gap-2 text-yellow-200 font-medium"
                      >
                        <Mail size={18} />
                        <span>Team Lead Email</span>
                      </label>
                      <div className="relative">
                        <input
                          id="email"
                          type="email"
                          defaultValue={userData?.email}
                          {...registerTeamLead('email')}
                          className="w-full bg-[#210000]/60 border font-antolia tracking-wider text-xl border-yellow-500/30 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none text-white rounded-md p-3 pl-10 transition-all duration-300"
                          placeholder="Enter team lead email"
                          readOnly
                        />
                        <Mail
                          size={18}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-500/70"
                        />
                      </div>
                      {teamLeadErrors.email && (
                        <p className="text-red-400 text-sm ml-2">
                          {teamLeadErrors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <label
                        htmlFor="collegeName"
                        className="flex items-center gap-2 text-yellow-200 font-medium"
                      >
                        <Building size={18} />
                        <span>College Name</span>
                      </label>
                      <div className="relative">
                        <input
                          id="collegeName"
                          {...registerTeamLead('collegeName')}
                          defaultValue={
                            teamLeadData?.collegeName || userData?.college
                          }
                          className="w-full bg-[#210000]/60 border font-antolia tracking-wider text-xl border-yellow-500/30 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none text-white rounded-md p-3 pl-10 transition-all duration-300"
                          placeholder="Enter college name"
                        />
                        <Building
                          size={18}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-500/70"
                        />
                      </div>
                      {teamLeadErrors.collegeName && (
                        <p className="text-red-400 text-sm ml-2">
                          {teamLeadErrors.collegeName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleDialogClose}
                      className="bg-red-700 hover:bg-red-600 text-white flex items-center gap-2 px-4 py-2 rounded-md border-0 transition-all duration-300"
                    >
                      <X size={18} />
                      <span>Close</span>
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-medium flex items-center gap-2 px-6 py-2 rounded-md border-0 transition-all duration-300"
                    >
                      <span>Next</span>
                      <ArrowRight size={18} />
                    </Button>
                  </div>
                </motion.form>
              )}

              {/* ViewTeamMembers component would be rendered here */}
              <ViewTeamMembers
                isOpen={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                teamMembers={teamMembers}
                teamLeadData={teamLeadData}
                showConfirmTeam={showConfirmTeam}
                registerLoading={registerLoading}
                onRemoveMember={onRemoveMember}
                confirmTeam={async () => {
                  setIsConfirmedTeam(true);
                  setStep(3);
                  setIsSheetOpen(false);
                }}
                onEditTeamLead={() => {
                  setStep(1);
                  setIsSheetOpen(false);
                }}
                onEditMember={(index: number) => {
                  setEditingMemberIndex(index);
                  setIsAddingMember(true);
                  setIsSheetOpen(false);
                }}
              />

              {/* Step 2: Manage Team Members */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  variants={fadeVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="overflow-y-auto my-scrollbar max-h-[60vh] relative z-10 mt-4"
                >
                  {isAddingMember ? (
                    <motion.form
                      onSubmit={handleTeamMemberSubmit((data) => {
                        if (editingMemberIndex !== null) {
                          const updatedMembers = [...teamMembers];
                          updatedMembers[editingMemberIndex] = data;
                          setTeamMembers(updatedMembers);
                          setEditingMemberIndex(null);
                        } else {
                          onAddTeamMember(data);
                        }
                        setIsAddingMember(false);
                      })}
                      className="grid gap-6 py-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-center text-yellow-300 font-antolia tracking-widest text-xl">
                        {editingMemberIndex !== null
                          ? 'Edit Team Member'
                          : 'Add Team Member'}
                      </h3>

                      <div className="grid gap-2">
                        <label
                          htmlFor="memberName"
                          className="flex items-center gap-2 text-yellow-200 font-medium"
                        >
                          <User size={18} />
                          <span>Member Name</span>
                        </label>
                        <div className="relative">
                          <input
                            id="memberName"
                            {...registerTeamMember('name')}
                            className="w-full bg-[#210000]/60 border font-antolia tracking-wider text-xl border-yellow-500/30 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none text-white rounded-md p-3 pl-10 transition-all duration-300"
                            placeholder="Enter member name"
                            autoFocus
                          />
                          <User
                            size={18}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-500/70"
                          />
                        </div>
                        {teamMemberErrors.name && (
                          <p className="text-red-400 text-sm ml-2">
                            {teamMemberErrors.name.message}
                          </p>
                        )}
                      </div>

                      <div className="grid gap-2">
                        <label
                          htmlFor="memberPhone"
                          className="flex items-center gap-2 text-yellow-200 font-medium"
                        >
                          <Phone size={18} />
                          <span>Member Phone</span>
                        </label>
                        <div className="relative">
                          <input
                            id="memberPhone"
                            type="tel"
                            {...registerTeamMember('phone')}
                            className="w-full bg-[#210000]/60 border font-antolia tracking-wider text-xl border-yellow-500/30 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none text-white rounded-md p-3 pl-10 transition-all duration-300"
                            placeholder="Enter member phone number"
                          />
                          <Phone
                            size={18}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-500/70"
                          />
                        </div>
                        {teamMemberErrors.phone && (
                          <p className="text-red-400 text-sm ml-2">
                            {teamMemberErrors.phone.message}
                          </p>
                        )}
                      </div>

                      <div className="grid gap-2">
                        <label
                          htmlFor="memberEmail"
                          className="flex items-center gap-2 text-yellow-200 font-medium"
                        >
                          <Mail size={18} />
                          <span>Member Email</span>
                        </label>
                        <div className="relative">
                          <input
                            id="memberEmail"
                            type="email"
                            {...registerTeamMember('email')}
                            className="w-full bg-[#210000]/60 border font-antolia tracking-wider text-xl border-yellow-500/30 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none text-white rounded-md p-3 pl-10 transition-all duration-300"
                            placeholder="Enter member email"
                          />
                          <Mail
                            size={18}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-500/70"
                          />
                        </div>
                        {teamMemberErrors.email && (
                          <p className="text-red-400 text-sm ml-2">
                            {teamMemberErrors.email.message}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-row flex-wrap gap-4 mt-4 justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsAddingMember(false);
                            setEditingMemberIndex(null);
                          }}
                          className="bg-red-700 hover:bg-red-600 text-white flex items-center gap-2 px-4 py-2 rounded-md border-0 transition-all duration-300"
                        >
                          <X size={18} />
                          <span>Cancel</span>
                        </Button>
                        <Button
                          type="submit"
                          className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-medium flex items-center gap-2 px-6 py-2 rounded-md border-0 transition-all duration-300"
                        >
                          {editingMemberIndex !== null ? (
                            <>
                              <Pencil size={18} />
                              <span>Update Member</span>
                            </>
                          ) : (
                            <>
                              <Plus size={18} />
                              <span>Add Member</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </motion.form>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col gap-6"
                    >
                      <div className="text-center">
                        <h3 className="text-yellow-300 font-antolia tracking-widest text-xl mb-4">
                          Manage Team Members
                        </h3>
                        <p className="text-gray-300">
                          {teamMembers.length === 0
                            ? 'Add team members to continue with registration.'
                            : `You have added ${teamMembers.length} team member${teamMembers.length !== 1 ? 's' : ''}.`}
                        </p>
                      </div>

                      {teamMembers.length > 0 && (
                        <div className="bg-[#300000]/40 rounded-lg p-4 border border-yellow-500/20">
                          <h4 className="text-yellow-200 font-medium mb-3 flex items-center gap-2">
                            <Users size={18} />
                            <span>Team Overview</span>
                          </h4>
                          <div className="text-white">
                            <div className="flex items-center gap-2 mb-2 bg-yellow-900/20 p-2 rounded-md">
                              <UserCheck
                                size={16}
                                className="text-yellow-400 flex-shrink-0"
                              />
                              <div className="flex-grow">
                                <span className="font-medium">
                                  {teamLeadData?.name}
                                </span>
                                <span className="text-gray-400 text-sm ml-2">
                                  (Team Lead)
                                </span>
                              </div>
                            </div>

                            {teamMembers.map((member, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between gap-2 mb-2 bg-gray-900/30 p-2 rounded-md"
                              >
                                <div className="flex items-center gap-2">
                                  <User
                                    size={16}
                                    className="text-gray-400 flex-shrink-0"
                                  />
                                  <span className="font-medium">
                                    {member.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => {
                                      setEditingMemberIndex(idx);
                                      setIsAddingMember(true);
                                    }}
                                    className="text-blue-400 hover:text-blue-300 transition-colors p-1"
                                  >
                                    <Pencil size={16} />
                                  </button>
                                  <button
                                    onClick={() => onRemoveMember(idx)}
                                    className="text-red-400 hover:text-red-300 transition-colors p-1"
                                  >
                                    <X size={16} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-4 justify-between mt-2">
                        {teamMembers.length < maxTeamSize - 1 && (
                          <Button
                            type="button"
                            onClick={() => setIsAddingMember(true)}
                            className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-medium flex items-center gap-2 px-6 py-2 rounded-md border-0 transition-all duration-300"
                          >
                            <UserPlus size={18} />
                            <span>Add Member</span>
                          </Button>
                        )}

                        <div className="flex gap-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setStep(1)}
                            className="bg-red-700/70 hover:bg-red-600 text-white flex items-center gap-2 px-4 py-2 rounded-md border-0 transition-all duration-300"
                          >
                            <ArrowLeft size={18} />
                            <span>Back</span>
                          </Button>

                          <Button
                            type="button"
                            onClick={handleProceedToPayment}
                            className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-medium flex items-center gap-2 px-6 py-2 rounded-md border-0 transition-all duration-300"
                            disabled={
                              totalTeamCount < minTeamSize ||
                              totalTeamCount > maxTeamSize
                            }
                          >
                            <span>Next</span>
                            <ArrowRight size={18} />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Step 3: Payment Details */}
              {step === 3 && (
                <motion.form
                  key="step3"
                  variants={fadeVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  onSubmit={handlePaymentSubmit(onPaymentSubmit)}
                  className="overflow-y-auto my-scrollbar py-4  relative z-10 mt-4"
                >
                  <div className="grid gap-6 py-4">
                    <div className="text-center mb-4">
                      <h3 className="text-yellow-300 font-antolia tracking-widest text-xl mb-2">
                        Payment Details
                      </h3>
                      <div className="flex items-center justify-center gap-2 bg-yellow-900/30 px-4 py-2 rounded-full">
                        <CreditCard size={18} className="text-yellow-300" />
                        <p className="text-white font-medium">
                          Amount:{' '}
                          <span className="text-yellow-300">₹{eventFees}</span>
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <label
                        htmlFor="transactionId"
                        className="flex items-center gap-2 text-yellow-200 font-medium"
                      >
                        <Ticket size={18} />
                        <span>Transaction ID</span>
                      </label>
                      <div className="relative">
                        <input
                          id="transactionId"
                          {...registerPayment('transactionId')}
                          className="w-full bg-[#210000]/60 border font-antolia tracking-wider text-xl border-yellow-500/30 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none text-white rounded-md p-3 pl-10 transition-all duration-300"
                          placeholder="Enter transaction ID"
                        />
                        <Ticket
                          size={18}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-500/70"
                        />
                      </div>
                      {paymentErrors.transactionId && (
                        <p className="text-red-400 text-sm ml-2">
                          {paymentErrors.transactionId.message}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-2">
                      <label
                        htmlFor="paymentScreenshot"
                        className="flex items-center gap-2 text-yellow-200 font-medium"
                      >
                        <Upload size={18} />
                        <span>Payment Screenshot</span>
                      </label>
                      <div className="relative">
                        <input
                          id="paymentScreenshot"
                          type="file"
                          {...registerPayment('paymentScreenshot')}
                          className="w-full bg-[#210000]/60 border font-antolia tracking-wider border-yellow-500/30 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none text-white rounded-md p-3 pl-10 transition-all duration-300"
                          accept="image/*"
                        />
                        <Upload
                          size={18}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-500/70"
                        />
                      </div>
                      {paymentErrors.paymentScreenshot && (
                        <p className="text-red-400 text-sm ml-2">
                          {String(paymentErrors.paymentScreenshot.message)}
                        </p>
                      )}
                    </div>

                    <div className="mt-6 flex items-center justify-center">
                      <div className="border-2 border-yellow-500/30 rounded-lg p-2 flex flex-col items-center">
                        <h4 className="text-white text-center text-lg font-bold mb-2">
                          Scan QR Code to Pay
                        </h4>
                        <Image
                          src="https://i.postimg.cc/0j5bd9Dy/Whats-App-Image-2025-04-25-at-04-49-14-be67b65c.jpg"
                          alt="Payment QR Code"
                          width={200}
                          height={200}
                          className="rounded-lg mb-2"
                        />
                        <p className="text-yellow-300 text-sm text-center">
                          After payment, enter Transaction ID and upload
                          screenshot
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(2)}
                      className="bg-red-700 hover:bg-red-600 text-white flex items-center gap-2 px-4 py-2 rounded-md border-0 transition-all duration-300"
                    >
                      <ArrowLeft size={18} />
                      <span>Back</span>
                    </Button>
                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-medium flex items-center gap-2 px-6 py-2 rounded-md border-0 transition-all duration-300"
                      disabled={isRegistering}
                    >
                      {isRegistering ? (
                        <>
                          <span>Registering...</span>
                        </>
                      ) : (
                        <>
                          <Check size={18} />
                          <span>Complete Registration</span>
                        </>
                      )}
                    </Button>
                  </div>
                </motion.form>
              )}
            </>
          )}
        </AnimatePresence>

        <Toaster position="top-center" richColors />
      </DialogContent>
    </Dialog>
  );
}
