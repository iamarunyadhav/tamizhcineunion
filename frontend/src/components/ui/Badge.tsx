import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors font-body",
  {
    variants: {
      variant: {
        default:
          "bg-secondary text-secondary-foreground",
        primary:
          "bg-primary/20 text-primary border border-primary/30",
        secondary:
          "bg-secondary text-secondary-foreground",
        outline:
          "border border-border text-muted-foreground",
        gold:
          "bg-gold/20 text-gold border border-gold/30",
        success:
          "bg-teal/20 text-teal border border-teal/30",
        destructive:
          "bg-destructive/20 text-destructive border border-destructive/30",
        // Project type badges
        film:
          "bg-gold/20 text-gold border border-gold/30",
        theatre:
          "bg-burgundy/20 text-burgundy border border-burgundy/30",
        music:
          "bg-teal/20 text-teal border border-teal/30",
        visual:
          "bg-accent/20 text-accent border border-accent/30",
        documentary:
          "bg-muted text-muted-foreground border border-muted",
        // Status badges
        ongoing:
          "bg-gold/20 text-gold animate-pulse-glow",
        completed:
          "bg-teal/20 text-teal border border-teal/30",
        upcoming:
          "bg-muted text-muted-foreground border border-muted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
