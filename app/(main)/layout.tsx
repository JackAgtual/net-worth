import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AppSidebar from "./app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      {/* TODO: Fix trigger layout/positioning */}
      <SidebarTrigger />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
