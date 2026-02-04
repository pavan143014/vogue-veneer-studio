import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Loader2, 
  Trash2, 
  Copy, 
  Check, 
  Image as ImageIcon,
  Search,
  RefreshCw,
  FolderOpen
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface StorageFile {
  name: string;
  id: string;
  created_at: string;
  metadata: {
    size: number;
    mimetype: string;
  };
}

export const StorageGallery = () => {
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const path = selectedFolder || "";
      const { data, error } = await supabase.storage
        .from("admin-uploads")
        .list(path, {
          limit: 100,
          sortBy: { column: "created_at", order: "desc" },
        });

      if (error) {
        console.error("Error fetching files:", error);
        toast.error("Failed to load images");
      } else {
        // Filter out folders (items without metadata) and .emptyFolderPlaceholder
        const imageFiles = (data || []).filter(
          (file) => file.metadata && !file.name.startsWith(".")
        ) as StorageFile[];
        setFiles(imageFiles);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFiles();
  }, [selectedFolder]);

  const getPublicUrl = (fileName: string) => {
    const path = selectedFolder ? `${selectedFolder}/${fileName}` : fileName;
    const { data } = supabase.storage.from("admin-uploads").getPublicUrl(path);
    return data.publicUrl;
  };

  const copyUrl = async (fileName: string) => {
    const url = getPublicUrl(fileName);
    await navigator.clipboard.writeText(url);
    setCopiedUrl(fileName);
    toast.success("URL copied to clipboard");
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const deleteFile = async (fileName: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    const path = selectedFolder ? `${selectedFolder}/${fileName}` : fileName;
    const { error } = await supabase.storage.from("admin-uploads").remove([path]);

    if (error) {
      toast.error("Failed to delete image");
    } else {
      toast.success("Image deleted");
      setFiles((prev) => prev.filter((f) => f.name !== fileName));
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const folders = ["storefront", "banners", "products", "general"];

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-display">Uploaded Images</CardTitle>
            <CardDescription>
              View and manage all uploaded images in storage
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchFiles} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Folder Tabs */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedFolder === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFolder(null)}
            className="gap-1"
          >
            <FolderOpen className="h-3 w-3" />
            All
          </Button>
          {folders.map((folder) => (
            <Button
              key={folder}
              variant={selectedFolder === folder ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFolder(folder)}
              className="capitalize"
            >
              {folder}
            </Button>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Gallery */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display text-lg text-foreground mb-2">
              No images found
            </h3>
            <p className="font-body text-muted-foreground">
              {selectedFolder
                ? `No images in the "${selectedFolder}" folder`
                : "Upload some images to see them here"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredFiles.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative group aspect-square"
                >
                  <img
                    src={getPublicUrl(file.name)}
                    alt={file.name}
                    className="w-full h-full object-cover rounded-lg border border-border"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center p-2">
                    <p className="text-white text-xs text-center truncate w-full mb-1">
                      {file.name}
                    </p>
                    <p className="text-white/70 text-[10px] mb-2">
                      {formatFileSize(file.metadata?.size || 0)}
                    </p>
                    <div className="flex gap-1">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => copyUrl(file.name)}
                      >
                        {copiedUrl === file.name ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => deleteFile(file.name)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {filteredFiles.length > 0 && (
          <p className="text-xs text-muted-foreground text-center">
            Showing {filteredFiles.length} image{filteredFiles.length !== 1 ? "s" : ""}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
