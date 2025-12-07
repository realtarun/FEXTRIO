import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Fuel } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useCreateCngExpense, useUpdateCngExpense, type CngExpense } from "@/hooks/useCngExpenses";

const cngSchema = z.object({
  date: z.date({
    required_error: "Date is required",
  }),
  amount: z.number().min(0, "Amount must be positive"),
});

type CngFormData = z.infer<typeof cngSchema>;

interface CngDialogProps {
  vehicleId: string;
  expense?: CngExpense;
  trigger?: React.ReactNode;
}

export const CngDialog = ({ vehicleId, expense, trigger }: CngDialogProps) => {
  const [open, setOpen] = useState(false);
  const createMutation = useCreateCngExpense();
  const updateMutation = useUpdateCngExpense();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CngFormData>({
    resolver: zodResolver(cngSchema),
    defaultValues: expense
      ? {
          date: new Date(expense.date),
          amount: Number(expense.amount),
        }
      : {
          date: new Date(),
          amount: 0,
        },
  });

  const selectedDate = watch("date");

  const onSubmit = async (data: CngFormData) => {
    const formattedDate = format(data.date, "yyyy-MM-dd");

    if (expense) {
      await updateMutation.mutateAsync({
        id: expense.id,
        date: formattedDate,
        amount: data.amount,
      });
    } else {
      await createMutation.mutateAsync({
        vehicle_id: vehicleId,
        date: formattedDate,
        amount: data.amount,
      });
    }

    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm">
            <Fuel className="mr-2 h-4 w-4" />
            Add CNG
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{expense ? "Edit" : "Add"} CNG Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setValue("date", date)}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("amount", { valueAsNumber: true })}
            />
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount.message}</p>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {expense ? "Update" : "Add"} CNG
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
