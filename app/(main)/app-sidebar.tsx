import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

// TODO: Add as props to component
const sidebarData = [
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
      { name: "Sign out", href: "#" }, // should be a server action
      { name: "Settings", href: "#" },
    ],
  },
  {
    group: "Misc",
    items: [
      { name: "FAQ", href: "#" },
      { name: "How-to", href: "#" },
      { name: "Contact", href: "#" },
    ],
  },
];

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>Net Worth Tracker</SidebarHeader>
      <SidebarContent>
        {sidebarData.map(({ group, items }) => (
          <SidebarGroup key={group}>
            <SidebarGroupLabel>{group}</SidebarGroupLabel>
            <SidebarMenu>
              {items.map(({ name, href }) => (
                <SidebarMenuItem key={name}>
                  <SidebarMenuButton asChild>
                    <Link href={href}>{name}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
