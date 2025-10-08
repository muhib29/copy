"use client";

import { useEffect, useState } from "react";
import { AdminAPI } from "@/lib/admin-api";
import { CollectionDTO, CollectionName } from "@shared/api";
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

export default function CollectionsPage() {
  const [items, setItems] = useState<CollectionDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<CollectionDTO>({ id: "", name: "Summer" });

  const load = async () => {
    setLoading(true);
    try {
      const data = await AdminAPI.listCollections();
      setItems(data);
    } catch (e: any) {
      toast.error("Failed to load collections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    if (!form.id.trim()) return toast.error("Enter id");
    setCreating(true);
    try {
      await AdminAPI.createCollection(form);
      setForm({ id: "", name: "Summer" });
      await load();
      toast.success("Created");
    } catch (e: any) {
      toast.error(e?.message || "Create failed");
    } finally {
      setCreating(false);
    }
  };

  const save = async (id: string, name: CollectionName) => {
    try {
      await AdminAPI.updateCollection(id, { id, name });
      setEditId(null);
      await load();
      toast.success("Updated");
    } catch (e: any) {
      toast.error("Update failed");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete collection and related data?")) return;
    try {
      await AdminAPI.deleteCollection(id);
      await load();
      toast.success("Deleted");
    } catch (e: any) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Collections</h1>

      <Card>
        <CardHeader>
          <CardTitle>Create</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2 flex-wrap">
          <Input
            placeholder="id (e.g. summer)"
            value={form.id}
            onChange={(e) => setForm({ ...form, id: e.target.value })}
            className="w-48"
          />
          <Select
            value={form.name}
            onValueChange={(v) =>
              setForm({ ...form, name: v as CollectionName })
            }
          >
            <SelectTrigger className="w-48">
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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3}>Loading...</TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3}>No collections</TableCell>
                </TableRow>
              ) : (
                items.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>{c.id}</TableCell>
                    <TableCell>
                      {editId === c.id ? (
                        <Select
                          defaultValue={c.name}
                          onValueChange={(v) => save(c.id, v as CollectionName)}
                        >
                          <SelectTrigger className="w-48">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Summer">Summer</SelectItem>
                            <SelectItem value="Winter">Winter</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        c.name
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditId(editId === c.id ? null : c.id)}
                      >
                        {editId === c.id ? "Cancel" : "Edit"}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => remove(c.id)}
                      >
                        Delete
                      </Button>
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
