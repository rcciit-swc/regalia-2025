'use client';

import { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, Phone, Mail, UserRound, Check, X } from 'lucide-react';

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData: any;
  profileImage?: string;
  name?: string;
  onSave: (formData: FormData) => Promise<void>;
}

export const EditProfileDialog: FC<EditProfileDialogProps> = ({
  open,
  onOpenChange,
  userData,
  name,
  profileImage,
  onSave,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Pass the form data to the onSave handler
      await onSave(new FormData(e.currentTarget));
      setShowSuccess(true);

      // Close dialog after showing success message
      setTimeout(() => {
        setShowSuccess(false);
        onOpenChange(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-br from-[#210000] to-[#3a0000] border-2 border-yellow-500/30 rounded-xl p-8 shadow-xl overflow-hidden">
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
            className="flex items-center justify-center mb-4"
          >
            <UserRound size={32} className="text-yellow-300" />
          </motion.div>
          <DialogTitle className="text-center text-white font-antolia tracking-widest font-bold text-3xl bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-500 pb-2">
            Edit Profile
          </DialogTitle>
          <div className="flex justify-center mt-2">
            <div className="h-1 w-32 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full"></div>
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
                Profile Updated!
              </h2>
              <p className="text-gray-300 text-center mb-4">
                Your profile has been successfully updated
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="editForm"
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onSubmit={handleSubmit}
              className="overflow-y-auto my-scrollbar relative z-10 mt-4"
            >
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full blur-lg opacity-50"></div>
                  <Avatar className="w-24 h-24 border-2 border-yellow-400">
                    <AvatarImage
                      src={profileImage}
                      alt={userData?.name || 'Profile'}
                    />
                    <AvatarFallback className="bg-violet-500 text-white font-antolia text-xl">
                      {userData?.name?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>

              <div className="grid gap-6 py-4">
                <div className="grid gap-2">
                  <label
                    htmlFor="fullName"
                    className="flex items-center gap-2 text-yellow-200 font-medium"
                  >
                    <User size={18} />
                    <span>Full Name</span>
                  </label>
                  <div className="relative">
                    <input
                      id="fullName"
                      name="fullName"
                      defaultValue={userData?.name || name}
                      className="w-full bg-[#210000]/60 border font-antolia tracking-wider text-xl border-yellow-500/30 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none text-white rounded-md p-3 pl-10 transition-all duration-300"
                      placeholder="Enter your full name"
                    />
                    <User
                      size={18}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-500/70"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <label
                    htmlFor="gender"
                    className="flex items-center gap-2 text-yellow-200 font-medium"
                  >
                    <UserRound size={18} />
                    <span>Gender</span>
                  </label>
                  <Select name="gender" defaultValue={userData?.gender || ''}>
                    <SelectTrigger className="bg-[#210000]/60 border border-yellow-500/30 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none text-white rounded-md p-3 h-14 font-antolia tracking-wider text-xl">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#210000] border border-yellow-500/30">
                      <SelectItem
                        value="female"
                        className="text-white hover:bg-yellow-300/20 focus:bg-yellow-300/20 font-antolia tracking-wider"
                      >
                        Female
                      </SelectItem>
                      <SelectItem
                        value="male"
                        className="text-white hover:bg-yellow-300/20 focus:bg-yellow-300/20 font-antolia tracking-wider"
                      >
                        Male
                      </SelectItem>
                      <SelectItem
                        value="other"
                        className="text-white hover:bg-yellow-300/20 focus:bg-yellow-300/20 font-antolia tracking-wider"
                      >
                        Other
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <label
                    htmlFor="email"
                    className="flex items-center gap-2 text-yellow-200 font-medium"
                  >
                    <Mail size={18} />
                    <span>Email ID</span>
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={userData?.email || ''}
                      className="w-full bg-[#210000]/60 border font-antolia tracking-wider text-xl border-yellow-500/30 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none text-white rounded-md p-3 pl-10 transition-all duration-300"
                      readOnly
                    />
                    <Mail
                      size={18}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-500/70"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <label
                    htmlFor="phone"
                    className="flex items-center gap-2 text-yellow-200 font-medium"
                  >
                    <Phone size={18} />
                    <span>Phone Number</span>
                  </label>
                  <div className="relative">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      defaultValue={userData?.phone || ''}
                      className="w-full bg-[#210000]/60 border font-antolia tracking-wider text-xl border-yellow-500/30 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 focus:outline-none text-white rounded-md p-3 pl-10 transition-all duration-300"
                      placeholder="Enter your phone number"
                    />
                    <Phone
                      size={18}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-500/70"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="bg-red-700 hover:bg-red-600 text-white flex items-center gap-2 px-4 py-2 rounded-md border-0 transition-all duration-300"
                >
                  <X size={18} />
                  <span>Cancel</span>
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-medium flex items-center gap-2 px-6 py-2 rounded-md border-0 transition-all duration-300"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <span>Save Changes</span>
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
};
