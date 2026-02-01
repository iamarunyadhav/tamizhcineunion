import { cn } from "@/lib/utils";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  gradient?: boolean;
}

export function SectionTitle({ 
  title, 
  subtitle, 
  align = 'center',
  className,
  gradient = true 
}: SectionTitleProps) {
  return (
    <div 
      className={cn(
        "mb-12",
        align === 'center' && "text-center",
        align === 'right' && "text-right",
        className
      )}
    >
      <h2 
        className={cn(
          "font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight",
          gradient ? "text-gradient" : "text-foreground"
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
