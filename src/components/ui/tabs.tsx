import * as React from "react";

// Fix the empty interface error by adding a property
interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={`${className || ""}`} {...props} />
  )
);
Tabs.displayName = "Tabs";

// Fix the empty interface error by adding a property
interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: string;
}

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={`inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground ${
        className || ""
      }`}
      {...props}
    />
  )
);
TabsList.displayName = "TabsList";

interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, value, ...props }, ref) => {
    const [activeTab, setActiveTab] = React.useState<string>("");

    React.useEffect(() => {
      // Find parent Tabs component and get default value
      const parent = document.querySelector("[data-state]");
      if (parent) {
        setActiveTab(parent.getAttribute("data-state") || "");
      }
    }, []);

    const isActive = activeTab === value;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      setActiveTab(value);
      if (props.onClick) props.onClick(e);

      // Find all TabsContent elements and hide/show based on value
      document.querySelectorAll("[data-tab-content]").forEach((el) => {
        if (el.getAttribute("data-tab-content") === value) {
          (el as HTMLElement).style.display = "block";
        } else {
          (el as HTMLElement).style.display = "none";
        }
      });
    };

    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
          isActive
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        } ${className || ""}`}
        onClick={handleClick}
        {...props}
      />
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, value, ...props }, ref) => {
    // Set display style based on whether this is the default tab
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
      // Find parent Tabs component and check if this is the default tab
      const parent = document.querySelector("[data-state]");
      if (parent) {
        const defaultValue = parent.getAttribute("data-state") || "";
        setIsVisible(defaultValue === value);
      }
    }, [value]);

    return (
      <div
        ref={ref}
        data-tab-content={value}
        style={{ display: isVisible ? "block" : "none" }}
        className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
          className || ""
        }`}
        {...props}
      />
    );
  }
);
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
