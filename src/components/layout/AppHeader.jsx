import { Bell, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useState, useEffect } from "react";

export function AppHeader() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  return (
    <header className="sticky top-0 z-40 h-16 bg-card border-b border-border flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="h-9 w-9" />
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-muted-foreground hover:text-foreground"
          onClick={toggleDarkMode}
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-destructive rounded-full" />
        </Button>
        <div className="ml-2 h-9 w-9 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
          AD
        </div>
      </div>
    </header>
  );
}
