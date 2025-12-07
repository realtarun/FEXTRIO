import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { VehicleFormData } from "@/lib/validations";

export interface Vehicle {
  id: string;
  name: string;
  owner_name: string;
  created_at: string;
  updated_at: string;
}

export const useVehicles = (searchQuery?: string) => {
  return useQuery({
    queryKey: ["vehicles", searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("vehicles")
        .select("*")
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,owner_name.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Vehicle[];
    },
  });
};

export const useVehicle = (id: string | undefined) => {
  return useQuery({
    queryKey: ["vehicle", id],
    queryFn: async () => {
      if (!id) throw new Error("Vehicle ID is required");

      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Vehicle;
    },
    enabled: !!id,
  });
};

export const useCreateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (vehicleData: VehicleFormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in to create a vehicle");

      const { data, error } = await supabase
        .from("vehicles")
        .insert([{
          name: vehicleData.name,
          owner_name: vehicleData.owner_name,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success("Vehicle created successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to create vehicle: ${error.message}`);
    },
  });
};

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: VehicleFormData }) => {
      const { data: updated, error } = await supabase
        .from("vehicles")
        .update({
          name: data.name,
          owner_name: data.owner_name,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return updated;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["vehicle", variables.id] });
      toast.success("Vehicle updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update vehicle: ${error.message}`);
    },
  });
};

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("vehicles")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success("Vehicle deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete vehicle: ${error.message}`);
    },
  });
};
