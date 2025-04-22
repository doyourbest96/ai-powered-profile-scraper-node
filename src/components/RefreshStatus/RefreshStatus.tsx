"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react";

interface RefreshStatusProps {
  onRefresh: (batchSize: number, userId?: string) => Promise<void>;
}

interface RefreshStats {
  totalProfiles: number;
  refreshStats: {
    neverRefreshed: number;
    refreshedSuccessfully: number;
    failedRefreshes: number;
    pendingRefreshes: number;
    last24Hours: number;
    last7Days: number;
  };
  recentRefreshes: Array<{
    userId: string;
    name: string;
    lastRefreshed: string;
    refreshStatus: string;
    refreshError: string | null;
  }>;
  mostFailedAttempts: Array<{
    userId: string;
    name: string;
    refreshAttempts: number;
    refreshError: string | null;
    lastRefreshed: string;
  }>;
}

const RefreshStatus: React.FC<RefreshStatusProps> = ({ onRefresh }) => {
  const [stats, setStats] = useState<RefreshStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [batchSize, setBatchSize] = useState(100);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("recent");

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/refresh/status");
      if (!response.ok) {
        throw new Error(
          `Error fetching refresh status: ${response.statusText}`
        );
      }
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      console.error("Error fetching refresh status:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefresh(batchSize);
      // Refresh stats after triggering refresh
      await fetchStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start refresh");
    } finally {
      setRefreshing(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "success":
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="w-3 h-3 mr-1" /> Success
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-500">
            <AlertCircle className="w-3 h-3 mr-1" /> Failed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500">
            <Clock className="w-3 h-3 mr-1" /> Pending
          </Badge>
        );
      default:
        return <Badge className="bg-gray-500">Unknown</Badge>;
    }
  };

  if (loading && !stats) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading refresh statistics...</span>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <Card className="bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-center text-red-600">
            <AlertCircle className="h-5 w-5 mr-2" />
            <p>Error loading refresh status: {error}</p>
          </div>
          <Button variant="outline" className="mt-4" onClick={fetchStats}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!stats) return null;

  const { totalProfiles, refreshStats, recentRefreshes, mostFailedAttempts } =
    stats;

  const successPercentage =
    totalProfiles > 0
      ? Math.round((refreshStats.refreshedSuccessfully / totalProfiles) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Profile Refresh Status</h2>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="10"
            max="500"
            value={batchSize}
            onChange={(e) => setBatchSize(parseInt(e.target.value) || 100)}
            className="w-20 px-2 py-1 border rounded"
          />
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center"
          >
            {refreshing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Profiles
              </>
            )}
          </Button>
          <Button variant="outline" onClick={fetchStats} disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Update Stats"
            )}
          </Button>
        </div>
      </div>

      {error && (
        <Card className="bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center text-red-600">
              <AlertCircle className="h-5 w-5 mr-2" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Profiles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {totalProfiles.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Refresh Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{successPercentage}%</div>
            <Progress value={successPercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Last 24 Hours</CardTitle>
            <CardDescription>Profiles refreshed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {refreshStats.last24Hours.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Last 7 Days</CardTitle>
            <CardDescription>Profiles refreshed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {refreshStats.last7Days.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Never Refreshed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {refreshStats.neverRefreshed.toLocaleString()}
            </div>
            <Progress
              value={
                totalProfiles > 0
                  ? (refreshStats.neverRefreshed / totalProfiles) * 100
                  : 0
              }
              className="mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Failed Refreshes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {refreshStats.failedRefreshes.toLocaleString()}
            </div>
            <Progress
              value={
                totalProfiles > 0
                  ? (refreshStats.failedRefreshes / totalProfiles) * 100
                  : 0
              }
              className="mt-2"
              indicatorClassName="bg-red-500"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Refreshes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {refreshStats.pendingRefreshes.toLocaleString()}
            </div>
            <Progress
              value={
                totalProfiles > 0
                  ? (refreshStats.pendingRefreshes / totalProfiles) * 100
                  : 0
              }
              className="mt-2"
              indicatorClassName="bg-yellow-500"
            />
          </CardContent>
        </Card>
      </div>

      <div className="border-b border-gray-200">
        <div className="flex space-x-2">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "recent"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleTabChange("recent")}
          >
            Recent Refreshes
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "failed"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleTabChange("failed")}
          >
            Failed Attempts
          </button>
        </div>
      </div>

      {activeTab === "recent" && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Profile Refreshes</CardTitle>
            <CardDescription>
              The 10 most recently refreshed profiles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Refreshed</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentRefreshes.map((profile) => (
                  <TableRow key={profile.userId}>
                    <TableCell className="font-mono">
                      {profile.userId}
                    </TableCell>
                    <TableCell>{profile.name}</TableCell>
                    <TableCell>
                      {getStatusBadge(profile.refreshStatus)}
                    </TableCell>
                    <TableCell>{formatDate(profile.lastRefreshed)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRefresh(1, profile.userId)}
                        disabled={refreshing}
                      >
                        Refresh
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === "failed" && (
        <Card>
          <CardHeader>
            <CardTitle>Profiles with Most Failed Attempts</CardTitle>
            <CardDescription>
              Profiles that have failed to refresh multiple times
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Failed Attempts</TableHead>
                  <TableHead>Last Error</TableHead>
                  <TableHead>Last Attempt</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mostFailedAttempts.map((profile) => (
                  <TableRow key={profile.userId}>
                    <TableCell className="font-mono">
                      {profile.userId}
                    </TableCell>
                    <TableCell>{profile.name}</TableCell>
                    <TableCell>{profile.refreshAttempts}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {profile.refreshError || "Unknown error"}
                    </TableCell>
                    <TableCell>{formatDate(profile.lastRefreshed)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRefresh(1, profile.userId)}
                        disabled={refreshing}
                      >
                        Retry
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RefreshStatus;
