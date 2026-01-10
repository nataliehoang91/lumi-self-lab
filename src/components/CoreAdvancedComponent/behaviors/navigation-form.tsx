"use client";

import type { ComponentProps } from "react";
import { useRouter } from "next/navigation";
import { Slot } from "@radix-ui/react-slot";
import {
  createContext,
  useContext,
  useRef,
  useTransition,
  useEffect,
} from "react";
import { Hidden, Visible } from "@/components/ui/reverse-layout";
import { composeRefs } from "../utils/compose-ref";
import { cn } from "@/lib/utils";

const FormRefContext =
  createContext<React.RefObject<HTMLFormElement | null> | null>(null);
const FormActionContext = createContext<string | null>(null);

const IsLoadingContext = createContext<boolean>(false);

export function useNavigationFormPending() {
  return useContext(IsLoadingContext);
}

export function NavigationForm({
  action,
  asChild,
  children,
  ref,
  className,
  preventReset = false,
  ...otherProps
}: Omit<ComponentProps<"form">, "action"> & {
  action: string;
  asChild?: boolean;
  preventReset?: boolean;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  // because we may use onSubmit, we can't rely on the React-DOM form status hook
  const [isLoading, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    // convert formData to a URLSearchParams object
    const searchParams = buildSearchParams(formData);
    const newHref = buildHref(action, searchParams);
    startTransition(() => {
      router.push(newHref, { scroll: false });
    });
  }

  const formProps = {
    ...otherProps,
    className: cn(className, "group"),
    "data-loading": isLoading ? "true" : undefined,
    ref: composeRefs(formRef, ref),
    // if preventReset is set to true, we use onSubmit with preventDefault
    onSubmit: preventReset
      ? (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          handleSubmit(new FormData(e.currentTarget));
          if (typeof otherProps.onSubmit === "function") {
            otherProps.onSubmit(e);
          }
        }
      : otherProps.onSubmit,

    // if preventReset is set to false, we use action
    action: preventReset ? undefined : handleSubmit,
  };

  if (asChild) {
    return (
      <IsLoadingContext.Provider value={isLoading}>
        <FormRefContext.Provider value={formRef}>
          <FormActionContext.Provider value={action}>
            <Slot {...formProps}>{children}</Slot>
          </FormActionContext.Provider>
        </FormRefContext.Provider>
      </IsLoadingContext.Provider>
    );
  }

  return (
    <IsLoadingContext.Provider value={isLoading}>
      <FormRefContext.Provider value={formRef}>
        <FormActionContext.Provider value={action}>
          <form {...formProps}>{children}</form>
        </FormActionContext.Provider>
      </FormRefContext.Provider>
    </IsLoadingContext.Provider>
  );
}

export function NavigationButton({
  formAction,
  searchParams,
  asChild,
  children,
  extraOnClick = () => {},
  ...otherProps
}: {
  formAction?: string;
  searchParams?: URLSearchParams;
  children: React.ReactNode;
  asChild?: boolean;
  extraOnClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
} & Omit<ComponentProps<"button">, "formAction" | "onClick">) {
  const router = useRouter();
  const formRef = useContext(FormRefContext);
  const baseAction = useContext(FormActionContext);

  const isFormLoading = useContext(IsLoadingContext);
  const [isLoading, startTransition] = useTransition();
  const combinedLoading = isFormLoading || isLoading;

  const pendingClickEventRef =
    useRef<React.MouseEvent<HTMLButtonElement> | null>(null);

  // Run extraOnClick when loading completes
  useEffect(() => {
    if (
      !combinedLoading &&
      pendingClickEventRef.current &&
      typeof extraOnClick === "function"
    ) {
      const event = pendingClickEventRef.current;
      pendingClickEventRef.current = null;
      extraOnClick(event);
    }
  }, [combinedLoading, extraOnClick]);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    const form = formRef?.current;

    if (!form) {
      // no form
      console.warn("no form");
      return;
    }

    // get the form data
    const obj = new URLSearchParams(searchParams);

    const base = formAction ?? baseAction;
    if (!base) {
      // no base action
      console.warn("no base action");
      return;
    }

    const newHref = buildHref(base, obj);

    // Store the click event to use when loading completes
    pendingClickEventRef.current = e;

    startTransition(() => {
      router.push(newHref.toString(), { scroll: false });
    });
  }

  const buttonProps = {
    ...otherProps,
    onClick: handleClick,
  };

  if (asChild) {
    return (
      <IsLoadingContext.Provider value={combinedLoading}>
        <Slot {...buttonProps}>{children}</Slot>
      </IsLoadingContext.Provider>
    );
  }

  return (
    <IsLoadingContext.Provider value={combinedLoading}>
      <button {...buttonProps}>{children}</button>
    </IsLoadingContext.Provider>
  );
}

export function NavigationSubmitMessage({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLoading = useContext(IsLoadingContext);

  if (isLoading) {
    return <Hidden>{children}</Hidden>;
  }

  return <Visible>{children}</Visible>;
}

export function NavigationLoadingMessage({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLoading = useContext(IsLoadingContext);
  if (isLoading) {
    return <Visible>{children}</Visible>;
  }
  return <Hidden>{children}</Hidden>;
}

function buildSearchParams(formData: FormData) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of formData.entries()) {
    if (Array.isArray(value)) {
      for (const item of value) {
        searchParams.append(key, item);
      }
    } else if (typeof value === "string") {
      searchParams.append(key, value);
    } else {
      // ignore other types
    }
  }

  return searchParams;
}

function buildHref(action: string, searchParams: URLSearchParams) {
  const newHref = new URL(action, window.location.origin);
  newHref.search = searchParams.toString();
  return newHref.toString();
}
