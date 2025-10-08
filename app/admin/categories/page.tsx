"use client";

import { useEffect, useState } from "react";
import { AdminAPI } from "@/lib/admin-api";
import { CategoryDTO, CollectionName } from "@shared/api";
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

export default function CategoriesPage() {
  const [items, setItems] = useState<CategoryDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<CategoryDTO>({
    id: "",
    name: "",
    slug: "",
    collection: "Summer",
  });
  const [editForm, setEditForm] = useState<Omit<CategoryDTO, "id">>({
    name: "",
    slug: "",
    collection: "Summer",
  });

  const load = async () => {
    setLoading(true);
    try {
      const data = await AdminAPI.listCategories();
      setItems(data);
    } catch (e: any) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const beginEdit = (c: CategoryDTO) => {
    setEditId(c.id);
    setEditForm({ name: c.name, slug: c.slug, collection: c.collection });
  };

  const create = async () => {
    if (!form.id.trim() || !form.name.trim() || !form.slug.trim())
      return toast.error("Fill all fields");
    setCreating(true);
    try {
      await AdminAPI.createCategory(form);
      setForm({ id: "", name: "", slug: "", collection: form.collection });
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
      await AdminAPI.updateCategory(id, editForm);
      setEditId(null);
      await load();
      toast.success("Updated");
    } catch (e: any) {
      toast.error("Update failed");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete category and related products?")) return;
    try {
      await AdminAPI.deleteCategory(id);
      await load();
      toast.success("Deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Categories</h1>

      <Card>
        <CardHeader>
          <CardTitle>Create</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2 flex-wrap">
          <Input
            placeholder="id"
            value={form.id}
            onChange={(e) => setForm({ ...form, id: e.target.value })}
            className="w-40"
          />
          <Input
            placeholder="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-48"
          />
          <Input
            placeholder="slug"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="w-48"
          />
          <Select
            value={form.collection}
            onValueChange={(v) =>
              setForm({ ...form, collection: v as CollectionName })
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Summer">Summer</SelectItem>
              <SelectItem value="Winter">Winter</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={create} disabled={creating}>
            Create
          </Button>
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
                <TableHead>Slug</TableHead>
                <TableHead>Collection</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5}>Loading...</TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>No categories</TableCell>
                </TableRow>
              ) : (
                items.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.id}</TableCell>
                    <TableCell>
                      {editId === c.id ? (
                        <Input
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                        />
                      ) : (
                        c.name
                      )}
                    </TableCell>
                    <TableCell>
                      {editId === c.id ? (
                        <Input
                          value={editForm.slug}
                          onChange={(e) =>
                            setEditForm({ ...editForm, slug: e.target.value })
                          }
                        />
                      ) : (
                        c.slug
                      )}
                    </TableCell>
                    <TableCell>
                      {editId === c.id ? (
                        <Select
                          value={editForm.collection}
                          onValueChange={(v) =>
                            setEditForm({
                              ...editForm,
                              collection: v as CollectionName,
                            })
                          }
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Summer">Summer</SelectItem>
                            <SelectItem value="Winter">Winter</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        c.collection
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {editId === c.id ? (
                        <>
                          <Button size="sm" onClick={() => save(c.id)}>
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
                            onClick={() => beginEdit(c)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => remove(c.id)}
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
