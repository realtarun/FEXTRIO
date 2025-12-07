import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import { ArrowLeft, Fuel, Pencil, Trash2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/EmptyState";
import { useVehicle } from "@/hooks/useVehicles";
import { useCngExpenses, useDeleteCngExpense } from "@/hooks/useCngExpenses";
import { CngDialog } from "@/components/CngDialog";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";
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

const CngExpenses = () => {
  const { id } = useParams();
  const { data: vehicle, isLoading: vehicleLoading } = useVehicle(id);
  const { data: expenses, isLoading: expensesLoading } = useCngExpenses({
    vehicleId: id,
  });
  const deleteMutation = useDeleteCngExpense();

  const totalAmount = expenses?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;

  if (vehicleLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
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
    <div className="min-h-screen bg-background">
      <div className="p-4 md:p-8 border-b">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <Link
                to={`/vehicles/${id}`}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold">CNG Expenses</h1>
                <p className="text-sm text-muted-foreground">
                  {vehicle.name} - {vehicle.owner_name}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to={`/vehicles/${id}/cng-statement`}>
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Statement
                </Button>
              </Link>
              <CngDialog vehicleId={id!} />
            </div>
          </div>

          <div className="mt-6 bg-card rounded-lg border p-6">
            <p className="text-sm text-muted-foreground">Total CNG Expenses</p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(totalAmount)}</p>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {expensesLoading ? (
            <Skeleton className="h-96" />
          ) : expenses && expenses.length > 0 ? (
            <div className="bg-card rounded-lg border overflow-hidden animate-fade-in">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 font-semibold">Date</th>
                      <th className="text-right p-4 font-semibold">Amount (₹)</th>
                      <th className="text-right p-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((expense, index) => (
                      <tr
                        key={expense.id}
                        className={cn("border-b", index % 2 === 0 && "bg-muted/20")}
                      >
                        <td className="p-4">{format(new Date(expense.date), "dd MMM yyyy")}</td>
                        <td className="p-4 text-right tabular-nums">
                          {Number(expense.amount).toFixed(2)}
                        </td>
                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            <CngDialog
                              vehicleId={id!}
                              expense={expense}
                              trigger={
                                <Button variant="ghost" size="sm">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              }
                            />
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete CNG expense?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the
                                    CNG expense record.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteMutation.mutate(expense.id)}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-lg border p-12 text-center animate-fade-in">
              <EmptyState
                icon={Fuel}
                title="No CNG expenses yet"
                description="Start tracking CNG expenses by adding your first entry."
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CngExpenses;
