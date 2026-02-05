 import { useState } from "react";
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
 import { Save, Users } from "lucide-react";
 
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
   const [selectedIds, setSelectedIds] = useState([]);
   const [targets, setTargets] = useState(
     initialSalespersons.reduce((acc, sp) => {
       acc[sp.id] = "";
       return acc;
     }, {})
   );
   const [bulkTarget, setBulkTarget] = useState("");
 
   const allSelected = selectedIds.length === initialSalespersons.length;
   const someSelected = selectedIds.length > 0 && !allSelected;
 
   const handleSelectAll = (checked) => {
     if (checked) {
       setSelectedIds(initialSalespersons.map((sp) => sp.id));
     } else {
       setSelectedIds([]);
     }
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
               Sales Team ({initialSalespersons.length})
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
                   {initialSalespersons.map((sp, idx) => (
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
                       <td className="px-4 py-3 text-sm">{idx + 1}</td>
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
                   ))}
                 </tbody>
               </table>
             </div>
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