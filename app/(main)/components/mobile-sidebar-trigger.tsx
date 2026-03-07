"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

export default function MobileSidebarTrigger() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <SidebarTrigger />;
  }
}
