import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { exportToExcel } from "@/lib/exportToExcel";

export function ExcelDownloadButton({ data, columns, filename = "report" }) {
  return (
    <Button
      variant="outline"
      size="sm"
      className="h-9 gap-2"
      onClick={() => exportToExcel(data, columns, filename)}
    >
      <Download className="h-4 w-4" />
      <span className="hidden sm:inline">Download Excel</span>
    </Button>
  );
}
