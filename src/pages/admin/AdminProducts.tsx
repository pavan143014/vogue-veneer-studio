import { useState } from "react";
import { useAdminData } from "@/hooks/useAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  Loader2,
  ImagePlus,
  Filter,
  X,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { MultiImageUpload } from "@/components/admin/ImageUpload";
import { CategorySelect } from "@/components/admin/CategorySelect";
import { ProductVariantsEditor, ProductVariant } from "@/components/admin/ProductVariantsEditor";
import { BulkProductImport } from "@/components/admin/BulkProductImport";
import { BulkProductExport } from "@/components/admin/BulkProductExport";

const ITEMS_PER_PAGE = 20;

const AdminProducts = () => {
  const { products, loading, createProduct, updateProduct, deleteProduct, fetchData } =
    useAdminData();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterStock, setFilterStock] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    compare_at_price: "",
    category: "",
    sku: "",
    stock_quantity: "",
    is_active: true,
    images: [] as string[],
    variants: [] as ProductVariant[],
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      compare_at_price: "",
      category: "",
      sku: "",
      stock_quantity: "",
      is_active: true,
      images: [],
      variants: [],
    });
    setEditingProduct(null);
  };

  const openEditDialog = (product: any) => {
    setEditingProduct(product);
    const rawVariants = Array.isArray(product.variants) ? product.variants : [];
    setFormData({
      title: product.title,
      description: product.description || "",
      price: product.price.toString(),
      compare_at_price: product.compare_at_price?.toString() || "",
      category: product.category || "",
      sku: product.sku || "",
      stock_quantity: product.stock_quantity?.toString() || "0",
      is_active: product.is_active,
      images: product.images || [],
      variants: rawVariants.map((v: any) => ({
        id: v.id || crypto.randomUUID(),
        size: v.size || "",
        color: v.color || "",
        price: v.price?.toString() || "",
        stock: v.stock?.toString() || "0",
        sku: v.sku || "",
      })),
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const serializedVariants = formData.variants.map((v) => ({
        id: v.id,
        size: v.size,
        color: v.color,
        price: v.price ? parseFloat(v.price) : null,
        stock: parseInt(v.stock) || 0,
        sku: v.sku,
      }));

      const productData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        compare_at_price: formData.compare_at_price
          ? parseFloat(formData.compare_at_price)
          : null,
        category: formData.category,
        sku: formData.sku,
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        is_active: formData.is_active,
        images: formData.images,
        variants: serializedVariants,
      };

      if (editingProduct) {
        const { error } = await updateProduct(editingProduct.id, productData);
        if (error) {
          toast.error("Failed to update product");
        } else {
          toast.success("Product updated successfully");
          setIsDialogOpen(false);
          resetForm();
        }
      } else {
        const { error } = await createProduct(productData);
        if (error) {
          toast.error("Failed to create product");
        } else {
          toast.success("Product created successfully");
          setIsDialogOpen(false);
          resetForm();
        }
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const { error } = await deleteProduct(id);
    if (error) {
      toast.error("Failed to delete product");
    } else {
      toast.success("Product deleted");
    }
  };

  // Derive unique categories for filter
  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  ).sort() as string[];

  const hasActiveFilters = filterCategory !== "all" || filterStatus !== "all" || filterStock !== "all";

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory === "all" || p.category === filterCategory;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && p.is_active) ||
      (filterStatus === "draft" && !p.is_active);
    const matchesStock =
      filterStock === "all" ||
      (filterStock === "in_stock" && (p.stock_quantity ?? 0) > 5) ||
      (filterStock === "low_stock" && (p.stock_quantity ?? 0) > 0 && (p.stock_quantity ?? 0) <= 5) ||
      (filterStock === "out_of_stock" && (p.stock_quantity ?? 0) === 0);

    return matchesSearch && matchesCategory && matchesStatus && matchesStock;
  });

  const clearFilters = () => {
    setFilterCategory("all");
    setFilterStatus("all");
    setFilterStock("all");
    setSearchQuery("");
    setCurrentPage(1);
  };

  // Reset page when filters/search change
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };
  const handleFilterChange = (setter: (v: string) => void) => (value: string) => {
    setter(value);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Products
          </h1>
          <p className="font-body text-muted-foreground">
            Manage your store products
          </p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <div className="flex gap-2 items-center">
            <BulkProductExport />
            <BulkProductImport onComplete={fetchData} />
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={18} />
                Add Product
              </Button>
            </DialogTrigger>
          </div>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Product Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <CategorySelect
                    value={formData.category}
                    onChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                    placeholder="Select a category"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="compare_at_price">Compare Price</Label>
                  <Input
                    id="compare_at_price"
                    type="number"
                    step="0.01"
                    value={formData.compare_at_price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        compare_at_price: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock_quantity">Stock</Label>
                  <Input
                    id="stock_quantity"
                    type="number"
                    value={formData.stock_quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stock_quantity: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) =>
                    setFormData({ ...formData, sku: e.target.value })
                  }
                  placeholder="Product SKU"
                />
              </div>

              {/* Image Upload */}
              <MultiImageUpload
                label="Product Images"
                value={formData.images}
                onChange={(images) => setFormData({ ...formData, images })}
                folder="products"
                maxImages={5}
              />

              {/* Variants */}
              <ProductVariantsEditor
                variants={formData.variants}
                onChange={(variants) => setFormData({ ...formData, variants })}
                basePrice={formData.price}
              />

              <div className="flex items-center gap-3">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked })
                  }
                />
                <Label htmlFor="is_active">Product is active</Label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={saving} className="flex-1">
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : editingProduct ? (
                    "Update Product"
                  ) : (
                    "Create Product"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search & Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, SKU, or category..."
              value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Filter size={14} className="text-muted-foreground" />
            <Select value={filterCategory} onValueChange={handleFilterChange(setFilterCategory)}>
              <SelectTrigger className="w-[160px] h-9 text-sm">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={handleFilterChange(setFilterStatus)}>
              <SelectTrigger className="w-[130px] h-9 text-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStock} onValueChange={handleFilterChange(setFilterStock)}>
              <SelectTrigger className="w-[140px] h-9 text-sm">
                <SelectValue placeholder="Stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stock</SelectItem>
                <SelectItem value="in_stock">In Stock</SelectItem>
                <SelectItem value="low_stock">Low Stock (≤5)</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 h-9 text-xs text-muted-foreground">
                <X size={12} />
                Clear filters
              </Button>
            )}
            <span className="text-xs text-muted-foreground ml-auto">
              {filteredProducts.length} of {products.length} products
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-0">
          {paginatedProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-lg text-foreground mb-2">
                No products found
              </h3>
              <p className="font-body text-muted-foreground">
                Create your first product to get started
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.map((product, index) => (
                  <motion.tr
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImagePlus className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="font-body font-medium text-foreground">
                            {product.title}
                          </p>
                          {product.sku && (
                            <p className="font-body text-xs text-muted-foreground">
                              SKU: {product.sku}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-body text-sm">
                        {product.category || "-"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div>
                        <span className="font-display font-semibold">
                          ₹{product.price}
                        </span>
                        {product.compare_at_price && (
                          <span className="font-body text-xs text-muted-foreground line-through ml-2">
                            ₹{product.compare_at_price}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`font-body text-sm ${
                          product.stock_quantity <= 5
                            ? "text-red-600"
                            : "text-foreground"
                        }`}
                      >
                        {product.stock_quantity}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          product.is_active
                            ? "bg-green-50 text-green-600 border-green-200"
                            : "bg-gray-50 text-gray-600 border-gray-200"
                        }
                      >
                        {product.is_active ? "Active" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(product)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} products
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
              .reduce<(number | string)[]>((acc, page, idx, arr) => {
                if (idx > 0 && page - (arr[idx - 1] as number) > 1) acc.push("...");
                acc.push(page);
                return acc;
              }, [])
              .map((item, idx) =>
                typeof item === "string" ? (
                  <span key={`ellipsis-${idx}`} className="px-1 text-muted-foreground text-sm">…</span>
                ) : (
                  <Button
                    key={item}
                    variant={currentPage === item ? "default" : "outline"}
                    size="sm"
                    className="min-w-[36px]"
                    onClick={() => setCurrentPage(item)}
                  >
                    {item}
                  </Button>
                )
              )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
