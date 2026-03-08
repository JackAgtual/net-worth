import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { signOut } from "@/lib/actions/auth-actions";
import { SidebarData } from "@/lib/types/sidebar-types";
import AppSidebar from "./components/app-sidebar";
import MobileSidebarTrigger from "./components/mobile-sidebar-trigger";

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
      <SidebarInset>
        <MobileSidebarTrigger />
        <div className="px-6 py-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
