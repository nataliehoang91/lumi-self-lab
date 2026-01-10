// @ts-nocheck

"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  useEffect,
  useLayoutEffect,
  useState,
  Children,
  isValidElement,
  useId,
  useRef,
  useCallback,
} from "react";
import { cn } from "@workspace/ui/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Lock,
  Unlock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Info,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";

// Import types and hooks from the main grid-list components
import type { GridListRowProps } from "./types";
import {
  useGridListState,
  useSelectionDispatch,
  useSelectionState,
  useSelectedRows,
  GridListBodyContext,
  RowContext,
  SelectionIndicatorContext,
} from "./state";
import { useRegisterRow } from "./hooks";
import { Slot } from "@radix-ui/react-slot";
import { useSearchParams } from "next/navigation";
import { TruncatedText } from "@/components/General/SharedPageComponents";

// ============================================
// ROW INNER COMPONENT
// ============================================

function RowInner({
  children,
  asChild,
  ...divProps
}: {
  children: React.ReactNode;
  asChild?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  const rowRef = useRef<HTMLDivElement>(null);

  const rowProps: React.HTMLAttributes<HTMLDivElement> = {
    ...divProps,
  };

  const rowElem = asChild ? (
    <Slot ref={rowRef} {...rowProps}>
      {children}
    </Slot>
  ) : (
    <div ref={rowRef} {...rowProps}>
      {children}
    </div>
  );

  return rowElem;
}

// ============================================
// TYPES
// ============================================

export interface ColumnConfig {
  id: string;
  label: string;
  width: string; // "1fr", "auto", "200px", "minmax(100px, 1fr)", etc.
  sortable?: boolean;
  defaultFrozen?: boolean;
  freezable?: boolean;
  preserveWidth?: boolean; // If true, keep original width value (including "auto") instead of converting to "1fr"
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Custom hook for debounced column width measurements
function useColumnWidths() {
  const [columnWidths, setColumnWidths] = useState<Map<string, number>>(
    new Map()
  );
  const [isMeasuring, setIsMeasuring] = useState(false);
  const columnRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const measureTimeoutRef = useRef<NodeJS.Timeout>();

  const debouncedMeasure = useCallback(() => {
    if (measureTimeoutRef.current) {
      clearTimeout(measureTimeoutRef.current);
    }

    setIsMeasuring(true);

    measureTimeoutRef.current = setTimeout(() => {
      const newWidths = new Map<string, number>();

      columnRefs.current.forEach((element, columnId) => {
        if (element) {
          const rect = element.getBoundingClientRect();
          const width = Math.ceil(rect.width || element.offsetWidth || 0);
          newWidths.set(columnId, width);
        }
      });

      setColumnWidths(newWidths);
      setIsMeasuring(false);
    }, 50); // Reduced from 100ms to 50ms for more responsiveness
  }, []);

  const measureColumn = useCallback(
    (columnId: string, element: HTMLDivElement | null) => {
      if (element) {
        columnRefs.current.set(columnId, element);
        debouncedMeasure();
      }
    },
    [debouncedMeasure]
  );

  const getColumnWidth = useCallback(
    (columnId: string): number => {
      return columnWidths.get(columnId) || 0;
    },
    [columnWidths]
  );

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (measureTimeoutRef.current) {
        clearTimeout(measureTimeoutRef.current);
      }
    };
  }, []);

  return {
    measureColumn,
    getColumnWidth,
    columnWidths,
    isMeasuring,
    remeasureAll: debouncedMeasure,
  };
}

interface FreezeGridState {
  frozenColumns: string[];
  columnOrder: string[];
  originalColumnOrder: string[]; // Add back original order tracking
  maxFrozenColumns: number;
  permanentFrozenColumns: string[]; // Columns that cannot be unfrozen
}

type FreezeGridAction =
  | { type: "FREEZE_COLUMN"; columnId: string }
  | { type: "UNFREEZE_COLUMN"; columnId: string }
  | {
      type: "INIT_COLUMNS";
      columnIds: string[];
      defaultFrozen: string[];
      permanentFrozen?: string[];
    }
  | { type: "SET_MAX_FROZEN"; max: number }
  | { type: "TOGGLE_FREEZE"; payload: string; canUnfreeze?: boolean };

// ============================================
// REDUCER
// ============================================

