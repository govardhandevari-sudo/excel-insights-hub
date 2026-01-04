import { 
  LayoutDashboard, 
  TrendingUp, 
  FlaskConical, 
  CreditCard, 
  Users, 
  Building2, 
  UserCheck, 
  GitBranch,
  BarChart3
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import logo from "@/assets/logo.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Daily Revenue", url: "/revenue", icon: TrendingUp },
  { title: "Lab & Radiology", url: "/lab-rad", icon: FlaskConical },
  { title: "Payment Mode", url: "/payment-mode", icon: CreditCard },
  { title: "Avg Per Patient", url: "/avg-realisation", icon: Users },
  { title: "Dept Revenue", url: "/dept-revenue", icon: Building2 },
  { title: "Salesperson", url: "/salesperson", icon: UserCheck },
  { title: "Ref & Non-Ref", url: "/ref-nonref", icon: GitBranch },
  { title: "Dept Volume", url: "/dept-volume", icon: BarChart3 },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <img 
            src={logo} 
            alt="MegSan Logo" 
            className="w-10 h-10 rounded-lg object-cover"
          />
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-heading font-bold text-sidebar-foreground text-lg">
                MegSan
              </span>
              <span className="text-xs text-sidebar-foreground/60">
                Diagnostics
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 uppercase text-xs tracking-wider mb-2">
            Reports
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200"
                      activeClassName="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
