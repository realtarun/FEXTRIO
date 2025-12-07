import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Download, Printer, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useVehicle } from "@/hooks/useVehicles";
import { useArchivedTrips } from "@/hooks/useArchivedTrips";
import { useVehicleStats } from "@/hooks/useVehicleStats";
import { formatCurrency } from "@/lib/currency";
import { EmptyState } from "@/components/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const ITEMS_PER_PAGE = 50;

const Archive = () => {
  const { id } = useParams<{ id: string }>();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: vehicle, isLoading: vehicleLoading } = useVehicle(id);
  const { data: allTrips, isLoading: tripsLoading } = useArchivedTrips({
    vehicleId: id,
    from: fromDate,
    to: toDate,
  });
  const { data: stats } = useVehicleStats(id, fromDate, toDate);

  // Pagination logic
  const totalPages = Math.ceil((allTrips?.length || 0) / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const trips = allTrips?.slice(startIndex, endIndex);

  const handleExportCSV = () => {
    if (!allTrips || allTrips.length === 0) return;

    const headers = ["Date", "Cash", "Earning"];
    const rows = allTrips.map((trip) => [
      format(new Date(trip.date), "yyyy-MM-dd"),
      trip.cash,
      trip.earning,
    ]);
    
    // Add totals row
    rows.push(["Total", stats?.totalCash || 0, stats?.totalEarning || 0]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${vehicle?.name}-archive-${Date.now()}.csv`;
    a.click();
  };

  const handlePrint = () => {
    window.print();
  };

  if (vehicleLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Skeleton className="h-12 w-64 mb-8" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <EmptyState
          icon={Calendar}
          title="Vehicle not found"
          description="The vehicle you're looking for doesn't exist."
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8 no-print">
          <Link to={`/vehicles/${id}`} className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Total Trips (Archive)</h1>
            <p className="text-muted-foreground">All-time trip history</p>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter by Date Range</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="from-date">From Date</Label>
                <Input
                  id="from-date"
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="to-date">To Date</Label>
                <Input
                  id="to-date"
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
              <div className="flex items-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setFromDate("");
                    setToDate("");
                  }}
                  className="flex-1"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card id="statement-content">
          <CardHeader className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h2 className="text-lg font-semibold">Vehicle Information</h2>
                <p className="text-sm text-muted-foreground">
                  Vehicle: {vehicle.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Owner: {vehicle.owner_name}
                </p>
              </div>
              {(fromDate || toDate) && (
                <div className="text-right">
                  <h2 className="text-lg font-semibold">Date Range</h2>
                  <p className="text-sm text-muted-foreground">
                    {fromDate || "Beginning"} - {toDate || "Present"}
                  </p>
                </div>
              )}
            </div>

            {stats && (
              <div className="flex gap-4 pt-4 border-t">
                <div className="flex-1 text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Cash</p>
                  <p className="text-2xl font-bold text-success">
                    {formatCurrency(stats.totalCash)}
                  </p>
                </div>
                <div className="flex-1 text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Earnings</p>
                  <p className="text-2xl font-bold text-primary">
                    {formatCurrency(stats.totalEarning)}
                  </p>
                </div>
                <div className="flex-1 text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Trips</p>
                  <p className="text-2xl font-bold">{stats.totalTrips}</p>
                </div>
              </div>
            )}

            <div className="flex gap-2 no-print">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                disabled={!trips || trips.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                disabled={!trips || trips.length === 0}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            {tripsLoading && (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12" />
                ))}
              </div>
            )}

            {!tripsLoading && (!allTrips || allTrips.length === 0) && (
              <EmptyState
                icon={Calendar}
                title="No archived trips"
                description={
                  fromDate || toDate
                    ? "No trips found for the selected date range."
                    : "All trips are in the current month."
                }
              />
            )}

            {!tripsLoading && allTrips && allTrips.length > 0 && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Cash</TableHead>
                      <TableHead className="text-right">Earning</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trips.map((trip) => (
                      <TableRow key={trip.id} className="animate-fade-in">
                        <TableCell>
                          {format(new Date(trip.date), "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatCurrency(Number(trip.cash))}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatCurrency(Number(trip.earning))}
                        </TableCell>
                      </TableRow>
                    ))}
                    {stats && (
                      <TableRow className="font-bold border-t-2">
                        <TableCell>Total</TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatCurrency(stats.totalCash)}
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          {formatCurrency(stats.totalEarning)}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between p-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Showing {startIndex + 1} to {Math.min(endIndex, allTrips.length)} of {allTrips.length} trips
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Archive;
