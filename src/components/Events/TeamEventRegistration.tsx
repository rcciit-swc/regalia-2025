'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { useUser } from '@/lib/stores';
import { uploadPaymentScreenshot } from '@/utils/functions/supabaseUpload';
import { toast } from 'sonner';
import {
  type RegisterTeamParams,
  registerTeamWithParticipants,
} from '@/utils/functions/events/registerTeam';
import { useEvents } from '@/lib/stores';
import { ViewTeamMembers } from './ViewTeamMembers';

interface EventRegistrationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  eventName: string;
  minTeamSize: number; // includes team lead
  maxTeamSize: number;
  eventID: string;
}

// Zod schema for the Team Lead (Step 1)
// Added a new field for teamName.
const teamLeadSchema = z.object({
  teamName: z.string().min(1, 'Team name is required'),
  name: z.string().min(1, 'Team lead name is required'),
  phone: z.string().min(1, 'Team lead phone is required'),
  email: z.string().email('Invalid email'),
  collegeName: z.string().min(1, 'College name is required'),
});
type TeamLeadFormValues = z.infer<typeof teamLeadSchema>;

// Zod schema for a Team Member (used in Step 2)
// Note: Removed the collegeName field.
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

export function TeamEventRegistration({
  isOpen,
  onClose,
  eventName,
  minTeamSize,
  maxTeamSize,
  eventID,
}: EventRegistrationDialogProps) {
  const { userData } = useUser();
  const { markEventAsRegistered } = useEvents();
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
  // Toggle for showing the add team member form
  const [isAddingMember, setIsAddingMember] = useState(false);
  // Added state to track which member is being edited
  const [editingMemberIndex, setEditingMemberIndex] = useState<number | null>(
    null
  );
  // State to track registration process
  const [isRegistering, setIsRegistering] = useState(false);

  // ----------- Step 1: Team Lead Form -----------
  const {
    register: registerTeamLead,
    handleSubmit: handleTeamLeadSubmit,
    formState: { errors: teamLeadErrors },
    reset: resetTeamLead,
  } = useForm<TeamLeadFormValues>({
    resolver: zodResolver(teamLeadSchema),
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
      alert(
        `Minimum team size is ${minTeamSize}. Please add more team members.`
      );
    } else if (totalTeamCount > maxTeamSize) {
      alert(
        `Maximum team size is ${maxTeamSize}. Please remove some team members.`
      );
    } else {
      setStep(3);
    }
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
      toast.error('Failed to upload payment screenshot. Please try again.');
      setIsRegistering(false);
      return;
    }

    // Combine all registration data.
    const registrationParams: RegisterTeamParams = {
      userId: String(userData?.id), // Convert user ID to string
      eventId: eventID,
      transactionId: data.transactionId,
      teamName: teamLeadData!.teamName,
      college: teamLeadData!.collegeName,
      transactionScreenshot: screenshotUrl,
      teamLeadName: teamLeadData!.name,
      teamLeadPhone: teamLeadData!.phone,
      teamLeadEmail: teamLeadData!.email,
      teamMembers: teamMembers,
    };

    try {
      // Call the registerTeamWithParticipants function.
      const result = await registerTeamWithParticipants(registrationParams);
      markEventAsRegistered(eventID);
      handleDialogClose();
    } catch (error) {
      console.error('Failed to register team:', error);
      setIsRegistering(false);
      return;
    }
  };

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
  };

  // Wrap onClose to also reset the form state
  const handleDialogClose = () => {
    resetForm();
    onClose();
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
      <DialogContent className="sm:max-w-[500px] bg-[#210000] border  rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl">
            Registration for {eventName}
          </DialogTitle>
        </DialogHeader>
        <p className="text-gray-400 mt-2">
          Team Members: {totalTeamCount} (Min: {minTeamSize}, Max: {maxTeamSize}
          )
        </p>
        {teamMembers.length > 0 && (
          <span
            className="text-[#8B5CF6] cursor-pointer hover:underline"
            onClick={() => setIsSheetOpen(true)}
          >
            View & Edit Added Members
          </span>
        )}

        {/* Step 1: Team Lead Details */}
        {step === 1 && (
          <form
            onSubmit={handleTeamLeadSubmit(onTeamLeadSubmit)}
            className="overflow-y-auto my-scrollbar max-h-[65vh]"
          >
            <div className="grid gap-6 py-4">
              {/* New Team Name Field */}
              <div className="grid gap-2">
                <label htmlFor="teamName" className="text-white">
                  Team Name
                </label>
                <Input
                  id="teamName"
                  {...registerTeamLead('teamName')}
                  defaultValue={teamLeadData?.teamName}
                  className="bg-[#210000] border border-gray-500 focus:border-[#F5E1DA] focus:outline-none text-white rounded-md"
                  placeholder="Enter your team name"
                />
                {teamLeadErrors.teamName && (
                  <p className="text-red-500 text-sm">
                    {teamLeadErrors.teamName.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <label htmlFor="name" className="text-white">
                  Team Lead Name
                </label>
                <Input
                  id="name"
                  readOnly
                  {...registerTeamLead('name')}
                  className="bg-[#210000] border border-gray-500 focus:border-[#F5E1DA] focus:outline-none text-white rounded-md"
                  placeholder="Enter team lead name"
                  defaultValue={userData?.name}
                />
                {teamLeadErrors.name && (
                  <p className="text-red-500 text-sm">
                    {teamLeadErrors.name.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <label htmlFor="phone" className="text-white">
                  Team Lead Phone
                </label>
                <Input
                  id="phone"
                  type="tel"
                  readOnly
                  defaultValue={userData?.phone}
                  {...registerTeamLead('phone')}
                  className="bg-[#210000] border border-gray-500 focus:border-[#F5E1DA] focus:outline-none text-white rounded-md"
                  placeholder="Enter team lead phone number"
                />
                {teamLeadErrors.phone && (
                  <p className="text-red-500 text-sm">
                    {teamLeadErrors.phone.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <label htmlFor="email" className="text-white">
                  Team Lead Email
                </label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={userData?.email}
                  {...registerTeamLead('email')}
                  className="bg-[#210000] border border-gray-500 focus:border-[#F5E1DA] focus:outline-none text-white rounded-md"
                  placeholder="Enter team lead email"
                  readOnly
                />
                {teamLeadErrors.email && (
                  <p className="text-red-500 text-sm">
                    {teamLeadErrors.email.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <label htmlFor="collegeName" className="text-white">
                  College Name
                </label>
                <Input
                  id="collegeName"
                  {...registerTeamLead('collegeName')}
                  defaultValue={teamLeadData?.collegeName}
                  className="bg-[#210000] border border-gray-500 focus:border-[#F5E1DA] focus:outline-none text-white rounded-md"
                  placeholder="Enter college name"
                />
                {teamLeadErrors.collegeName && (
                  <p className="text-red-500 text-sm">
                    {teamLeadErrors.collegeName.message}
                  </p>
                )}
              </div>
            </div>
            {/* Bottom buttons arranged side by side */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleDialogClose}
                className="bg-white text-black hover:bg-white/90 border-0"
              >
                Close
              </Button>
              <Button type="submit" className="bg-[#F5E1DA] text-black hover:bg-[#F5E1DA]/90 border-0">
                Next
              </Button>
            </div>
          </form>
        )}

        {/* Step 2: Manage Team Members */}
        {step === 2 && (
          <div className="overflow-y-auto my-scrollbar max-h-[65vh]">
            {teamMembers.length > 0 && (
              <ViewTeamMembers
                isOpen={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                teamMembers={teamMembers}
                onEditMember={(index:number) => {
                  setEditingMemberIndex(index);
                  setIsAddingMember(true);
                  setIsSheetOpen(false);
                }}
              />
            )}
            {isAddingMember ? (
              <form
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
              >
                <div className="grid gap-2">
                  <label htmlFor="memberName" className="text-white">
                    Team Member Name
                  </label>
                  <Input
                    id="memberName"
                    {...registerTeamMember('name')}
                    className="bg-[#210000] border border-gray-500 focus:border-[#F5E1DA] focus:outline-none text-white rounded-md"
                    placeholder="Enter team member name"
                  />
                  {teamMemberErrors.name && (
                    <p className="text-red-500 text-sm">
                      {teamMemberErrors.name.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <label htmlFor="memberPhone" className="text-white">
                    Team Member Phone
                  </label>
                  <Input
                    id="memberPhone"
                    type="tel"
                    {...registerTeamMember('phone')}
                    className="bg-[#210000] border border-gray-500 focus:border-[#F5E1DA] focus:outline-none text-white rounded-md"
                    placeholder="Enter team member phone number"
                  />
                  {teamMemberErrors.phone && (
                    <p className="text-red-500 text-sm">
                      {teamMemberErrors.phone.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <label htmlFor="memberEmail" className="text-white">
                    Team Member Email
                  </label>
                  <Input
                    id="memberEmail"
                    type="email"
                    {...registerTeamMember('email')}
                    className="bg-[#210000] border border-gray-500 focus:border-[#F5E1DA] focus:outline-none text-white rounded-md"
                    placeholder="Enter team member email"
                  />
                  {teamMemberErrors.email && (
                    <p className="text-red-500 text-sm">
                      {teamMemberErrors.email.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsAddingMember(false);
                      setEditingMemberIndex(null);
                    }}
                    className="bg-white text-black hover:bg-white/90 border-0"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-[#F5E1DA] text-black hover:bg-[#F5E1DA]/90 border-0">
                    {editingMemberIndex !== null ? "Update" : "Save"}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                  <Button
                    type="button"
                    onClick={() => setIsAddingMember(true)}
                    className="bg-[#F5E1DA] text-black hover:bg-[#F5E1DA]/90 border-0"
                  >
                    Add New Member
                  </Button>
                  <Button
                    type="button"
                    onClick={handleProceedToPayment}
                    className="bg-[#F5E1DA] text-black hover:bg-[#F5E1DA]/90 border-0"
                    disabled={totalTeamCount < minTeamSize || totalTeamCount > maxTeamSize}
                  >
                    Make Payment
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="bg-white text-black hover:bg-white/90 border-0"
                  >
                    Back
                  </Button>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Payment Details */}
        {step === 3 && (
          <form
            onSubmit={handlePaymentSubmit(onPaymentSubmit)}
            className="overflow-y-auto max-h-[65vh]"
          >
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <label htmlFor="transactionId" className="text-white">
                  Transaction ID
                </label>
                <Input
                  id="transactionId"
                  {...registerPayment('transactionId')}
                  className="bg-[#210000] border border-gray-500 focus:border-[#F5E1DA] focus:outline-none text-white rounded-md"
                  placeholder="Enter transaction ID"
                />
                {paymentErrors.transactionId && (
                  <p className="text-red-500 text-sm">
                    {paymentErrors.transactionId.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <label htmlFor="paymentScreenshot" className="text-white">
                  Payment Screenshot
                </label>
                <Input
                  id="paymentScreenshot"
                  type="file"
                  {...registerPayment('paymentScreenshot')}
                  className="bg-[#210000] border border-gray-500 focus:border-[#F5E1DA] focus:outline-none text-white rounded-md"
                  accept="image/*"
                />
                {paymentErrors.paymentScreenshot && (
                  <p className="text-red-500 text-sm">
                    {String(paymentErrors.paymentScreenshot.message)}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-6 flex items-center justify-center">
              <Image
                src="/images/qr.jpg"
                alt="Payment QR Code"
                width={200}
                height={200}
                className="rounded-lg"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(2)}
                className="bg-white text-black hover:bg-white/90 border-0"
              >
                Back
              </Button>
              <Button
                type="submit"
                className="bg-[#F5E1DA] text-black hover:bg-[#F5E1DA]/90 border-0"
                disabled={isRegistering}
              >
                {isRegistering ? "Registering..." : "Register"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
