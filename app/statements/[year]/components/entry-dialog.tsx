"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { Dispatch, ReactNode, SetStateAction } from "react";

type EntryDialogProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  action: "edit" | "delete";
  onSubmit: () => Promise<void>;
  children?: ReactNode;
};

export default function EntryDialog({
  open,
  setOpen,
  action,
  onSubmit,
  children,
}: EntryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>{action === "delete" ? "Delete" : "Edit"}</DialogTitle>
            <DialogDescription>
              {action === "delete"
                ? "Are you sure you want to delete this? This action caonnot be undone."
                : "Make changes and click save when you're done."}
            </DialogDescription>
          </DialogHeader>
          {children}
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
