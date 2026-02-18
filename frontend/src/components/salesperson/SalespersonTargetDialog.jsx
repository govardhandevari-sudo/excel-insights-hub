import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export function SalespersonTargetDialog({ salesperson, open, onOpenChange }) {
  const { toast } = useToast();
  
  // Mock previous targets - in real app this would come from database
  const [targetHistory, setTargetHistory] = useState([
    { id: 1, startDate: new Date(2025, 0, 1), endDate: new Date(2025, 0, 31), amount: "150000" },
    { id: 2, startDate: new Date(2025, 1, 1), endDate: new Date(2025, 1, 28), amount: "175000" },
  ]);

  const [newStartDate, setNewStartDate] = useState();
  const [newEndDate, setNewEndDate] = useState();
  const [newAmount, setNewAmount] = useState("");

  const handleAddTarget = () => {
    if (!newStartDate || !newEndDate || !newAmount) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (newEndDate < newStartDate) {
      toast({
        title: "Invalid Date Range",
        description: "End date must be after start date",
        variant: "destructive",
      });
      return;
    }

    const newTarget = {
      id: Date.now(),
      startDate: newStartDate,
      endDate: newEndDate,
      amount: newAmount,
    };

    setTargetHistory((prev) => [...prev, newTarget]);
    setNewStartDate(undefined);
    setNewEndDate(undefined);
    setNewAmount("");

    toast({
      title: "Target Added",
      description: `New target of ₹${newAmount} added for ${salesperson?.name}`,
    });
  };

  const handleDeleteTarget = (id) => {
    setTargetHistory((prev) => prev.filter((t) => t.id !== id));
    toast({
      title: "Target Removed",
      description: "Target has been removed",
    });
  };

  if (!salesperson) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Targets for {salesperson.name}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {salesperson.branch} • {salesperson.region}
          </p>
        </DialogHeader>

        {/* Previous Targets */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">Target History</h3>
          {targetHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No targets set yet
            </p>
          ) : (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50 border-b">
                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground uppercase">
                      Date Range
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground uppercase">
                      Amount
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-muted-foreground uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {targetHistory.map((target) => (
                    <tr key={target.id} className="border-b last:border-0">
                      <td className="px-3 py-2 text-sm">
                        {format(target.startDate, "dd MMM yyyy")} -{" "}
                        {format(target.endDate, "dd MMM yyyy")}
                      </td>
                      <td className="px-3 py-2 text-sm font-medium">
                        ₹{Number(target.amount).toLocaleString()}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteTarget(target.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add New Target */}
        <div className="space-y-3 pt-4 border-t">
          <h3 className="text-sm font-medium text-foreground">Add New Target</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Start Date */}
            <div className="space-y-1.5">
              <Label className="text-xs">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-9",
                      !newStartDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newStartDate ? format(newStartDate, "dd MMM yyyy") : "Pick date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newStartDate}
                    onSelect={setNewStartDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Date */}
            <div className="space-y-1.5">
              <Label className="text-xs">End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-9",
                      !newEndDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newEndDate ? format(newEndDate, "dd MMM yyyy") : "Pick date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={newEndDate}
                    onSelect={setNewEndDate}
                    disabled={(date) => newStartDate && date < newStartDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Amount */}
            <div className="space-y-1.5">
              <Label className="text-xs">Target Amount (₹)</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="h-9"
              />
            </div>
          </div>

          <Button onClick={handleAddTarget} className="gap-2 w-full sm:w-auto">
            <Plus className="h-4 w-4" />
            Add Target
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
