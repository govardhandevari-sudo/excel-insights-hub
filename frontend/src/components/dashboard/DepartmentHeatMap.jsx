import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const departments = ["MRI", "CT", "USG", "Lab", "ECG", "X-Ray"];
const branches = ["Punjagutta", "Kompally", "KPHB", "MBNR", "Nalgonda", "Bangalore"];

const heatmapData = [
  [85, 72, 90, 78, 65, 92],
  [78, 88, 75, 82, 70, 85],
  [92, 80, 88, 75, 82, 90],
  [65, 72, 68, 88, 75, 78],
  [70, 65, 72, 80, 85, 75],
  [95, 88, 92, 85, 78, 98],
];

const getColor = (value) => {
  if (value >= 90) return "bg-success";
  if (value >= 80) return "bg-chart-1";
  if (value >= 70) return "bg-chart-2";
  if (value >= 60) return "bg-warning";
  return "bg-destructive";
};

const getOpacity = (value) => {
  const normalized = (value - 50) / 50;
  return Math.max(0.4, Math.min(1, normalized));
};

export function DepartmentHeatMap() {
  const navigate = useNavigate();

  const handleCellClick = (branch, dept) => {
    navigate(`/dept-revenue?branch=${branch.toLowerCase()}&dept=${dept.toLowerCase()}`);
  };

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <CardTitle className="font-heading text-base md:text-lg">Department Performance Heat Map</CardTitle>
        <p className="text-xs text-muted-foreground">Achievement % - Click cells to drill down</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[400px]">
            {/* Header */}
            <div className="grid gap-1 mb-1" style={{ gridTemplateColumns: `80px repeat(${departments.length}, 1fr)` }}>
              <div className="text-xs font-medium text-muted-foreground"></div>
              {departments.map((dept) => (
                <div key={dept} className="text-xs font-medium text-muted-foreground text-center p-1 truncate">
                  {dept}
                </div>
              ))}
            </div>
            
            {/* Rows */}
            {branches.map((branch, rowIdx) => (
              <div 
                key={branch} 
                className="grid gap-1 mb-1" 
                style={{ gridTemplateColumns: `80px repeat(${departments.length}, 1fr)` }}
              >
                <div className="text-xs font-medium text-muted-foreground flex items-center truncate pr-1">
                  {branch}
                </div>
                {heatmapData[rowIdx].map((value, colIdx) => (
                  <div
                    key={`${rowIdx}-${colIdx}`}
                    className={cn(
                      "aspect-square md:aspect-auto md:h-10 rounded flex items-center justify-center text-xs font-semibold cursor-pointer transition-transform hover:scale-105",
                      getColor(value)
                    )}
                    style={{ opacity: getOpacity(value) }}
                    onClick={() => handleCellClick(branch, departments[colIdx])}
                    title={`${branch} - ${departments[colIdx]}: ${value}%`}
                  >
                    <span className="text-white text-[10px] md:text-xs">{value}%</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-success" />
            <span className="text-muted-foreground">90%+</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-chart-1" />
            <span className="text-muted-foreground">80-89%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-chart-2" />
            <span className="text-muted-foreground">70-79%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-warning" />
            <span className="text-muted-foreground">60-69%</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-destructive" />
            <span className="text-muted-foreground">&lt;60%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
