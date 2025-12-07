import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCreateVehicle, useUpdateVehicle, type Vehicle } from "@/hooks/useVehicles";
import { vehicleSchema, type VehicleFormData } from "@/lib/validations";
import { Plus, Edit } from "lucide-react";

interface VehicleDialogProps {
  vehicle?: Vehicle;
  trigger?: React.ReactNode;
}

export const VehicleDialog = ({ vehicle, trigger }: VehicleDialogProps) => {
  const [open, setOpen] = useState(false);
  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicle();

  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      name: vehicle?.name || "",
      owner_name: vehicle?.owner_name || "",
    },
  });

  const onSubmit = async (data: VehicleFormData) => {
    if (vehicle) {
      await updateVehicle.mutateAsync({ id: vehicle.id, data });
    } else {
      await createVehicle.mutateAsync(data);
    }
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            {vehicle ? <Edit className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
            {vehicle ? "Edit Vehicle" : "Add Vehicle"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{vehicle ? "Edit Vehicle" : "Add Vehicle"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Name/Number</FormLabel>
                  <FormControl>
                    <Input placeholder="MH12AB1234" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="owner_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Owner Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createVehicle.isPending || updateVehicle.isPending}>
                {vehicle ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
