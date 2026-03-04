"use client";

import { memo } from "react";
import { useGridListState, useSelectionState, useSelectedRows } from "./state";
import { GridListRow } from "./components";
import { cn } from "@/lib/utils";

// @ts-nocheck

export const Debugger = memo(function Debugger() {
  const { isFocusWithinContainer, lastFocusedRowId, cycleRowFocus } = useGridListState();
  const { selectionMode } = useSelectionState();
  const selectedRows = useSelectedRows();

  return (
    <GridListRow disabled>
      <dl
        className="bg-muted/50 text-muted-foreground col-span-full flex flex-row gap-8
          rounded-md p-1 text-sm"
        // eslint-disable-next-line jsx-a11y/use-semantic-elements
        role="gridcell"
        tabIndex={-1}
        aria-readonly
      >
        <h3 className="text-sm font-bold tracking-tight">debugger</h3>
        <BooleanValue label="cycleRowFocus" value={cycleRowFocus} />
        <TextValue label="lastFocusedRowId" value={lastFocusedRowId} />
        <BooleanValue label="isFocusWithinContainer" value={isFocusWithinContainer} />
        <TextValue label="selectionMode" value={selectionMode} />
        <TextValue
          label="selectedRows"
          value={Array.from(selectedRows).join(", ") || "none"}
        />
      </dl>
    </GridListRow>
  );
});

function TextValue({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  if (value == null) {
    return (
      <div className="bg-muted flex flex-row items-center gap-2">
        <dt className="font-semibold tracking-tighter">{label}</dt>
        <dd className="font-mono italic">NULL</dd>
      </div>
    );
  }

  return (
    <div className="bg-muted flex flex-row items-center gap-2">
      <dt className="font-semibold tracking-tighter">{label}</dt>
      <dd className="font-mono">{JSON.stringify(value)}</dd>
    </div>
  );
}

function BooleanValue({ label, value }: { label: string; value: boolean }) {
  return (
    <div className="bg-muted flex flex-row items-center gap-2">
      <dt className="font-semibold tracking-tighter">{label}</dt>
      <dd>
        <div
          className={cn(
            "size-3 overflow-hidden rounded-full text-transparent",
            value ? "bg-green-500" : "bg-red-500"
          )}
        >
          {value ? "true" : "false"}
        </div>
      </dd>
    </div>
  );
}
