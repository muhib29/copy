export type Collection = "Summer" | "Winter";

export type Category = {
  slug: string;
  name: string;
  collection: Collection;
};

export const categories: Category[] = [
  { slug: "lawn", name: "Lawn", collection: "Summer" },
  { slug: "cotton", name: "Cotton", collection: "Summer" },
  { slug: "printed", name: "Printed", collection: "Summer" },
  { slug: "embroidered", name: "Embroidered", collection: "Summer" },
  { slug: "karandi", name: "Karandi", collection: "Winter" },
  { slug: "linen", name: "Linen", collection: "Winter" },
  { slug: "wool-blend", name: "Wool Blend", collection: "Winter" },
  { slug: "shawls", name: "Shawls", collection: "Winter" },
];
