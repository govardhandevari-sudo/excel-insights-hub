import { useState, useEffect } from "react";
import {
  format,
  subDays,
  subMonths,
  startOfMonth,
  startOfYear,
} from "date-fns";
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
import { Input } from "@/components/ui/input";

export function ReportFilters({
  dropdowns = [],
  showDateRange = false,
  filters = {},
  onFilterChange,
}) {
  /* ================= SEARCH STATE ================= */
  const [searchMap, setSearchMap] = useState({});

  /* ================= DATE STATE ================= */
  const [open, setOpen] = useState(false);
  const [draftRange, setDraftRange] = useState({
    from: filters.fromDate || undefined,
    to: filters.toDate || undefined,
  });

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth < 640
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setDraftRange({
      from: filters.fromDate || undefined,
      to: filters.toDate || undefined,
    });
  }, [filters.fromDate, filters.toDate]);

  /* ================= DATE PRESETS ================= */
  const applyPreset = (type) => {
    const to = new Date();
    let from = new Date();

    if (type === "7d") from = subDays(to, 6);
    if (type === "1m") from = subMonths(to, 1);
    if (type === "3m") from = subMonths(to, 3);
    if (type === "month") from = startOfMonth(to);
    if (type === "year") from = startOfYear(to);

    setDraftRange({ from, to });
  };

  /* ================= CLEAR FILTERS ================= */
  const clearFilters = () => {
    dropdowns.forEach((d) => onFilterChange(d.key, ""));
    onFilterChange("fromDate", null);
    onFilterChange("toDate", null);
    setSearchMap({});
  };

  const hasActiveFilters = Object.values(filters).some(
    (v) => v !== "" && v !== null && v !== undefined
  );

  return (
    <div className="w-full flex flex-col lg:flex-row lg:flex-wrap gap-3 p-4 bg-card rounded-lg border border-border shadow-sm">

      {/* Header */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span className="font-medium">Filters</span>
      </div>

      {/* ================= DROPDOWNS ================= */}
      {dropdowns.map((dropdown) => {
        const searchValue = searchMap[dropdown.key] || "";

        const filteredOptions = searchValue
          ? dropdown.options.filter((opt) =>
              String(opt[dropdown.optionLabel])
                .toLowerCase()
                .includes(searchValue.toLowerCase())
            )
          : dropdown.options;

        return (
          <Select
            key={dropdown.key}
            value={filters[dropdown.key] || "__all__"}
            onValueChange={(v) => {
              const value = v === "__all__" ? "" : v;

              onFilterChange(dropdown.key, value);

              // ✅ CLEAR SEARCH AFTER SELECTION
              setSearchMap((prev) => ({
                ...prev,
                [dropdown.key]: "",
              }));
            }}
          >
            <SelectTrigger className="w-full lg:w-[180px] h-10 text-sm">
              <SelectValue placeholder={dropdown.label} />
            </SelectTrigger>

            <SelectContent className="max-h-[300px] overflow-y-auto">

              {/* Search Box */}
              {dropdown.options.length > 10 && (
                <div className="sticky top-0 bg-popover p-2 border-b border-border z-10">
                  <Input
                    autoFocus
                    placeholder="Search..."
                    value={searchValue}
                    onChange={(e) =>
                      setSearchMap((prev) => ({
                        ...prev,
                        [dropdown.key]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                </div>
              )}

              <SelectItem value="__all__">All</SelectItem>

              {filteredOptions.map((opt) => (
                <SelectItem
                  key={opt[dropdown.optionValue]}
                  value={String(opt[dropdown.optionValue])}
                >
                  {opt[dropdown.optionLabel]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      })}

      {/* ================= DATE RANGE ================= */}
      {showDateRange && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full lg:w-[280px] h-10 justify-start text-left"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.fromDate ? (
                filters.toDate ? (
                  <>
                    {format(filters.fromDate, "dd MMM yyyy")} -{" "}
                    {format(filters.toDate, "dd MMM yyyy")}
                  </>
                ) : (
                  format(filters.fromDate, "dd MMM yyyy")
                )
              ) : (
                "Select date range"
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent
            align="start"
            className="w-[95vw] sm:w-[650px] max-w-[95vw] p-4 space-y-4"
          >
            {/* Presets */}
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
              <Button size="sm" variant="secondary" onClick={() => applyPreset("7d")}>Last 7 Days</Button>
              <Button size="sm" variant="secondary" onClick={() => applyPreset("1m")}>Last 1 Month</Button>
              <Button size="sm" variant="secondary" onClick={() => applyPreset("3m")}>Last 3 Months</Button>
              <Button size="sm" variant="secondary" onClick={() => applyPreset("month")}>This Month</Button>
              <Button size="sm" variant="secondary" onClick={() => applyPreset("year")}>This Year</Button>
            </div>

            {/* Calendar */}
            <div className="flex justify-center">
              <Calendar
                mode="range"
                selected={draftRange}
                onSelect={(range) => setDraftRange(range || {})}
                numberOfMonths={isMobile ? 1 : 2}
                captionLayout="dropdown"
                className="w-full max-w-[600px]"
              />
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-3 border-t border-border">
              <Button
                size="sm"
                variant="ghost"
                className="w-full sm:w-auto"
                onClick={() => {
                  setDraftRange({
                    from: filters.fromDate || undefined,
                    to: filters.toDate || undefined,
                  });
                  setOpen(false);
                }}
              >
                Cancel
              </Button>

              <Button
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => {
                  onFilterChange("fromDate", draftRange?.from || null);
                  onFilterChange("toDate", draftRange?.to || null);
                  setOpen(false);
                }}
              >
                Apply
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}

      {/* ================= CLEAR BUTTON ================= */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full lg:w-auto"
          onClick={clearFilters}
        >
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}
