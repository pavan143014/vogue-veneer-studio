import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from "xlsx";

export function BulkProductExport() {
  const [exporting, setExporting] = useState(false);

  const exportProducts = async (format: "csv" | "xlsx") => {
    setExporting(true);
    try {
      const { data: products, error } = await supabase
        .from("admin_products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (!products || products.length === 0) {
        toast.error("No products to export");
        setExporting(false);
        return;
      }

      const rows = products.map((p) => {
        const images = Array.isArray(p.images) ? (p.images as string[]) : [];
        const variants = Array.isArray(p.variants)
          ? (p.variants as { size?: string; color?: string; stock?: string; price?: string; sku?: string }[])
          : [];
        const tags = Array.isArray(p.tags) ? (p.tags as string[]).join(", ") : "";

        const row: Record<string, any> = {
          id: p.id,
          title: p.title,
          description: p.description || "",
          price: p.price,
          compare_at_price: p.compare_at_price || "",
          category: p.category || "",
          sku: p.sku || "",
          stock_quantity: p.stock_quantity ?? 0,
          is_active: p.is_active ?? true,
          tags,
          image_url: images[0] || "",
          image_url_2: images[1] || "",
          image_url_3: images[2] || "",
          image_url_4: images[3] || "",
          image_url_5: images[4] || "",
        };

        for (let n = 1; n <= 3; n++) {
          const v = variants[n - 1];
          row[`variant_${n}_size`] = v?.size || "";
          row[`variant_${n}_color`] = v?.color || "";
          row[`variant_${n}_stock`] = v?.stock || "";
          row[`variant_${n}_price`] = v?.price || "";
          row[`variant_${n}_sku`] = v?.sku || "";
        }

        return row;
      });

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(rows);
      ws["!cols"] = [
        { wch: 36 }, { wch: 30 }, { wch: 50 }, { wch: 10 }, { wch: 15 },
        { wch: 15 }, { wch: 18 }, { wch: 15 }, { wch: 10 }, { wch: 30 },
        { wch: 40 }, { wch: 40 }, { wch: 40 }, { wch: 40 }, { wch: 40 },
      ];
      XLSX.utils.book_append_sheet(wb, ws, "Products");

      const filename = `products_export_${new Date().toISOString().slice(0, 10)}`;
      if (format === "csv") {
        XLSX.writeFile(wb, `${filename}.csv`, { bookType: "csv", sheet: "Products" });
      } else {
        XLSX.writeFile(wb, `${filename}.xlsx`);
      }

      toast.success(`Exported ${products.length} products as ${format.toUpperCase()}`);
    } catch (err) {
      toast.error("Failed to export products");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex gap-1">
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5"
        disabled={exporting}
        onClick={() => exportProducts("csv")}
      >
        {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
        CSV
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5"
        disabled={exporting}
        onClick={() => exportProducts("xlsx")}
      >
        {exporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
        Excel
      </Button>
    </div>
  );
}