function freezeGridReducer(
  state: FreezeGridState,
  action: FreezeGridAction
): FreezeGridState {
  switch (action.type) {
    case "FREEZE_COLUMN": {
      if (state.frozenColumns.length >= state.maxFrozenColumns) {
        return state;
      }

      const newFrozenColumns = [...state.frozenColumns, action.columnId];

      // Reorder: frozen columns first (maintaining their original relative order)
      const frozen: string[] = [];
      const unfrozen: string[] = [];

      for (const colId of state.originalColumnOrder) {
        if (newFrozenColumns.includes(colId)) {
          frozen.push(colId);
        } else {
          unfrozen.push(colId);
        }
      }

      return {
        ...state,
        frozenColumns: newFrozenColumns,
        columnOrder: [...frozen, ...unfrozen],
      };
    }

    case "UNFREEZE_COLUMN": {
      // Prevent unfreezing permanent frozen columns
      if (state.permanentFrozenColumns.includes(action.columnId)) {
        return state;
      }

      const newFrozenColumns = state.frozenColumns.filter(
        (id) => id !== action.columnId
      );

      // Reorder: frozen columns first
      const frozen: string[] = [];
      const unfrozen: string[] = [];

      for (const colId of state.originalColumnOrder) {
        if (newFrozenColumns.includes(colId)) {
          frozen.push(colId);
        } else {
          unfrozen.push(colId);
        }
      }

      return {
        ...state,
        frozenColumns: newFrozenColumns,
        columnOrder: [...frozen, ...unfrozen],
      };
    }

    case "INIT_COLUMNS": {
      const frozen: string[] = [];
      const unfrozen: string[] = [];

      for (const colId of action.columnIds) {
        if (action.defaultFrozen.includes(colId)) {
          frozen.push(colId);
        } else {
          unfrozen.push(colId);
        }
      }

      return {
        ...state,
        originalColumnOrder: action.columnIds,
        columnOrder: [...frozen, ...unfrozen],
        frozenColumns: action.defaultFrozen.slice(0, state.maxFrozenColumns),
        permanentFrozenColumns: action.permanentFrozen || [],
      };
    }

    case "SET_MAX_FROZEN": {
      // If we have too many frozen columns, unfreeze the excess
      const newFrozenColumns = state.frozenColumns.slice(0, action.max);

      const frozen: string[] = [];
      const unfrozen: string[] = [];

      for (const colId of state.originalColumnOrder) {
        if (newFrozenColumns.includes(colId)) {
          frozen.push(colId);
        } else {
          unfrozen.push(colId);
        }
      }

      return {
        ...state,
        maxFrozenColumns: action.max,
        frozenColumns: newFrozenColumns,
        columnOrder: [...frozen, ...unfrozen],
      };
    }

    case "TOGGLE_FREEZE": {
      const columnId = action.payload;
      if (state.frozenColumns.includes(columnId)) {
        // Unfreeze - but prevent if it's a permanent frozen column
        if (state.permanentFrozenColumns.includes(columnId)) {
          // Cannot unfreeze permanent columns
          return state;
        }

        const newFrozenColumns = state.frozenColumns.filter(
          (id) => id !== columnId
        );

        const frozen: string[] = [];
        const unfrozen: string[] = [];

        for (const colId of state.originalColumnOrder) {
          if (newFrozenColumns.includes(colId)) {
            frozen.push(colId);
          } else {
            unfrozen.push(colId);
          }
        }

        return {
          ...state,
          frozenColumns: newFrozenColumns,
          columnOrder: [...frozen, ...unfrozen],
        };
      } else {
        // Freeze
        if (state.frozenColumns.length >= state.maxFrozenColumns) {
          return state;
        }

        const newFrozenColumns = [...state.frozenColumns, columnId];

        const frozen: string[] = [];
        const unfrozen: string[] = [];

        for (const colId of state.originalColumnOrder) {
          if (newFrozenColumns.includes(colId)) {
            frozen.push(colId);
          } else {
            unfrozen.push(colId);
          }
        }

        return {
          ...state,
          frozenColumns: newFrozenColumns,
          columnOrder: [...frozen, ...unfrozen],
        };
      }
    }

    default:
      return state;
  }
}

// ============================================
// CONTEXT
// ============================================

interface FreezeGridContextType {
  state: FreezeGridState;
  columns: ColumnConfig[];
  responsive?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  currentMaxFrozen: number;
  toggleFreeze: (columnId: string) => void;
  isColumnFrozen: (columnId: string) => boolean;
  getColumnConfig: (columnId: string) => ColumnConfig | undefined;
  getOrderedColumns: () => ColumnConfig[];
  generateGridTemplate: () => string;
  getOriginalGridTemplate: () => string;
  generateDynamicGridTemplate: () => string;
  measureColumn: (columnId: string, element: HTMLDivElement | null) => void;
  getColumnWidth: (columnId: string) => number;
  columnWidths: Map<string, number>;
  isMeasuring: boolean;
  remeasureAll: () => void;
}

const FreezeGridContext = createContext<FreezeGridContextType | null>(null);

export function useFreezeGrid() {
  const context = useContext(FreezeGridContext);
  return context;
}

// ============================================
// PROVIDER
// ============================================

interface FreezableGridProviderProps {
  children: React.ReactNode;
  columns: ColumnConfig[];
  maxFrozenColumns?: number;
  responsive?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  preserveAutoWidth?: boolean; // If true, keep "auto" width instead of converting to "1fr"
  stickyTopOffset?: string | number; // Offset from top for sticky positioning (e.g., "60px", 60)
}

