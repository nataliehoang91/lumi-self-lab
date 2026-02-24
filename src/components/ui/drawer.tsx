"use client";

import * as React from "react";
import { Drawer as VaulDrawer } from "vaul";

import { cn } from "@/lib/utils";

function Drawer({
  open,
  onOpenChange,
  direction = "bottom",
  modal = true,
  ...props
}: React.ComponentProps<typeof VaulDrawer.Root>) {
  return (
    <VaulDrawer.Root
      open={open}
      onOpenChange={onOpenChange}
      direction={direction}
      modal={modal}
      {...props}
    />
  );
}
Drawer.displayName = "Drawer";

const DrawerTrigger = VaulDrawer.Trigger;
DrawerTrigger.displayName = "DrawerTrigger";

const DrawerPortal = VaulDrawer.Portal;
DrawerPortal.displayName = "DrawerPortal";

const DrawerClose = VaulDrawer.Close;
DrawerClose.displayName = "DrawerClose";

function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof VaulDrawer.Overlay>) {
  return (
    <VaulDrawer.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  );
}
DrawerOverlay.displayName = "DrawerOverlay";

function DrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof VaulDrawer.Content>) {
  return (
    <DrawerPortal>
      <DrawerOverlay />
      <VaulDrawer.Content
        className={cn(
          "fixed z-50 flex flex-col bg-background shadow-xl",
          "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:max-h-[96vh] data-[vaul-drawer-direction=bottom]:rounded-t-[10px]",
          "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:max-h-[96vh] data-[vaul-drawer-direction=top]:rounded-b-[10px]",
          "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:max-w-[96vw] data-[vaul-drawer-direction=left]:rounded-r-[10px]",
          "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:max-w-[96vw] data-[vaul-drawer-direction=right]:rounded-l-[10px]",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[vaul-drawer-direction=bottom]:data-[state=closed]:slide-out-to-bottom data-[vaul-drawer-direction=bottom]:data-[state=open]:slide-in-from-bottom",
          "data-[vaul-drawer-direction=top]:data-[state=closed]:slide-out-to-top data-[vaul-drawer-direction=top]:data-[state=open]:slide-in-from-top",
          "data-[vaul-drawer-direction=left]:data-[state=closed]:slide-out-to-left data-[vaul-drawer-direction=left]:data-[state=open]:slide-in-from-left",
          "data-[vaul-drawer-direction=right]:data-[state=closed]:slide-out-to-right data-[vaul-drawer-direction=right]:data-[state=open]:slide-in-from-right",
          className
        )}
        {...props}
      >
        {children}
      </VaulDrawer.Content>
    </DrawerPortal>
  );
}
DrawerContent.displayName = "DrawerContent";

function DrawerHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
      {...props}
    />
  );
}
DrawerHeader.displayName = "DrawerHeader";

function DrawerFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  );
}
DrawerFooter.displayName = "DrawerFooter";

const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof VaulDrawer.Title>,
  React.ComponentPropsWithoutRef<typeof VaulDrawer.Title>
>(({ className, ...props }, ref) => (
  <VaulDrawer.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
DrawerTitle.displayName = "DrawerTitle";

const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof VaulDrawer.Description>,
  React.ComponentPropsWithoutRef<typeof VaulDrawer.Description>
>(({ className, ...props }, ref) => (
  <VaulDrawer.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DrawerDescription.displayName = "DrawerDescription";

export {
  Drawer,
  DrawerTrigger,
  DrawerPortal,
  DrawerClose,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
