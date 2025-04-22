"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/lib/utils";

// Context to track if we're on a touch device
const TouchContext = React.createContext<boolean | undefined>(undefined);
const useTouch = () => React.useContext(TouchContext);

// Modified TooltipProvider that sets up touch detection
const TooltipProvider = ({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Provider>) => {
  const [isTouch, setIsTouch] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  return (
    <TouchContext.Provider value={isTouch}>
      <TooltipPrimitive.Provider {...props}>
        {children}
      </TooltipPrimitive.Provider>
    </TouchContext.Provider>
  );
};

// Use either Tooltip or Popover based on touch device detection
const Tooltip = (
  props: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root> &
    React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Root>,
) => {
  const isTouch = useTouch();
  return isTouch ? (
    <PopoverPrimitive.Root {...props} />
  ) : (
    <TooltipPrimitive.Root {...props} />
  );
};

// Use either TooltipTrigger or PopoverTrigger based on touch device detection
const TooltipTrigger = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Trigger> &
    React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>
>(({ ...props }, ref) => {
  const isTouch = useTouch();
  return isTouch ? (
    <PopoverPrimitive.Trigger ref={ref} {...props} />
  ) : (
    <TooltipPrimitive.Trigger ref={ref} {...props} />
  );
});
TooltipTrigger.displayName = TooltipPrimitive.Trigger.displayName;

// Use either TooltipContent or PopoverContent based on touch device detection
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> &
    React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => {
  const isTouch = useTouch();

  if (isTouch) {
    return (
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={ref}
          sideOffset={sideOffset}
          align="center"
          className={cn(
            "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            className,
          )}
          {...props}
        />
      </PopoverPrimitive.Portal>
    );
  }

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          "z-50 origin-[--radix-tooltip-content-transform-origin] overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          className,
        )}
        {...props}
      />
    </TooltipPrimitive.Portal>
  );
});
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
