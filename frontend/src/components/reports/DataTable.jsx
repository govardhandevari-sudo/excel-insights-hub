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
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { ExcelDownloadButton } from "./ExcelDownloadButton";

export function DataTable({ 
  title, 
  subtitle, 
  columns, 
  data, 
  className, 
  onRowClick, 
  rowClickable,
  showPagination = true,
  defaultRowsPerPage = 10,
  exportFilename = "report"
}) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [globalSearch, setGlobalSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  // Global search filter
  const searchedData = useMemo(() => {
    if (!globalSearch.trim()) return data;
    
    const searchLower = globalSearch.toLowerCase();
    return data.filter((row) => {
      return columns.some((col) => {
        const cellValue = String(row[col.key] || "").toLowerCase();
        return cellValue.includes(searchLower);
      });
    });
  }, [data, globalSearch, columns]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortConfig.key || !sortConfig.direction) return searchedData;
    
    return [...searchedData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      // Handle numeric values
      const aNum = typeof aVal === 'string' ? parseFloat(aVal.replace(/[₹,%,]/g, '')) : aVal;
      const bNum = typeof bVal === 'string' ? parseFloat(bVal.replace(/[₹,%,]/g, '')) : bVal;
      
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
      }
      
      // String comparison
      const aStr = String(aVal || '').toLowerCase();
      const bStr = String(bVal || '').toLowerCase();
      
      if (sortConfig.direction === 'asc') {
        return aStr.localeCompare(bStr);
      }
      return bStr.localeCompare(aStr);
    });
  }, [searchedData, sortConfig]);

  // Pagination calculations
  const totalRows = sortedData.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalRows);
  const paginatedData = showPagination ? sortedData.slice(startIndex, endIndex) : sortedData;

  const handleRowClick = (row) => {
    if (row.drilldownUrl) {
      navigate(row.drilldownUrl);
    } else if (onRowClick) {
      onRowClick(row);
    }
  };

  const handleSort = (columnKey) => {
    setSortConfig((prev) => {
      if (prev.key !== columnKey) {
        return { key: columnKey, direction: 'asc' };
      }
      if (prev.direction === 'asc') {
        return { key: columnKey, direction: 'desc' };
      }
      return { key: null, direction: null };
    });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown className="h-3 w-3 opacity-50" />;
    }
    if (sortConfig.direction === 'asc') {
      return <ArrowUp className="h-3 w-3" />;
    }
    return <ArrowDown className="h-3 w-3" />;
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1);
  };

  const handleSearchChange = (value) => {
    setGlobalSearch(value);
    setCurrentPage(1);
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
            <ExcelDownloadButton data={data} columns={columns} filename={exportFilename} />
          </div>
          
          {/* Global Search */}
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search in table..."
              value={globalSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
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
                      "px-2 py-2 text-[10px] md:text-xs font-semibold text-muted-foreground uppercase tracking-tight",
                      col.align === "center" && "text-center",
                      col.align === "right" && "text-right",
                      !col.align && "text-left",
                      col.sortable !== false && "cursor-pointer hover:bg-muted/70 transition-colors select-none"
                    )}
                    onClick={() => col.sortable !== false && handleSort(col.key)}
                  >
                    <div className={cn(
                      "flex items-center gap-1",
                      col.align === "center" && "justify-center",
                      col.align === "right" && "justify-end"
                    )}>
                      {col.label}
                      {col.sortable !== false && getSortIcon(col.key)}
                    </div>
                  </th>
                ))}
              </tr>
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
                          "px-2 py-2 text-[11px] md:text-xs",
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
