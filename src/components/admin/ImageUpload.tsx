import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2, Image as ImageIcon, Link2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
  className?: string;
  aspectRatio?: "square" | "video" | "banner";
}

export const ImageUpload = ({
  value,
  onChange,
  label = "Image",
  folder = "general",
  className,
  aspectRatio = "square",
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const aspectRatioClass = {
    square: "aspect-square",
    video: "aspect-video",
    banner: "aspect-[3/1]",
  }[aspectRatio];

  const uploadImage = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }

      setUploading(true);

      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from("admin-uploads")
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          console.error("Upload error:", error);
          toast.error("Failed to upload image");
          return;
        }

        const { data: urlData } = supabase.storage
          .from("admin-uploads")
          .getPublicUrl(data.path);

        onChange(urlData.publicUrl);
        toast.success("Image uploaded!");
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Failed to upload image");
      } finally {
        setUploading(false);
      }
    },
    [folder, onChange]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) {
        uploadImage(file);
      }
    },
    [uploadImage]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput("");
      setShowUrlInput(false);
      toast.success("Image URL added");
    }
  };

  const removeImage = () => {
    onChange("");
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label className="font-body text-sm">{label}</Label>}

      {value ? (
        <div className="relative group">
          <div
            className={cn(
              "relative overflow-hidden rounded-lg border border-border bg-muted",
              aspectRatioClass
            )}
          >
            <img
              src={value}
              alt="Uploaded"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={removeImage}
                className="gap-1"
              >
                <X size={14} />
                Remove
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Upload Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
              "relative border-2 border-dashed rounded-lg transition-colors cursor-pointer",
              aspectRatioClass,
              dragOver
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50",
              uploading && "pointer-events-none opacity-50"
            )}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              {uploading ? (
                <>
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Uploading...</p>
                </>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground text-center">
                    <span className="text-primary font-medium">Click to upload</span>
                    <br />
                    or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG, WebP up to 5MB
                  </p>
                </>
              )}
            </div>
          </div>

          {/* URL Input Toggle */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-border" />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-xs text-muted-foreground hover:text-foreground gap-1"
            >
              <Link2 size={12} />
              {showUrlInput ? "Hide URL input" : "Or paste URL"}
            </Button>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* URL Input */}
          {showUrlInput && (
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com/image.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleUrlSubmit}
                disabled={!urlInput.trim()}
              >
                Add
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  folder?: string;
  maxImages?: number;
  className?: string;
}

export const MultiImageUpload = ({
  value = [],
  onChange,
  label = "Images",
  folder = "products",
  maxImages = 5,
  className,
}: MultiImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const uploadImage = useCallback(
    async (file: File) => {
      if (value.length >= maxImages) {
        toast.error(`Maximum ${maxImages} images allowed`);
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }

      setUploading(true);

      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from("admin-uploads")
          .upload(fileName, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (error) {
          console.error("Upload error:", error);
          toast.error("Failed to upload image");
          return;
        }

        const { data: urlData } = supabase.storage
          .from("admin-uploads")
          .getPublicUrl(data.path);

        onChange([...value, urlData.publicUrl]);
        toast.success("Image uploaded!");
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("Failed to upload image");
      } finally {
        setUploading(false);
      }
    },
    [folder, onChange, value, maxImages]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) {
        uploadImage(file);
      }
    },
    [uploadImage]
  );

  const handleUrlSubmit = () => {
    if (urlInput.trim() && value.length < maxImages) {
      onChange([...value, urlInput.trim()]);
      setUrlInput("");
      setShowUrlInput(false);
      toast.success("Image URL added");
    }
  };

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const moveImage = (from: number, to: number) => {
    const newImages = [...value];
    const [removed] = newImages.splice(from, 1);
    newImages.splice(to, 0, removed);
    onChange(newImages);
  };

  return (
    <div className={cn("space-y-3", className)}>
      {label && <Label className="font-body text-sm">{label}</Label>}

      {/* Image Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {value.map((url, index) => (
            <div key={index} className="relative group aspect-square">
              <img
                src={url}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover rounded-lg border border-border"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/placeholder.svg";
                }}
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-1">
                {index > 0 && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => moveImage(index, index - 1)}
                  >
                    ←
                  </Button>
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => removeImage(index)}
                >
                  <X size={12} />
                </Button>
                {index < value.length - 1 && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => moveImage(index, index + 1)}
                  >
                    →
                  </Button>
                )}
              </div>
              {index === 0 && (
                <div className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded">
                  Main
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {value.length < maxImages && (
        <div className="space-y-2">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            className={cn(
              "relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer",
              dragOver
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50",
              uploading && "pointer-events-none opacity-50"
            )}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading}
            />
            <div className="flex flex-col items-center">
              {uploading ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Uploading...</p>
                </>
              ) : (
                <>
                  <ImageIcon className="h-6 w-6 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground text-center">
                    <span className="text-primary font-medium">Click to upload</span> or drag
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {value.length}/{maxImages} images
                  </p>
                </>
              )}
            </div>
          </div>

          {/* URL Input */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-xs text-muted-foreground"
            >
              <Link2 size={12} className="mr-1" />
              {showUrlInput ? "Hide" : "Add URL"}
            </Button>
          </div>

          {showUrlInput && (
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com/image.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUrlSubmit()}
              />
              <Button type="button" variant="outline" onClick={handleUrlSubmit}>
                Add
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
