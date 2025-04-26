'use client';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ImageIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEvents } from '@/lib/stores';
import { useEffect } from 'react';

export function BasicInformation({ form }: { form: any }) {
  const { eventCategories, eventCategoriesLoading, getEventCategories } =
    useEvents();

  useEffect(() => {
    getEventCategories();
  }, []);
  return (
    <Card className="transition-transform hover:shadow-lg hover:shadow-[#9158FF]/20 bg-[#2a3142] border-none">
      <CardHeader>
        <CardTitle className="text-white">Basic Information</CardTitle>
        <CardDescription className="text-gray-400">
          Enter the core details about your event.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="text-gray-300">Event Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter event name"
                      {...field}
                      className="bg-[#1e2432] text-white border-gray-600 focus-visible:ring-[#9158FF] focus-visible:border-[#9158FF]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          {/* <FormField
            control={form.control}
            name="event_category_id"
            render={({ field }) => {
              return(
              <FormItem>
                <FormLabel className="text-gray-300">Event Category</FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-[180px] text-white">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {eventCategoriesLoading ? (
                        <div>Loading...</div>
                      ) : (
                        eventCategories.map((category: any) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}}
          /> */}

          <FormField
            control={form.control}
            name="registration_fees"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">
                  Registration Fee
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-[6px] text-white">
                      ₹
                    </span>
                    <Input
                      className="pl-7 bg-[#1e2432] text-white border-gray-600 focus-visible:ring-[#9158FF] focus-visible:border-[#9158FF]"
                      placeholder="0.00"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="prize_pool"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Prize Pool</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-[6px] text-white">
                      ₹
                    </span>
                    <Input
                      className="pl-7 bg-[#1e2432] text-white border-gray-600 focus-visible:ring-[#9158FF] focus-visible:border-[#9158FF]"
                      placeholder="0.00"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">Cover Image URL</FormLabel>
                <FormControl>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="pl-9 bg-[#1e2432] text-white border-gray-600 focus-visible:ring-[#9158FF] focus-visible:border-[#9158FF]"
                      placeholder="https://"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="min_team_size"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">
                  Minimum Team Size
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    {...field} // Use field only
                    className="bg-[#1e2432] text-white border-gray-600 focus-visible:ring-[#9158FF] focus-visible:border-[#9158FF]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="max_team_size"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-300">
                  Maximum Team Size
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    {...field}
                    {...form.register('max_team_size', { valueAsNumber: true })}
                    className="bg-[#1e2432] text-white border-gray-600 focus-visible:ring-[#9158FF] focus-visible:border-[#9158FF]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
