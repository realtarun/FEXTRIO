import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Trip } from "./useTrips";

interface ArchivedTripsParams {
  vehicleId: string | undefined;
  from?: string;
  to?: string;
}

export const useArchivedTrips = ({ vehicleId, from, to }: ArchivedTripsParams) => {
  return useQuery({
    queryKey: ["archived-trips", vehicleId, from, to],
    queryFn: async (): Promise<Trip[]> => {
      if (!vehicleId) throw new Error("Vehicle ID is required");

      let query = supabase
        .from("trips")
        .select("*")
        .eq("vehicle_id", vehicleId)
        .eq("is_archived", true);

      if (from) {
        query = query.gte("date", from);
      }
      if (to) {
        query = query.lte("date", to);
      }

      const { data, error } = await query.order("date", { ascending: true });

      if (error) throw error;
      return data as Trip[];
    },
    enabled: !!vehicleId,
  });
};
