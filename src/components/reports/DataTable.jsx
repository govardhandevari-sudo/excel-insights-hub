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
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, X } from "lucide-react";

export function DataTable({ 
  title, 
  subtitle, 
  columns, 
  data, 
  className, 
  onRowClick, 
  rowClickable,
  showPagination = true,
  showColumnFilters = true,
  defaultRowsPerPage = 10
}) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [columnFilters, setColumnFilters] = useState({});

  // Filter data based on column filters
  const filteredData = useMemo(() => {
    if (!showColumnFilters || Object.keys(columnFilters).length === 0) {
      return data;
    }
    
    return data.filter((row) => {
      return Object.entries(columnFilters).every(([key, filterValue]) => {
        if (!filterValue) return true;
        const cellValue = String(row[key] || "").toLowerCase();
        return cellValue.includes(filterValue.toLowerCase());
      });
    });
  }, [data, columnFilters, showColumnFilters]);

  // Pagination calculations
  const totalRows = filteredData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalRows);
  const paginatedData = showPagination ? filteredData.slice(startIndex, endIndex) : filteredData;

  const handleRowClick = (row) => {
    if (row.drilldownUrl) {
      navigate(row.drilldownUrl);
    } else if (onRowClick) {
      onRowClick(row);
    }
  };

  const handleColumnFilterChange = (columnKey, value) => {
    setColumnFilters(prev => ({
      ...prev,
      [columnKey]: value
    }));
    setCurrentPage(1);
  };

  const clearColumnFilters = () => {
    setColumnFilters({});
    setCurrentPage(1);
  };

  const hasActiveFilters = Object.values(columnFilters).some(v => v);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1);
  };

  return (
    <Card className={cn("shadow-card", className)}>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="font-heading text-base md:text-lg">{title}</CardTitle>
            {subtitle && <p className="text-xs md:text-sm text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearColumnFilters}
              className="h-8 px-2 text-muted-foreground hover:text-foreground self-start sm:self-auto"
            >
              <X className="h-4 w-4 mr-1" />
              Clear filters
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      "px-3 md:px-4 py-2 md:py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap",
                      col.align === "center" && "text-center",
                      col.align === "right" && "text-right",
                      !col.align && "text-left"
                    )}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
              {showColumnFilters && (
                <tr className="border-b border-border bg-muted/30">
                  {columns.map((col) => (
                    <th key={`filter-${col.key}`} className="px-2 md:px-3 py-2">
                      {col.filterable !== false && (
                        <div className="relative">
                          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-muted-foreground" />
                          <Input
                            placeholder="Filter..."
                            value={columnFilters[col.key] || ""}
                            onChange={(e) => handleColumnFilterChange(col.key, e.target.value)}
                            className="h-7 pl-7 pr-2 text-xs bg-background border-input w-full min-w-[80px]"
                          />
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              )}
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-8 text-center text-muted-foreground">
                    No data found
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, idx) => (
                  <tr 
                    key={idx} 
                    className={cn(
                      "border-b border-border last:border-0 hover:bg-muted/30 transition-colors",
                      row.isHeader && "bg-muted/50 font-semibold",
                      (row.drilldownUrl || rowClickable) && !row.isHeader && "cursor-pointer hover:bg-primary/5"
                    )}
                    onClick={() => !row.isHeader && handleRowClick(row)}
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          "px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm whitespace-nowrap",
                          col.align === "center" && "text-center",
                          col.align === "right" && "text-right",
                          !col.align && "text-left"
                        )}
                      >
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {showPagination && totalRows > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-3 md:px-4 py-3 border-t border-border bg-muted/20">
            <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
              <span>Rows per page:</span>
              <Select value={String(rowsPerPage)} onValueChange={handleRowsPerPageChange}>
                <SelectTrigger className="w-[70px] h-8 text-xs md:text-sm bg-background border-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border z-[100]">
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span className="hidden sm:inline">
                Showing {startIndex + 1}-{endIndex} of {totalRows}
              </span>
              <span className="sm:hidden">
                {startIndex + 1}-{endIndex}/{totalRows}
              </span>
            </div>
            
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
                  className="w-12 h-8 text-xs md:text-sm text-center bg-background border-input"
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
  );
}
