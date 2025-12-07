import { z } from "zod";

export const vehicleSchema = z.object({
  name: z.string()
    .trim()
    .min(1, { message: "Vehicle name/number is required" })
    .max(100, { message: "Vehicle name must be less than 100 characters" }),
  owner_name: z.string()
    .trim()
    .min(1, { message: "Owner name is required" })
    .max(100, { message: "Owner name must be less than 100 characters" }),
});

export const tripSchema = z.object({
  date: z.string()
    .min(1, { message: "Date is required" }),
  cash: z.number()
    .min(0, { message: "Cash must be greater than or equal to 0" })
    .nonnegative(),
  earning: z.number()
    .min(0, { message: "Earning must be greater than or equal to 0" })
    .nonnegative(),
});

export type VehicleFormData = z.infer<typeof vehicleSchema>;
export type TripFormData = z.infer<typeof tripSchema>;
