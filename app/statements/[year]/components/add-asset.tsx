"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import AssetDialog from "./asset-dialog";

export default function AddAsset({ statementId }: { statementId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button
        variant="outline"
        onClick={() => {
          setOpen(true);
        }}
      >
        Add Asset
      </Button>
      <AssetDialog
        action="create"
        statementId={statementId}
        open={open}
        setOpen={setOpen}
      />
    </div>
  );
}
