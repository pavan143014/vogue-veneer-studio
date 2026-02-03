import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Menu, Plus, Eye } from "lucide-react";
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
import { SortableMenuItem, MenuItem } from "./SortableMenuItem";
import { MenuPreviewDialog } from "./MenuPreviewDialog";

interface MenuItemsListProps {
  menu: {
    id: string;
    name: string;
    items: MenuItem[];
  } | null;
  menuType: "header" | "footer";
  onAddItem: () => void;
  onEditItem: (item: MenuItem, parentId?: string) => void;
  onDeleteItem: (id: string, parentId?: string) => void;
  onAddChild: (parentId: string) => void;
  onDragEnd: (event: DragEndEvent) => void;
}

export const MenuItemsList = ({
  menu,
  menuType,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onAddChild,
  onDragEnd,
}: MenuItemsListProps) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
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

  if (!menu) return null;

  const items = menu.items as MenuItem[];

  return (
    <>
      <Card className="border-0 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-display text-xl">{menu.name}</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Drag items to reorder • Click + to add sub-items
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsPreviewOpen(true)}
              className="gap-2"
              disabled={items.length === 0}
            >
              <Eye size={16} />
              Preview
            </Button>
            <Button size="sm" onClick={onAddItem} className="gap-2">
              <Plus size={16} />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {items?.length === 0 ? (
            <div className="text-center py-12">
              <Menu className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-lg text-foreground mb-2">
                No menu items
              </h3>
              <p className="font-body text-muted-foreground">
                Add your first menu item to get started
              </p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={onDragEnd}
            >
              <SortableContext
                items={items.map((i) => i.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {items.map((item) => (
                    <SortableMenuItem
                      key={item.id}
                      item={item}
                      onEdit={onEditItem}
                      onDelete={onDeleteItem}
                      onAddChild={onAddChild}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>

      <MenuPreviewDialog
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        menuType={menuType}
        items={items}
      />
    </>
  );
};