export function FreezableGridProvider({
  children,
  columns,
  maxFrozenColumns = 3,
  responsive = true,
  preserveAutoWidth = false,
  stickyTopOffset = 0,
}: FreezableGridProviderProps) {
  // Handle responsive max frozen columns - hydration safe
  const [windowWidth, setWindowWidth] = useState(1024);

  useEffect(() => {
    // Set initial window width after hydration
    setWindowWidth(window.innerWidth);

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const currentMaxFrozen = useMemo(() => {
    if (!responsive || typeof responsive === "boolean") return maxFrozenColumns;

    if (windowWidth < 640 && responsive.sm !== undefined) return responsive.sm;
    if (windowWidth < 768 && responsive.md !== undefined) return responsive.md;
    if (windowWidth < 1024 && responsive.lg !== undefined) return responsive.lg;
    if (windowWidth < 1280 && responsive.xl !== undefined) return responsive.xl;

    return maxFrozenColumns;
  }, [windowWidth, responsive, maxFrozenColumns]);

  const [state, dispatch] = useReducer(freezeGridReducer, {
    frozenColumns: [],
    columnOrder: columns.map((col) => col.id),
    originalColumnOrder: columns.map((col) => col.id),
    maxFrozenColumns: currentMaxFrozen,
    permanentFrozenColumns: [],
  });

  // Initialize default frozen columns on mount
  useEffect(() => {
    const defaultFrozenColumns = columns
      .filter((col) => col.defaultFrozen)
      .map((col) => col.id)
      .slice(0, currentMaxFrozen);

    const permanentFrozenColumns = columns
      .filter((col) => col.defaultFrozen && col.freezable === false)
      .map((col) => col.id);

    if (defaultFrozenColumns.length > 0) {
      dispatch({
        type: "INIT_COLUMNS",
        columnIds: columns.map((col) => col.id),
        defaultFrozen: defaultFrozenColumns,
        permanentFrozen: permanentFrozenColumns,
      });
    }
  }, [columns, currentMaxFrozen]);

  // Update max frozen when responsive changes
  useEffect(() => {
    if (state.maxFrozenColumns !== currentMaxFrozen) {
      dispatch({ type: "SET_MAX_FROZEN", max: currentMaxFrozen });
    }
  }, [currentMaxFrozen, state.maxFrozenColumns]);

  const {
    measureColumn,
    getColumnWidth,
    columnWidths,
    isMeasuring,
    remeasureAll,
  } = useColumnWidths();

  // Track sort changes via URL params
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort");
  const currentOrder = searchParams.get("order");

  // Preserve scroll position during layout updates
  const preserveScrollPosition = useCallback(() => {
    const scrollContainer =
      document.querySelector(".freezable-grid-container") ||
      document.documentElement;
    const scrollLeft = scrollContainer.scrollLeft;
    const scrollTop = scrollContainer.scrollTop;
    return () => {
      scrollContainer.scrollLeft = scrollLeft;
      scrollContainer.scrollTop = scrollTop;
    };
  }, []);

  // Trigger remeasurement when sort changes (only if there are frozen columns)
  useEffect(() => {
    // Only trigger remeasurement if there are frozen columns
    // since layout updates are only needed for frozen column positioning
    if (state.frozenColumns.length === 0) {
      return;
    }

    const restoreScroll = preserveScrollPosition();

    // Small delay to let DOM update with new content
    const timer = setTimeout(() => {
      remeasureAll();

      // Restore scroll position after remeasurement
      setTimeout(restoreScroll, 10);
    }, 50);

    return () => clearTimeout(timer);
  }, [
    currentSort,
    currentOrder,
    remeasureAll,
    preserveScrollPosition,
    state.frozenColumns.length,
  ]);

  const toggleFreeze = useCallback(
    (columnId: string) => {
      // Check if column is freezable
      const column = columns.find((col) => col.id === columnId);
      if (column?.freezable === false) {
        // Column cannot be unfrozen
        return;
      }
      dispatch({ type: "TOGGLE_FREEZE", payload: columnId });

      // Batch remeasurement after layout update to reduce reflows
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          remeasureAll();
        });
      });
    },
    [columns, remeasureAll]
  );

  const isColumnFrozen = useCallback(
    (columnId: string) => {
      return state.frozenColumns.includes(columnId);
    },
    [state.frozenColumns]
  );

  const getColumnConfig = useCallback(
    (columnId: string) => {
      return columns.find((col) => col.id === columnId);
    },
    [columns]
  );

  const getOrderedColumns = useCallback(() => {
    return state.columnOrder
      .map((id) => getColumnConfig(id))
      .filter(Boolean) as ColumnConfig[];
  }, [state.columnOrder, getColumnConfig]);

  const generateGridTemplate = useCallback(() => {
    const orderedColumns = getOrderedColumns();
    return orderedColumns
      .map((col) => {
        // If column has preserveWidth: true, always keep its original width
        if (col?.preserveWidth) {
          return col?.width || "1fr";
        }
        // Otherwise, respect global preserveAutoWidth setting
        if (col?.width === "auto" && !preserveAutoWidth) {
          return "1fr";
        }
        return col?.width || "1fr";
      })
      .join(" ");
  }, [getOrderedColumns, preserveAutoWidth]);

  const generateDynamicGridTemplate = useCallback(() => {
    const orderedColumns = getOrderedColumns();
    return orderedColumns
      .map((col) => {
        // If column has preserveWidth: true, always keep its original width
        if (col?.preserveWidth) {
          return col?.width || "1fr";
        }
        // Otherwise, respect global preserveAutoWidth setting
        if (col?.width === "auto" && !preserveAutoWidth) {
          return "1fr";
        }
        return col?.width || "1fr";
      })
      .join(" ");
  }, [getOrderedColumns, preserveAutoWidth]);

  const getOriginalGridTemplate = useCallback(() => {
    return columns
      .map((col) => {
        // If column has preserveWidth: true, always keep its original width
        if (col.preserveWidth) {
          return col.width || "1fr";
        }
        // Otherwise, respect global preserveAutoWidth setting
        if (col.width === "auto" && !preserveAutoWidth) {
          return "1fr";
        }
        return col.width || "1fr";
      })
      .join(" ");
  }, [columns, preserveAutoWidth]);

  // Normalize stickyTopOffset to string (e.g., "60px" or "0")
  const normalizedStickyTopOffset = useMemo(() => {
    if (typeof stickyTopOffset === "number") {
      return `${stickyTopOffset}px`;
    }
    return stickyTopOffset || "0";
  }, [stickyTopOffset]);

  // Optimized context value with memoization
  const contextValue = useMemo(
    () => ({
      state,
      columns,
      responsive,
      currentMaxFrozen,
      toggleFreeze,
      isColumnFrozen,
      getColumnConfig,
      getOrderedColumns,
      generateGridTemplate,
      getOriginalGridTemplate,
      generateDynamicGridTemplate,
      measureColumn,
      getColumnWidth,
      columnWidths,
      isMeasuring,
      remeasureAll,
      stickyTopOffset: normalizedStickyTopOffset,
    }),
    [
      state.frozenColumns,
      state.columnOrder,
      state.maxFrozenColumns,
      columns,
      columnWidths,
      toggleFreeze,
      isColumnFrozen,
      getColumnConfig,
      getOrderedColumns,
      generateGridTemplate,
      getOriginalGridTemplate,
      generateDynamicGridTemplate,
      measureColumn,
      getColumnWidth,
      remeasureAll,
      isMeasuring,
      responsive,
      currentMaxFrozen,
      normalizedStickyTopOffset,
    ]
  );

  return (
    <FreezeGridContext.Provider value={contextValue}>
      {children}
    </FreezeGridContext.Provider>
  );
}

