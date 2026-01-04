import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export function DataTable({ title, subtitle, columns, data, className, onRowClick, rowClickable }) {
  const navigate = useNavigate();

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
        <div>
          <CardTitle className="font-heading text-base md:text-lg">{title}</CardTitle>
          {subtitle && <p className="text-xs md:text-sm text-muted-foreground mt-1">{subtitle}</p>}
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
            </thead>
            <tbody>
              {data.map((row, idx) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
