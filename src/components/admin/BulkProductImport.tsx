import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
  Upload,
  Download,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  Loader2,
  X,
  RefreshCw,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from "xlsx";

interface ParsedVariant {
  size: string;
  color: string;
  stock: string;
  price: string;
  sku: string;
}

interface ParsedProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  category: string;
  sku: string;
  stock_quantity: number;
  is_active: boolean;
  tags: string[];
  images: string[];
  variants: ParsedVariant[];
  _row: number;
  _errors: string[];
  _mode: "create" | "update";
}

interface BulkProductImportProps {
  onComplete: () => void;
}

const SAMPLE_DATA = [
  {
    id: "",
    title: "Silk Embroidered Kurthi",
    description: "Beautiful silk kurthi with intricate embroidery work",
    price: 1299,
    compare_at_price: 1999,
    category: "kurthis",
    sku: "SKU-SILK-001",
    stock_quantity: 25,
    is_active: true,
    tags: "silk, embroidered, festive",
    image_url: "https://example.com/silk-kurthi.jpg",
    image_url_2: "https://example.com/silk-kurthi-back.jpg",
    image_url_3: "",
    image_url_4: "",
    image_url_5: "",
    variant_1_size: "S",
    variant_1_color: "Red",
    variant_1_stock: 10,
    variant_1_price: 1299,
    variant_1_sku: "SKU-SILK-001-S-RED",
    variant_2_size: "M",
    variant_2_color: "Red",
    variant_2_stock: 15,
    variant_2_price: 1299,
    variant_2_sku: "SKU-SILK-001-M-RED",
    variant_3_size: "",
    variant_3_color: "",
    variant_3_stock: "",
    variant_3_price: "",
    variant_3_sku: "",
  },
  {
    id: "",
    title: "Cotton Printed Dress",
    description: "Comfortable cotton dress with block print pattern",
    price: 899,
    compare_at_price: 1299,
    category: "dresses",
    sku: "SKU-CTN-002",
    stock_quantity: 40,
    is_active: true,
    tags: "cotton, casual, block-print",
    image_url: "https://example.com/cotton-dress.jpg",
    image_url_2: "",
    image_url_3: "",
    image_url_4: "",
    image_url_5: "",
    variant_1_size: "Free Size",
    variant_1_color: "Blue",
    variant_1_stock: 40,
    variant_1_price: 899,
    variant_1_sku: "SKU-CTN-002-FS-BLU",
    variant_2_size: "",
    variant_2_color: "",
    variant_2_stock: "",
    variant_2_price: "",
    variant_2_sku: "",
    variant_3_size: "",
    variant_3_color: "",
    variant_3_stock: "",
    variant_3_price: "",
    variant_3_sku: "",
  },
  {
    id: "",
    title: "Chikankari Anarkali Set",
    description: "Elegant Lucknow chikankari work on premium georgette",
    price: 2499,
    compare_at_price: 3499,
    category: "kurthis",
    sku: "SKU-CHK-003",
    stock_quantity: 10,
    is_active: true,
    tags: "chikankari, premium, anarkali",
    image_url: "https://example.com/chikankari.jpg",
    image_url_2: "https://example.com/chikankari-detail.jpg",
    image_url_3: "",
    image_url_4: "",
    image_url_5: "",
    variant_1_size: "M",
    variant_1_color: "White",
    variant_1_stock: 5,
    variant_1_price: 2499,
    variant_1_sku: "SKU-CHK-003-M-WHT",
    variant_2_size: "L",
    variant_2_color: "White",
    variant_2_stock: 5,
    variant_2_price: 2499,
    variant_2_sku: "SKU-CHK-003-L-WHT",
    variant_3_size: "",
    variant_3_color: "",
    variant_3_stock: "",
    variant_3_price: "",
    variant_3_sku: "",
  },
];

