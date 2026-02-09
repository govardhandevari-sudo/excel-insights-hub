/**
 * Export data to Excel/CSV format and trigger download
 */
export function exportToExcel(data, columns, filename = "report") {
  // Build CSV header
  const header = columns.map(col => col.label).join(",");
  
  // Build CSV rows
  const rows = data
    .filter(row => !row.isHeader)
    .map(row => {
      return columns.map(col => {
        let value = row[col.key];
        if (value === undefined || value === null) return "";
        // Remove currency symbols and special chars for clean export
        value = String(value).replace(/[₹]/g, "").trim();
        // Wrap in quotes if contains comma
        if (String(value).includes(",")) {
          value = `"${value}"`;
        }
        return value;
      }).join(",");
    });
  
  const csv = [header, ...rows].join("\n");
  
  // Add BOM for Excel compatibility
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
