"use client";

import { cn } from "@/lib/utils";
import { createReducerContext } from "../utils/reducer-context";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import React, { createContext, useCallback, useContext, useRef } from "react";
import { Check } from "lucide-react";
import type {
  ChangeEvent,
  ComponentPropsWithoutRef,
  FocusEvent,
  FormEventHandler,
  SyntheticEvent,
} from "react";
import { Slot } from "@radix-ui/react-slot";
import useEffectEvent from "../utils/use-effect-event";

interface ComboboxState {
  name?: string;
  selected: string[];
  open: boolean;
  multiple: boolean;
  required?: boolean;
  searchValue: string;
}

type ComboboxAction =
  | { type: "select"; value: string }
  | { type: "deselect"; value: string }
  | { type: "set_open"; open: boolean }
  | { type: "set_search_value"; value: string };

const defaultComboboxState: ComboboxState = {
  selected: [],
  open: false,
  multiple: false,
  required: false,
  searchValue: "",
};

const [ComboboxProvider, useComboboxState, useComboboxDispatch] =
  createReducerContext(
    (state: ComboboxState, action: ComboboxAction): ComboboxState => {
      switch (action.type) {
        case "select":
          if (state.multiple) {
            const newState = {
              ...state,
              selected: [...state.selected, action.value],
            };
            return newState;
          }
          const newState = {
            ...state,
            selected: [action.value],
            // Keep popover open for both single and multiple selections
            // Users can manually close it or select another option
          };
          return newState;
        case "deselect":
          const deselectState = {
            ...state,
            selected: state.selected.filter((item) => item !== action.value),
          };
          return deselectState;
        case "set_open":
          return {
            ...state,
            open: action.open,
            // Clear search value when opening/closing popover
            searchValue: action.open ? state.searchValue : "",
          };
        case "set_search_value":
          return {
            ...state,
            searchValue: action.value,
          };

        default:
          return state;
      }
    },
    defaultComboboxState
  );

interface ComboboxProps extends ComponentPropsWithoutRef<"select"> {
  onValueChange?: (value: string | string[]) => void;
}

