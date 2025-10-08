"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Heart,
  Edit,
  Trash,
  Star,
  TrendingUp,
  Activity,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
// import { categories } from "@/lib/temp-texture-data";
import { Button } from "@/components/ui/button";

interface Texture {
  _id: string;
  name: string;
  category: string;
  image: string;
  views: number;
  likes: number;
  featured: boolean;
  trending: boolean;
  isActive: boolean;
  createdAt: string;
}

export default function AdminTextures() {
  const [textures, setTextures] = useState<Texture[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchTextures();
  }, [search, category, status, page]);

  const fetchTextures = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });

      if (search) params.append("search", search);
      if (category !== "all") params.append("category", category);
      if (status !== "all") params.append("status", status);

      const response = await fetch(`/api/admin/textures?${params}`);
      const data = await response.json();

      if (data.success) {
        setTextures(data.data);
        setTotalPages(data.pagination.total);
      }
    } catch (error) {
      console.error("Error fetching textures:", error);
      toast.error("Failed to fetch textures");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/textures/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Texture deleted successfully");
        fetchTextures();
      } else {
        toast.error("Failed to delete texture");
      }
    } catch (error) {
      console.error("Error deleting texture:", error);
      toast.error("Failed to delete texture");
    } finally {
      setDeleteId(null);
    }
  };

  const toggleFeature = async (id: string, featured: boolean) => {
    try {
      const response = await fetch(`/api/textures/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !featured }),
      });

      if (response.ok) {
        toast.success(
          `Texture ${!featured ? "featured" : "unfeatured"} successfully`,
        );
        fetchTextures();
      } else {
        toast.error("Failed to update texture");
      }
    } catch (error) {
      console.error("Error updating texture:", error);
      toast.error("Failed to update texture");
    }
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/textures/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        toast.success(
          `Texture ${!isActive ? "activated" : "deactivated"} successfully`,
        );
        fetchTextures();
      } else {
        toast.error("Failed to update texture");
      }
    } catch (error) {
      console.error("Error updating texture:", error);
      toast.error("Failed to update texture");
    }
  }

  const toggleTrending = async (id: string, trending: boolean) => {
    try {
      const response = await fetch(`/api/textures/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trending: !trending }),
      });

      if (response.ok) {
        toast.success(
          `Texture ${!trending ? "marked as trending" : "unmarked as trending"} successfully`,
        );
        fetchTextures();
      } else {
        toast.error("Failed to update texture");
      }
    } catch (error) {
      console.error("Error updating texture:", error);
      toast.error("Failed to update texture");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Textures</h1>
        <Button asChild>
          <Link href="/admin/textures/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Texture
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search textures..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Texture</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stats</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-muted animate-pulse rounded" />
                      <div className="space-y-1">
                        <div className="h-4 bg-muted animate-pulse rounded w-32" />
                        <div className="h-3 bg-muted animate-pulse rounded w-20" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted animate-pulse rounded w-24" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted animate-pulse rounded w-16" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted animate-pulse rounded w-12" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted animate-pulse rounded w-20" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted animate-pulse rounded w-8" />
                  </TableCell>
                </TableRow>
              ))
            ) : textures.length > 0 ? (
              textures.map((texture) => (
                <TableRow key={texture._id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="relative w-10 h-10">
                        <Image
                          src={texture.image}
                          alt={texture.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{texture.name}</div>
                        <div className="flex items-center space-x-1">
                          {texture.featured && (
                            <Star className="h-3 w-3 text-yellow-500" />
                          )}
                          {texture.trending && (
                            <TrendingUp className="h-3 w-3 text-green-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {texture.category}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3 text-sm">
                      <span className="flex items-center">
                        <Eye className="mr-1 h-3 w-3" />
                        {texture.views}
                      </span>
                      <span className="flex items-center">
                        <Heart className="mr-1 h-3 w-3" />
                        {texture.likes}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={texture.isActive ? "default" : "secondary"}>
                      {texture.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(texture.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/texture/${texture._id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/textures/${texture._id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            toggleActive(texture._id, texture.isActive) // ✅ correct for active/inactive
                          }
                        >
                          <Activity className="mr-2 h-4 w-4" />
                          {texture.isActive
                            ? "InActive"
                            : "Active"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            toggleFeature(texture._id, texture.featured)
                          }
                        >
                          <Star className="mr-2 h-4 w-4" />
                          {texture.featured ? "Unfeature" : "Feature"}
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() =>
                            toggleTrending(texture._id, texture.trending) // ✅ correct for trending
                          }
                        >
                          <TrendingUp className="mr-2 h-4 w-4" />
                          {texture.trending
                            ? "Remove trending"
                            : "Mark trending"}
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => setDeleteId(texture._id)}
                          className="text-destructive"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  No textures found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the texture. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}