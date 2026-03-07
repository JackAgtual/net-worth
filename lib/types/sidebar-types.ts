type SidebarItemBase = { name: string };

type SidebarItemLink = SidebarItemBase & {
  isAction?: false;
  href: string;
  action?: never;
};

type SidebarItemAction = SidebarItemBase & {
  isAction: true;
  href?: never;
  action: () => Promise<void>;
};

export type SidebarItem = SidebarItemLink | SidebarItemAction;

export type SidebarData = {
  group: string;
  items: SidebarItem[];
};