function toArray(value: string | readonly string[] | number | undefined) {
  if (value === undefined) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

function createSyntheticEvent(
  target: Element,
  nativeEvent: Event,
  isDefaultPrevented: () => boolean,
  isPropagationStopped: () => boolean,
  persist: () => void
): SyntheticEvent {
  return {
    nativeEvent: nativeEvent,
    currentTarget: target,
    target: target,
    bubbles: nativeEvent.bubbles,
    cancelable: nativeEvent.cancelable,
    defaultPrevented: nativeEvent.defaultPrevented,
    eventPhase: nativeEvent.eventPhase,
    isTrusted: nativeEvent.isTrusted,
    preventDefault: nativeEvent.preventDefault,
    isDefaultPrevented: isDefaultPrevented,
    stopPropagation: nativeEvent.stopPropagation,
    isPropagationStopped: isPropagationStopped,
    persist: persist,
    timeStamp: nativeEvent.timeStamp,
    type: nativeEvent.type,
  };
}

function Combobox({
  name,
  multiple,
  value,
  onValueChange,
  defaultValue,
  required = false,
  children,
  onBlur,
  onChange,
  onInvalid,
}: ComboboxProps) {
  // cannot accept both value and defaultValue
  if (value !== undefined && defaultValue !== undefined) {
    throw new Error("Cannot accept both value and defaultValue");
  }

  const selectRef = useRef<HTMLSelectElement>(null);

  const selected = value
    ? toArray(value)
    : defaultValue
    ? toArray(defaultValue)
    : [];

  const onChangeEvent = useEffectEvent(() => {
    if (typeof onChange === "function" && selectRef.current) {
      // create a new synthetic change event and dispatch it
      const changeEvent = new Event("change", {
        bubbles: true,
        cancelable: true,
      });

      const syntheticChangeEvent = createSyntheticEvent(
        selectRef.current,
        changeEvent,
        () => false,
        () => false,
        () => {}
      ) as ChangeEvent<HTMLSelectElement>;

      onChange(syntheticChangeEvent);
    }
  });

  const onBlurEvent = useEffectEvent(() => {
    if (typeof onBlur === "function" && selectRef.current) {
      // create a new synthetic focus event and dispatch it
      const focusEvent = new FocusEvent("focus", {
        bubbles: true,
        cancelable: true,
      });

      const syntheticBlurEvent = createSyntheticEvent(
        selectRef.current,
        focusEvent,
        () => false,
        () => false,
        () => {}
      ) as FocusEvent<HTMLSelectElement>;

      onBlur(syntheticBlurEvent);
    }
  });

  const onValueChangeEvent = useEffectEvent((value: string | string[]) => {
    if (typeof onValueChange === "function") {
      onValueChange(value);
    }
  });

  const middleware = useCallback(
    (
        dispatch: ReturnType<typeof useComboboxDispatch>,
        getNextState: (action: ComboboxAction) => ComboboxState
      ) =>
      (action: ComboboxAction) => {
        dispatch(action);
        if (action.type === "select" || action.type === "deselect") {
          const state = getNextState(action);
          onValueChangeEvent(state.selected);
        }

        if (action.type === "select" || action.type === "deselect") {
          onChangeEvent();
        }

        if (action.type === "set_open" && !action.open) {
          onBlurEvent();
        }
      },
    [onValueChangeEvent, onChangeEvent, onBlurEvent]
  );

  return (
    <ComboboxProvider
      name={name}
      selected={selected}
      multiple={multiple ?? false}
      required={required}
      middleware={middleware}
    >
      <ComboboxImpl>
        {children}
        <HiddenInputs selectRef={selectRef} onInvalid={onInvalid} />
      </ComboboxImpl>
    </ComboboxProvider>
  );
}

function ComboboxImpl({ children }: { children: React.ReactNode }) {
  const dispatch = useComboboxDispatch();
  const state = useComboboxState();

  return (
    <Popover
      open={state.open}
      onOpenChange={(open) => {
        dispatch({ type: "set_open", open });
      }}
    >
      {children}
    </Popover>
  );
}

function HiddenInputs({
  selectRef,
  onInvalid,
}: {
  selectRef: React.RefObject<HTMLSelectElement | null>;
  onInvalid?: FormEventHandler<HTMLSelectElement>;
}) {
  const { selected, name, required, multiple } = useComboboxState();

  // For single select, use the first value or empty string
  // For multiple select, use the array
  const value = multiple ? selected : selected[0] || "";

  return (
    <select
      hidden
      ref={selectRef}
      name={name}
      multiple={multiple}
      value={value}
      onChange={() => {}}
      onInvalid={onInvalid}
      required={required}
      tabIndex={-1}
      aria-hidden="true"
    >
      {selected.map((value) => (
        <option key={value} value={value}>
          {value}
        </option>
      ))}
    </select>
  );
}

function ComboboxTrigger({
  className,
  children,
  asChild = false,
  ...props
}: React.ComponentPropsWithoutRef<typeof PopoverTrigger> & {
  asChild?: boolean;
}) {
  return (
    <PopoverTrigger
      asChild={asChild}
      className={cn("flex w-full min-w-64 justify-between", className)}
      {...props}
    >
      {children}
    </PopoverTrigger>
  );
}

function ComboboxContent({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof PopoverContent>) {
  return (
    <PopoverContent className={cn("w-full min-w-64 p-0", className)} {...props}>
      <Command
        className="max-h-[300px] overflow-y-auto p-1"
        shouldFilter={false}
        onSelect={() => {
          // Prevent Command from closing the popover
          return false;
        }}
      >
        {children}
      </Command>
    </PopoverContent>
  );
}

function ComboboxInput({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof CommandInput>) {
  const dispatch = useComboboxDispatch();
  const state = useComboboxState();

  return (
    <div className="flex items-center border-b px-3">
      <CommandInput
        className={cn(
          "placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        value={state.searchValue}
        onValueChange={(value) => {
          dispatch({ type: "set_search_value", value });
        }}
        {...props}
      />
    </div>
  );
}

function ComboboxOptions({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof CommandList>) {
  const state = useComboboxState();

  // Filter children based on search value
  const filteredChildren = React.Children.toArray(children).filter((child) => {
    if (!React.isValidElement(child)) return false;

    // If it's a ComboboxOption, check if it matches the search
    if (child.type === ComboboxOption) {
      const optionValue = (child.props as { value: string }).value;
      if (!state.searchValue) return true; // Show all if no search

      return optionValue
        .toLowerCase()
        .includes(state.searchValue.toLowerCase());
    }

    // If it's ComboboxEmpty, always show it
    if (child.type === ComboboxEmpty) return true;

    return true; // Show other children
  });

  return (
    <CommandList
      className={cn("max-h-[300px] overflow-y-auto", className)}
      {...props}
    >
      {filteredChildren}
    </CommandList>
  );
}

const comboboxOptionValueContext = createContext<string | undefined>(undefined);

function ComboboxOption({
  className,
  children,
  value,
  ...props
}: React.ComponentPropsWithoutRef<typeof CommandItem> & {
  value: string;
}) {
  const state = useComboboxState();
  const dispatch = useComboboxDispatch();
  const selected = state.selected.includes(value);

  return (
    <CommandItem
      className={cn(
        "flex my-1 mx-2 flex-row items-center justify-between gap-2 px-3 py-2 cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-sm",
        {
          "bg-accent text-accent-foreground": selected,
        },
        className
      )}
      value={value}
      onSelect={(currentValue: string) => {
        if (selected) {
          dispatch({ type: "deselect", value: currentValue });
        } else {
          dispatch({ type: "select", value: currentValue });
        }
        // Prevent the Command from closing the popover
        return false;
      }}
      {...props}
    >
      <comboboxOptionValueContext.Provider value={value}>
        <span className="flex-1">{children}</span>
        {selected && (
          <Check className="h-4 w-4 text-primary dark:text-od-bright-teal" />
        )}
      </comboboxOptionValueContext.Provider>
    </CommandItem>
  );
}

function ComboboxIndicator({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"span">) {
  const state = useComboboxState();
  const value = useContext(comboboxOptionValueContext);

  if (value === undefined) {
    return null;
  }

  const selected = state.selected.includes(value);

  return (
    <Slot
      className={cn({
        "opacity-100": selected,
        "opacity-0": !selected,
      })}
      aria-hidden={!selected}
      {...props}
    >
      {children}
    </Slot>
  );
}

function ComboboxEmpty({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof CommandEmpty>) {
  return (
    <CommandEmpty
      className={cn("py-6 text-center text-sm", className)}
      {...props}
    >
      {children}
    </CommandEmpty>
  );
}

export function ComboboxValues({
  placeholder,
  locale,
}: {
  placeholder: string;
  locale?: string;
}) {
  const state = useComboboxState();
  if (state.selected.length === 0) {
    return placeholder;
  }

  // Show only first 2 values, then "+more" if there are more
  const displayValues = state.selected.slice(0, 2);
  const remainingCount = state.selected.length - 2;

  return (
    <span className="truncate ">
      {displayValues.map((value, index) => {
        // Truncate long values (max 15 characters)
        const truncatedValue =
          value.length > 15 ? value.substring(0, 15) + "..." : value;

        return (
          <span key={index} className="font-medium">
            {truncatedValue}
            {index < displayValues.length - 1 && (
              <span className="text-muted-foreground">, </span>
            )}
          </span>
        );
      })}
      {remainingCount > 0 && (
        <span className="text-muted-foreground font-medium">
          +{remainingCount} more
        </span>
      )}
    </span>
  );
}

export function useSelectedValues() {
  const state = useComboboxState();
  return state.selected;
}

export {
  Combobox,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  ComboboxIndicator,
  ComboboxEmpty,
};