// ============================================
// GRID COMPONENTS
// ============================================

interface FreezableGridContentProps {
  children: React.ReactNode;
  className?: string;
  gridContainerClassName: string;
  containerClassName: string;
  originalGridCols: string;
}

export function FreezableGridContent({
  children,
  className,
  gridContainerClassName,
  containerClassName,
  originalGridCols,
}: FreezableGridContentProps) {
  const context = useFreezeGrid();

  // Generate the dynamic grid template based on frozen columns
  const dynamicGridTemplate = useMemo(() => {
    const baseTemplate =
      (originalGridCols && originalGridCols.trim().length > 0
        ? originalGridCols
        : context?.getOriginalGridTemplate?.()) || "";

    if (!context) return baseTemplate;

    return context.generateDynamicGridTemplate(baseTemplate);
  }, [context, originalGridCols]);

  // Create the final grid class
  // NOTE: Tailwind JIT cannot see dynamic arbitrary values like grid-cols-[1fr_auto]
  // so we apply the template via inline style instead of a dynamic class.
  const inlineGridTemplate = dynamicGridTemplate.replaceAll("_", " ");

  return (
    <div className={cn("w-full", containerClassName)}>
      <div
        className={cn(
          "grid w-full relative transition-opacity duration-150",
          context?.isMeasuring ? "opacity-50" : "opacity-100",
          className
        )}
        style={{ gridTemplateColumns: inlineGridTemplate }}
      >
        {children}
      </div>
    </div>
  );
}

// ============================================
// FREEZABLE GRID HEADER COMPONENTS
// ============================================

export function FreezableGridHeader({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  const context = useFreezeGrid();
  const topOffset = context?.stickyTopOffset || "0";

  return (
    <div
      className={cn(
        "grid col-span-full grid-cols-subgrid sticky z-40",
        className
      )}
      style={{ top: topOffset }}
      role="rowgroup"
      {...props}
    >
      {children}
    </div>
  );
}

export function FreezableGridHeaderRow({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  const context = useFreezeGrid();

  // Enhanced children processing for frozen columns in header
  const processedChildren = useMemo(() => {
    if (!context) return children;

    const childArray = Children.toArray(children);
    const childMap = new Map<string, React.ReactNode>();

    // Map children by their columnId
    childArray.forEach((child) => {
      if (isValidElement(child) && child.props.columnId) {
        childMap.set(child.props.columnId, child);
      }
    });

    // Separate frozen and unfrozen children
    const frozenChildren: React.ReactNode[] = [];
    const unfrozenChildren: React.ReactNode[] = [];

    context.state.columnOrder.forEach((columnId) => {
      const child = childMap.get(columnId);
      if (child) {
        if (context.state.frozenColumns.includes(columnId)) {
          // Just add the child without sticky styling for now
          frozenChildren.push(child);
        } else {
          unfrozenChildren.push(child);
        }
      }
    });

    // Return frozen children first, then unfrozen
    return [...frozenChildren, ...unfrozenChildren];
  }, [children, context]);

  return (
    <div
      className={cn("grid col-span-full grid-cols-subgrid", className)}
      role="row"
      {...props}
    >
      {processedChildren}
    </div>
  );
}

// Body Component
export function FreezableGridBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("grid col-span-full grid-cols-subgrid", className)}
      role="rowgroup"
    >
      {children}
    </div>
  );
}

