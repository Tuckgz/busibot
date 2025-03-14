import React, { useState, forwardRef, ChangeEvent } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Input = forwardRef<HTMLTextAreaElement, InputProps>(
  ({ className, onInput, ...props }, ref) => {
    const [height, setHeight] = useState("40px"); // Default height

    const handleInput = (event: ChangeEvent<HTMLTextAreaElement>) => {
      const target = event.target;
      target.style.height = "40px"; // Reset to default height
      target.style.height = `${Math.min(target.scrollHeight, 160)}px`; // Expand up to 5 lines (160px max)
    };

    return (
      <textarea
        ref={ref}
        className={cn(
          "flex w-full max-h-[160px] resize-none overflow-y-auto rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        rows={1}
        onInput={handleInput}
        style={{ height }}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export { Input };
