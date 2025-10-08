"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useCategories } from "@/hooks/useCategories";

interface TextureFormData {
  name: string;
  description: string;
  category: string;
  image: string;
  imagePublicId?: string;
  images: Array<{
    url: string;
    publicId?: string;
    alt: string;
    isPrimary: boolean;
  }>;
  resolution: string;
  format: string;
  tags: string[];
  featured: boolean;
  trending: boolean;
  adminNotes: string;
}

interface TextureFormProps {
  initialData?: Partial<TextureFormData>;
  textureId?: string;
}

export function ProductForm({ initialData, textureId }: TextureFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const { categories } = useCategories();

  const [formData, setFormData] = useState<TextureFormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    category: initialData?.category || "",
    image: initialData?.image || "",
    imagePublicId: initialData?.imagePublicId || "",
    images: initialData?.images || [],
    resolution: initialData?.resolution || "4096x4096",
    format: initialData?.format || "PNG, JPG",
    tags: initialData?.tags || [],
    featured: initialData?.featured || false,
    trending: initialData?.trending || false,
    adminNotes: initialData?.adminNotes || "",
  });

  const handleInputChange = (field: keyof TextureFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // const handleImageUpload = async (file: File) => {
  //   try {
  //     setUploading(true);

  //     const uploadFormData = new FormData();
  //     uploadFormData.append("file", file);

  //     const response = await fetch("/api/upload", {
  //       method: "POST",
  //       body: uploadFormData,
  //     });

  //     const result = await response.json();

  //     if (result.success) {
  //       setFormData((prev) => ({
  //         ...prev,
  //         image: result.data.url,
  //         imagePublicId: result.data.publicId,
  //       }));
  //       toast.success("Image uploaded successfully");
  //     } else {
  //       toast.error("Failed to upload image");
  //     }
  //   } catch (error) {
  //     console.error("Error uploading image:", error);
  //     toast.error("Failed to upload image");
  //   } finally {
  //     setUploading(false);
  //   }
  // };
 
  const handleImageUpload = async (files: File[]) => {
  try {
    setUploading(true);

    const uploadedImages: {
      url: string;
      publicId?: string;
      alt: string;
      isPrimary: boolean;
    }[] = [];

    for (const file of files) {
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      const result = await response.json();

      if (result.success && result.data.url) {
        uploadedImages.push({
          url: result.data.url,
          publicId: result.data.publicId,
          alt: file.name,
          isPrimary: false,
        });

        toast.success(`Uploaded: ${file.name}`);
      } else {
        toast.error(`Failed to upload: ${file.name}`);
      }
    }

    if (uploadedImages.length > 0) {
      setFormData((prev) => {
        const [first, ...rest] = uploadedImages;

        // If no main image exists, set the first uploaded image as main
        const shouldSetMainImage = !prev.image;

        return {
          ...prev,
          image: shouldSetMainImage ? first.url : prev.image,
          imagePublicId: shouldSetMainImage ? first.publicId : prev.imagePublicId,
          images: [
            ...(prev.images || []),
            ...(shouldSetMainImage ? rest : uploadedImages),
          ],
        };
      });
    }
  } catch (error) {
    console.error("Error uploading image(s):", error);
    toast.error("Upload failed");
  } finally {
    setUploading(false);
  }
};



  // const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     if (file.size > 5 * 1024 * 1024) {
  //       toast.error("File size must be less than 5MB");
  //       return;
  //     }

  //     if (!file.type.startsWith("image/")) {
  //       toast.error("Please select an image file");
  //       return;
  //     }

  //     handleImageUpload(file);
  //   }
  // };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validFiles = Array.from(files).filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 5MB`);
        return false;
      }
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not a valid image`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      handleImageUpload(validFiles); // ✅ Pass valid files array
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.description ||
      !formData.category ||
      !formData.image
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);

      const url = textureId ? `/api/textures/${textureId}` : "/api/textures";
      const method = textureId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(
          `Texture ${textureId ? "updated" : "created"} successfully`,
        );
        router.push("/admin/textures");
      } else {
        toast.error(result.error || "Failed to save texture");
      }
    } catch (error) {
      console.error("Error saving texture:", error);
      toast.error("Failed to save texture");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter texture name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Enter texture description"
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    handleInputChange("category", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="resolution">Resolution</Label>
                  <Input
                    id="resolution"
                    value={formData.resolution}
                    onChange={(e) =>
                      handleInputChange("resolution", e.target.value)
                    }
                    placeholder="e.g., 4096x4096"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="format">Format</Label>
                  <Input
                    id="format"
                    value={formData.format}
                    onChange={(e) =>
                      handleInputChange("format", e.target.value)
                    }
                    placeholder="e.g., PNG, JPG"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add tag"
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                />
                <Button type="button" onClick={addTag} variant="outline">
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="pl-2">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Admin Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.adminNotes}
                onChange={(e) =>
                  handleInputChange("adminNotes", e.target.value)
                }
                placeholder="Internal notes for this texture"
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Image *</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.image ? (
                <div className="relative">
                  <Image
                    src={formData.image}
                    alt="Texture preview"
                    width={300}
                    height={300}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="mr-2 h-4 w-4" />
                    )}
                    {uploading ? "Uploading..." : "Change Image"}
                  </Button>
                </div>
              ) : (
                <div
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploading ? (
                    <div className="space-y-2">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Uploading...
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload image
                      </p>
                    </div>
                  )}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />

              {/* Additional Images */}
              {formData.images.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Additional Images</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={img.url}
                          alt={img.alt || `Image ${index + 1}`}
                          width={150}
                          height={150}
                          className="w-full h-24 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== index),
                            }));
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="featured">Featured</Label>
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) =>
                    handleInputChange("featured", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="trending">Trending</Label>
                <Switch
                  id="trending"
                  checked={formData.trending}
                  onCheckedChange={(checked) =>
                    handleInputChange("trending", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {textureId ? "Update Texture" : "Create Texture"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}