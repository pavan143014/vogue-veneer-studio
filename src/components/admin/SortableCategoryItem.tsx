import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CategoryWithChildren } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  ChevronDown,
  GripVertical,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SortableCategoryItemProps {
  category: CategoryWithChildren;
  depth: number;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onAddSubcategory: (category: CategoryWithChildren) => void;
  onEdit: (category: CategoryWithChildren) => void;
  onDelete: (id: string, hasChildren: boolean) => void;
  renderChildren: (children: CategoryWithChildren[], depth: number) => React.ReactNode;
}

export function SortableCategoryItem({
  category,
  depth,
  isExpanded,
  onToggleExpand,
  onAddSubcategory,
  onEdit,
  onDelete,
  renderChildren,
}: SortableCategoryItemProps) {
  const hasChildren = category.children.length > 0;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="space-y-1">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`flex items-center gap-2 p-3 rounded-xl bg-muted/50 group hover:bg-muted transition-colors ${
          depth > 0 ? "ml-8 border-l-2 border-muted" : ""
        } ${isDragging ? "shadow-lg ring-2 ring-primary/20" : ""}`}
      >
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="touch-none cursor-grab active:cursor-grabbing p-1 rounded hover:bg-accent transition-colors"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>

        {/* Expand button */}
        <button
          onClick={() => onToggleExpand(category.id)}
          className="p-1 rounded hover:bg-accent transition-colors"
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )
          ) : (
            <div className="h-4 w-4" />
          )}
        </button>

        {/* Category image */}
        {category.image_url ? (
          <img 
            src={category.image_url} 
            alt={category.name}
            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-medium text-muted-foreground">
              {category.name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        {/* Category info */}
        <div className="flex-1 min-w-0">
          <p className="font-body font-medium text-foreground">{category.name}</p>
          <p className="text-xs text-muted-foreground">/category/{category.slug}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onAddSubcategory(category)}
            title="Add subcategory"
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(category)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(category.id, hasChildren)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {/* Children */}
      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-1"
          >
            {renderChildren(category.children, depth + 1)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
