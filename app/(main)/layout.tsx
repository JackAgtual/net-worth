import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SidebarData } from "@/lib/types/sidebar-types";
import AppSidebar from "./components/app-sidebar";
import { signOut } from "@/lib/actions/auth-actions";

const sidebarData: SidebarData[] = [
  {
    group: "Your data",
    items: [
      { name: "Dashboard", href: "/dashboard" },
      { name: "Statements", href: "/statements" },
      { name: "Create statement", href: "/statements/create" },
    ],
  },
  {
    group: "Account",
    items: [
      { name: "Sign out", isAction: true, action: signOut },
      { name: "Settings", href: "#" },
    ],
  },
  {
    group: "Misc",
    items: [
      { name: "FAQ", href: "#" },
      { name: "User guide", href: "#" },
      { name: "Contact", href: "#" },
    ],
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar data={sidebarData} />
      {/* TODO: Fix trigger layout/positioning */}
      <SidebarTrigger />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