// Row Component - Reorders its children
export function FreezableGridRow({
  children,
  className,
  rowData: _rowData,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  rowData?: any;
  [key: string]: any;
}) {
  const context = useFreezeGrid();

  // Reorder children based on column order
  const reorderedChildren = useMemo(() => {
    if (!context) return children;

    const childArray = Children.toArray(children);
    const childMap = new Map<string, React.ReactNode>();

    // Map children by their columnId
    childArray.forEach((child) => {
      if (isValidElement(child) && child.props.columnId) {
        childMap.set(child.props.columnId, child);
      }
    });

    // Return in the correct order
    return context.state.columnOrder
      .map((columnId) => childMap.get(columnId))
      .filter(Boolean);
  }, [children, context]);

  return (
    <div className={cn("contents", className)} role="row" {...props}>
      {reorderedChildren}
    </div>
  );
}

// ============================================
// GRIDLIST ROW COMPONENT (EXACT COPY FROM components.tsx)
// ============================================

export const GridListRow = function GridListRow({
  children,
  className,
  asChild,
  rowId,
  readOnly,
  disabled,
  rowData,
  ...divProps
}: GridListRowProps) {
  const state = useGridListState();
  const selectionDispatch = useSelectionDispatch();
  const { selectionMode } = useSelectionState();
  const selectedRows = useSelectedRows();
  const isInBody = useContext(GridListBodyContext);
  const isLastFocusedRow = state.lastFocusedRowId === rowId;
  const freezeContext = useFreezeGrid();

  const autoGeneratedRowId = useId();
  const actualRowId = rowId ?? autoGeneratedRowId;

  // Only show as focused when the row element itself is the active element
  const isFocused =
    isLastFocusedRow &&
    state.isFocusWithinContainer &&
    document.activeElement?.getAttribute("data-row-id") === rowId;

  // Check if row is selected
  const isRowSelected =
    selectionMode !== "none" && selectedRows.has(actualRowId);

  // Enhanced children processing for frozen columns
  const processedChildren = useMemo(() => {
    if (!freezeContext) return children;

    const childArray = Children.toArray(children);
    const childMap = new Map<string, React.ReactNode>();

    // Map children by their columnId
    childArray.forEach((child) => {
      if (isValidElement(child) && child.props.columnId) {
        childMap.set(child.props.columnId, child);
      }
    });

    // Separate frozen and unfrozen children
    const frozenChildren: React.ReactNode[] = [];
    const unfrozenChildren: React.ReactNode[] = [];

    freezeContext.state.columnOrder.forEach((columnId) => {
      const child = childMap.get(columnId);
      if (child) {
        if (freezeContext.state.frozenColumns.includes(columnId)) {
          frozenChildren.push(child);
        } else {
          unfrozenChildren.push(child);
        }
      }
    });

    // Return frozen children first, then unfrozen
    return [...frozenChildren, ...unfrozenChildren];
  }, [children, freezeContext]);

  const rowProps: React.HTMLAttributes<HTMLDivElement> & {
    "data-row-id": string;
    "data-focused"?: string;
    "data-restore-focus"?: string;
    "data-selected"?: string;
    "data-readonly"?: string;
    "data-disabled"?: string;
  } = {
    ...divProps,
    role: "row",
    tabIndex: disabled ? -1 : isLastFocusedRow ? 0 : -1,
    className: cn("grid col-span-full grid-cols-subgrid", className),
    "aria-selected": selectionMode !== "none" ? isRowSelected : undefined,
    "data-row-id": actualRowId,
    "data-focused": isFocused ? "true" : undefined,
    "data-restore-focus": isLastFocusedRow ? "true" : undefined,
    "data-selected": isRowSelected ? "true" : undefined,
    "data-readonly": readOnly ? "true" : undefined,
    "data-disabled": disabled ? "true" : undefined,
  };

  useRegisterRow(actualRowId, readOnly, disabled, rowData);

  const rowContextValue = useMemo(() => {
    return {
      rowId: actualRowId,
      data: rowData,
    };
  }, [actualRowId, rowData]);

  const rowElem = (
    <RowInner asChild={asChild} {...rowProps}>
      {processedChildren}
    </RowInner>
  );

  const contextWrappedElem = (
    <RowContext value={rowContextValue}>{rowElem}</RowContext>
  );

  const selectionCtxValue = useMemo(() => {
    return {
      selected: isRowSelected,
      onCheckedChange: () => {
        if (disabled || readOnly) return;

        if (isRowSelected) {
          selectionDispatch({ type: "deselectRow", rowId: actualRowId });
        } else {
          selectionDispatch({ type: "selectRow", rowId: actualRowId });
        }
      },
    };
  }, [selectionDispatch, actualRowId, isRowSelected, disabled, readOnly]);

  // Only provide SelectionIndicatorContext for rows inside GridListBody
  if (selectionMode === "none" || !isInBody) {
    return contextWrappedElem;
  }

  return (
    <SelectionIndicatorContext value={selectionCtxValue}>
      {contextWrappedElem}
    </SelectionIndicatorContext>
  );
};

