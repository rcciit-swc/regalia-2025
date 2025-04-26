import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export function RulesAndGuidelines({ form }: { form: any }) {
  return (
    <Card className="transition-transform hover:shadow-lg bg-[#2a3142] border-none hover:shadow-[#9158FF]/20">
      <CardHeader>
        <CardTitle className="text-white">Rules & Guidelines</CardTitle>
        <CardDescription className="text-gray-400">
          Set clear rules and guidelines for participants to follow.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={form.control}
          name="rules"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <ReactQuill
                  theme="snow"
                  value={field.value}
                  onChange={field.onChange}
                  className="[&_.ql-toolbar]:bg-[#2a3142] [&_.ql-container]:bg-[#1e2432] [&_.ql-toolbar]:border-gray-600 [&_.ql-container]:border-gray-600 [&_.ql-editor]:text-white [&_.ql-editor]:min-h-[200px] [&_.ql-editor]:focus:border-[#9158FF] [&_.ql-editor]:focus:ring-[#9158FF]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
