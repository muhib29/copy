"use client";

import { useEffect, useState } from "react";
import {
  Image,
  Eye,
  Heart,
  TrendingUp,
  Star,
  Plus,
  Activity,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DashboardStats {
  total: number;
  active: number;
  inactive: number;
  featured: number;
  trending: number;
}

interface RecentTexture {
  _id: string;
  name: string;
  category: string;
  views: number;
  likes: number;
  featured: boolean;
  trending: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentTextures, setRecentTextures] = useState<RecentTexture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/admin/textures?limit=5");
      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
        setRecentTextures(data.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-8 bg-muted rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link href="/admin/textures/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Texture
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Textures
            </CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.active || 0} active, {stats?.inactive || 0} inactive
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.featured || 0}</div>
            <p className="text-xs text-muted-foreground">Featured textures</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trending</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.trending || 0}</div>
            <p className="text-xs text-muted-foreground">Trending textures</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.active || 0}</div>
            <p className="text-xs text-muted-foreground">Published textures</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Textures */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Textures</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTextures.length > 0 ? (
              recentTextures.map((texture) => (
                <div
                  key={texture._id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{texture.name}</h3>
                      {texture.featured && (
                        <Badge variant="secondary">Featured</Badge>
                      )}
                      {texture.trending && (
                        <Badge variant="outline">Trending</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {texture.category}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span className="flex items-center">
                        <Eye className="mr-1 h-3 w-3" />
                        {texture.views}
                      </span>
                      <span className="flex items-center">
                        <Heart className="mr-1 h-3 w-3" />
                        {texture.likes}
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/admin/textures/${texture._id}`}>Edit</Link>
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No textures found. Create your first texture!
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}