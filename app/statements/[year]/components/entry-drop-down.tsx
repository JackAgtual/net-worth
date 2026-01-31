"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LiabilityForm } from "@/lib/types/liability-types";
import { MoreHorizontalIcon } from "lucide-react";
import { useState } from "react";
import EntryDialog from "./entry-dialog";
import { AssetForm } from "@/lib/types/asset-types";

type EntryDropDownProps = {
  id: string;
} & (
  | { entityType: "asset"; data: AssetForm }
  | { entityType: "liability"; data: LiabilityForm }
);

export default function EntryDropDown({
  id,
  entityType,
  data,
}: EntryDropDownProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <MoreHorizontalIcon />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {entityType === "asset" ? ( // needed for TS
        <>
          <EntryDialog
            open={editOpen}
            setOpen={setEditOpen}
            id={id}
            entityType={entityType}
            action="edit"
            data={data}
          />
          <EntryDialog
            open={deleteOpen}
            setOpen={setDeleteOpen}
            id={id}
            entityType={entityType}
            action="delete"
          />
        </>
      ) : (
        <>
          <EntryDialog
            open={editOpen}
            setOpen={setEditOpen}
            id={id}
            entityType={entityType}
            action="edit"
            data={data}
          />
          <EntryDialog
            open={deleteOpen}
            setOpen={setDeleteOpen}
            id={id}
            entityType={entityType}
            action="delete"
          />
        </>
      )}
    </>
  );
}
