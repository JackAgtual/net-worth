"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

export function MobileSidebarTrigger() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <SidebarTrigger />;
  }
}
