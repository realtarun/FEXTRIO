import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Trip } from "./useTrips";

interface CurrentMonthTripsParams {
  vehicleId: string | undefined;
}

// Get start and end of current month
const getCurrentMonthRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  return {
    from: start.toISOString().split('T')[0],
    to: end.toISOString().split('T')[0],
  };
};

export const useCurrentMonthTrips = ({ vehicleId }: CurrentMonthTripsParams) => {
  const { from, to } = getCurrentMonthRange();
  
  return useQuery({
    queryKey: ["current-month-trips", vehicleId, from, to],
    queryFn: async (): Promise<Trip[]> => {
      if (!vehicleId) throw new Error("Vehicle ID is required");

      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .eq("vehicle_id", vehicleId)
        .eq("is_archived", false)
        .gte("date", from)
        .lte("date", to)
        .order("date", { ascending: false });

      if (error) throw error;
      return data as Trip[];
    },
    enabled: !!vehicleId,
  });
};

export const getCurrentMonth = () => {
  const now = new Date();
  return now.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};
