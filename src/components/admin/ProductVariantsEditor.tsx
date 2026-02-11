import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Palette, Ruler } from "lucide-react";

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  price: string;
  stock: string;
  sku: string;
}

interface ProductVariantsEditorProps {
  variants: ProductVariant[];
  onChange: (variants: ProductVariant[]) => void;
  basePrice?: string;
}

const generateId = () => crypto.randomUUID();

const COMMON_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];
const COMMON_COLORS = [
  "Red", "Blue", "Green", "Black", "White", "Yellow",
  "Pink", "Orange", "Purple", "Brown", "Grey", "Navy",
  "Maroon", "Beige", "Teal", "Gold",
];

export function ProductVariantsEditor({ variants, onChange, basePrice }: ProductVariantsEditorProps) {
  const [showSizePicker, setShowSizePicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const addVariant = () => {
    onChange([
      ...variants,
      { id: generateId(), size: "", color: "", price: basePrice || "", stock: "0", sku: "" },
    ]);
  };

  const updateVariant = (id: string, field: keyof ProductVariant, value: string) => {
    onChange(variants.map((v) => (v.id === id ? { ...v, [field]: value } : v)));
  };

  const removeVariant = (id: string) => {
    onChange(variants.filter((v) => v.id !== id));
  };

  const addBulkSizes = (sizes: string[]) => {
    const existingSizes = new Set(variants.map((v) => v.size));
    const newVariants = sizes
      .filter((s) => !existingSizes.has(s))
      .map((size) => ({
        id: generateId(),
        size,
        color: "",
        price: basePrice || "",
        stock: "0",
        sku: "",
      }));
    onChange([...variants, ...newVariants]);
    setShowSizePicker(false);
  };

  const addBulkColors = (colors: string[]) => {
    const existingColors = new Set(variants.map((v) => v.color));
    const newVariants = colors
      .filter((c) => !existingColors.has(c))
      .map((color) => ({
        id: generateId(),
        size: "",
        color,
        price: basePrice || "",
        stock: "0",
        sku: "",
      }));
    onChange([...variants, ...newVariants]);
    setShowColorPicker(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Product Variants</Label>
        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => setShowSizePicker(!showSizePicker)}>
            <Ruler className="h-3.5 w-3.5 mr-1" /> Add Sizes
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setShowColorPicker(!showColorPicker)}>
            <Palette className="h-3.5 w-3.5 mr-1" /> Add Colors
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={addVariant}>
            <Plus className="h-3.5 w-3.5 mr-1" /> Custom
          </Button>
        </div>
      </div>

      {/* Quick Size Picker */}
      {showSizePicker && (
        <Card className="border-dashed">
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground mb-2">Click sizes to add as variants:</p>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_SIZES.map((size) => {
                const exists = variants.some((v) => v.size === size);
                return (
                  <Badge
                    key={size}
                    variant={exists ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${exists ? "opacity-50" : "hover:bg-primary hover:text-primary-foreground"}`}
                    onClick={() => !exists && addBulkSizes([size])}
                  >
                    {size}
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Color Picker */}
      {showColorPicker && (
        <Card className="border-dashed">
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground mb-2">Click colors to add as variants:</p>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_COLORS.map((color) => {
                const exists = variants.some((v) => v.color === color);
                return (
                  <Badge
                    key={color}
                    variant={exists ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${exists ? "opacity-50" : "hover:bg-primary hover:text-primary-foreground"}`}
                    onClick={() => !exists && addBulkColors([color])}
                  >
                    {color}
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Variant List */}
      {variants.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4 border rounded-md border-dashed">
          No variants yet. Add sizes or colors to create variants.
        </p>
      ) : (
        <div className="space-y-3">
          {variants.map((variant, index) => (
            <Card key={variant.id} className="border shadow-sm">
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  <span className="text-xs font-medium text-muted-foreground mt-2.5 w-5 shrink-0">
                    #{index + 1}
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 flex-1">
                    <div>
                      <Label className="text-xs text-muted-foreground">Size</Label>
                      <Input
                        value={variant.size}
                        onChange={(e) => updateVariant(variant.id, "size", e.target.value)}
                        placeholder="e.g. M"
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Color</Label>
                      <Input
                        value={variant.color}
                        onChange={(e) => updateVariant(variant.id, "color", e.target.value)}
                        placeholder="e.g. Red"
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Price (₹)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={variant.price}
                        onChange={(e) => updateVariant(variant.id, "price", e.target.value)}
                        placeholder="Price"
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Stock</Label>
                      <Input
                        type="number"
                        value={variant.stock}
                        onChange={(e) => updateVariant(variant.id, "stock", e.target.value)}
                        placeholder="0"
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">SKU</Label>
                      <Input
                        value={variant.sku}
                        onChange={(e) => updateVariant(variant.id, "sku", e.target.value)}
                        placeholder="SKU"
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive shrink-0 mt-4"
                    onClick={() => removeVariant(variant.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {variants.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {variants.length} variant{variants.length !== 1 ? "s" : ""} configured. 
          Leave price empty to use the base product price.
        </p>
      )}
    </div>
  );
}
