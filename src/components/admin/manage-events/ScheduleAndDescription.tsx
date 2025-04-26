import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Calendar, ClipboardList } from 'lucide-react';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export function ScheduleAndDescription({ form }: { form: any }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="transition-transform bg-[#2a3142] border-none hover:shadow-lg hover:shadow-[#9158FF]/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-white">Schedule</CardTitle>
          <Calendar className="h-4 w-4 text-white" />
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="schedule"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ReactQuill
                    theme="snow"
                    value={field.value}
                    onChange={field.onChange}
                    className="[&_.ql-toolbar]:bg-[#2a3142] [&_.ql-container]:bg-[#1e2432] [&_.ql-toolbar]:border-gray-600 [&_.ql-container]:border-gray-600 [&_.ql-editor]:text-white [&_.ql-editor]:min-h-[120px] [&_.ql-editor]:focus:border-[#9158FF] [&_.ql-editor]:focus:ring-[#9158FF] bg-[#1e2432] text-white border-gray-600 focus-visible:ring-[#9158FF] focus-visible:border-[#9158FF]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card className="transition-transform bg-[#2a3142] border-none hover:shadow-lg hover:shadow-[#9158FF]/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-white">Description</CardTitle>
          <ClipboardList className="h-4 w-4 text-white" />
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <ReactQuill
                    theme="snow"
                    value={field.value}
                    onChange={field.onChange}
                    className="[&_.ql-toolbar]:bg-[#2a3142] [&_.ql-container]:bg-[#1e2432] [&_.ql-toolbar]:border-gray-600 [&_.ql-container]:border-gray-600 [&_.ql-editor]:text-white [&_.ql-editor]:min-h-[120px] [&_.ql-editor]:focus:border-[#9158FF] [&_.ql-editor]:focus:ring-[#9158FF]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
}
