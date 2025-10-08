"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ProductForm } from "@/components/admin/ProductForm";

interface Texture {
  _id: string;
  name: string;
  description: string;
  category: string;
  image: string;
  imagePublicId?: string;
  resolution: string;
  format: string;
  tags: string[];
  featured: boolean;
  trending: boolean;
  adminNotes: string;
}

export default function EditTexture() {
  const params = useParams();
  const [texture, setTexture] = useState<Texture | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTexture();
  }, []);

  const fetchTexture = async () => {
    try {
      const response = await fetch(`/api/textures/${params.id}`);
      const data = await response.json();

      if (data.success) {
        setTexture(data.data);
      } else {
        toast.error("Texture not found");
      }
    } catch (error) {
      console.error("Error fetching texture:", error);
      toast.error("Failed to load texture");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!texture) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold">Texture Not Found</h1>
        <p className="text-muted-foreground">
          The texture you're looking for doesn't exist.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Texture</h1>
        <p className="text-muted-foreground">Update texture information.</p>
      </div>

      <ProductForm initialData={texture} textureId={texture._id} />
    </div>
  );
}