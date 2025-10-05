/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

export type CollectionName = "Summer" | "Winter";

export interface CollectionDTO {
  id: string;
  name: CollectionName;
}

export interface CategoryDTO {
  id: string;
  name: string;
  slug: string;
  collection: CollectionName;
}

export interface ProductDTO {
  id: string;
  name: string;
  price: number;
  image: string;
  collection: CollectionName;
  category: string; // slug
}
