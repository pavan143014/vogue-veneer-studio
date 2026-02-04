import { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories, CategoryWithChildren } from "@/hooks/useCategories";
import { FolderTree } from "lucide-react";

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CategorySelect({ value, onChange, placeholder = "Select category" }: CategorySelectProps) {
  const { categoryTree, loading } = useCategories();

  // Flatten tree with indentation for display
  const flattenedCategories = useMemo(() => {
    const result: { id: string; name: string; slug: string; depth: number }[] = [];
    
    const flatten = (categories: CategoryWithChildren[], depth: number = 0) => {
      categories.forEach(cat => {
        result.push({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          depth,
        });
        if (cat.children.length > 0) {
          flatten(cat.children, depth + 1);
        }
      });
    };
    
    flatten(categoryTree);
    return result;
  }, [categoryTree]);

  if (loading) {
    return (
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Loading categories..." />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="">
          <span className="text-muted-foreground">No category</span>
        </SelectItem>
        {flattenedCategories.length === 0 ? (
          <div className="px-2 py-4 text-center text-sm text-muted-foreground">
            <FolderTree className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No categories yet</p>
            <p className="text-xs">Create categories in the Categories section</p>
          </div>
        ) : (
          flattenedCategories.map((cat) => (
            <SelectItem key={cat.id} value={cat.slug}>
              <span style={{ paddingLeft: `${cat.depth * 12}px` }} className="flex items-center gap-2">
                {cat.depth > 0 && <span className="text-muted-foreground">└</span>}
                {cat.name}
              </span>
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}
