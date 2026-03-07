import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { SidebarItem as TSidebarItem } from "@/lib/types/sidebar-types";
import Link from "next/link";

export default function SidebarItem({ data }: { data: TSidebarItem }) {
  const { name, isAction, href, action } = data;
  return (
    <SidebarMenuItem>
      {isAction ? (
        <form action={action}>
          <SidebarMenuButton type="submit" className="cursor-pointer">
            {name}
          </SidebarMenuButton>
        </form>
      ) : (
        <SidebarMenuButton asChild>
          <Link href={href}>{name}</Link>
        </SidebarMenuButton>
      )}
    </SidebarMenuItem>
  );
}
