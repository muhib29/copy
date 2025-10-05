export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  collection: "Summer" | "Winter";
  category: string; // e.g. lawn, linen, embroidered
};

export const products: Product[] = [
  {
    id: "p1",
    name: "3-Piece Lawn Printed",
    price: 49,
    image:
      "https://images.unsplash.com/photo-1583391733952-429f0c4a4eb8?q=80&w=1600&auto=format&fit=crop",
    collection: "Summer",
    category: "lawn",
  },
  {
    id: "p2",
    name: "2-Piece Cotton Embroidered",
    price: 59,
    image:
      "https://images.unsplash.com/photo-1556909114-33e7bb6193d9?q=80&w=1600&auto=format&fit=crop",
    collection: "Summer",
    category: "embroidered",
  },
  {
    id: "p3",
    name: "Lawn Printed Suit",
    price: 39,
    image:
      "https://images.unsplash.com/photo-1603574670812-d24560880210?q=80&w=1600&auto=format&fit=crop",
    collection: "Summer",
    category: "printed",
  },
  {
    id: "p4",
    name: "Linen 3-Piece Embroidered",
    price: 79,
    image:
      "https://images.unsplash.com/photo-1549284923-7697b9a38a83?q=80&w=1600&auto=format&fit=crop",
    collection: "Winter",
    category: "linen",
  },
  {
    id: "p5",
    name: "Karandi Embroidered Suit",
    price: 89,
    image:
      "https://images.unsplash.com/photo-1559718062-361155fad299?q=80&w=1600&auto=format&fit=crop",
    collection: "Winter",
    category: "karandi",
  },
  {
    id: "p6",
    name: "Shawl With 2-Piece",
    price: 99,
    image:
      "https://images.unsplash.com/photo-1544911319-9c721cd1b053?q=80&w=1600&auto=format&fit=crop",
    collection: "Winter",
    category: "shawls",
  },
  {
    id: "p7",
    name: "Cotton 2-Piece Printed",
    price: 45,
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=1600&auto=format&fit=crop",
    collection: "Summer",
    category: "cotton",
  },
  {
    id: "p8",
    name: "Wool Blend 3-Piece",
    price: 109,
    image:
      "https://images.unsplash.com/photo-1611259183938-73a054f1b4b1?q=80&w=1600&auto=format&fit=crop",
    collection: "Winter",
    category: "wool-blend",
  },
];
