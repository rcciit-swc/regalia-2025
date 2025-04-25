"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import Image from 'next/image';
import { toast } from 'sonner';
import { useUser } from '@/lib/stores';
import { useEvents } from '@/lib/stores';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { registerSoloEvent, uploadPaymentScreenshot } from '@/utils/functions/register-services';

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
  const { markEventAsRegistered } = useEvents();
  const [step, setStep] = useState(1);
  const [soloLeadData, setSoloLeadData] = useState<SoloLeadFormValues | null>(
    null
  );

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
  })

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

  const onPaymentSubmit = async (data: PaymentFormValues) => {
    let screenshotUrl = '';
    try {
      screenshotUrl = await uploadPaymentScreenshot(
        data.paymentScreenshot,
        eventName
      );
    } catch (error) {
      console.error('Failed to upload screenshot:', error);
      toast.error('Failed to upload payment screenshot. Please try again.');
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

    try {
      const result = await registerSoloEvent(registrationParams);
      // console.log('Solo registration result:', result);
      markEventAsRegistered(eventID)
      onClose()
      setSoloLeadData(null)
      setStep(1)
      resetPayment()
    } catch (error) {
      console.error('Failed to register for solo event:', error);
      toast.error('Failed to register for solo event. Please try again.');
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent   
      // style={{
        //   backgroundImage:
        //     "url('https://i.postimg.cc/K8j889rC/regalia-2025.png')",
        //   backgroundSize: 'cover',
        //   backgroundPosition: 'center',
        //   backdropFilter: 'blur(10px)',
        // }} 
        className="sm:max-w-[500px] bg-[#210000] border  rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-white font-antolia tracking-widest font-bold text-2xl">
            Registration for {eventName}
          </DialogTitle>
        </DialogHeader>

        {step === 1 && (
          <form
            onSubmit={handleSoloLeadSubmit(onSoloLeadSubmit)}
            className="overflow-y-auto my-scrollbar max-h-[65vh]"
          >
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="modal-title">
                  Name
                </label>
                <input
                  id="name"
                  readOnly
                  {...registerSoloLead("name")}
                  className="bg-[#210000] border font-antolia tracking-widest text-xl border-gray-500 focus:border-[#F5E1DA] focus:outline-none text-white rounded-md p-2"
                  placeholder="Enter your name"
                  defaultValue={userData?.name}
                />
                {soloLeadErrors.name && <p className="text-red-500 text-sm">{soloLeadErrors.name.message}</p>}
              </div>
              <div className="grid gap-2">
                <label htmlFor="phone" className="modal-title">
                  Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  readOnly
                  {...registerSoloLead("phone")}
                  className="bg-[#210000] border font-antolia tracking-widest text-xl border-gray-500 focus:border-[#F5E1DA] focus:outline-none text-white rounded-lg p-2"
                  placeholder="Enter your phone number"
                  defaultValue={userData?.phone}
                />
                {soloLeadErrors.phone && <p className="text-red-500 text-sm">{soloLeadErrors.phone.message}</p>}
              </div>
              <div className="grid gap-2">
                <label htmlFor="email" className="modal-title">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  {...registerSoloLead("email")}
                  className="bg-[#210000] border font-antolia tracking-widest text-xl border-gray-500 focus:border-[#F5E1DA] focus:outline-none text-white rounded-md p-2"
                  placeholder="Enter your email"
                  defaultValue={userData?.email}
                  readOnly
                />
                {soloLeadErrors.email && <p className="text-red-500 text-sm">{soloLeadErrors.email.message}</p>}
              </div>
              <div className="grid gap-2">
                <label htmlFor="college" className="modal-title">
                  College
                </label>
                <input
                  id="college"
                  autoFocus
                  {...registerSoloLead("college")}
                  className="bg-[#210000] border font-antolia tracking-widest text-xl border-gray-500 focus:border-[#F5E1DA] focus:outline-none text-white rounded-md p-2"
                  placeholder="Enter your college name"
                />
                {soloLeadErrors.college && <p className="text-red-500 text-sm">{soloLeadErrors.college.message}</p>}
              </div> 
            </div>
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="bg-red-700 text-white hover:text-white hover:bg-red-500 border-0"
              >
                Close
              </Button>
              <Button type="submit" className="bg-yellow-300 text-black hover:bg-yellow-500 border-0">
                Next
              </Button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handlePaymentSubmit(onPaymentSubmit)} className="overflow-y-auto max-h-[65vh]">
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <label htmlFor="transactionId" className="modal-title">
                  Transaction ID
                </label>
                <input
                  id="transactionId"
                  {...registerPayment("transactionId")}
                  className="bg-[#210000] border border-gray-500 focus:border-[#F5E1DA] focus:outline-none text-white rounded-md p-2"
                  placeholder="Enter transaction ID"
                />
                {paymentErrors.transactionId && (
                  <p className="text-red-500 text-sm">{paymentErrors.transactionId.message}</p>
                )}
              </div>
              <div className="grid gap-2 text-white">
                <label htmlFor="paymentScreenshot" className="modal-title">
                  Payment Screenshot
                </label>
                <input
                  id="paymentScreenshot"
                  type="file"
                  {...registerPayment("paymentScreenshot")}
                  className="bg-[#210000] border file:text-black border-gray-500 focus:border-[#F5E1DA] focus:outline-none rounded-md p-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-[#F5E1DA]  hover:file:bg-[#F5E1DA]/90 "
                  accept="image/*"
                />
                {paymentErrors.paymentScreenshot && (
                  <p className="text-red-500 text-sm">{String(paymentErrors.paymentScreenshot.message)}</p>
                )}
              </div>
            </div>
            <h1 className="text-white text-center text-2xl font-antolia tracking-widest font-semibold">
              Pay <span className="text-green-500">₹ {eventFees}</span>
            </h1>
            <div className="mt-3 w-full flex items-center justify-center">
              <Image src="https://i.postimg.cc/0j5bd9Dy/Whats-App-Image-2025-04-25-at-04-49-14-be67b65c.jpg" alt="Payment QR Code" width={300} height={200} className="rounded-lg" />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="bg-red-700 text-white hover:text-white hover:bg-red-500 border-0"
              >
                Back
              </Button>
              <Button type="submit" className="bg-yellow-300 text-black hover:bg-yellow-500 border-0">
                Register
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
