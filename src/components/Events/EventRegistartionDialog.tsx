'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { toast } from 'sonner';
import { useUser } from '@/lib/stores';
import { useEvents } from '@/lib/stores';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import {
  registerSoloEvent,
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
  PartyPopper,
  Ticket,
  Music,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { whatsAppLinks } from '@/utils/constraints/constants/whatsApp';

interface SoloEventRegistrationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  eventName: string;
  eventID: string;
  eventFees: number;
}

// Schema for solo (team lead) details.
const soloLeadSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().regex(/^\d{10,}$/, 'Phone must be at least 10 digits'),
  email: z.string().email('Invalid email'),
  college: z.string().min(1, 'College is required'),
});
type SoloLeadFormValues = z.infer<typeof soloLeadSchema>;

// Schema for payment details.
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

export function SoloEventRegistration({
  isOpen,
  onClose,
  eventName,
  eventID,
  eventFees,
}: SoloEventRegistrationDialogProps) {
  const { userData } = useUser();

  const { markEventAsRegistered, eventsData } = useEvents();
  const eventData = eventsData?.find((event) => event.id === eventID);
  const [step, setStep] = useState(1);
  const [soloLeadData, setSoloLeadData] = useState<SoloLeadFormValues | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form for solo lead details.
  const {
    register: registerSoloLead,
    handleSubmit: handleSoloLeadSubmit,
    formState: { errors: soloLeadErrors },
    reset: resetSoloLead,
  } = useForm<SoloLeadFormValues>({
    resolver: zodResolver(soloLeadSchema),
    defaultValues: {
      name: userData?.name,
      phone: userData?.phone,
      email: userData?.email,
    },
  });

  const onSoloLeadSubmit = (data: SoloLeadFormValues) => {
    setSoloLeadData(data);
    setStep(2);
    resetSoloLead();
  };

  // Form for payment details.
  const {
    register: registerPayment,
    handleSubmit: handlePaymentSubmit,
    formState: { errors: paymentErrors },
    reset: resetPayment,
  } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
  });

  const triggerConfetti = () => {
    // Create confetti effect
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const onPaymentSubmit = async (data: PaymentFormValues) => {
    setIsSubmitting(true);
    let screenshotUrl = '';
    try {
      screenshotUrl = await uploadPaymentScreenshot(
        data.paymentScreenshot,
        eventName
      );
    } catch (error) {
      console.error('Failed to upload screenshot:', error);
      toast.error('Failed to upload payment screenshot. Please try again.');
      setIsSubmitting(false);
      return;
    }

    // Combine the registration data.
    const registrationParams = {
      userId: String(userData?.id), // Ensure userId is a string
      eventId: eventID,
      transactionId: data.transactionId,
      college: soloLeadData!.college,
      transactionScreenshot: screenshotUrl,
      name: soloLeadData!.name,
      phone: soloLeadData!.phone,
      email: soloLeadData!.email,
    };
    const emailData = {
      teamName: null,
      leaderName: soloLeadData?.name, 
      leaderPhone: soloLeadData?.phone, 
      email: soloLeadData?.email, 
      eventName: eventName, 
      year: '2025', 
      festName: 'Regalia', 
      transactionId: data.transactionId, 
      college: soloLeadData!.college, 
      teamMembers: [],
      coordinators: eventData?.coordinators || [], 
      verificationDays: 2, 
      contactEmail: 'regalia.rcciit.official@gmail.com', 
      logoUrl: 'https://i.postimg.cc/dQZZWTRd/regalia-2025-2.png', 
      socialLinks: {
        instagram: '#',
        facebook: '#',
        website: '#',
      },
    };
    try {
      const result = await registerSoloEvent(registrationParams);
      const emailResponse = await fetch('/api/sendMail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: soloLeadData?.email,
          subject: `🎉 Registration Confirmed: ${eventData?.name.toLowerCase().charAt(0).toUpperCase()} - Regalia 2025`,
          fileName: 'send-email.ejs',
          data: emailData,
        }),
      });
      toast.success('Registered successfully');
      markEventAsRegistered(eventID);
      setIsSubmitting(false);
      setShowSuccess(true);
      triggerConfetti();
      setTimeout(() => {
        setShowSuccess(false);
        setSoloLeadData(null);
        setStep(1);
        resetPayment();
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Failed to register for solo event:', error);
      toast.error('Failed to register for solo event. Please try again.');
      setIsSubmitting(false);
    }
  };

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setSoloLeadData(null);
      setStep(1);
      resetPayment();
      resetSoloLead();
      setShowSuccess(false);
    }
  }, [isOpen, resetPayment, resetSoloLead]);

  const fadeVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] my-scrollbar bg-gradient-to-br from-[#210000] to-[#3a0000] border-2 border-yellow-500/30 rounded-xl p-8 shadow-xl overflow-hidden">
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
            <PartyPopper size={32} className="text-yellow-300" />
            <Music size={32} className="text-yellow-300" />
            <Ticket size={32} className="text-yellow-300" />
          </motion.div>
          <DialogTitle className="text-center text-white font-antolia tracking-widest font-bold text-3xl bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-500 pb-2">
            Registration for {eventName}
          </DialogTitle>
          <div className="flex justify-center mt-2">
            <div className="h-1 w-32 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full"></div>
          </div>
          <div className="flex justify-center mt-4">
            <div className="flex gap-4">
              <div
                className={`w-3 h-3 rounded-full ${step === 1 ? 'bg-yellow-400' : 'bg-gray-600'} transition-colors duration-300`}
              ></div>
              <div
                className={`w-3 h-3 rounded-full ${step === 2 ? 'bg-yellow-400' : 'bg-gray-600'} transition-colors duration-300`}
              ></div>
            </div>
          </div>
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
                You have successfully registered for {eventName}
              </p>
              <p className="text-yellow-300 font-medium">
                We'll see you at the fest!
              </p>
            </motion.div>
          ) : step === 1 ? (
            <motion.form
              key="step1"
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onSubmit={handleSoloLeadSubmit(onSoloLeadSubmit)}
              className="overflow-y-auto my-scrollbar max-h-[65vh] relative z-10 mt-4"
            >
              <div className="grid gap-6 py-4">
                <div className="grid gap-2">
                  <label
                    htmlFor="name"
                    className="flex items-center gap-2 text-yellow-200 font-medium"
                  >
                    <User size={18} />
                    <span>Name</span>
                  </label>
                  <div className="relative">
                    <input
                      id="name"
                      readOnly
                      {...registerSoloLead('name')}
                      className="w-full bg-[#210000]/60 border font-antolia tracking-wider text-xl border-yellow-500/30 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none text-white rounded-md p-3 pl-10 transition-all duration-300"
                      placeholder="Enter your name"
                      defaultValue={userData?.name}
                    />
                    <User
                      size={18}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-500/70"
                    />
                  </div>
                  {soloLeadErrors.name && (
                    <p className="text-red-400 text-sm ml-2">
                      {soloLeadErrors.name.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <label
                    htmlFor="phone"
                    className="flex items-center gap-2 text-yellow-200 font-medium"
                  >
                    <Phone size={18} />
                    <span>Phone</span>
                  </label>
                  <div className="relative">
                    <input
                      id="phone"
                      type="tel"
                      readOnly
                      {...registerSoloLead('phone')}
                      className="w-full bg-[#210000]/60 border font-antolia tracking-wider text-xl border-yellow-500/30 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none text-white rounded-md p-3 pl-10 transition-all duration-300"
                      placeholder="Enter your phone number"
                      defaultValue={userData?.phone}
                    />
                    <Phone
                      size={18}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-500/70"
                    />
                  </div>
                  {soloLeadErrors.phone && (
                    <p className="text-red-400 text-sm ml-2">
                      {soloLeadErrors.phone.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <label
                    htmlFor="email"
                    className="flex items-center gap-2 text-yellow-200 font-medium"
                  >
                    <Mail size={18} />
                    <span>Email</span>
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      {...registerSoloLead('email')}
                      className="w-full bg-[#210000]/60 border font-antolia tracking-wider text-xl border-yellow-500/30 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none text-white rounded-md p-3 pl-10 transition-all duration-300"
                      placeholder="Enter your email"
                      defaultValue={userData?.email}
                      readOnly
                    />
                    <Mail
                      size={18}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-500/70"
                    />
                  </div>
                  {soloLeadErrors.email && (
                    <p className="text-red-400 text-sm ml-2">
                      {soloLeadErrors.email.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-2">
                  <label
                    htmlFor="college"
                    className="flex items-center gap-2 text-yellow-200 font-medium"
                  >
                    <Building size={18} />
                    <span>College</span>
                  </label>
                  <div className="relative">
                    <input
                      id="college"
                      autoFocus
                      {...registerSoloLead('college')}
                      className="w-full bg-[#210000]/60 border font-antolia tracking-wider text-xl border-yellow-500/30 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none text-white rounded-md p-3 pl-10 transition-all duration-300"
                      placeholder="Enter your college name"
                    />
                    <Building
                      size={18}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-500/70"
                    />
                  </div>
                  {soloLeadErrors.college && (
                    <p className="text-red-400 text-sm ml-2">
                      {soloLeadErrors.college.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
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
          ) : (
            <motion.form
              key="step2"
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onSubmit={handlePaymentSubmit(onPaymentSubmit)}
              className="overflow-y-auto my-scrollbar max-h-[65vh] relative z-10 mt-4"
            >
              <div className="grid gap-6 py-4">
                <div className="grid gap-2">
                  <label
                    htmlFor="transactionId"
                    className="flex items-center gap-2 text-yellow-200 font-medium"
                  >
                    <CreditCard size={18} />
                    <span>Transaction ID</span>
                  </label>
                  <div className="relative">
                    <input
                      id="transactionId"
                      {...registerPayment('transactionId')}
                      className="w-full bg-[#210000]/60 border font-antolia tracking-wider text-xl border-yellow-500/30 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none text-white rounded-md p-3 pl-10 transition-all duration-300"
                      placeholder="Enter transaction ID"
                    />
                    <CreditCard
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

                <div className="grid gap-2 text-white">
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
                      className="w-full bg-[#210000]/60 border file:text-black border-yellow-500/30 focus:border-yellow-400 focus:outline-none rounded-md p-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-gradient-to-r file:from-yellow-400 file:to-yellow-500 file:hover:from-yellow-500 file:hover:to-yellow-600 file:transition-all file:duration-300"
                      accept="image/*"
                    />
                  </div>
                  {paymentErrors.paymentScreenshot && (
                    <p className="text-red-400 text-sm ml-2">
                      {String(paymentErrors.paymentScreenshot.message)}
                    </p>
                  )}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-8 mb-6"
              >
                <h1 className="text-white text-center text-2xl font-antolia tracking-widest font-semibold">
                  Pay <span className="text-green-400">₹ {eventFees}</span>
                </h1>
                <div className="mt-4 w-full flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-red-500 rounded-lg blur-lg opacity-50 animate-pulse"></div>
                    <div className="relative p-1 bg-gradient-to-r from-yellow-400 to-red-500 rounded-lg">
                      <Image
                        src="https://i.postimg.cc/0j5bd9Dy/Whats-App-Image-2025-04-25-at-04-49-14-be67b65c.jpg"
                        alt="Payment QR Code"
                        width={280}
                        height={280}
                        className="rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="flex flex-col sm:flex-row gap-4 mt-6 sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="bg-gray-700 hover:bg-gray-600 text-white flex items-center gap-2 px-4 py-2 rounded-md border-0 transition-all duration-300"
                  disabled={isSubmitting}
                >
                  <ArrowLeft size={18} />
                  <span>Back</span>
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-medium flex items-center gap-2 px-6 py-2 rounded-md border-0 transition-all duration-300"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Register</span>
                      <Check size={18} />
                    </>
                  )}
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
