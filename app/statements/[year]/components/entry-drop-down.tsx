"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AssetForm } from "@/lib/types/asset-types";
import { LiabilityForm } from "@/lib/types/liability-types";
import { MoreHorizontalIcon } from "lucide-react";
import { useState } from "react";
import AssetDialog from "./asset-dialog";
import LiabilityDialog from "./liability-dialog";

type EntryDropDownProps = {
  entryId: string;
  statementId: string;
} & (
  | { entityType: "asset"; data: AssetForm }
  | { entityType: "liability"; data: LiabilityForm }
);

export default function EntryDropDown({
  entryId,
  statementId,
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

      {entityType === "asset" ? (
        <>
          <AssetDialog
            open={editOpen}
            setOpen={setEditOpen}
            action="edit"
            assetId={entryId}
            statementId={statementId}
            data={data}
          />
          <AssetDialog
            open={deleteOpen}
            setOpen={setDeleteOpen}
            action="delete"
            assetId={entryId}
            statementId={statementId}
          />
        </>
      ) : (
        <>
          <LiabilityDialog
            open={editOpen}
            setOpen={setEditOpen}
            action="edit"
            liabilityId={entryId}
            statementId={statementId}
            data={data}
          />
          <LiabilityDialog
            open={deleteOpen}
            setOpen={setDeleteOpen}
            action="delete"
            liabilityId={entryId}
            statementId={statementId}
            data={data}
          />
        </>
      )}
    </>
  );
}
