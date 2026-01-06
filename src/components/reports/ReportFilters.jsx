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
  const [dateRange, setDateRange] = useState({
    from: filters.dateFrom || undefined,
    to: filters.dateTo || undefined,
  });

  const handleFilterChange = (key, value) => {
    onFilterChange?.({ ...filters, [key]: value });
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range || { from: undefined, to: undefined });
    onFilterChange?.({ 
      ...filters, 
      dateFrom: range?.from || null, 
      dateTo: range?.to || null 
    });
  };

  const clearFilters = () => {
    setDateRange({ from: undefined, to: undefined });
    onFilterChange?.({});
  };

  const hasActiveFilters = Object.values(filters).some(v => v && v !== "all");

  return (
    <div className="flex flex-wrap gap-2 md:gap-3 items-center p-3 md:p-4 bg-card rounded-lg border border-border shadow-sm">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span className="hidden sm:inline font-medium">Filters:</span>
      </div>

      {showState && (
        <Select
          value={filters.state || "all"}
          onValueChange={(v) => handleFilterChange("state", v)}
        >
          <SelectTrigger className="w-[130px] md:w-[150px] h-9 text-sm bg-background border-input">
            <SelectValue placeholder="State" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border z-[100]">
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
          <SelectTrigger className="w-[130px] md:w-[150px] h-9 text-sm bg-background border-input">
            <SelectValue placeholder="Branch" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border z-[100]">
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
          <SelectTrigger className="w-[140px] md:w-[160px] h-9 text-sm bg-background border-input">
            <SelectValue placeholder="Salesperson" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border z-[100]">
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
          <SelectTrigger className="w-[140px] md:w-[160px] h-9 text-sm bg-background border-input">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border z-[100]">
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
          <SelectTrigger className="w-[150px] md:w-[170px] h-9 text-sm bg-background border-input">
            <SelectValue placeholder="Payment Mode" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border z-[100]">
            {paymentModes.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {showDateRange && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[200px] md:w-[280px] h-9 justify-start text-left text-sm font-normal bg-background border-input",
                !dateRange.from && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, "dd MMM yyyy")} - {format(dateRange.to, "dd MMM yyyy")}
                  </>
                ) : (
                  format(dateRange.from, "dd MMM yyyy")
                )
              ) : (
                "Select date range"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-popover border-border z-[100]" align="start">
            <Calendar
              mode="range"
              selected={dateRange}
              onSelect={handleDateRangeChange}
              numberOfMonths={2}
              initialFocus
              className="pointer-events-auto p-3"
            />
          </PopoverContent>
        </Popover>
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
