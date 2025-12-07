import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft, Truck } from "lucide-react";
import { VehicleDialog } from "@/components/VehicleDialog";
import { VehicleCard } from "@/components/VehicleCard";
import { EmptyState } from "@/components/EmptyState";
import { Footer } from "@/components/Footer";
import { useVehicles } from "@/hooks/useVehicles";
import { Skeleton } from "@/components/ui/skeleton";

const Vehicles = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { data: vehicles, isLoading } = useVehicles(searchQuery);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-4xl font-bold font-heading mb-1">Vehicles</h1>
              <p className="text-muted-foreground">Manage your fleet and track performance</p>
            </div>
          </div>
          <VehicleDialog />
        </div>

        {!isLoading && (!vehicles || vehicles.length === 0) && !searchQuery && (
          <EmptyState
            icon={Truck}
            title="No vehicles yet"
            description="Get started by adding your first vehicle to track trips and earnings."
            action={{
              label: "Add Vehicle",
              onClick: () => setShowAddDialog(true)
            }}
          />
        )}

        {!isLoading && searchQuery && (!vehicles || vehicles.length === 0) && (
          <EmptyState
            icon={Search}
            title="No vehicles found"
            description={`No vehicles match "${searchQuery}". Try a different search term.`}
          />
        )}

        {!isLoading && vehicles && vehicles.length > 0 && (
          <>
            <div className="relative mb-8 animate-fade-in max-w-xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by vehicle name or owner..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-base border-2 focus:border-primary rounded-xl"
                aria-label="Search vehicles"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          </>
        )}

        {isLoading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-44 rounded-xl" />
            ))}
          </div>
        )}

        {showAddDialog && <VehicleDialog />}
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default Vehicles;
