import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AdminAPI } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import type {
  CategoryDTO,
  CollectionDTO,
  ProductDTO,
  CollectionName,
} from "@shared/api";

function useAdminData() {
  const qc = useQueryClient();
  const collectionsQ = useQuery({
    queryKey: ["collections"],
    queryFn: AdminAPI.listCollections,
  });
  const categoriesQ = useQuery({
    queryKey: ["categories"],
    queryFn: AdminAPI.listCategories,
  });
  const productsQ = useQuery({
    queryKey: ["products"],
    queryFn: AdminAPI.listProducts,
  });
  const invalidateAll = () =>
    Promise.all([
      qc.invalidateQueries({ queryKey: ["collections"] }),
      qc.invalidateQueries({ queryKey: ["categories"] }),
      qc.invalidateQueries({ queryKey: ["products"] }),
    ]);
  return { collectionsQ, categoriesQ, productsQ, invalidateAll };
}

export default function Admin() {
  const { collectionsQ, categoriesQ, productsQ, invalidateAll } =
    useAdminData();
  const [open, setOpen] = useState<{
    type: "collection" | "category" | "product" | null;
    edit?: any;
  }>({ type: null });

  // Mutations
  const createCollection = useMutation({
    mutationFn: AdminAPI.createCollection,
    onSuccess: invalidateAll,
  });
  const updateCollection = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Omit<CollectionDTO, "id">;
    }) => AdminAPI.updateCollection(id, data),
    onSuccess: invalidateAll,
  });
  const deleteCollection = useMutation({
    mutationFn: AdminAPI.deleteCollection,
    onSuccess: invalidateAll,
  });

  const createCategory = useMutation({
    mutationFn: AdminAPI.createCategory,
    onSuccess: invalidateAll,
  });
  const updateCategory = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<CategoryDTO, "id"> }) =>
      AdminAPI.updateCategory(id, data),
    onSuccess: invalidateAll,
  });
  const deleteCategory = useMutation({
    mutationFn: AdminAPI.deleteCategory,
    onSuccess: invalidateAll,
  });

  const createProduct = useMutation({
    mutationFn: AdminAPI.createProduct,
    onSuccess: invalidateAll,
  });
  const updateProduct = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<ProductDTO, "id"> }) =>
      AdminAPI.updateProduct(id, data),
    onSuccess: invalidateAll,
  });
  const deleteProduct = useMutation({
    mutationFn: AdminAPI.deleteProduct,
    onSuccess: invalidateAll,
  });

  const collections = collectionsQ.data ?? [];
  const categories = categoriesQ.data ?? [];
  const products = productsQ.data ?? [];

  return (
    <div className="container py-10">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="text-xs tracking-widest text-accent">Admin Panel</p>
          <h1 className="font-display text-3xl md:text-4xl">Manage Store</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Collections, Categories, and Products
          </p>
        </div>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>

        {/* Collections */}
        <TabsContent value="collections">
          <div className="mb-3 flex justify-end">
            <Dialog
              open={open.type === "collection"}
              onOpenChange={(v) =>
                setOpen(v ? { type: "collection" } : { type: null })
              }
            >
              <DialogTrigger asChild>
                <Button>Add Collection</Button>
              </DialogTrigger>
              <CollectionForm
                onSubmit={async (data) => {
                  await createCollection.mutateAsync(data as CollectionDTO);
                  setOpen({ type: null });
                }}
              />
            </Dialog>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {collections.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.id}</TableCell>
                  <TableCell>{c.name}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </DialogTrigger>
                      <CollectionForm
                        initial={c}
                        onSubmit={async (data) => {
                          await updateCollection.mutateAsync({
                            id: c.id,
                            data,
                          });
                        }}
                      />
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteCollection.mutate(c.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        {/* Categories */}
        <TabsContent value="categories">
          <div className="mb-3 flex justify-end">
            <Dialog
              open={open.type === "category"}
              onOpenChange={(v) =>
                setOpen(v ? { type: "category" } : { type: null })
              }
            >
              <DialogTrigger asChild>
                <Button>Add Category</Button>
              </DialogTrigger>
              <CategoryForm
                collections={collections}
                onSubmit={async (data) => {
                  await createCategory.mutateAsync(data as CategoryDTO);
                  setOpen({ type: null });
                }}
              />
            </Dialog>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Collection</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.id}</TableCell>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.slug}</TableCell>
                  <TableCell>{c.collection}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </DialogTrigger>
                      <CategoryForm
                        initial={c}
                        collections={collections}
                        onSubmit={async (data) => {
                          await updateCategory.mutateAsync({ id: c.id, data });
                        }}
                      />
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteCategory.mutate(c.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        {/* Products */}
        <TabsContent value="products">
          <div className="mb-3 flex justify-end">
            <Dialog
              open={open.type === "product"}
              onOpenChange={(v) =>
                setOpen(v ? { type: "product" } : { type: null })
              }
            >
              <DialogTrigger asChild>
                <Button>Add Product</Button>
              </DialogTrigger>
              <ProductForm
                collections={collections}
                categories={categories}
                onSubmit={async (data) => {
                  await createProduct.mutateAsync(data as ProductDTO);
                  setOpen({ type: null });
                }}
              />
            </Dialog>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Collection</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.id}</TableCell>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>${p.price.toFixed(2)}</TableCell>
                  <TableCell>{p.collection}</TableCell>
                  <TableCell>{p.category}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </DialogTrigger>
                      <ProductForm
                        initial={p}
                        collections={collections}
                        categories={categories}
                        onSubmit={async (data) => {
                          await updateProduct.mutateAsync({ id: p.id, data });
                        }}
                      />
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteProduct.mutate(p.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CollectionForm({
  initial,
  onSubmit,
}: {
  initial?: CollectionDTO;
  onSubmit: (data: Omit<CollectionDTO, "id"> & { id?: string }) => Promise<any>;
}) {
  const [id, setId] = useState(initial?.id ?? "");
  const [name, setName] = useState<CollectionName | "">(initial?.name ?? "");
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{initial ? "Edit" : "Add"} Collection</DialogTitle>
      </DialogHeader>
      <div className="space-y-3 py-2">
        {!initial && (
          <Input
            placeholder="id (summer|winter)"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        )}
        <Select
          value={name}
          onValueChange={(v) => setName(v as CollectionName)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select name" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Summer">Summer</SelectItem>
            <SelectItem value="Winter">Winter</SelectItem>
          </SelectContent>
        </Select>
        <div className="pt-2">
          <Button
            className="w-full"
            onClick={() =>
              onSubmit(
                initial
                  ? { name: name as CollectionName }
                  : { id, name: name as CollectionName },
              )
            }
          >
            Save
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}

function CategoryForm({
  initial,
  collections,
  onSubmit,
}: {
  initial?: CategoryDTO;
  collections: CollectionDTO[];
  onSubmit: (data: Omit<CategoryDTO, "id"> & { id?: string }) => Promise<any>;
}) {
  const [id, setId] = useState(initial?.id ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [collection, setCollection] = useState<CollectionName | "">(
    initial?.collection ?? "",
  );
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{initial ? "Edit" : "Add"} Category</DialogTitle>
      </DialogHeader>
      <div className="space-y-3 py-2">
        {!initial && (
          <Input
            placeholder="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        )}
        <Input
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        />
        <Select
          value={collection}
          onValueChange={(v) => setCollection(v as CollectionName)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select collection" />
          </SelectTrigger>
          <SelectContent>
            {collections.map((c) => (
              <SelectItem key={c.id} value={c.name}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="pt-2">
          <Button
            className="w-full"
            onClick={() =>
              onSubmit(
                initial
                  ? { name, slug, collection: collection as CollectionName }
                  : {
                      id,
                      name,
                      slug,
                      collection: collection as CollectionName,
                    },
              )
            }
          >
            Save
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}

function ProductForm({
  initial,
  collections,
  categories,
  onSubmit,
}: {
  initial?: ProductDTO;
  collections: CollectionDTO[];
  categories: CategoryDTO[];
  onSubmit: (data: Omit<ProductDTO, "id"> & { id?: string }) => Promise<any>;
}) {
  const [id, setId] = useState(initial?.id ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [price, setPrice] = useState(initial?.price ?? 0);
  const [image, setImage] = useState(initial?.image ?? "");
  const [collection, setCollection] = useState<CollectionName | "">(
    initial?.collection ?? "",
  );
  const [category, setCategory] = useState(initial?.category ?? "");

  const filteredCats = categories.filter((c) => c.collection === collection);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{initial ? "Edit" : "Add"} Product</DialogTitle>
      </DialogHeader>
      <div className="space-y-3 py-2">
        {!initial && (
          <Input
            placeholder="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        )}
        <Input
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          type="number"
          placeholder="price"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
        <Input
          placeholder="image url"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
        <Select
          value={collection}
          onValueChange={(v) => setCollection(v as CollectionName)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select collection" />
          </SelectTrigger>
          <SelectContent>
            {collections.map((c) => (
              <SelectItem key={c.id} value={c.name}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {filteredCats.map((c) => (
              <SelectItem key={c.id} value={c.slug}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="pt-2">
          <Button
            className="w-full"
            onClick={() =>
              onSubmit(
                initial
                  ? {
                      name,
                      price,
                      image,
                      collection: collection as CollectionName,
                      category,
                    }
                  : {
                      id,
                      name,
                      price,
                      image,
                      collection: collection as CollectionName,
                      category,
                    },
              )
            }
          >
            Save
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
