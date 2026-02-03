import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  GripVertical,
  Edit2,
  Trash2,
  Plus,
  ChevronDown,
  ChevronRight,
  Link as LinkIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

export interface MenuItem {
  id: string;
  label: string;
  href: string;
  children?: MenuItem[];
}

interface SortableChildItemProps {
  child: MenuItem;
  parentId: string;
  onEdit: (item: MenuItem, parentId?: string) => void;
  onDelete: (id: string, parentId?: string) => void;
}

const SortableChildItem = ({
  child,
  parentId,
  onEdit,
  onDelete,
}: SortableChildItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: child.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 p-2.5 rounded-lg bg-muted/30 group hover:bg-muted/50 transition-colors ${
        isDragging ? "opacity-50 shadow-lg ring-2 ring-primary/50 z-50" : ""
      }`}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
    >
      {/* Drag handle for child */}
      <button
        {...attributes}
        {...listeners}
        className="touch-none cursor-grab active:cursor-grabbing p-1 rounded hover:bg-accent transition-colors"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-3.5 w-3.5 text-muted-foreground" />
      </button>

      <div className="flex-1 min-w-0">
        <p className="font-body text-sm font-medium text-foreground">
          {child.label}
        </p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <LinkIcon size={9} />
          <span className="truncate">{child.href}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => onEdit(child, parentId)}
        >
          <Edit2 className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-destructive hover:text-destructive"
          onClick={() => onDelete(child.id, parentId)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </motion.div>
  );
};

interface SortableMenuItemProps {
  item: MenuItem;
  depth?: number;
  onEdit: (item: MenuItem, parentId?: string) => void;
  onDelete: (id: string, parentId?: string) => void;
  onAddChild: (parentId: string) => void;
  onChildDragEnd?: (parentId: string, event: DragEndEvent) => void;
}

export const SortableMenuItem = ({
  item,
  depth = 0,
  onEdit,
  onDelete,
  onAddChild,
  onChildDragEnd,
}: SortableMenuItemProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = item.children && item.children.length > 0;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleChildDragEnd = (event: DragEndEvent) => {
    if (onChildDragEnd) {
      onChildDragEnd(item.id, event);
    }
  };

  return (
    <div className="space-y-1">
      <motion.div
        ref={setNodeRef}
        style={style}
        className={`flex items-center gap-2 p-3 rounded-xl bg-muted/50 group hover:bg-muted transition-colors ${
          isDragging ? "opacity-50 shadow-lg ring-2 ring-primary/50 z-50" : ""
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="touch-none cursor-grab active:cursor-grabbing p-1 rounded hover:bg-accent transition-colors"
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>

        {/* Expand/Collapse button for items with children or at root level */}
        {depth < 2 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded hover:bg-accent transition-colors"
            aria-label={isExpanded ? "Collapse" : "Expand"}
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
        )}

        {/* Item content */}
        <div className="flex-1 min-w-0">
          <p className="font-body font-medium text-foreground">{item.label}</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <LinkIcon size={10} />
            <span className="truncate">{item.href}</span>
            {hasChildren && (
              <span className="ml-2 px-1.5 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-medium">
                {item.children!.length} sub-item{item.children!.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {depth < 2 && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onAddChild(item.id)}
              title="Add sub-item"
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(item)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(item.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {/* Children with drag-and-drop */}
      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="ml-8 pl-4 border-l-2 border-muted space-y-1"
          >
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleChildDragEnd}
            >
              <SortableContext
                items={item.children!.map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                {item.children!.map((child) => (
                  <SortableChildItem
                    key={child.id}
                    child={child}
                    parentId={item.id}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
