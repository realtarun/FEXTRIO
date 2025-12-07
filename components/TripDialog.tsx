import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Plus, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCreateTrip, useUpdateTrip, type Trip } from "@/hooks/useTrips";
import { tripSchema, type TripFormData } from "@/lib/validations";
import { cn } from "@/lib/utils";

interface TripDialogProps {
  vehicleId: string;
  trip?: Trip;
  trigger?: React.ReactNode;
}

export const TripDialog = ({ vehicleId, trip, trigger }: TripDialogProps) => {
  const [open, setOpen] = useState(false);
  const createTrip = useCreateTrip();
  const updateTrip = useUpdateTrip();

  const form = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      date: trip?.date || format(new Date(), "yyyy-MM-dd"),
      cash: trip?.cash || 0,
      earning: trip?.earning || 0,
    },
  });

  const onSubmit = async (data: TripFormData) => {
    if (trip) {
      await updateTrip.mutateAsync({ id: trip.id, vehicleId, data });
    } else {
      await createTrip.mutateAsync({ vehicleId, data });
    }
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            {trip ? <Edit className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
            {trip ? "Edit Trip" : "Add Trip"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading">
            {trip ? "Edit Trip" : "Add New Trip"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="text-base font-medium">Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full h-12 pl-4 text-left font-normal border-2 rounded-xl",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-5 w-5 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                        initialFocus
                        className={cn("p-3 pointer-events-auto rounded-xl")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cash"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Cash (₹)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Enter cash amount"
                      className="h-12 text-base border-2 rounded-xl"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="earning"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Earning (₹)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Enter earning amount"
                      className="h-12 text-base border-2 rounded-xl"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
                className="h-11 px-6 rounded-xl"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createTrip.isPending || updateTrip.isPending}
                className="h-11 px-6 rounded-xl shadow-md"
              >
                {trip ? "Update Trip" : "Create Trip"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
