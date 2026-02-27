import { useEffect, useMemo, useState } from "react";
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
import { api } from "@/services/api";

export default function SalespersonTargets() {
  const { toast } = useToast();

  const [filters, setFilters] = useState({
    stateid: "all",
    cityid: "all",
    centreid: "all",
    search: "",
  });

  const [masters, setMasters] = useState({
    states: [],
    cities: [],
    centres: [],
  });

  const [salespersons, setSalespersons] = useState([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedSalesperson, setSelectedSalesperson] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [targetDates, setTargetDates] = useState({});

  useEffect(() => {
    api
      .get("/salesperson-targets/filters", {
        params: {
          stateid: filters.stateid !== "all" ? filters.stateid : undefined,
          cityid: filters.cityid !== "all" ? filters.cityid : undefined,
        },
      })
      .then((res) => {
        const f = res.data?.data?.filters || {};
        setMasters({
          states: f.states || [],
          cities: f.cities || [],
          centres: f.centres || [],
        });
      })
      .catch(() => {
        toast({
          title: "Failed to load filters",
          description: "Unable to fetch state/city/centre filters",
          variant: "destructive",
        });
      });
  }, [filters.stateid, filters.cityid]);

  useEffect(() => {
    setLoading(true);

    api
      .get("/salesperson-targets/salespersons", {
        params: {
          stateid: filters.stateid !== "all" ? filters.stateid : undefined,
          cityid: filters.cityid !== "all" ? filters.cityid : undefined,
          centreid: filters.centreid !== "all" ? filters.centreid : undefined,
          search: filters.search || undefined,
        },
      })
      .then((res) => {
        setSalespersons(res.data?.data?.rows || []);
        setCurrentPage(1);
        setSelectedIds([]);
      })
      .catch(() => {
        toast({
          title: "Failed to load salespersons",
          description: "Unable to fetch salesperson list",
          variant: "destructive",
        });
      })
      .finally(() => setLoading(false));
  }, [filters.stateid, filters.cityid, filters.centreid, filters.search]);

  useEffect(() => {
    setTargetDates((prev) => {
      const next = { ...prev };
      salespersons.forEach((sp) => {
        if (!(sp.id in next)) next[sp.id] = undefined;
      });
      return next;
    });
  }, [salespersons]);

  const totalPages = Math.max(1, Math.ceil(salespersons.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, salespersons.length);
  const paginatedSalespersons = useMemo(
    () => salespersons.slice(startIndex, endIndex),
    [salespersons, startIndex, endIndex]
  );

  const allSelected = selectedIds.length === salespersons.length && salespersons.length > 0;
  const someSelected = selectedIds.length > 0 && !allSelected;

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedIds(salespersons.map((sp) => sp.id));
    } else {
      setSelectedIds([]);
    }
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

  const handleSave = () => {
    const salespersonsWithDates = salespersons.filter((sp) => targetDates[sp.id]);

    if (salespersonsWithDates.length === 0) {
      toast({
        title: "No Dates Set",
        description: "Please set target dates for at least one salesperson",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Saved",
      description: `${salespersonsWithDates.length} salesperson date(s) prepared`,
    });
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-4 max-h-screen overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-heading font-bold text-foreground">Salesperson Targets</h1>
            <p className="text-sm text-muted-foreground mt-1">Click on a salesperson name to manage their targets</p>
          </div>
        </div>

        <Card>
          <CardContent className="py-3 px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="space-y-1">
                <Label className="text-sm">State</Label>
                <Select
                  value={filters.stateid}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, stateid: value, cityid: "all", centreid: "all" }))
                  }
                >
                  <SelectTrigger><SelectValue placeholder="All States" /></SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="all">All States</SelectItem>
                    {masters.states.map((state) => (
                      <SelectItem key={state.id} value={String(state.id)}>{state.state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-sm">City</Label>
                <Select
                  value={filters.cityid}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, cityid: value, centreid: "all" }))}
                >
                  <SelectTrigger><SelectValue placeholder="All Cities" /></SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="all">All Cities</SelectItem>
                    {masters.cities.map((city) => (
                      <SelectItem key={city.id} value={String(city.id)}>{city.city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-sm">Centre</Label>
                <Select
                  value={filters.centreid}
                  onValueChange={(value) => setFilters((prev) => ({ ...prev, centreid: value }))}
                >
                  <SelectTrigger><SelectValue placeholder="All Centres" /></SelectTrigger>
                  <SelectContent className="bg-popover z-50">
                    <SelectItem value="all">All Centres</SelectItem>
                    {masters.centres.map((centre) => (
                      <SelectItem key={centre.centreid} value={String(centre.centreid)}>{centre.centre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-sm">Search</Label>
                <Input
                  placeholder="Search salesperson"
                  value={filters.search}
                  onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                />
              </div>
            </div>
            <div className="text-sm text-muted-foreground pt-3">{salespersons.length} salesperson(s)</div>
          </CardContent>
        </Card>

        {selectedIds.length > 0 && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="py-3 px-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-primary">{selectedIds.length} selected</span>
                <span className="text-sm text-muted-foreground">Click on names to set individual targets</span>
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
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">S.No</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Salesperson</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Branch</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">State</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase">Target Date</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Loading salespersons...</td></tr>
                  ) : paginatedSalespersons.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No salespersons found</td></tr>
                  ) : (
                    paginatedSalespersons.map((sp, idx) => (
                      <tr key={sp.id} className="border-b border-border hover:bg-muted/30">
                        <td className="px-4 py-3">
                          <Checkbox checked={selectedIds.includes(sp.id)} onCheckedChange={(checked) => handleSelectOne(sp.id, checked)} aria-label={`Select ${sp.name}`} />
                        </td>
                        <td className="px-4 py-3 text-sm">{startIndex + idx + 1}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => handleSalespersonClick(sp)} className="text-sm font-medium text-primary hover:underline cursor-pointer text-left">{sp.name}</button>
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
                                {targetDates[sp.id] ? format(targetDates[sp.id], "dd MMM yyyy") : "Pick date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={targetDates[sp.id]} onSelect={(date) => handleTargetDateChange(sp.id, date)} initialFocus className="p-3 pointer-events-auto" />
                            </PopoverContent>
                          </Popover>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {salespersons.length > rowsPerPage && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-border bg-muted/20">
                <span className="text-xs md:text-sm text-muted-foreground">Showing {startIndex + 1}-{endIndex} of {salespersons.length}</span>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => goToPage(1)} disabled={currentPage === 1}><ChevronsLeft className="h-4 w-4" /></Button>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
                  <div className="flex items-center gap-1 mx-2">
                    <span className="text-xs md:text-sm text-muted-foreground">Page</span>
                    <Input type="number" min={1} max={totalPages} value={currentPage} onChange={(e) => goToPage(Number(e.target.value))} className="w-12 h-8 text-xs md:text-sm text-center" />
                    <span className="text-xs md:text-sm text-muted-foreground">of {totalPages}</span>
                  </div>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}><ChevronRight className="h-4 w-4" /></Button>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}><ChevronsRight className="h-4 w-4" /></Button>
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

      <SalespersonTargetDialog salesperson={selectedSalesperson} open={dialogOpen} onOpenChange={setDialogOpen} />
    </DashboardLayout>
  );
}