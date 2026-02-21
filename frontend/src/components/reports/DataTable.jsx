import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from "lucide-react";

export function DataTable({ 
  title, 
  subtitle, 
  columns, 
  data, 
  className, 
  onRowClick, 
  rowClickable,
  showPagination = true,
  pagination,
  onPageChange,
  extraActions
}) {
  const navigate = useNavigate();

  const [globalSearch, setGlobalSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  /* ================= SEARCH (current page only) ================= */
  const searchedData = useMemo(() => {
    if (!globalSearch.trim()) return data;

    const searchLower = globalSearch.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => {
        const cellValue = String(row[col.key] || "").toLowerCase();
        return cellValue.includes(searchLower);
      })
    );
  }, [data, globalSearch, columns]);

  /* ================= SORTING (current page only) ================= */
  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return searchedData;

    return [...searchedData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      const aNum = typeof aVal === "string"
        ? parseFloat(aVal.replace(/[₹,%,]/g, ""))
        : aVal;
      const bNum = typeof bVal === "string"
        ? parseFloat(bVal.replace(/[₹,%,]/g, ""))
        : bVal;

      if (!isNaN(aNum) && !isNaN(bNum)) {
        return sortConfig.direction === "asc"
          ? aNum - bNum
          : bNum - aNum;
      }

      const aStr = String(aVal || "").toLowerCase();
      const bStr = String(bVal || "").toLowerCase();

      return sortConfig.direction === "asc"
        ? aStr.localeCompare(bStr)
        : bStr.localeCompare(aStr);
    });
  }, [searchedData, sortConfig]);

  /* ================= SERVER PAGINATION ================= */
  const currentPage = pagination?.page || 1;
  const totalPages = pagination?.totalPages || 1;
  const totalRecords = pagination?.totalRecords || data.length;
  const perPage = pagination?.perPage || data.length;

  const handleSort = (columnKey) => {
    setSortConfig((prev) => {
      if (prev.key !== columnKey) {
        return { key: columnKey, direction: "asc" };
      }
      if (prev.direction === "asc") {
        return { key: columnKey, direction: "desc" };
      }
      return { key: null, direction: null };
    });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown className="h-3 w-3 opacity-50" />;
    }
    return sortConfig.direction === "asc"
      ? <ArrowUp className="h-3 w-3" />
      : <ArrowDown className="h-3 w-3" />;
  };

  const goToPage = (page) => {
    if (!onPageChange) return;
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  const handleRowClick = (row) => {
    if (row.drilldownUrl) {
      navigate(row.drilldownUrl);
    } else if (onRowClick) {
      onRowClick(row);
    }
  };

  return (
    <Card className={cn("shadow-card", className)}>
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="font-heading text-base md:text-lg">{title}</CardTitle>
              {subtitle && <p className="text-xs md:text-sm text-muted-foreground mt-1">{subtitle}</p>}
            </div>
           {extraActions}
          </div>

          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search in table..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="pl-9 h-9 bg-background border-input"
            />
          </div>

        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      "px-2 py-2 text-xs font-semibold text-muted-foreground uppercase",
                      col.sortable !== false && "cursor-pointer"
                    )}
                    onClick={() =>
                      col.sortable !== false && handleSort(col.key)
                    }
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {col.sortable !== false && getSortIcon(col.key)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {sortedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No data found
                  </td>
                </tr>
              ) : (
                sortedData.map((row, idx) => (
                  <tr
                    key={idx}
                    className={cn(
                      "border-b border-border hover:bg-muted/30 transition-colors",
                      (rowClickable || row.drilldownUrl) && "cursor-pointer"
                    )}
                    onClick={() => handleRowClick(row)}
                  >
                    {columns.map((col) => (
                      <td key={col.key} className="px-2 py-2 text-sm">
                        {col.render
                          ? col.render(row[col.key], row)
                          : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {showPagination && totalRecords > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t">

            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages} | Total {totalRecords} records
            </div>

            <div className="flex items-center gap-1">

              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
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
  );
}
