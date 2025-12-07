import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useArchiveOldTrips = () => {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('archive-old-trips', {
        body: {},
      });

      if (error) throw error;
      return data;
    },
  });
};
