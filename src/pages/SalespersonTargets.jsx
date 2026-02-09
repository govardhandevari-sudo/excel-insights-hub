import { useState, useMemo } from "react";
import { format } from "date-fns";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { Save, Users, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { SalespersonTargetDialog } from "@/components/salesperson/SalespersonTargetDialog";

// Mock salesperson data
const initialSalespersons = [
  { id: 1, name: "Uma", branch: "Hyderabad", region: "Telangana" },
  { id: 2, name: "Mallikarjun", branch: "Karimnagar", region: "Telangana" },
  { id: 3, name: "Srinivas E", branch: "Warangal", region: "Telangana" },
  { id: 4, name: "Bhaskar", branch: "Khammam", region: "Telangana" },
  { id: 5, name: "Kiran Kumar", branch: "Nalgonda", region: "Telangana" },
  { id: 6, name: "Ravi Kumar", branch: "Vizag", region: "Andhra Pradesh" },
  { id: 7, name: "Prasad", branch: "Vijayawada", region: "Andhra Pradesh" },
  { id: 8, name: "Suresh", branch: "Guntur", region: "Andhra Pradesh" },
  { id: 9, name: "Venkat", branch: "Tirupati", region: "Andhra Pradesh" },
  { id: 10, name: "Ramesh", branch: "Bangalore", region: "Karnataka" },
  { id: 11, name: "Mahesh", branch: "Mysore", region: "Karnataka" },
  { id: 12, name: "Rajesh", branch: "Hubli", region: "Karnataka" },
];

export default function SalespersonTargets() {
  const { toast } = useToast();
  const [stateFilter, setStateFilter] = useState("all");
  const [branchFilter, setBranchFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedSalesperson, setSelectedSalesperson] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [targetDates, setTargetDates] = useState(
    initialSalespersons.reduce((acc, sp) => {
      acc[sp.id] = undefined;
      return acc;
    }, {})
  );
  const [bulkTarget, setBulkTarget] = useState("");
 
   // Get unique states and branches for filters
   const states = useMemo(() => {
     const unique = [...new Set(initialSalespersons.map((sp) => sp.region))];
     return unique.sort();
   }, []);
 
   const branches = useMemo(() => {
     let filtered = initialSalespersons;
     if (stateFilter !== "all") {
       filtered = filtered.filter((sp) => sp.region === stateFilter);
     }
     const unique = [...new Set(filtered.map((sp) => sp.branch))];
     return unique.sort();
   }, [stateFilter]);
 
   // Filter salespersons based on state and branch
   const filteredSalespersons = useMemo(() => {
     let result = initialSalespersons;
     if (stateFilter !== "all") {
       result = result.filter((sp) => sp.region === stateFilter);
     }
     if (branchFilter !== "all") {
       result = result.filter((sp) => sp.branch === branchFilter);
     }
     return result;
   }, [stateFilter, branchFilter]);
 
   // Pagination
   const totalPages = Math.ceil(filteredSalespersons.length / rowsPerPage);
   const startIndex = (currentPage - 1) * rowsPerPage;
   const endIndex = Math.min(startIndex + rowsPerPage, filteredSalespersons.length);
   const paginatedSalespersons = filteredSalespersons.slice(startIndex, endIndex);
 
   const allSelected = selectedIds.length === filteredSalespersons.length && filteredSalespersons.length > 0;
   const someSelected = selectedIds.length > 0 && !allSelected;
 
   const handleSelectAll = (checked) => {
     if (checked) {
       setSelectedIds(filteredSalespersons.map((sp) => sp.id));
     } else {
       setSelectedIds([]);
     }
   };
 
   const handleStateChange = (value) => {
     setStateFilter(value);
     setBranchFilter("all");
     setCurrentPage(1);
     setSelectedIds([]);
   };
 
   const handleBranchChange = (value) => {
     setBranchFilter(value);
     setCurrentPage(1);
     setSelectedIds([]);
   };
 
   const goToPage = (page) => {
     setCurrentPage(Math.max(1, Math.min(page, totalPages)));
   };
 
   const handleSelectOne = (id, checked) => {
     if (checked) {
       setSelectedIds((prev) => [...prev, id]);
     } else {
       setSelectedIds((prev) => prev.filter((sid) => sid !== id));
     }
   };
 
  const handleTargetDateChange = (id, date) => {
    setTargetDates((prev) => ({ ...prev, [id]: date }));
  };

  const handleSalespersonClick = (sp) => {
    setSelectedSalesperson(sp);
    setDialogOpen(true);
  };
 
  const handleApplyBulkTarget = () => {
    if (selectedIds.length === 0) {
      toast({
        title: "Error",
        description: "Please select salespersons first",
        variant: "destructive",
      });
      return;
    }
    // Open dialog for bulk target setting would go here
    toast({
      title: "Bulk Selection",
      description: `${selectedIds.length} salesperson(s) selected. Click on individual names to set targets.`,
    });
  };
 
  const handleSave = () => {
    const salespersonsWithDates = initialSalespersons.filter(
      (sp) => targetDates[sp.id]
    );

    if (salespersonsWithDates.length === 0) {
      toast({
        title: "No Dates Set",
        description: "Please set target dates for at least one salesperson",
        variant: "destructive",
      });
      return;
    }

    // Here you would save to database
    console.log("Saving targets:", salespersonsWithDates.map((sp) => ({
      id: sp.id,
      name: sp.name,
      targetDate: targetDates[sp.id],
    })));
    
    toast({
      title: "Saved",
      description: `${salespersonsWithDates.length} salesperson date(s) saved`,
    });
  };
 
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-4 max-h-screen overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-heading font-bold text-foreground">
              Salesperson Targets
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Click on a salesperson name to manage their targets
            </p>
          </div>
        </div>
 
         {/* Filters */}
         <Card>
           <CardContent className="py-3 px-4">
             <div className="flex flex-wrap items-center gap-4">
               <div className="flex items-center gap-2">
                 <Label className="text-sm font-medium whitespace-nowrap">State:</Label>
                 <Select value={stateFilter} onValueChange={handleStateChange}>
                   <SelectTrigger className="w-[150px]">
                     <SelectValue placeholder="All States" />
                   </SelectTrigger>
                   <SelectContent className="bg-popover z-50">
                     <SelectItem value="all">All States</SelectItem>
                     {states.map((state) => (
                       <SelectItem key={state} value={state}>
                         {state}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>
               <div className="flex items-center gap-2">
                 <Label className="text-sm font-medium whitespace-nowrap">Branch:</Label>
                 <Select value={branchFilter} onValueChange={handleBranchChange}>
                   <SelectTrigger className="w-[150px]">
                     <SelectValue placeholder="All Branches" />
                   </SelectTrigger>
                   <SelectContent className="bg-popover z-50">
                     <SelectItem value="all">All Branches</SelectItem>
                     {branches.map((branch) => (
                       <SelectItem key={branch} value={branch}>
                         {branch}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>
               <span className="text-sm text-muted-foreground ml-auto">
                 {filteredSalespersons.length} salesperson(s)
               </span>
             </div>
           </CardContent>
         </Card>
 
        {/* Bulk Action Bar */}
        {selectedIds.length > 0 && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-primary">
                  {selectedIds.length} selected
                </span>
                <span className="text-sm text-muted-foreground">
                  Click on names to set individual targets
                </span>
              </div>
            </CardContent>
          </Card>
        )}
 
         <Card>
           <CardHeader className="pb-3">
             <CardTitle className="flex items-center gap-2 text-base">
               <Users className="h-5 w-5" />
               Sales Team
             </CardTitle>
           </CardHeader>
           <CardContent className="p-0">
             <div className="overflow-x-auto">
               <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                      className={someSelected ? "data-[state=checked]:bg-primary/50" : ""}
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                    S.No
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                    Salesperson
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                    Branch
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                    Region
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">
                    Target Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedSalespersons.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      No salespersons found
                    </td>
                  </tr>
                ) : (
                  paginatedSalespersons.map((sp, idx) => (
                    <tr
                      key={sp.id}
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <Checkbox
                          checked={selectedIds.includes(sp.id)}
                          onCheckedChange={(checked) => handleSelectOne(sp.id, checked)}
                          aria-label={`Select ${sp.name}`}
                        />
                      </td>
                      <td className="px-4 py-3 text-sm">{startIndex + idx + 1}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleSalespersonClick(sp)}
                          className="text-sm font-medium text-primary hover:underline cursor-pointer text-left"
                        >
                          {sp.name}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm">{sp.branch}</td>
                      <td className="px-4 py-3 text-sm">{sp.region}</td>
                      <td className="px-4 py-3">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-36 h-8 justify-start text-left font-normal text-sm",
                                !targetDates[sp.id] && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                              {targetDates[sp.id]
                                ? format(targetDates[sp.id], "dd MMM yyyy")
                                : "Pick date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={targetDates[sp.id]}
                              onSelect={(date) => handleTargetDateChange(sp.id, date)}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
               </table>
             </div>
             
             {/* Pagination */}
             {filteredSalespersons.length > rowsPerPage && (
               <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-border bg-muted/20">
                 <span className="text-xs md:text-sm text-muted-foreground">
                   Showing {startIndex + 1}-{endIndex} of {filteredSalespersons.length}
                 </span>
                 <div className="flex items-center gap-1">
                   <Button
                     variant="outline"
                     size="icon"
                     className="h-8 w-8"
                     onClick={() => goToPage(1)}
                     disabled={currentPage === 1}
                   >
                     <ChevronsLeft className="h-4 w-4" />
                   </Button>
                   <Button
                     variant="outline"
                     size="icon"
                     className="h-8 w-8"
                     onClick={() => goToPage(currentPage - 1)}
                     disabled={currentPage === 1}
                   >
                     <ChevronLeft className="h-4 w-4" />
                   </Button>
                   <div className="flex items-center gap-1 mx-2">
                     <span className="text-xs md:text-sm text-muted-foreground">Page</span>
                     <Input
                       type="number"
                       min={1}
                       max={totalPages}
                       value={currentPage}
                       onChange={(e) => goToPage(Number(e.target.value))}
                       className="w-12 h-8 text-xs md:text-sm text-center"
                     />
                     <span className="text-xs md:text-sm text-muted-foreground">of {totalPages}</span>
                   </div>
                   <Button
                     variant="outline"
                     size="icon"
                     className="h-8 w-8"
                     onClick={() => goToPage(currentPage + 1)}
                     disabled={currentPage === totalPages}
                   >
                     <ChevronRight className="h-4 w-4" />
                   </Button>
                   <Button
                     variant="outline"
                     size="icon"
                     className="h-8 w-8"
                     onClick={() => goToPage(totalPages)}
                     disabled={currentPage === totalPages}
                   >
                     <ChevronsRight className="h-4 w-4" />
                   </Button>
                 </div>
               </div>
             )}
           </CardContent>
         </Card>
 
        <div className="flex justify-end pt-2">
          <Button onClick={handleSave} size="lg" className="gap-2">
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      <SalespersonTargetDialog
        salesperson={selectedSalesperson}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </DashboardLayout>
  );
}