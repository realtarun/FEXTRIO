import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { format } from "date-fns";
import { ArrowLeft, CalendarIcon, Download, Printer, Fuel } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/EmptyState";
import { useVehicle } from "@/hooks/useVehicles";
import { useCngExpenses } from "@/hooks/useCngExpenses";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CngStatement = () => {
  const { id } = useParams();
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();

  const fromDateStr = fromDate ? format(fromDate, "yyyy-MM-dd") : undefined;
  const toDateStr = toDate ? format(toDate, "yyyy-MM-dd") : undefined;

  const { data: vehicle, isLoading: vehicleLoading } = useVehicle(id);
  const { data: cngExpenses, isLoading: cngLoading } = useCngExpenses({
    vehicleId: id,
    from: fromDateStr,
    to: toDateStr,
  });

  const totalCng = cngExpenses?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;

  const handleExportCSV = () => {
    if (!cngExpenses || cngExpenses.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = ["Date", "Amount"];
    const rows = cngExpenses.map((expense) => [
      format(new Date(expense.date), "dd-MM-yyyy"),
      Number(expense.amount).toFixed(2),
    ]);

    const totalsRow = ["TOTAL", totalCng.toFixed(2)];

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
      totalsRow.join(","),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `cng_statement_${vehicle?.name}_${format(new Date(), "yyyy-MM-dd")}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CNG Statement exported successfully");
  };

  const handlePrint = () => {
    window.print();
  };

  if (vehicleLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-5xl mx-auto">
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-muted-foreground">Vehicle not found</p>
          <Link to="/vehicles">
            <Button className="mt-4">Back to Vehicles</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="no-print p-4 md:p-6 border-b">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <Link
                to={`/vehicles/${id}/cng`}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl font-bold">CNG Statement</h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">From:</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "justify-start text-left font-normal",
                      !fromDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fromDate ? format(fromDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={fromDate}
                    onSelect={setFromDate}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">To:</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "justify-start text-left font-normal",
                      !toDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {toDate ? format(toDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={setToDate}
                    initialFocus
                    disabled={(date) => (fromDate ? date < fromDate : false)}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {(fromDate || toDate) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFromDate(undefined);
                  setToDate(undefined);
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="p-3 md:p-4">
        <div className="max-w-5xl mx-auto">
          <div className="statement-header bg-card rounded-lg border p-4 mb-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">Vehicle</p>
                <p className="text-lg font-semibold">{vehicle.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Owner</p>
                <p className="text-lg font-semibold">{vehicle.owner_name}</p>
              </div>
            </div>
            {(fromDate || toDate) && (
              <div className="mt-2">
                <p className="text-xs text-muted-foreground">Date Range</p>
                <p className="text-lg font-semibold">
                  {fromDate ? format(fromDate, "dd MMM yyyy") : "Start"} -{" "}
                  {toDate ? format(toDate, "dd MMM yyyy") : "End"}
                </p>
              </div>
            )}
          </div>

          <div className="bg-card rounded-lg border p-4 mb-3">
            <div>
              <p className="text-xs text-muted-foreground">Total CNG Expenses</p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(totalCng)}
              </p>
            </div>
          </div>

          {cngLoading ? (
            <Skeleton className="h-64" />
          ) : cngExpenses && cngExpenses.length > 0 ? (
            <div className="statement-table bg-card rounded-lg border overflow-hidden animate-fade-in">
              <div className="overflow-x-auto">
                <table className="w-full" role="table" aria-label="CNG statement">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left px-3 py-2 font-semibold text-base">Date</th>
                    <th className="text-right px-3 py-2 font-semibold text-base">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {cngExpenses.map((expense, index) => (
                    <tr
                      key={expense.id}
                      className={cn("border-b", index % 2 === 0 && "bg-muted/20")}
                    >
                      <td className="px-3 py-2 text-base">{format(new Date(expense.date), "dd MMM yyyy")}</td>
                      <td className="px-3 py-2 text-right tabular-nums text-base">
                        {Number(expense.amount).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-primary/50 bg-muted/30 font-bold">
                    <td className="px-3 py-2 text-base">TOTAL</td>
                    <td className="px-3 py-2 text-right tabular-nums text-base">
                      {totalCng.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-lg border p-12 text-center animate-fade-in">
              <EmptyState
                icon={Fuel}
                title="No CNG expenses in this date range"
                description="Try adjusting the date filters or add CNG expenses to see data here."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CngStatement;