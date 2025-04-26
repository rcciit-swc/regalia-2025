import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import React from 'react';

const Header = ({ form }: { form: any }) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-sargento text-white">
          Add New Event
        </h1>
        <p className="text-sm text-muted-foreground mt-1 text-gray-300">
          Create a new event by filling out the details below.
        </p>
      </div>
      <Button
        type="submit"
        size="lg"
        className="bg-gradient-to-r from-[#a383e6] via-[#9158FF] to-[#9158FF] hover:opacity-90 transition-opacity"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        Create Event
      </Button>
    </div>
  );
};

export default Header;
