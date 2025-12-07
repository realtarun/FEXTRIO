import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Truck, User, Edit, Trash2 } from "lucide-react";
import { VehicleDialog } from "./VehicleDialog";
import { useDeleteVehicle, type Vehicle } from "@/hooks/useVehicles";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export const VehicleCard = ({ vehicle }: VehicleCardProps) => {
  const deleteVehicle = useDeleteVehicle();

  return (
    <Card className="group relative overflow-hidden border-none bg-card hover:shadow-xl transition-all duration-300 animate-fade-in">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-12 translate-x-12 group-hover:scale-150 transition-transform duration-500" />
      
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <Link to={`/vehicles/${vehicle.id}`} className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold truncate group-hover:text-primary transition-colors">
                {vehicle.name}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground pl-14">
              <User className="h-4 w-4 shrink-0" />
              <span className="text-sm truncate">{vehicle.owner_name}</span>
            </div>
          </Link>
          
          <div className="flex gap-1 shrink-0">
            <VehicleDialog
              vehicle={vehicle}
              trigger={
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Edit className="h-4 w-4" />
                </Button>
              }
            />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Vehicle</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete {vehicle.name}? This will also delete all associated trips. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => deleteVehicle.mutate(vehicle.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <Link 
          to={`/vehicles/${vehicle.id}`}
          className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          View Details
          <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </CardContent>
    </Card>
  );
};
