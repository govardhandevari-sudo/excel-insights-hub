 import { useState, useMemo } from "react";
 import { DashboardLayout } from "@/components/layout/DashboardLayout";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Input } from "@/components/ui/input";
 import { Button } from "@/components/ui/button";
 import { Checkbox } from "@/components/ui/checkbox";
 import { Label } from "@/components/ui/label";
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from "@/components/ui/select";
 import { useToast } from "@/hooks/use-toast";
 import { Save, Users, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
 
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
   const [duration, setDuration] = useState("monthly");
   const [stateFilter, setStateFilter] = useState("all");
   const [branchFilter, setBranchFilter] = useState("all");
   const [currentPage, setCurrentPage] = useState(1);
   const rowsPerPage = 10;
   const [selectedIds, setSelectedIds] = useState([]);
   const [targets, setTargets] = useState(
     initialSalespersons.reduce((acc, sp) => {
       acc[sp.id] = "";
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
 
   const handleTargetChange = (id, value) => {
     setTargets((prev) => ({ ...prev, [id]: value }));
   };
 
   const handleApplyBulkTarget = () => {
     if (!bulkTarget || selectedIds.length === 0) {
       toast({
         title: "Error",
         description: "Please select salespersons and enter a bulk target amount",
         variant: "destructive",
       });
       return;
     }
     setTargets((prev) => {
       const updated = { ...prev };
       selectedIds.forEach((id) => {
         updated[id] = bulkTarget;
       });
       return updated;
     });
     toast({
       title: "Bulk Target Applied",
       description: `Target of ₹${bulkTarget} applied to ${selectedIds.length} salesperson(s)`,
     });
   };
 
   const handleSave = () => {
     const targetsToSave = initialSalespersons
       .filter((sp) => targets[sp.id])
       .map((sp) => ({
         id: sp.id,
         name: sp.name,
         target: targets[sp.id],
         duration,
       }));
 
     if (targetsToSave.length === 0) {
       toast({
         title: "No Targets",
         description: "Please enter at least one target amount",
         variant: "destructive",
       });
       return;
     }
 
     // Here you would save to database
     console.log("Saving targets:", { duration, targets: targetsToSave });
     
     toast({
       title: "Targets Saved",
       description: `${targetsToSave.length} target(s) saved for ${duration} duration`,
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
               Set revenue targets for your sales team
             </p>
           </div>
           <div className="flex items-center gap-3">
             <Label className="text-sm font-medium">Duration:</Label>
             <Select value={duration} onValueChange={setDuration}>
               <SelectTrigger className="w-[140px]">
                 <SelectValue />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="weekly">Weekly</SelectItem>
                 <SelectItem value="monthly">Monthly</SelectItem>
                 <SelectItem value="quarterly">Quarterly</SelectItem>
               </SelectContent>
             </Select>
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
               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                 <span className="text-sm font-medium text-primary">
                   {selectedIds.length} selected
                 </span>
                 <div className="flex items-center gap-2 flex-1">
                   <Input
                     type="number"
                     placeholder="Enter bulk target amount"
                     value={bulkTarget}
                     onChange={(e) => setBulkTarget(e.target.value)}
                     className="w-full sm:w-48"
                   />
                   <Button size="sm" onClick={handleApplyBulkTarget}>
                     Apply to Selected
                   </Button>
                 </div>
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
                       Target Amount (₹)
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
                       <td className="px-4 py-3 text-sm font-medium">{sp.name}</td>
                       <td className="px-4 py-3 text-sm">{sp.branch}</td>
                       <td className="px-4 py-3 text-sm">{sp.region}</td>
                       <td className="px-4 py-3">
                         <Input
                           type="number"
                           placeholder="Enter target"
                           value={targets[sp.id]}
                           onChange={(e) => handleTargetChange(sp.id, e.target.value)}
                           className="w-32 h-8 text-sm"
                         />
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
             Save Targets
           </Button>
         </div>
       </div>
     </DashboardLayout>
   );
 }