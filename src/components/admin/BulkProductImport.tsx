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
}

interface BulkProductImportProps {
  onComplete: () => void;
}

const TEMPLATE_COLUMNS = [
  "title",
  "description",
  "price",
  "compare_at_price",
  "category",
  "sku",
  "stock_quantity",
  "is_active",
];

const SAMPLE_DATA = [
  {
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
  },
  {
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
  },
  {
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
  },
];

export function BulkProductImport({ onComplete }: BulkProductImportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [parsedProducts, setParsedProducts] = useState<ParsedProduct[]>([]);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importResults, setImportResults] = useState<{
    success: number;
    failed: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = (format: "csv" | "xlsx") => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(SAMPLE_DATA);

    // Set column widths
    ws["!cols"] = [
      { wch: 30 }, { wch: 50 }, { wch: 10 }, { wch: 15 },
      { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 10 },
      { wch: 40 }, { wch: 40 },
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Products");

    if (format === "csv") {
      XLSX.writeFile(wb, "product_import_template.csv", { bookType: "csv" });
    } else {
      XLSX.writeFile(wb, "product_import_template.xlsx");
    }
    toast.success(`Template downloaded as ${format.toUpperCase()}`);
  };

  const parseFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(ws);

        if (rows.length === 0) {
          toast.error("File is empty or has no data rows");
          return;
        }

        const parsed: ParsedProduct[] = rows.map((row, i) => {
          const errors: string[] = [];
          const title = String(row.title || "").trim();
          const price = parseFloat(row.price);
          const compare = row.compare_at_price
            ? parseFloat(row.compare_at_price)
            : null;
          const stock = parseInt(row.stock_quantity) || 0;

          // Collect image URLs from image_url, image_url_2, ..., image_url_5
          const images: string[] = [];
          const primaryImg = String(row.image_url || "").trim();
          if (primaryImg) images.push(primaryImg);
          for (let n = 2; n <= 5; n++) {
            const img = String(row[`image_url_${n}`] || "").trim();
            if (img) images.push(img);
          }

          // Collect variants from variant_1_size, variant_1_color, etc. up to 5
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

          if (!title) errors.push("Title is required");
          if (isNaN(price) || price <= 0) errors.push("Invalid price");
          if (compare !== null && isNaN(compare)) errors.push("Invalid compare price");

          return {
            title,
            description: String(row.description || "").trim(),
            price: isNaN(price) ? 0 : price,
            compare_at_price: compare,
            category: String(row.category || "").trim(),
            sku: String(row.sku || "").trim(),
            stock_quantity: stock,
            is_active:
              row.is_active === false || row.is_active === "false" || row.is_active === 0
                ? false
                : true,
            tags: String(row.tags || "").trim()
              ? String(row.tags).split(",").map((t: string) => t.trim()).filter(Boolean)
              : [],
            images,
            variants,
            _row: i + 2,
            _errors: errors,
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

    const validTypes = [
      "text/csv",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
    ];
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!validTypes.includes(file.type) && !["csv", "xlsx", "xls"].includes(ext || "")) {
      toast.error("Please upload a CSV or Excel file");
      return;
    }

    parseFile(file);
    // Reset file input so same file can be re-selected
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
    let success = 0;
    let failed = 0;

    // Batch insert in chunks of 20
    const chunkSize = 20;
    for (let i = 0; i < validProducts.length; i += chunkSize) {
      const chunk = validProducts.slice(i, i + chunkSize).map((p) => ({
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
        success += chunk.length;
      }
      setProgress(Math.round(((i + chunk.length) / validProducts.length) * 100));
    }

    setImportResults({ success, failed });
    setImporting(false);

    if (success > 0) {
      toast.success(`Successfully imported ${success} products`);
      onComplete();
    }
    if (failed > 0) {
      toast.error(`Failed to import ${failed} products`);
    }
  };

  const validCount = parsedProducts.filter((p) => p._errors.length === 0).length;
  const errorCount = parsedProducts.filter((p) => p._errors.length > 0).length;

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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Bulk Import Products
            </DialogTitle>
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
                      Download a template with sample data to see the expected format.
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
                        Excel Template
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
                      Upload a CSV or Excel file with your product data. Required columns:{" "}
                      <span className="font-medium text-foreground">title</span> and{" "}
                      <span className="font-medium text-foreground">price</span>. Optional:{" "}
                      <span className="font-medium text-foreground">image_url</span> through{" "}
                      <span className="font-medium text-foreground">image_url_5</span> for up to 5 images.
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
                        <h3 className="font-body font-semibold text-foreground mb-1">
                          Review & Import
                        </h3>
                        <div className="flex gap-3 text-sm">
                          <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle size={14} />
                            {validCount} valid
                          </span>
                          {errorCount > 0 && (
                            <span className="flex items-center gap-1 text-destructive">
                              <AlertCircle size={14} />
                              {errorCount} with errors
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Preview Table */}
                      <div className="max-h-64 overflow-auto rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-12">Row</TableHead>
                              <TableHead>Title</TableHead>
                              <TableHead>Price</TableHead>
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
                                <TableCell className="text-sm">
                                  {p.images.length > 0 ? (
                                    <Badge variant="outline" className="text-xs">
                                      {p.images.length} image{p.images.length !== 1 ? "s" : ""}
                                    </Badge>
                                  ) : (
                                    <span className="text-muted-foreground">—</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-sm">
                                  {p.category || "-"}
                                </TableCell>
                                <TableCell className="text-sm">
                                  {p.stock_quantity}
                                </TableCell>
                                <TableCell className="text-sm">
                                  {p.variants.length > 0 ? (
                                    <Badge variant="outline" className="text-xs">
                                      {p.variants.length} variant{p.variants.length !== 1 ? "s" : ""}
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
                                        ? "bg-green-50 text-green-600 border-green-200"
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
                        <div className="flex gap-3 text-sm p-3 rounded-lg bg-muted/50">
                          <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle size={14} />
                            {importResults.success} imported
                          </span>
                          {importResults.failed > 0 && (
                            <span className="flex items-center gap-1 text-destructive">
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
                            : `Import ${validCount} Products`}
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