// ============================================
// ENHANCED GRIDLIST ROW COMPONENT
// ============================================

// Column Header Component
interface FreezableGridColumnHeaderProps {
  columnId: string;
  children?: React.ReactNode;
  className?: string;
  freezable?: boolean;
  showLockIcon?: boolean;
  toggleFreezeOutside?: boolean; // If true, always show lock icon and make it clickable to toggle freeze
  showDropdown?: boolean; // If false, hide the dropdown menu (default: true)
  sortable?: boolean;
  onSort?: () => void;
  extraDropdownContent?: React.ReactNode;
  isFrozenHeaderClassName?: string;
  freezableContainerClassName?: string;
  headerContentFlexDirection?: string; // e.g., "flex-col" to override default "flex items-center gap-3"
  iconClassNames?: string;
  frozenClassName?: string; // Additional className to apply when column is frozen
}

export function FreezableGridColumnHeader({
  columnId,
  children,
  className,
  isFrozenHeaderClassName,
  freezable = true,
  showLockIcon = true,
  toggleFreezeOutside = true,
  showDropdown = true,
  sortable = false,
  onSort,
  extraDropdownContent,
  freezableContainerClassName,
  headerContentFlexDirection,
  iconClassNames,
  frozenClassName,
}: FreezableGridColumnHeaderProps) {
  const context = useFreezeGrid();
  const headerRef = useRef<HTMLDivElement>(null);
  const hasMeasuredRef = useRef(false);
  const lastElementRef = useRef<HTMLDivElement | null>(null);

  // Extract context values safely (will be null if context is null)
  const toggleFreeze = context?.toggleFreeze;
  const isColumnFrozen = context?.isColumnFrozen;
  const getColumnConfig = context?.getColumnConfig;
  const measureColumn = context?.measureColumn;
  const isFrozen = isColumnFrozen?.(columnId) ?? false;
  const column = getColumnConfig?.(columnId);

  // Measure the column width when the element is mounted (layout-safe)
  // Always call hooks, even if context is null
  useLayoutEffect(() => {
    if (!context || !headerRef.current || !measureColumn) return;

    // Only measure if element changed or hasn't been measured yet
    const currentElement = headerRef.current;
    const elementChanged = lastElementRef.current !== currentElement;

    if (!hasMeasuredRef.current || elementChanged) {
      lastElementRef.current = currentElement;

      // Defer measurement to next frame to avoid blocking the current render
      requestAnimationFrame(() => {
        if (
          headerRef.current &&
          measureColumn &&
          headerRef.current === currentElement
        ) {
          // Preserve scroll position before measurement
          const scrollContainer =
            document.querySelector(".freezable-grid-container") ||
            document.documentElement;
          const scrollLeft = scrollContainer.scrollLeft;
          const scrollTop = scrollContainer.scrollTop;

          measureColumn(columnId, headerRef.current);
          hasMeasuredRef.current = true;

          // Restore scroll position after measurement
          requestAnimationFrame(() => {
            scrollContainer.scrollLeft = scrollLeft;
            scrollContainer.scrollTop = scrollTop;
          });
        }
      });
    }
    // Only depend on columnId - measureColumn is stable (useCallback), context check is inside
  }, [columnId]);

  // Calculate sticky position for frozen columns
  // Always call hooks, even if context is null
  const stickyStyles = useMemo(() => {
    if (!context || !isFrozen) return {};

    const orderedColumns = context.getOrderedColumns();
    const frozenColumns = orderedColumns.filter((col) =>
      context.state.frozenColumns.includes(col.id)
    );
    const columnIndex = frozenColumns.findIndex((col) => col.id === columnId);
    const topOffset = context.stickyTopOffset || "0";

    if (columnIndex === 0) {
      return {
        position: "sticky" as const,
        left: 0,
        zIndex: 40,
        top: topOffset, // Use stickyTopOffset from context
      };
    }

    // Calculate cumulative width for position using measured widths
    let leftOffset =
      columnIndex === 0 || columnIndex === 1 ? 0 : -(columnIndex - 1);
    for (let i = 0; i < columnIndex; i++) {
      const col = frozenColumns[i];
      if (col) {
        leftOffset += context.getColumnWidth(col.id);
      }
    }

    return {
      position: "sticky" as const,
      left: `${leftOffset}px`,
      zIndex: 40,
      top: topOffset, // Use stickyTopOffset from context
    };
  }, [
    isFrozen,
    columnId,
    context?.state.frozenColumns,
    context?.columnWidths,
    context?.stickyTopOffset,
    context,
  ]);

  // Detect if this is the last frozen column to draw a right separator
  // Always call hooks, even if context is null
  const isLastFrozen = useMemo(() => {
    if (!context || !isFrozen) return false;
    const orderedColumns = context.getOrderedColumns();
    const frozenColumns = orderedColumns.filter((col) =>
      context.state.frozenColumns.includes(col.id)
    );
    const columnIndex = frozenColumns.findIndex((col) => col.id === columnId);
    return columnIndex === frozenColumns.length - 1;
  }, [isFrozen, context, columnId]);

  // Early return AFTER all hooks are called
  if (!context) {
    return <div className={cn("px-3 py-1", className)}>{children}</div>;
  }

  const finalFrozenHeaderClassName = cn(
    "bg-blue-900 border-blue-800 dark:bg-od-dark-navy  dark:border-blue-200 border-r sticky top-0",
    isFrozenHeaderClassName
  );

  const normalHeaderClassName = cn(
    "px-2 py-1.5 border-r text-sm text-nowrap",
    // If using flex-col for content, use flex-col for outer container too
    headerContentFlexDirection?.includes("flex-col")
      ? "flex flex-col items-stretch"
      : "flex items-center justify-between",
    isLastFrozen && "border-r-0",
    className
  );

  return (
    <div
      ref={headerRef}
      className={cn(
        normalHeaderClassName,
        isFrozen && finalFrozenHeaderClassName,
        isLastFrozen && "border-r border-blue-400 dark:border-slate-600",
        isFrozen && frozenClassName
      )}
      style={stickyStyles}
      role="columnheader"
    >
      <div
        className={cn(headerContentFlexDirection || "flex items-center gap-3")}
      >
        <div
          className={cn(
            "flex items-center gap-3 justify-center",
            !showLockIcon && !toggleFreezeOutside && "justify-center"
          )}
        >
          {toggleFreezeOutside && freezable && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (toggleFreeze) {
                  toggleFreeze(columnId);
                }
              }}
              className="flex-shrink-0 hover:opacity-80 transition-opacity cursor-pointer flex items-center gap-1"
              aria-label={isFrozen ? "Unfreeze column" : "Freeze column"}
            >
              {isFrozen ? (
                <>
                  <Lock className={cn("size-3 text-blue-400")} />
                  <ChevronRight className={cn("size-2.5 text-blue-400")} />
                </>
              ) : (
                <>
                  <ChevronLeft className={cn("size-2.5 text-white/60")} />
                  <Unlock className={cn("size-3 text-white/60")} />
                </>
              )}
            </button>
          )}
          {!toggleFreezeOutside && showLockIcon && isFrozen && (
            <Lock className={cn("size-3 text-blue-400 flex-shrink-0")} />
          )}
          {children || column?.label}
        </div>
      </div>

      {freezable && showDropdown && (
        <div className={freezableContainerClassName}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="h-4 w-4 p-0 hover:bg-white/20 transition-colors ml-4"
                onClick={(e) => e.stopPropagation()}
              >
                <ChevronDown
                  className={cn("h-3 w-3 text-white", iconClassNames)}
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* Extra dropdown content passed by user */}
              {extraDropdownContent}
              {extraDropdownContent && freezable && !toggleFreezeOutside && (
                <DropdownMenuSeparator />
              )}
              {!toggleFreezeOutside && freezable && (
                <DropdownMenuItem onClick={() => toggleFreeze(columnId)}>
                  {isFrozen ? (
                    <>
                      <Unlock className="mr-2 h-4 w-4" />
                      Unfreeze Column
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Freeze Column
                    </>
                  )}
                </DropdownMenuItem>
              )}
              {sortable && (
                <DropdownMenuItem onClick={onSort}>
                  Sort Column
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}

// Cell Component
interface FreezableGridCellProps {
  columnId: string;
  children: React.ReactNode | string;
  className?: string;
  maxTextLength?: number; // For string children truncation
  frozenClassName?: string; // Additional className to apply when cell is frozen
}

export function FreezableGridCell({
  columnId,
  children,
  className,
  maxTextLength = 20,
  frozenClassName,
}: FreezableGridCellProps) {
  const context = useFreezeGrid();
  const cellRef = useRef<HTMLDivElement>(null);
  const hasBeenMeasured = useRef(false);

  // Extract context values safely (will be null if context is null)
  const isColumnFrozen = context?.isColumnFrozen;
  const measureColumn = context?.measureColumn;
  const isFrozen = isColumnFrozen?.(columnId) ?? false;

  // Only measure frozen columns and only once unless content changes significantly
  // Always call hooks, even if context is null
  const lastElementRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!context || !measureColumn || !cellRef.current) return;

    const currentElement = cellRef.current;
    const elementChanged = lastElementRef.current !== currentElement;
    const shouldMeasure =
      (isFrozen || !hasBeenMeasured.current) &&
      (!hasBeenMeasured.current || elementChanged);

    if (shouldMeasure) {
      lastElementRef.current = currentElement;

      // Defer measurement to next frame to avoid blocking the current render
      requestAnimationFrame(() => {
        if (
          cellRef.current &&
          measureColumn &&
          cellRef.current === currentElement
        ) {
          // Preserve scroll position before measurement
          const scrollContainer =
            document.querySelector(".freezable-grid-container") ||
            document.documentElement;
          const scrollLeft = scrollContainer.scrollLeft;
          const scrollTop = scrollContainer.scrollTop;

          measureColumn(columnId, cellRef.current);
          hasBeenMeasured.current = true;

          // Restore scroll position after measurement
          requestAnimationFrame(() => {
            scrollContainer.scrollLeft = scrollLeft;
            scrollContainer.scrollTop = scrollTop;
          });
        }
      });
    }
    // Only depend on columnId and isFrozen - measureColumn is stable (useCallback), context check is inside
  }, [columnId, isFrozen]);

  // Calculate sticky position for frozen cells
  // Always call hooks, even if context is null
  const stickyStyles = useMemo(() => {
    if (!context || !isFrozen) return {};

    const orderedColumns = context.getOrderedColumns();
    const frozenColumns = orderedColumns.filter((col) =>
      context.state.frozenColumns.includes(col.id)
    );
    const columnIndex = frozenColumns.findIndex((col) => col.id === columnId);

    if (columnIndex === 0) {
      return {
        position: "sticky" as const,
        left: 0,
        zIndex: 35,
      };
    }

    // Calculate cumulative width for position using measured widths
    let leftOffset = 0;
    for (let i = 0; i < columnIndex; i++) {
      const col = frozenColumns[i];
      if (col) {
        leftOffset += context.getColumnWidth(col.id);
      }
    }

    return {
      position: "sticky" as const,
      left: `${leftOffset}px`,
      zIndex: 35,
    };
  }, [
    isFrozen,
    columnId,
    context?.state.frozenColumns,
    context?.columnWidths,
    context,
  ]);

  // Detect if this is the last frozen column to draw a right separator
  // Always call hooks, even if context is null
  const isLastFrozen = useMemo(() => {
    if (!context || !isFrozen) return false;
    const orderedColumns = context.getOrderedColumns();
    const frozenColumns = orderedColumns.filter((col) =>
      context.state.frozenColumns.includes(col.id)
    );
    const columnIndex = frozenColumns.findIndex((col) => col.id === columnId);
    return columnIndex === frozenColumns.length - 1;
  }, [isFrozen, context, columnId]);

  // Early return AFTER all hooks are called
  if (!context) {
    return (
      <div className={cn("px-3 py-1 flex items-center", className)}>
        {children}
      </div>
    );
  }

  const finalFrozenCellClassName = cn(
    "bg-od-light-teal-50 border-blue-200 border-b-blue-200  dark:border-slate-600 dark:bg-slate-900",
    isLastFrozen && "border-r  border-b-blue-200"
  );

  // Render children based on type
  const renderChildren = () => {
    // If maxTextLength is explicitly undefined, always render as React component (allow wrapping)
    if (maxTextLength === undefined) {
      return children;
    }

    if (typeof children === "string" && typeof maxTextLength === "number") {
      if (isFrozen) {
        // For frozen cells with string children, allow wrapping if maxTextLength is 0 or very large
        // Otherwise use nowrap for short text
        if (maxTextLength === 0 || maxTextLength > 1000) {
          return <span className="break-words">{children}</span>;
        }
        return <span className="whitespace-nowrap">{children}</span>;
      } else {
        // For non-frozen cells, use TruncatedText
        return (
          <TruncatedText
            text={children}
            maxLength={maxTextLength}
            className=""
          />
        );
      }
    } else {
      // For React components, render as-is
      return children;
    }
  };

  return (
    <div
      ref={cellRef}
      className={cn(
        "px-2 py-1 text-sm border-r border-b border-border last:border-r-0 text-left flex items-center dark:border-slate-600",
        // Allow text wrapping when maxTextLength is undefined
        maxTextLength === undefined && "break-words",
        isFrozen && finalFrozenCellClassName,
        className,
        isFrozen && frozenClassName
      )}
      style={stickyStyles}
      role="gridcell"
    >
      {renderChildren()}
    </div>
  );
}

// Indicator Component
export function FrozenColumnsIndicator() {
  const context = useFreezeGrid();

  if (!context) {
    return null;
  }

  return (
    <div className="flex items-center justify-between md:flex-row flex-col gap-4 px-4 py-1.5 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg text-blue-700 dark:text-blue-300 text-sm mb-4">
      <div className="flex items-center gap-3">
        <Lock className="h-4 w-4 flex-shrink-0" />
        <div className="flex items-center gap-2">
          <span suppressHydrationWarning>
            {context.state.frozenColumns.length} of {context.currentMaxFrozen}{" "}
            columns frozen
          </span>
          <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-3 w-3" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click column headers icon to freeze/unfreeze</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
        <span>
          💡 Tip: Freeze important columns to keep them visible while scrolling
        </span>
      </div>
    </div>
  );
}
