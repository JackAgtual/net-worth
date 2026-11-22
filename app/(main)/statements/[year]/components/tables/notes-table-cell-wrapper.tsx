import { ReactNode } from "react";

export function NotesTableCellWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="w-40 whitespace-normal wrap-break-word">{children}</div>
  );
}
