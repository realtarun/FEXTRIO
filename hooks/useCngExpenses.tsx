import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface CngExpense {
  id: string;
  vehicle_id: string;
  date: string;
  amount: number;
  created_at: string;
  updated_at: string;
}

interface CngExpensesQueryParams {
  vehicleId: string | undefined;
  from?: string;
  to?: string;
}

export const useCngExpenses = ({ vehicleId, from, to }: CngExpensesQueryParams) => {
  return useQuery({
    queryKey: ["cng-expenses", vehicleId, from, to],
    queryFn: async (): Promise<CngExpense[]> => {
      if (!vehicleId) throw new Error("Vehicle ID is required");

      let query = supabase
        .from("cng_expenses")
        .select("*")
        .eq("vehicle_id", vehicleId);

      if (from) {
        query = query.gte("date", from);
      }
      if (to) {
        query = query.lte("date", to);
      }

      const { data, error } = await query.order("date", { ascending: false });

      if (error) throw error;
      return data as CngExpense[];
    },
    enabled: !!vehicleId,
  });
};

export const useCngExpense = (id: string | undefined) => {
  return useQuery({
    queryKey: ["cng-expense", id],
    queryFn: async (): Promise<CngExpense> => {
      if (!id) throw new Error("CNG expense ID is required");

      const { data, error } = await supabase
        .from("cng_expenses")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as CngExpense;
    },
    enabled: !!id,
  });
};

export const useCreateCngExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expense: { vehicle_id: string; date: string; amount: number }) => {
      const { data, error } = await supabase
        .from("cng_expenses")
        .insert(expense)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cng-expenses"] });
      queryClient.invalidateQueries({ queryKey: ["vehicle-stats"] });
      toast.success("CNG expense added successfully");
    },
    onError: () => {
      toast.error("Failed to add CNG expense");
    },
  });
};

export const useUpdateCngExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CngExpense> & { id: string }) => {
      const { data, error } = await supabase
        .from("cng_expenses")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cng-expenses"] });
      queryClient.invalidateQueries({ queryKey: ["cng-expense"] });
      queryClient.invalidateQueries({ queryKey: ["vehicle-stats"] });
      toast.success("CNG expense updated successfully");
    },
    onError: () => {
      toast.error("Failed to update CNG expense");
    },
  });
};

export const useDeleteCngExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("cng_expenses").delete().eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cng-expenses"] });
      queryClient.invalidateQueries({ queryKey: ["vehicle-stats"] });
      toast.success("CNG expense deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete CNG expense");
    },
  });
};
