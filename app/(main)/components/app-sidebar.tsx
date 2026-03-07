import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { SidebarData } from "@/lib/types/sidebar-types";
import SidebarItem from "./sidebar-item";

export default function AppSidebar({ data }: { data: SidebarData[] }) {
  return (
    <Sidebar>
      <SidebarHeader>Net Worth Tracker</SidebarHeader>
      <SidebarContent>
        {data.map(({ group, items }) => (
          <SidebarGroup key={group}>
            <SidebarGroupLabel>{group}</SidebarGroupLabel>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarItem data={item} key={item.name} />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
