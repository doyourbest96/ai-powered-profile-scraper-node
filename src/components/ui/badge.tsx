import * as React from "react";

// Fix the empty interface error by adding React.HTMLAttributes
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  // Add at least one property to avoid the empty interface error
  variant?: string;
}

function Badge({ className, ...props }: BadgeProps) {
  return (
    <div
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80 ${
        className || ""
      }`}
      {...props}
    />
  );
}

export { Badge };
