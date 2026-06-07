import { cn } from "@/lib/utils";

export function Panel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-card p-5 flex flex-col",
        "dark:bg-card dark:border-border/40",
        className
      )}
    >
      {children}
    </div>
  );
}

export function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground mb-3">
      {children}
    </p>
  );
}
