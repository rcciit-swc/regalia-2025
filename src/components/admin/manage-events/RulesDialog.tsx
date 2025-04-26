'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { parseWithQuillStyles } from '@/utils/functions/admin/quillParser';
import { useState } from 'react';
import { Sparkles } from 'lucide-react';

type RulesDialogProps = {
  rules: string;
};

export const RulesDialog = ({ rules }: RulesDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="relative px-6 py-3 font-antolia text-xl lg:text-2xl lg:py-4 bg-gradient-to-br from-yellow-200 to-yellow-300 hover:from-yellow-300 hover:to-yellow-400 text-[#210000] border-2 border-yellow-100/30 shadow-lg hover:shadow-yellow-200/40 transition-all duration-300 overflow-hidden group">
          <span className="absolute inset-0 w-full h-full bg-gradient-to-br from-yellow-200/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          <span className="relative flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            View Rules
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[#210000] font-antolia text-yellow-50 max-w-2xl border-yellow-200/70 border-2 max-h-[85vh] rounded-xl shadow-2xl shadow-yellow-200/20 overflow-hidden modal">
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://i.pinimg.com/736x/90/59/3b/90593b288869fe650f17b101322ee12d.jpg')] bg-cover bg-center"></div>
          <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-yellow-200/10 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-[#210000] to-transparent"></div>
          <div className="absolute top-8 right-8 w-24 h-24 rounded-full bg-yellow-200/5 blur-xl"></div>
          <div className="absolute bottom-8 left-8 w-32 h-32 rounded-full bg-yellow-200/5 blur-xl"></div>
        </div>

        <DialogHeader className="relative z-10">
          <DialogTitle className="text-3xl font-kagitingan text-yellow-200 !tracking-widest pb-2 border-b border-yellow-200/30 flex items-center gap-2">
            <Sparkles className="w-6 h-6" />
            RULES
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6 overflow-y-auto font-alexandria p-4 max-h-[60vh] pr-6 my-scrollbar relative z-10">
          {parseWithQuillStyles(rules)}
        </div>

        {/* Custom scrollbar styles */}
        <style jsx global>{`
          .my-scrollbar::-webkit-scrollbar {
            width: 8px;
          }

          .my-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 249, 229, 0.05);
            border-radius: 20px;
          }

          .my-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(253, 224, 71, 0.4);
            border-radius: 20px;
          }

          .my-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(253, 224, 71, 0.6);
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
};
