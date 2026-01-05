import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const branches = [
  { value: "all", label: "All Branches" },
  { value: "punjagutta", label: "Punjagutta" },
  { value: "kompally", label: "Kompally" },
  { value: "kphb", label: "KPHB" },
  { value: "mbnr", label: "MBNR" },
  { value: "nalgonda", label: "Nalgonda" },
  { value: "nizamabad", label: "Nizamabad" },
  { value: "medak", label: "Medak" },
  { value: "sangareddy", label: "Sangareddy" },
  { value: "santhanu", label: "Santhanu" },
  { value: "jagtial", label: "Jagtial" },
  { value: "rajahmundry", label: "Rajahmundry" },
  { value: "bangalore", label: "Bangalore" },
];

const states = [
  { value: "all", label: "All States" },
  { value: "TS", label: "Telangana" },
  { value: "AP", label: "Andhra Pradesh" },
  { value: "KA", label: "Karnataka" },
];

const salespersons = [
  { value: "all", label: "All Salespersons" },
  { value: "nagesh", label: "Nagesh" },
  { value: "ganesh", label: "Ganesh/Rakesh" },
  { value: "prasanth", label: "Prasanth" },
  { value: "ramakrishna", label: "Ramakrishna" },
  { value: "mallikarjun", label: "Mallikarjun" },
  { value: "uma", label: "Uma" },
  { value: "srinivas", label: "Srinivas E" },
  { value: "murali", label: "Murali" },
  { value: "sujeeth", label: "Sujeeth" },
  { value: "sujith", label: "Dr. Sujith" },
  { value: "satish", label: "Satish" },
  { value: "sreenath", label: "Dr. Sreenath" },
];

const departments = [
  { value: "all", label: "All Departments" },
  { value: "pathology", label: "Pathology" },
  { value: "radiology", label: "Radiology" },
  { value: "cardiology", label: "Cardiology" },
  { value: "neurology", label: "Neurology" },
  { value: "biochemistry", label: "Biochemistry" },
  { value: "microbiology", label: "Microbiology" },
];

const paymentModes = [
  { value: "all", label: "All Payment Modes" },
  { value: "cash", label: "Cash" },
  { value: "card", label: "Card" },
  { value: "upi", label: "UPI" },
  { value: "insurance", label: "Insurance" },
  { value: "credit", label: "Credit" },
];

export function ReportFilters({
  showBranch = false,
  showState = false,
  showSalesperson = false,
  showDepartment = false,
  showPaymentMode = false,
  showDateRange = false,
  filters = {},
  onFilterChange,
}) {
  const [dateFrom, setDateFrom] = useState(filters.dateFrom || null);
  const [dateTo, setDateTo] = useState(filters.dateTo || null);

  const handleFilterChange = (key, value) => {
    onFilterChange?.({ ...filters, [key]: value });
  };

  const handleDateFromChange = (date) => {
    setDateFrom(date);
    onFilterChange?.({ ...filters, dateFrom: date });
  };

  const handleDateToChange = (date) => {
    setDateTo(date);
    onFilterChange?.({ ...filters, dateTo: date });
  };

  const clearFilters = () => {
    setDateFrom(null);
    setDateTo(null);
    onFilterChange?.({});
  };

  const hasActiveFilters = Object.values(filters).some(v => v && v !== "all");

  return (
    <div className="flex flex-wrap gap-2 md:gap-3 items-center p-3 md:p-4 bg-muted/30 rounded-lg border border-border/50">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span className="hidden sm:inline font-medium">Filters:</span>
      </div>

      {showState && (
        <Select
          value={filters.state || "all"}
          onValueChange={(v) => handleFilterChange("state", v)}
        >
          <SelectTrigger className="w-[130px] md:w-[150px] h-9 text-sm bg-background">
            <SelectValue placeholder="State" />
          </SelectTrigger>
          <SelectContent className="bg-background border-border z-50">
            {states.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {showBranch && (
        <Select
          value={filters.branch || "all"}
          onValueChange={(v) => handleFilterChange("branch", v)}
        >
          <SelectTrigger className="w-[130px] md:w-[150px] h-9 text-sm bg-background">
            <SelectValue placeholder="Branch" />
          </SelectTrigger>
          <SelectContent className="bg-background border-border z-50">
            {branches.map((b) => (
              <SelectItem key={b.value} value={b.value}>
                {b.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {showSalesperson && (
        <Select
          value={filters.salesperson || "all"}
          onValueChange={(v) => handleFilterChange("salesperson", v)}
        >
          <SelectTrigger className="w-[140px] md:w-[160px] h-9 text-sm bg-background">
            <SelectValue placeholder="Salesperson" />
          </SelectTrigger>
          <SelectContent className="bg-background border-border z-50">
            {salespersons.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {showDepartment && (
        <Select
          value={filters.department || "all"}
          onValueChange={(v) => handleFilterChange("department", v)}
        >
          <SelectTrigger className="w-[140px] md:w-[160px] h-9 text-sm bg-background">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent className="bg-background border-border z-50">
            {departments.map((d) => (
              <SelectItem key={d.value} value={d.value}>
                {d.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {showPaymentMode && (
        <Select
          value={filters.paymentMode || "all"}
          onValueChange={(v) => handleFilterChange("paymentMode", v)}
        >
          <SelectTrigger className="w-[150px] md:w-[170px] h-9 text-sm bg-background">
            <SelectValue placeholder="Payment Mode" />
          </SelectTrigger>
          <SelectContent className="bg-background border-border z-50">
            {paymentModes.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {showDateRange && (
        <>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[120px] md:w-[140px] h-9 justify-start text-left text-sm font-normal bg-background",
                  !dateFrom && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFrom ? format(dateFrom, "dd MMM") : "From"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-background border-border z-50" align="start">
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={handleDateFromChange}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[120px] md:w-[140px] h-9 justify-start text-left text-sm font-normal bg-background",
                  !dateTo && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateTo ? format(dateTo, "dd MMM") : "To"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-background border-border z-50" align="start">
              <Calendar
                mode="single"
                selected={dateTo}
                onSelect={handleDateToChange}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </>
      )}

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="h-9 px-2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}