export function BulkProductImport({ onComplete }: BulkProductImportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [parsedProducts, setParsedProducts] = useState<ParsedProduct[]>([]);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importResults, setImportResults] = useState<{
    created: number;
    updated: number;
    failed: number;
    skipped: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = (format: "csv" | "xlsx") => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(SAMPLE_DATA);

    // Set column widths for readability
    ws["!cols"] = [
      { wch: 36 }, // id
      { wch: 30 }, // title
      { wch: 50 }, // description
      { wch: 10 }, // price
      { wch: 15 }, // compare_at_price
      { wch: 15 }, // category
      { wch: 18 }, // sku
      { wch: 15 }, // stock_quantity
      { wch: 10 }, // is_active
      { wch: 30 }, // tags
      { wch: 40 }, // image_url
      { wch: 40 }, // image_url_2
      { wch: 40 }, // image_url_3
      { wch: 40 }, // image_url_4
      { wch: 40 }, // image_url_5
    ];

    // Add instructions sheet
    const instructions = [
      ["Bulk Product Import — Instructions"],
      [""],
      ["COLUMNS REFERENCE"],
      ["Column", "Required", "Description"],
      ["id", "No", "Leave empty to CREATE a new product. Provide an existing product UUID to UPDATE it."],
      ["title", "Yes", "Product title / name"],
      ["description", "No", "Full product description (HTML allowed)"],
      ["price", "Yes", "Selling price (number)"],
      ["compare_at_price", "No", "Original / MRP price for showing discount (number)"],
      ["category", "No", "Category slug, e.g. kurthis, dresses, accessories"],
      ["sku", "No", "Stock Keeping Unit — unique product code. Used for matching during update-or-create."],
      ["stock_quantity", "No", "Total stock count (number, defaults to 0)"],
      ["is_active", "No", "TRUE = published, FALSE = draft (defaults to TRUE)"],
      ["tags", "No", "Comma-separated tags, e.g. silk, festive, premium"],
      ["image_url", "No", "Primary product image URL"],
      ["image_url_2 – image_url_5", "No", "Additional image URLs (up to 5 total)"],
      [""],
      ["VARIANTS (up to 3 per row)"],
      ["variant_N_size", "No", "Size label, e.g. S, M, L, XL, Free Size"],
      ["variant_N_color", "No", "Color name, e.g. Red, Blue, White"],
      ["variant_N_stock", "No", "Stock for this variant (number)"],
      ["variant_N_price", "No", "Price override for this variant (number)"],
      ["variant_N_sku", "No", "SKU for this variant"],
      [""],
      ["IMPORT BEHAVIOR"],
      ["• If 'id' is provided and matches an existing product → UPDATE that product"],
      ["• If 'id' is empty but 'sku' matches an existing product → UPDATE that product"],
      ["• If neither match → CREATE a new product"],
      ["• Rows with errors (missing title, invalid price) are skipped"],
    ];
    const wsInstructions = XLSX.utils.aoa_to_sheet(instructions);
    wsInstructions["!cols"] = [{ wch: 30 }, { wch: 10 }, { wch: 80 }];

    XLSX.utils.book_append_sheet(wb, wsInstructions, "Instructions");
    XLSX.utils.book_append_sheet(wb, ws, "Products");

    if (format === "csv") {
      // For CSV, only export the Products sheet
      XLSX.writeFile(wb, "product_import_template.csv", { bookType: "csv", sheet: "Products" });
    } else {
      XLSX.writeFile(wb, "product_import_template.xlsx");
    }
    toast.success(`Template downloaded as ${format.toUpperCase()}`);
  };

  const parseFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });
        // Find "Products" sheet or fall back to first sheet
        const sheetName = wb.SheetNames.includes("Products") ? "Products" : wb.SheetNames[0];
        const ws = wb.Sheets[sheetName];
        const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(ws);

        if (rows.length === 0) {
          toast.error("File is empty or has no data rows");
          return;
        }

        // Fetch existing products for SKU matching
        const { data: existingProducts } = await supabase
          .from("admin_products")
          .select("id, sku, title");

        const skuMap = new Map<string, string>();
        const idSet = new Set<string>();
        if (existingProducts) {
          existingProducts.forEach((p) => {
            idSet.add(p.id);
            if (p.sku) skuMap.set(p.sku.toLowerCase(), p.id);
          });
        }

        const parsed: ParsedProduct[] = rows.map((row, i) => {
          const errors: string[] = [];
          const rowId = String(row.id || "").trim();
          const title = String(row.title || "").trim();
          const price = parseFloat(row.price);
          const compare = row.compare_at_price
            ? parseFloat(row.compare_at_price)
            : null;
          const stock = parseInt(row.stock_quantity) || 0;
          const sku = String(row.sku || "").trim();

          // Determine create vs update
          let mode: "create" | "update" = "create";
          let resolvedId = "";

          if (rowId && idSet.has(rowId)) {
            mode = "update";
            resolvedId = rowId;
          } else if (sku && skuMap.has(sku.toLowerCase())) {
            mode = "update";
            resolvedId = skuMap.get(sku.toLowerCase())!;
          }

          // Collect image URLs
          const images: string[] = [];
          const primaryImg = String(row.image_url || "").trim();
          if (primaryImg) images.push(primaryImg);
          for (let n = 2; n <= 5; n++) {
            const img = String(row[`image_url_${n}`] || "").trim();
            if (img) images.push(img);
          }

          // Collect variants (up to 5)
          const variants: ParsedVariant[] = [];
          for (let n = 1; n <= 5; n++) {
            const vSize = String(row[`variant_${n}_size`] || "").trim();
            const vColor = String(row[`variant_${n}_color`] || "").trim();
            if (vSize || vColor) {
              variants.push({
                size: vSize,
                color: vColor,
                stock: String(row[`variant_${n}_stock`] ?? "0").trim(),
                price: String(row[`variant_${n}_price`] ?? "").trim(),
                sku: String(row[`variant_${n}_sku`] || "").trim(),
              });
            }
          }

          // Parse tags
          const tags = String(row.tags || "").trim()
            ? String(row.tags).split(",").map((t: string) => t.trim()).filter(Boolean)
            : [];

          // Validation
          if (!title) errors.push("Title is required");
          if (isNaN(price) || price <= 0) errors.push("Invalid price");
          if (compare !== null && isNaN(compare)) errors.push("Invalid compare price");
          if (rowId && !idSet.has(rowId) && rowId.length > 0) {
            errors.push("ID not found — will create new");
          }

          return {
            id: resolvedId,
            title,
            description: String(row.description || "").trim(),
            price: isNaN(price) ? 0 : price,
            compare_at_price: compare,
            category: String(row.category || "").trim(),
            sku,
            stock_quantity: stock,
            is_active:
              row.is_active === false || row.is_active === "false" || row.is_active === 0 || row.is_active === "FALSE"
                ? false
                : true,
            tags,
            images,
            variants,
            _row: i + 2,
            _errors: errors,
            _mode: mode,
          };
        });

        setParsedProducts(parsed);
        setImportResults(null);
        toast.success(`Parsed ${parsed.length} products from file`);
      } catch (err) {
        toast.error("Failed to parse file. Ensure it's a valid CSV or Excel file.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["csv", "xlsx", "xls"].includes(ext || "")) {
      toast.error("Please upload a CSV or Excel file");
      return;
    }

    parseFile(file);
    e.target.value = "";
  };

  const startImport = async () => {
    const validProducts = parsedProducts.filter((p) => p._errors.length === 0);
    if (validProducts.length === 0) {
      toast.error("No valid products to import");
      return;
    }

    setImporting(true);
    setProgress(0);
    let created = 0;
    let updated = 0;
    let failed = 0;
    let skipped = 0;

    const toCreate = validProducts.filter((p) => p._mode === "create");
    const toUpdate = validProducts.filter((p) => p._mode === "update");
    const total = validProducts.length;
    let processed = 0;

    // Batch CREATE in chunks of 20
    const chunkSize = 20;
    for (let i = 0; i < toCreate.length; i += chunkSize) {
      const chunk = toCreate.slice(i, i + chunkSize).map((p) => ({
        title: p.title,
        description: p.description || null,
        price: p.price,
        compare_at_price: p.compare_at_price,
        category: p.category || null,
        sku: p.sku || null,
        stock_quantity: p.stock_quantity,
        is_active: p.is_active,
        tags: p.tags.length > 0 ? p.tags : null,
        images: p.images,
        variants: p.variants.map((v) => ({
          id: crypto.randomUUID(),
          size: v.size,
          color: v.color,
          stock: v.stock,
          price: v.price,
          sku: v.sku,
        })),
      }));

      const { error } = await supabase.from("admin_products").insert(chunk);
      if (error) {
        failed += chunk.length;
      } else {
        created += chunk.length;
      }
      processed += chunk.length;
      setProgress(Math.round((processed / total) * 100));
    }

    // UPDATE one by one (each has a unique ID)
    for (const p of toUpdate) {
      const updateData: Record<string, any> = {
        title: p.title,
        description: p.description || null,
        price: p.price,
        compare_at_price: p.compare_at_price,
        category: p.category || null,
        sku: p.sku || null,
        stock_quantity: p.stock_quantity,
        is_active: p.is_active,
        tags: p.tags.length > 0 ? p.tags : null,
        images: p.images,
        variants: p.variants.map((v) => ({
          id: crypto.randomUUID(),
          size: v.size,
          color: v.color,
          stock: v.stock,
          price: v.price,
          sku: v.sku,
        })),
      };

      const { error } = await supabase
        .from("admin_products")
        .update(updateData)
        .eq("id", p.id);

      if (error) {
        failed++;
      } else {
        updated++;
      }
      processed++;
      setProgress(Math.round((processed / total) * 100));
    }

    skipped = parsedProducts.filter((p) => p._errors.length > 0).length;

    setImportResults({ created, updated, failed, skipped });
    setImporting(false);

    if (created > 0 || updated > 0) {
      toast.success(`Import complete: ${created} created, ${updated} updated`);
      onComplete();
    }
    if (failed > 0) {
      toast.error(`${failed} products failed to import`);
    }
  };

  const validCount = parsedProducts.filter((p) => p._errors.length === 0).length;
  const errorCount = parsedProducts.filter((p) => p._errors.length > 0).length;
  const createCount = parsedProducts.filter((p) => p._errors.length === 0 && p._mode === "create").length;
  const updateCount = parsedProducts.filter((p) => p._errors.length === 0 && p._mode === "update").length;

  return (
    <>
      <Button
        variant="outline"
        className="gap-2"
        onClick={() => setIsOpen(true)}
      >
        <Upload size={18} />
        Bulk Import
      </Button>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            setParsedProducts([]);
            setImportResults(null);
            setProgress(0);
          }
        }}
      >
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Bulk Import Products
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              WordPress-style import — create new products or update existing ones by ID/SKU.
            </p>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Step 1: Download Template */}
            <Card className="border-dashed">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-primary">1</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-body font-semibold text-foreground mb-1">
                      Download Template
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Download a template with sample data and an instructions sheet explaining every column.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => downloadTemplate("csv")}
                        className="gap-1.5"
                      >
                        <Download size={14} />
                        CSV Template
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => downloadTemplate("xlsx")}
                        className="gap-1.5"
                      >
                        <Download size={14} />
                        Excel Template (with Instructions)
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Upload File */}
            <Card className="border-dashed">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-primary">2</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-body font-semibold text-foreground mb-1">
                      Upload Your File
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Upload a CSV or Excel file. Required:{" "}
                      <span className="font-medium text-foreground">title</span> and{" "}
                      <span className="font-medium text-foreground">price</span>.{" "}
                      Leave <span className="font-medium text-foreground">id</span> empty to create new products,
                      or provide an existing ID/SKU to update.
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-1.5"
                    >
                      <FileSpreadsheet size={14} />
                      Choose File
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 3: Preview & Import */}
            {parsedProducts.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-primary">3</span>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="font-body font-semibold text-foreground mb-2">
                          Review & Import
                        </h3>
                        <div className="flex flex-wrap gap-3 text-sm">
                          <span className="flex items-center gap-1.5 text-foreground">
                            <Plus size={14} className="text-emerald-600" />
                            {createCount} new
                          </span>
                          <span className="flex items-center gap-1.5 text-foreground">
                            <RefreshCw size={14} className="text-blue-600" />
                            {updateCount} updates
                          </span>
                          {errorCount > 0 && (
                            <span className="flex items-center gap-1.5 text-destructive">
                              <AlertCircle size={14} />
                              {errorCount} with errors
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Preview Table */}
                      <div className="max-h-72 overflow-auto rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-16">Row</TableHead>
                              <TableHead className="w-20">Action</TableHead>
                              <TableHead>Title</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead>SKU</TableHead>
                              <TableHead>Tags</TableHead>
                              <TableHead>Images</TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead>Stock</TableHead>
                              <TableHead>Variants</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {parsedProducts.map((p, i) => (
                              <TableRow
                                key={i}
                                className={
                                  p._errors.length > 0 ? "bg-destructive/5" : ""
                                }
                              >
                                <TableCell className="text-xs text-muted-foreground">
                                  {p._row}
                                </TableCell>
                                <TableCell>
                                  {p._errors.length > 0 ? (
                                    <Badge variant="destructive" className="text-[10px]">
                                      Skip
                                    </Badge>
                                  ) : p._mode === "update" ? (
                                    <Badge className="text-[10px] bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100">
                                      Update
                                    </Badge>
                                  ) : (
                                    <Badge className="text-[10px] bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
                                      Create
                                    </Badge>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <span className="text-sm font-medium">
                                      {p.title || "(empty)"}
                                    </span>
                                    {p._errors.length > 0 && (
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {p._errors.map((err, j) => (
                                          <Badge
                                            key={j}
                                            variant="destructive"
                                            className="text-[10px]"
                                          >
                                            {err}
                                          </Badge>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="text-sm">
                                  ₹{p.price.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {p.sku || "—"}
                                </TableCell>
                                <TableCell className="text-sm">
                                  {p.tags.length > 0 ? (
                                    <div className="flex flex-wrap gap-1 max-w-[120px]">
                                      {p.tags.slice(0, 2).map((tag, j) => (
                                        <Badge key={j} variant="outline" className="text-[10px]">
                                          {tag}
                                        </Badge>
                                      ))}
                                      {p.tags.length > 2 && (
                                        <span className="text-[10px] text-muted-foreground">
                                          +{p.tags.length - 2}
                                        </span>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground">—</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-sm">
                                  {p.images.length > 0 ? (
                                    <Badge variant="outline" className="text-xs">
                                      {p.images.length} img
                                    </Badge>
                                  ) : (
                                    <span className="text-muted-foreground">—</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-sm">
                                  {p.category || "—"}
                                </TableCell>
                                <TableCell className="text-sm">
                                  {p.stock_quantity}
                                </TableCell>
                                <TableCell className="text-sm">
                                  {p.variants.length > 0 ? (
                                    <Badge variant="outline" className="text-xs">
                                      {p.variants.length} var
                                    </Badge>
                                  ) : (
                                    <span className="text-muted-foreground">—</span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant="outline"
                                    className={
                                      p.is_active
                                        ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                        : "bg-muted text-muted-foreground"
                                    }
                                  >
                                    {p.is_active ? "Active" : "Draft"}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Progress */}
                      {importing && (
                        <div className="space-y-2">
                          <Progress value={progress} className="h-2" />
                          <p className="text-xs text-muted-foreground text-center">
                            Importing... {progress}%
                          </p>
                        </div>
                      )}

                      {/* Results */}
                      {importResults && (
                        <div className="flex flex-wrap gap-3 text-sm p-3 rounded-lg bg-muted/50">
                          {importResults.created > 0 && (
                            <span className="flex items-center gap-1.5">
                              <Plus size={14} className="text-emerald-600" />
                              {importResults.created} created
                            </span>
                          )}
                          {importResults.updated > 0 && (
                            <span className="flex items-center gap-1.5">
                              <RefreshCw size={14} className="text-blue-600" />
                              {importResults.updated} updated
                            </span>
                          )}
                          {importResults.skipped > 0 && (
                            <span className="flex items-center gap-1.5 text-muted-foreground">
                              <AlertCircle size={14} />
                              {importResults.skipped} skipped
                            </span>
                          )}
                          {importResults.failed > 0 && (
                            <span className="flex items-center gap-1.5 text-destructive">
                              <X size={14} />
                              {importResults.failed} failed
                            </span>
                          )}
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          onClick={startImport}
                          disabled={importing || validCount === 0}
                          className="gap-1.5"
                        >
                          {importing ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Upload size={14} />
                          )}
                          {importing
                            ? "Importing..."
                            : `Import ${validCount} Products (${createCount} new, ${updateCount} update)`}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setParsedProducts([]);
                            setImportResults(null);
                          }}
                        >
                          Clear
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
