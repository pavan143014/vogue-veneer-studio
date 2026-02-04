import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

interface CategoryDropZoneProps {
  id: string;
  label: string;
  isOver?: boolean;
  className?: string;
}

export function CategoryDropZone({ id, label, className }: CategoryDropZoneProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "h-1 rounded-full transition-all duration-200",
        isOver 
          ? "h-8 bg-primary/20 border-2 border-dashed border-primary flex items-center justify-center" 
          : "bg-transparent",
        className
      )}
    >
      {isOver && (
        <span className="text-xs font-medium text-primary">{label}</span>
      )}
    </div>
  );
}
