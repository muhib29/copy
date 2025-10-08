export type CollectionName = "Summer" | "Winter";

export interface CollectionDTO {
  id: string; // e.g., "summer" | "winter"
  name: CollectionName;
}

export interface CategoryDTO {
  id: string; // arbitrary string id
  name: string;
  slug: string; // unique within all categories
  collection: CollectionName;
}

export interface ProductDTO {
  id: string; // arbitrary string id
  name: string;
  price: number;
  image: string; // url
  collection: CollectionName;
  category: string; // category slug
}

export interface DemoResponse {
  message: string;
}


