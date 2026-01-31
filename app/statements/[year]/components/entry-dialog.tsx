"use client";

import AssetForm from "@/components/form/asset-form";
import LiabilityForm from "@/components/form/liability-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AssetForm as TAssetForm } from "@/lib/types/asset-types";
import { LiabilityForm as TLiabilityForm } from "@/lib/types/liability-types";
import { DialogClose } from "@radix-ui/react-dialog";
import { Dispatch, SetStateAction } from "react";

type BaseDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  id: string;
  action: "edit" | "delete";
};

type DialogProps = BaseDialogProps &
  (
    | { entityType: "asset"; data?: TAssetForm }
    | { entityType: "liability"; data?: TLiabilityForm }
  );

export default function EntryDialog({
  open,
  setOpen,
  id,
  entityType,
  action,
  data,
}: DialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        {/* TODO: Form action */}
        <form>
          <DialogHeader>
            <DialogTitle>{action === "delete" ? "Delete" : "Edit"}</DialogTitle>
            <DialogDescription>
              {action === "delete"
                ? "Are you sure you want to delete this? This action caonnot be undone."
                : "Make changes and click save when you're done."}
            </DialogDescription>
          </DialogHeader>
          {action === "edit" &&
            (entityType === "liability" ? (
              <LiabilityForm data={data} />
            ) : (
              <AssetForm data={data} />
            ))}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            {action === "delete" ? (
              <Button type="submit" variant="destructive">
                Delete
              </Button>
            ) : (
              <Button type="submit">Save</Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
