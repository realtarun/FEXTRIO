import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { TripFormData } from "@/lib/validations";

export interface Trip {
  id: string;
  vehicle_id: string;
  date: string;
  cash: number;
  earning: number;
  created_at: string;
  updated_at: string;
}

interface TripsQueryParams {
  vehicleId: string | undefined;
  from?: string;
  to?: string;
}

export const useTrips = ({ vehicleId, from, to }: TripsQueryParams) => {
  return useQuery({
    queryKey: ["trips", vehicleId, from, to],
    queryFn: async () => {
      if (!vehicleId) throw new Error("Vehicle ID is required");

      let query = supabase
        .from("trips")
        .select("*")
        .eq("vehicle_id", vehicleId)
        .order("date", { ascending: false });

      if (from) {
        query = query.gte("date", from);
      }
      if (to) {
        query = query.lte("date", to);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data as Trip[];
    },
    enabled: !!vehicleId,
  });
};

export const useTrip = (id: string | undefined) => {
  return useQuery({
    queryKey: ["trip", id],
    queryFn: async () => {
      if (!id) throw new Error("Trip ID is required");

      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Trip;
    },
    enabled: !!id,
  });
};

export const useCreateTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ vehicleId, data }: { vehicleId: string; data: TripFormData }) => {
      const { data: created, error } = await supabase
        .from("trips")
        .insert([{
          vehicle_id: vehicleId,
          date: data.date,
          cash: data.cash,
          earning: data.earning,
        }])
        .select()
        .single();

      if (error) throw error;
      return created;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["trips", variables.vehicleId] });
      queryClient.invalidateQueries({ queryKey: ["vehicle-stats", variables.vehicleId] });
      toast.success("Trip added successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to add trip: ${error.message}`);
    },
  });
};

export const useUpdateTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, vehicleId, data }: { id: string; vehicleId: string; data: TripFormData }) => {
      const { data: updated, error } = await supabase
        .from("trips")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return updated;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["trips", variables.vehicleId] });
      queryClient.invalidateQueries({ queryKey: ["trip", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["vehicle-stats", variables.vehicleId] });
      toast.success("Trip updated successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to update trip: ${error.message}`);
    },
  });
};

export const useDeleteTrip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, vehicleId }: { id: string; vehicleId: string }) => {
      const { error } = await supabase
        .from("trips")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["trips", variables.vehicleId] });
      queryClient.invalidateQueries({ queryKey: ["vehicle-stats", variables.vehicleId] });
      toast.success("Trip deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete trip: ${error.message}`);
    },
  });
};
