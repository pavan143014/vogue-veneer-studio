import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Ticket,
  Loader2,
  Copy,
  Check,
  Percent,
  IndianRupee,
  Calendar,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { format } from "date-fns";

interface DiscountCode {
  id: string;
  code: string;
  description: string | null;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order_amount: number;
  max_uses: number | null;
  current_uses: number;
  is_active: boolean;
  starts_at: string;
  expires_at: string | null;
  created_at: string;
}

const AdminDiscounts = () => {
  const [discounts, setDiscounts] = useState<DiscountCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<DiscountCode | null>(null);
  const [saving, setSaving] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discount_type: "percentage" as "percentage" | "fixed",
    discount_value: "",
    min_order_amount: "",
    max_uses: "",
    is_active: true,
    expires_at: "",
  });

  const fetchDiscounts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("discount_codes")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setDiscounts(data as DiscountCode[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDiscounts();
  }, [fetchDiscounts]);

  const resetForm = () => {
    setFormData({
      code: "",
      description: "",
      discount_type: "percentage",
      discount_value: "",
      min_order_amount: "",
      max_uses: "",
      is_active: true,
      expires_at: "",
    });
    setEditingDiscount(null);
  };

  const openEditDialog = (discount: DiscountCode) => {
    setEditingDiscount(discount);
    setFormData({
      code: discount.code,
      description: discount.description || "",
      discount_type: discount.discount_type,
      discount_value: discount.discount_value.toString(),
      min_order_amount: discount.min_order_amount?.toString() || "",
      max_uses: discount.max_uses?.toString() || "",
      is_active: discount.is_active,
      expires_at: discount.expires_at ? discount.expires_at.split("T")[0] : "",
    });
    setIsDialogOpen(true);
  };

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, code });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const discountData = {
      code: formData.code.toUpperCase().trim(),
      description: formData.description || null,
      discount_type: formData.discount_type,
      discount_value: parseFloat(formData.discount_value),
      min_order_amount: formData.min_order_amount ? parseFloat(formData.min_order_amount) : 0,
      max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
      is_active: formData.is_active,
      expires_at: formData.expires_at ? new Date(formData.expires_at).toISOString() : null,
    };

    if (editingDiscount) {
      const { error } = await supabase
        .from("discount_codes")
        .update(discountData)
        .eq("id", editingDiscount.id);

      if (error) {
        toast.error("Failed to update discount code");
      } else {
        toast.success("Discount code updated!");
        fetchDiscounts();
        setIsDialogOpen(false);
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from("discount_codes")
        .insert(discountData);

      if (error) {
        if (error.code === "23505") {
          toast.error("This code already exists");
        } else {
          toast.error("Failed to create discount code");
        }
      } else {
        toast.success("Discount code created!");
        fetchDiscounts();
        setIsDialogOpen(false);
        resetForm();
      }
    }

    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this discount code?")) return;

    const { error } = await supabase.from("discount_codes").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete discount code");
    } else {
      toast.success("Discount code deleted");
      setDiscounts(discounts.filter((d) => d.id !== id));
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("discount_codes")
      .update({ is_active: !currentStatus })
      .eq("id", id);

    if (!error) {
      setDiscounts(discounts.map((d) => (d.id === id ? { ...d, is_active: !currentStatus } : d)));
      toast.success(currentStatus ? "Discount deactivated" : "Discount activated");
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success("Code copied!");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredDiscounts = discounts.filter(
    (d) =>
      d.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const isMaxedOut = (discount: DiscountCode) => {
    if (!discount.max_uses) return false;
    return discount.current_uses >= discount.max_uses;
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
          <h1 className="font-display text-3xl font-bold text-foreground">Discount Codes</h1>
          <p className="font-body text-muted-foreground">
            Create and manage promotional discount codes
          </p>
        </div>
        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={18} />
              Create Discount
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">
                {editingDiscount ? "Edit Discount Code" : "Create Discount Code"}
              </DialogTitle>
              <DialogDescription>
                {editingDiscount
                  ? "Update the discount code details below"
                  : "Create a new promotional discount code for your customers"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5 mt-4">
              {/* Code Input */}
              <div className="space-y-2">
                <Label htmlFor="code">Discount Code *</Label>
                <div className="flex gap-2">
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g., SUMMER20"
                    className="uppercase font-mono"
                    required
                  />
                  <Button type="button" variant="outline" onClick={generateCode}>
                    Generate
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Customers will enter this code at checkout
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g., Summer sale - 20% off"
                />
              </div>

              {/* Discount Type & Value */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Discount Type</Label>
                  <Select
                    value={formData.discount_type}
                    onValueChange={(value: "percentage" | "fixed") =>
                      setFormData({ ...formData, discount_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">
                        <span className="flex items-center gap-2">
                          <Percent size={14} /> Percentage
                        </span>
                      </SelectItem>
                      <SelectItem value="fixed">
                        <span className="flex items-center gap-2">
                          <IndianRupee size={14} /> Fixed Amount
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount_value">
                    {formData.discount_type === "percentage" ? "Percentage Off *" : "Amount Off (₹) *"}
                  </Label>
                  <Input
                    id="discount_value"
                    type="number"
                    min="0"
                    max={formData.discount_type === "percentage" ? "100" : undefined}
                    step={formData.discount_type === "percentage" ? "1" : "0.01"}
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                    placeholder={formData.discount_type === "percentage" ? "20" : "500"}
                    required
                  />
                </div>
              </div>

              {/* Min Order & Max Uses */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min_order_amount">Minimum Order (₹)</Label>
                  <Input
                    id="min_order_amount"
                    type="number"
                    min="0"
                    value={formData.min_order_amount}
                    onChange={(e) => setFormData({ ...formData, min_order_amount: e.target.value })}
                    placeholder="0"
                  />
                  <p className="text-xs text-muted-foreground">Leave empty for no minimum</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_uses">Usage Limit</Label>
                  <Input
                    id="max_uses"
                    type="number"
                    min="1"
                    value={formData.max_uses}
                    onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
                    placeholder="Unlimited"
                  />
                  <p className="text-xs text-muted-foreground">Leave empty for unlimited</p>
                </div>
              </div>

              {/* Expiry Date */}
              <div className="space-y-2">
                <Label htmlFor="expires_at">Expiry Date</Label>
                <Input
                  id="expires_at"
                  type="date"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                />
                <p className="text-xs text-muted-foreground">Leave empty for no expiry</p>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <div>
                  <Label htmlFor="is_active" className="cursor-pointer">
                    Active
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Customers can use this code immediately
                  </p>
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={saving} className="flex-1">
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : editingDiscount ? (
                    "Update Discount"
                  ) : (
                    "Create Discount"
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Ticket className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold">{discounts.length}</p>
                <p className="text-xs text-muted-foreground">Total Codes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold">
                  {discounts.filter((d) => d.is_active && !isExpired(d.expires_at)).length}
                </p>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <Users className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold">
                  {discounts.reduce((sum, d) => sum + d.current_uses, 0)}
                </p>
                <p className="text-xs text-muted-foreground">Total Uses</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                <Calendar className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold">
                  {discounts.filter((d) => isExpired(d.expires_at)).length}
                </p>
                <p className="text-xs text-muted-foreground">Expired</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search discount codes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Discounts Table */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-0">
          {filteredDiscounts.length === 0 ? (
            <div className="text-center py-12">
              <Ticket className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-lg text-foreground mb-2">No discount codes yet</h3>
              <p className="font-body text-muted-foreground mb-4">
                Create your first discount code to offer promotions
              </p>
              <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
                <Plus size={16} />
                Create Discount
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDiscounts.map((discount, index) => (
                  <motion.tr
                    key={discount.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="font-mono font-semibold text-foreground bg-muted px-2 py-1 rounded">
                          {discount.code}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => copyCode(discount.code)}
                        >
                          {copiedCode === discount.code ? (
                            <Check size={14} className="text-green-600" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </Button>
                      </div>
                      {discount.description && (
                        <p className="text-xs text-muted-foreground mt-1">{discount.description}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {discount.discount_type === "percentage" ? (
                          <>
                            <span className="font-display font-bold text-lg">
                              {discount.discount_value}%
                            </span>
                            <span className="text-xs text-muted-foreground">off</span>
                          </>
                        ) : (
                          <>
                            <span className="font-display font-bold text-lg">
                              ₹{discount.discount_value}
                            </span>
                            <span className="text-xs text-muted-foreground">off</span>
                          </>
                        )}
                      </div>
                      {discount.min_order_amount > 0 && (
                        <p className="text-xs text-muted-foreground">
                          Min. order: ₹{discount.min_order_amount}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span className="font-semibold">{discount.current_uses}</span>
                        <span className="text-muted-foreground">
                          {discount.max_uses ? ` / ${discount.max_uses}` : " uses"}
                        </span>
                      </div>
                      {discount.expires_at && (
                        <p className="text-xs text-muted-foreground">
                          {isExpired(discount.expires_at)
                            ? "Expired"
                            : `Expires ${format(new Date(discount.expires_at), "MMM d, yyyy")}`}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      {isExpired(discount.expires_at) ? (
                        <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                          Expired
                        </Badge>
                      ) : isMaxedOut(discount) ? (
                        <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-200">
                          Maxed Out
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className={
                            discount.is_active
                              ? "bg-green-50 text-green-600 border-green-200"
                              : "bg-gray-50 text-gray-600 border-gray-200"
                          }
                        >
                          {discount.is_active ? "Active" : "Inactive"}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Switch
                          checked={discount.is_active}
                          onCheckedChange={() => toggleActive(discount.id, discount.is_active)}
                          disabled={isExpired(discount.expires_at)}
                        />
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(discount)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(discount.id)}
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
    </div>
  );
};

export default AdminDiscounts;
