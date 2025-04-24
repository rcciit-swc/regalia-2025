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

type RulesDialogProps = {
  rules: string;
};

export const RulesDialog = ({ rules }: RulesDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="px-6 font-kagitingan text-xl lg:text-xl lg:py-4 bg-yellow-200 hover:bg-yellow-300 text-black">
          View Rules
        </Button>
      </DialogTrigger>
      <DialogContent
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/736x/90/59/3b/90593b288869fe650f17b101322ee12d.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        className="bg-zinc-900 text-white max-w-2xl border-yellow-200 border max-h-[80vh] modal"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-kagitingan text-yellow-200 !tracking-widest">
            Rules
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4 overflow-y-auto font-alexandria p-4 max-h-[60vh] pr-6 my-scrollbar">
          {parseWithQuillStyles(rules)}
        </div>
      </DialogContent>
    </Dialog>
  );
};
