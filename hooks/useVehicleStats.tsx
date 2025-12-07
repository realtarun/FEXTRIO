import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface VehicleStats {
  totalCash: number;
  totalEarning: number;
  totalTrips: number;
}

export const useVehicleStats = (vehicleId: string | undefined, from?: string, to?: string) => {
  return useQuery({
    queryKey: ["vehicle-stats", vehicleId, from, to],
    queryFn: async (): Promise<VehicleStats> => {
      if (!vehicleId) throw new Error("Vehicle ID is required");

      let query = supabase
        .from("trips")
        .select("cash, earning")
        .eq("vehicle_id", vehicleId);

      if (from) {
        query = query.gte("date", from);
      }
      if (to) {
        query = query.lte("date", to);
      }

      const { data, error } = await query;

      if (error) throw error;

      const stats = data.reduce(
        (acc, trip) => ({
          totalCash: acc.totalCash + Number(trip.cash),
          totalEarning: acc.totalEarning + Number(trip.earning),
          totalTrips: acc.totalTrips + 1,
        }),
        { totalCash: 0, totalEarning: 0, totalTrips: 0 }
      );

      return stats;
    },
    enabled: !!vehicleId,
  });
};
