import { useMemo } from "react";
import { useCategories, CategoryWithChildren } from "@/hooks/useCategories";
import { FolderTree } from "lucide-react";
import { Label } from "@/components/ui/label";

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
      <select disabled className="flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
        <option>Loading categories...</option>
      </select>
    );
  }

  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="flex h-10 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    >
      <option value="">{placeholder}</option>
      {flattenedCategories.map((cat) => (
        <option key={cat.id} value={cat.slug}>
          {"—".repeat(cat.depth)} {cat.name}
        </option>
      ))}
    </select>
  );
}
