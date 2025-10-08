"use client";

import { useEffect, useState } from "react";
import { AdminAPI } from "@/lib/admin-api";
import { ProductDTO, CollectionName } from "@shared/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

export default function ProductsPage() {
  const [items, setItems] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductDTO>({
    id: "",
    name: "",
    price: 0,
    image: "",
    collection: "Summer",
    category: "",
  });
  const [editForm, setEditForm] = useState<Omit<ProductDTO, "id">>({
    name: "",
    price: 0,
    image: "",
    collection: "Summer",
    category: "",
  });

  const load = async () => {
    setLoading(true);
    try {
      const data = await AdminAPI.listProducts();
      setItems(data);
    } catch (e: any) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const beginEdit = (p: ProductDTO) => {
    setEditId(p.id);
    setEditForm({
      name: p.name,
      price: p.price,
      image: p.image,
      collection: p.collection,
      category: p.category,
    });
  };

  const create = async () => {
    if (
      !form.id.trim() ||
      !form.name.trim() ||
      !form.image.trim() ||
      !form.category.trim()
    )
      return toast.error("Fill all fields");
    setCreating(true);
    try {
      await AdminAPI.createProduct({ ...form, price: Number(form.price) });
      setForm({
        id: "",
        name: "",
        price: 0,
        image: "",
        collection: form.collection,
        category: "",
      });
      await load();
      toast.success("Created");
    } catch (e: any) {
      toast.error(e?.message || "Create failed");
    } finally {
      setCreating(false);
    }
  };

  const save = async (id: string) => {
    try {
      await AdminAPI.updateProduct(id, {
        ...editForm,
        price: Number(editForm.price),
      });
      setEditId(null);
      await load();
      toast.success("Updated");
    } catch (e: any) {
      toast.error("Update failed");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete product?")) return;
    try {
      await AdminAPI.deleteProduct(id);
      await load();
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Products</h1>

      <Card>
        <CardHeader>
          <CardTitle>Create</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-6">
          <Input
            placeholder="id"
            value={form.id}
            onChange={(e) => setForm({ ...form, id: e.target.value })}
          />
          <Input
            placeholder="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            type="number"
            placeholder="price"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: Number(e.target.value) })
            }
          />
          <Input
            placeholder="image url"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />
          <Select
            value={form.collection}
            onValueChange={(v) =>
              setForm({ ...form, collection: v as CollectionName })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Summer">Summer</SelectItem>
              <SelectItem value="Winter">Winter</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="category slug"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
          <div className="md:col-span-6">
            <Button onClick={create} disabled={creating}>
              Create
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Id</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Collection</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7}>Loading...</TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7}>No products</TableCell>
                </TableRow>
              ) : (
                items.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.id}</TableCell>
                    <TableCell>
                      {editId === p.id ? (
                        <Input
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                        />
                      ) : (
                        p.name
                      )}
                    </TableCell>
                    <TableCell>
                      {editId === p.id ? (
                        <Input
                          type="number"
                          value={editForm.price}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              price: Number(e.target.value),
                            })
                          }
                        />
                      ) : (
                        p.price
                      )}
                    </TableCell>
                    <TableCell>
                      {editId === p.id ? (
                        <Input
                          value={editForm.image}
                          onChange={(e) =>
                            setEditForm({ ...editForm, image: e.target.value })
                          }
                        />
                      ) : (
                        <a
                          href={p.image}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline"
                        >
                          link
                        </a>
                      )}
                    </TableCell>
                    <TableCell>
                      {editId === p.id ? (
                        <Select
                          value={editForm.collection}
                          onValueChange={(v) =>
                            setEditForm({
                              ...editForm,
                              collection: v as CollectionName,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Summer">Summer</SelectItem>
                            <SelectItem value="Winter">Winter</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        p.collection
                      )}
                    </TableCell>
                    <TableCell>
                      {editId === p.id ? (
                        <Input
                          value={editForm.category}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              category: e.target.value,
                            })
                          }
                        />
                      ) : (
                        p.category
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {editId === p.id ? (
                        <>
                          <Button size="sm" onClick={() => save(p.id)}>
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditId(null)}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => beginEdit(p)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => remove(p.id)}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
