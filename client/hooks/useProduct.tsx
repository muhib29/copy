"use client";

import { useState, useEffect, useCallback } from "react";

export interface TextureImage {
  url: string;
  alt?: string;
  isPrimary?: boolean;
  _id?: string;
}

export interface TextureData {
  _id: string;
  name: string;
  description: string;
  category: string;
  image: string; // this is the primary image url
  images?: TextureImage[]; // updated to correct object type
  resolution: string;
  format: string;
  tags: string[];
  featured: boolean;
  trending: boolean;
  likes: number;
  views: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationData {
  current: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface TexturesResponse {
  success: boolean;
  data: TextureData[];
  pagination: PaginationData;
  total: number;
}

interface UseTexturesOptions {
  category?: string;
  featured?: boolean;
  trending?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export function useTextures(options: UseTexturesOptions = {}) {
  const [textures, setTextures] = useState<TextureData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [total, setTotal] = useState(0);

  const fetchTextures = useCallback(async () => {
    const controller = new AbortController();

    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();

      if (options.category) params.append("category", options.category);
      if (options.featured) params.append("featured", "true");
      if (options.trending) params.append("trending", "true");
      if (options.search) params.append("search", options.search);
      if (options.page) params.append("page", options.page.toString());
      if (options.limit) params.append("limit", options.limit.toString());

      const response = await fetch(`/api/textures?${params.toString()}`, {
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: TexturesResponse = await response.json();

      if (result.success) {
        setTextures(result.data);
        setPagination(result.pagination);
        setTotal(result.total);
      } else {
        setError("Failed to fetch textures");
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return; // Ignore aborted requests
      }
      setError("Network error occurred");
      console.error("Error fetching textures:", err);
    } finally {
      setLoading(false);
    }

    return () => controller.abort();
  }, [
    options.category,
    options.featured,
    options.trending,
    options.search,
    options.page,
    options.limit,
  ]);

  useEffect(() => {
    fetchTextures();
  }, [fetchTextures]);

  return {
    textures,
    loading,
    error,
    pagination,
    total,
    refetch: fetchTextures,
  };
}

export function useTexture(id: string) {
  const [texture, setTexture] = useState<TextureData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchTexture = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/textures/${id}`);
        const result = await response.json();

        if (result.success) {
          setTexture(result.data);
        } else {
          setError(result.error || "Failed to fetch texture");
        }
      } catch (err) {
        setError("Network error occurred");
        console.error("Error fetching texture:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTexture();
  }, [id]);

  return { texture, loading, error };
}