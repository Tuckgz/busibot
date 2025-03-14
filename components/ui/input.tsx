import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, style, ...props }, ref) => {
    const [inputHeight, setInputHeight] = React.useState(40); // Default height
    const hiddenSpanRef = React.useRef<HTMLSpanElement | null>(null);
    const maxHeight = 120; // Approx. 5 lines

    const adjustHeight = (value: string) => {
      if (!hiddenSpanRef.current) return;
      hiddenSpanRef.current.textContent = value || " ";
      const computedHeight = Math.min(hiddenSpanRef.current.scrollHeight, maxHeight);
      setInputHeight(computedHeight);
    };

    return (
      <div className="relative w-full">
        {/* Hidden span to measure text width & determine line breaks */}
        <span
          ref={hiddenSpanRef}
          className="absolute invisible whitespace-pre-wrap break-words px-3 py-2 text-sm"
          style={{
            maxWidth: "100%",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        />

        <input
          {...props}
          ref={ref}
          className={cn(
            "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          style={{
            height: `${inputHeight}px`,
            overflowY: inputHeight >= maxHeight ? "auto" : "hidden",
            ...style,
          }}
          onChange={(e) => {
            adjustHeight(e.target.value);
            props.onChange?.(e);
          }}
        />
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
