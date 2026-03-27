import { GraduationCap, FileText, Heart, Landmark, Mail, Home as HomeIcon, ChevronDown, ClipboardList } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import smythsLogo from "@/assets/smyths-logo.png";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const docPolicyItems = [
    { title: t("sidebar_regulation_code"), icon: FileText },
    { title: t("sidebar_health_insurance"), icon: Heart },
    { title: t("sidebar_provident_insurance"), icon: Landmark },
    { title: t("sidebar_digiposte_logement"), icon: Mail },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarContent className="bg-sidebar-background">
        {/* Logo */}
        <div className={`flex items-center gap-2 px-3 py-3 border-b border-sidebar-border ${collapsed ? "justify-center" : ""}`}>
          <img src={smythsLogo} alt="Smyths" className="w-7 h-7 object-contain" />
          {!collapsed && <span className="font-bold text-sm text-sidebar-foreground">Smyths 360</span>}
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Home */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigate("/dashboard")}
                  isActive={location.pathname === "/dashboard"}
                  className="gap-2"
                >
                  <HomeIcon className="w-4 h-4" />
                  {!collapsed && <span>{t("sidebar_home")}</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Learning - enabled */}
              <SidebarMenuItem>
                <SidebarMenuButton className="gap-2">
                  <GraduationCap className="w-4 h-4" />
                  {!collapsed && <span>{t("learning")}</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Documents & Policies */}
              {!collapsed && (
                <Collapsible defaultOpen className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="gap-2">
                        <FileText className="w-4 h-4" />
                        <span className="flex-1 text-left">{t("sidebar_docs_policies")}</span>
                        <ChevronDown className="w-3.5 h-3.5 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {docPolicyItems.map((item) => (
                          <SidebarMenuSubItem key={item.title}>
                            <SidebarMenuSubButton className="gap-2 text-xs cursor-pointer hover:bg-sidebar-accent">
                              <item.icon className="w-3.5 h-3.5" />
                              <span>{item.title}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              )}

              {/* Contract (Manager only) */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => navigate("/contracts")}
                  isActive={location.pathname.startsWith("/contracts")}
                  className="gap-2"
                >
                  <ClipboardList className="w-4 h-4" />
                  {!collapsed && <span>{t("sidebar_contracts_manager")}</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
