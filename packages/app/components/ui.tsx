"use client";

import { forwardRef, ReactNode, cloneElement } from "react";
import { cn } from "@/lib/utils";

export const Button = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
  asChild?: boolean;
}>(
  ({ className, variant = "primary", size = "md", asChild = false, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    };

    const sizes = {
      sm: "h-9 rounded-md px-3 text-xs",
      md: "h-10 px-4 py-2 text-sm",
      lg: "h-11 rounded-lg px-8 text-base",
      icon: "h-10 w-10",
    };

    const classes = cn(baseStyles, variants[variant], sizes[size], className);

    if (asChild && typeof children === "object" && (children as React.ReactElement)?.type) {
      const child = children as React.ReactElement<{ className?: string }>;
      return cloneElement(child, { className: cn(classes, child.props.className), ...props });
    }

    return (
      <button
        ref={ref}
        className={classes}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export const Label = forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}
        {...props}
      />
    );
  }
);

Label.displayName = "Label";

export const Card = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("rounded-xl border bg-card text-card-foreground shadow-sm", className)} {...props} />
  )
);

Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
);

CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  )
);

CardTitle.displayName = "CardTitle";

export const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
);

CardDescription.displayName = "CardDescription";

export const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);

CardContent.displayName = "CardContent";

export const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  )
);

CardFooter.displayName = "CardFooter";

export const Badge = forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "secondary" | "destructive" | "outline" }>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
      secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
      destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
      outline: "text-foreground",
    };

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export const Separator = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { orientation?: "horizontal" | "vertical" }>(
  ({ className, orientation = "horizontal", ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
);

Separator.displayName = "Separator";

Separator.displayName = "Separator";

export const Avatar = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { src?: string; alt?: string; fallback?: ReactNode }>(
  ({ className, src, alt, fallback, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
      {...props}
    >
      {src ? (
        <img src={src} alt={alt} className="aspect-square h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
          {fallback}
        </div>
      )}
    </div>
  )
);

Avatar.displayName = "Avatar";

export { Switch } from "./switch";
export { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";

export const DropdownMenu = ({ children, className, align, ...props }: { children: ReactNode; className?: string; align?: "start" | "end"; } & React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("relative inline-block text-left", className)} {...props}>{children}</div>
);
export const DropdownMenuTrigger = ({ children, asChild, ...props }: { children: ReactNode; asChild?: boolean } & React.HTMLAttributes<HTMLDivElement>) => {
  if (asChild && typeof children === "object" && children !== null) {
    const child = children as React.ReactElement<{ className?: string }>;
    return cloneElement(child, { className: cn(child.props.className), ...props });
  }
  return <div className="cursor-pointer" {...props}>{children}</div>;
};
export const DropdownMenuContent = ({ children, className, align = "end", ...props }: { children: ReactNode; className?: string; align?: "start" | "end" } & React.HTMLAttributes<HTMLDivElement>) => (
  <div 
    className={cn(
      "absolute right-0 top-full mt-1.5 z-50 min-w-[11rem] w-max rounded-xl border border-slate-700 bg-[#18181B] p-1.5 text-slate-100 shadow-2xl backdrop-blur-md animate-in fade-in-80 zoom-in-95",
      align === "start" ? "left-0 right-auto" : "right-0 left-auto",
      className
    )} 
    {...props}
  >
    {children}
  </div>
);
export const DropdownMenuItem = ({ children, onClick, className, ...props }: { children: ReactNode; onClick?: () => void; className?: string } & React.HTMLAttributes<HTMLDivElement>) => (
  <div 
    onClick={onClick} 
    className={cn("flex cursor-pointer select-none items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-200 outline-none hover:bg-slate-800 hover:text-white transition-colors whitespace-nowrap", className)} 
    {...props}
  >
    {children}
  </div>
);
export const DropdownMenuSeparator = () => <Separator className="-mx-1 my-1.5 h-px bg-slate-800" />;