import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { ArrowLeft, IndianRupee, TrendingUp, Calendar, Edit, Trash2, FileText, Archive as ArchiveIcon, Fuel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/EmptyState";
import { Footer } from "@/components/Footer";
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
import { useVehicle } from "@/hooks/useVehicles";
import { useDeleteTrip } from "@/hooks/useTrips";
import { useCurrentMonthTrips, getCurrentMonth } from "@/hooks/useCurrentMonthTrips";
import { useVehicleStats } from "@/hooks/useVehicleStats";
import { StatCard } from "@/components/StatCard";
import { TripDialog } from "@/components/TripDialog";
import { VehicleDialog } from "@/components/VehicleDialog";
import { formatCurrency } from "@/lib/currency";

const VehicleDetail = () => {
  const { id } = useParams();
  const { data: vehicle, isLoading: vehicleLoading } = useVehicle(id);
  const { data: trips, isLoading: tripsLoading } = useCurrentMonthTrips({ vehicleId: id });
  const { data: stats } = useVehicleStats(id);
  const currentMonth = getCurrentMonth();
  const deleteTrip = useDeleteTrip();

  if (vehicleLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-12 w-full" />
          <div className="grid gap-4 md:grid-cols-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground">Vehicle not found</p>
          <Link to="/vehicles">
            <Button className="mt-4">Back to Vehicles</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Link to="/vehicles" className="text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-4xl font-bold font-heading mb-1">{vehicle.name}</h1>
                <p className="text-muted-foreground text-lg">Owner: {vehicle.owner_name}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <VehicleDialog vehicle={vehicle} />
              <TripDialog vehicleId={vehicle.id} />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-4 mb-10 animate-fade-in-up">
            <StatCard
              title="Total Cash"
              value={formatCurrency(stats?.totalCash || 0)}
              icon={IndianRupee}
            />
            <StatCard
              title="Total Earnings"
              value={formatCurrency(stats?.totalEarning || 0)}
              icon={TrendingUp}
            />
            <StatCard
              title="Driver Salary (30%)"
              value={formatCurrency((stats?.totalEarning || 0) * 0.3)}
              icon={IndianRupee}
            />
            <StatCard
              title="Total Trips"
              value={stats?.totalTrips || 0}
              icon={Calendar}
            />
          </div>

          <div className="bg-card rounded-2xl border-none shadow-md">
            <div className="p-6 border-b flex justify-between items-center flex-wrap gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold font-heading mb-1">Trips - Current Month</h2>
                <p className="text-base md:text-lg text-muted-foreground">{currentMonth}</p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <Link to={`/vehicles/${vehicle.id}/cng`}>
                  <Button variant="outline" size="sm" className="rounded-lg">
                    <Fuel className="h-4 w-4 mr-2" />
                    CNG
                  </Button>
                </Link>
                <Link to={`/vehicles/${vehicle.id}/statement`}>
                  <Button variant="outline" size="sm" className="rounded-lg">
                    <FileText className="h-4 w-4 mr-2" />
                    Statement
                  </Button>
                </Link>
                <Link to={`/vehicles/${vehicle.id}/archive`}>
                  <Button variant="outline" size="sm" className="rounded-lg">
                    <ArchiveIcon className="h-4 w-4 mr-2" />
                    Archive
                  </Button>
                </Link>
              </div>
            </div>
            {tripsLoading ? (
              <div className="p-6">
                <Skeleton className="h-48" />
              </div>
            ) : trips && trips.length > 0 ? (
              <div className="overflow-x-auto animate-fade-in">
                <Table aria-label="Current month trips">
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-b">
                      <TableHead className="text-base md:text-lg font-semibold">Date</TableHead>
                      <TableHead className="text-right text-base md:text-lg font-semibold">Cash</TableHead>
                      <TableHead className="text-right text-base md:text-lg font-semibold">Earning</TableHead>
                      <TableHead className="text-right text-base md:text-lg font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trips.map((trip) => (
                        <TableRow key={trip.id} className="hover:bg-muted/50 transition-colors">
                          <TableCell className="text-base md:text-lg font-medium">
                            {format(new Date(trip.date), "PPP")}
                          </TableCell>
                          <TableCell className="text-right tabular-nums text-base md:text-lg">
                            {formatCurrency(Number(trip.cash))}
                          </TableCell>
                          <TableCell className="text-right tabular-nums text-base md:text-lg">
                            {formatCurrency(Number(trip.earning))}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <TripDialog
                                vehicleId={vehicle.id}
                                trip={trip}
                                trigger={
                                  <Button variant="ghost" size="icon" aria-label="Edit trip" className="h-9 w-9">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                }
                              />
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" aria-label="Delete trip" className="h-9 w-9 text-destructive hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Trip</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this trip? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteTrip.mutate({ id: trip.id, vehicleId: vehicle.id })}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <EmptyState
                icon={FileText}
                title="No trips this month"
                description="Start tracking by adding your first trip for this vehicle."
              />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VehicleDetail;
