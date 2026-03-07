"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import AssetDialog from "./asset-dialog";
import LiabilityDialog from "./liability-dialog";

export default function AddEntry({
  statementId,
  entryType,
}: {
  statementId: string;
  entryType: "asset" | "liability";
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button
        variant="outline"
        onClick={() => {
          setOpen(true);
        }}
      >
        {`Add ${entryType === "asset" ? "Asset" : "Liability"}`}
      </Button>
      {entryType === "asset" ? (
        <AssetDialog
          action="create"
          statementId={statementId}
          open={open}
          setOpen={setOpen}
        />
      ) : (
        <LiabilityDialog
          action="create"
          statementId={statementId}
          open={open}
          setOpen={setOpen}
        />
      )}
    </div>
  );
}
