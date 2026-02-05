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
import { Spinner } from "@/components/ui/spinner";
import { DialogClose } from "@radix-ui/react-dialog";
import { Dispatch, ReactNode, SetStateAction, useEffect } from "react";
import { FieldValues, UseFormReset } from "react-hook-form";

type EntryDialogProps<T extends FieldValues> = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  action: "edit" | "delete";
  onSubmit: () => Promise<void>;
  reset: UseFormReset<T>;
  data: T;
  isSubmitting: boolean;
  children?: ReactNode;
};

export default function EntryDialog<T extends FieldValues>({
  open,
  setOpen,
  action,
  onSubmit,
  reset,
  data,
  isSubmitting,
  children,
}: EntryDialogProps<T>) {
  useEffect(() => {
    if (open) {
      reset(data);
    }
  }, [open, data]);

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
            <Button
              type="submit"
              disabled={isSubmitting}
              variant={action === "delete" ? "destructive" : "default"}
            >
              {isSubmitting && <Spinner />}
              {action === "delete" ? "Delete" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
