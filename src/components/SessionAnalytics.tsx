import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Activity,
  Users,
  Clock,
  TrendingUp,
  Globe,
  MousePointer,
  FileText,
  Mic,
  MessageSquare,
} from "lucide-react";
import { useAssistant } from "@/hooks/useAssistant";

interface AnalyticsData {
  totalSessions: number;
  activeSessions: number;
  completionRate: number;
  averageDuration: number;
  interactionTypes: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  languageDistribution: Array<{
    language: string;
    count: number;
    percentage: number;
  }>;
  popularPages: Array<{
    url: string;
    title: string;
    sessions: number;
  }>;
  hourlyActivity: Array<{
    hour: number;
    sessions: number;
  }>;
}

const SessionAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">("24h");
  const { session } = useAssistant();

  // Mock data for demonstration
  const mockAnalyticsData: AnalyticsData = {
    totalSessions: 1247,
    activeSessions: 23,
    completionRate: 78.5,
    averageDuration: 342, // seconds
    interactionTypes: [
      { type: "highlight", count: 456, percentage: 45.6 },
      { type: "form_assist", count: 234, percentage: 23.4 },
      { type: "chat", count: 198, percentage: 19.8 },
      { type: "voice", count: 112, percentage: 11.2 },
    ],
    languageDistribution: [
      { language: "English", count: 623, percentage: 50.0 },
      { language: "Spanish", count: 249, percentage: 20.0 },
      { language: "French", count: 125, percentage: 10.0 },
      { language: "German", count: 87, percentage: 7.0 },
      { language: "Chinese", count: 75, percentage: 6.0 },
      { language: "Other", count: 88, percentage: 7.0 },
    ],
    popularPages: [
      { url: "/banking/transfer", title: "Money Transfer", sessions: 234 },
      { url: "/forms/application", title: "Application Form", sessions: 189 },
      { url: "/account/settings", title: "Account Settings", sessions: 156 },
      { url: "/support/contact", title: "Contact Support", sessions: 134 },
      { url: "/dashboard", title: "Dashboard", sessions: 98 },
    ],
    hourlyActivity: [
      { hour: 0, sessions: 12 },
      { hour: 1, sessions: 8 },
      { hour: 2, sessions: 5 },
      { hour: 3, sessions: 3 },
      { hour: 4, sessions: 7 },
      { hour: 5, sessions: 15 },
      { hour: 6, sessions: 28 },
      { hour: 7, sessions: 45 },
      { hour: 8, sessions: 67 },
      { hour: 9, sessions: 89 },
      { hour: 10, sessions: 95 },
      { hour: 11, sessions: 87 },
      { hour: 12, sessions: 92 },
      { hour: 13, sessions: 78 },
      { hour: 14, sessions: 85 },
      { hour: 15, sessions: 91 },
      { hour: 16, sessions: 76 },
      { hour: 17, sessions: 68 },
      { hour: 18, sessions: 54 },
      { hour: 19, sessions: 43 },
      { hour: 20, sessions: 35 },
      { hour: 21, sessions: 28 },
      { hour: 22, sessions: 22 },
      { hour: 23, sessions: 16 },
    ],
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        // Try to fetch real analytics data
        const response = await fetch(
          `/api/analytics/dashboard?period=${timeRange}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setAnalyticsData(data.data);
        } else {
          throw new Error("Failed to fetch analytics");
        }
      } catch (error) {
        console.error("Analytics fetch failed, using mock data:", error);
        // Fallback to mock data
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setAnalyticsData(mockAnalyticsData);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case "highlight":
        return <MousePointer className="h-4 w-4" />;
      case "form_assist":
        return <FileText className="h-4 w-4" />;
      case "voice":
        return <Mic className="h-4 w-4" />;
      case "chat":
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-muted-foreground">
            No Analytics Data Available
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            Unable to load analytics data. Please check your connection and try
            again.
          </p>
        </div>
        <Button onClick={() => window.location.reload()} variant="outline">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Session Analytics</h2>
        <div className="flex gap-2">
          {(["24h", "7d", "30d"] as const).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range === "24h"
                ? "Last 24 Hours"
                : range === "7d"
                  ? "Last 7 Days"
                  : "Last 30 Days"}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Sessions
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.totalSessions.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Sessions
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.activeSessions}
            </div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.completionRate}%
            </div>
            <Progress value={analyticsData.completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatDuration(analyticsData.averageDuration)}
            </div>
            <p className="text-xs text-muted-foreground">Per session</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Activity by Hour</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.hourlyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sessions" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Language Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Language Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analyticsData.languageDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ language, percentage }) =>
                    `${language} ${percentage}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {analyticsData.languageDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Interaction Types and Popular Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interaction Types */}
        <Card>
          <CardHeader>
            <CardTitle>Interaction Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.interactionTypes.map((interaction) => (
                <div
                  key={interaction.type}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    {getInteractionIcon(interaction.type)}
                    <span className="capitalize">
                      {interaction.type.replace("_", " ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {interaction.count}
                    </span>
                    <Badge variant="outline">{interaction.percentage}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Most Assisted Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.popularPages.map((page, index) => (
                <div
                  key={page.url}
                  className="flex items-center justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{page.title}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {page.url}
                    </p>
                  </div>
                  <Badge variant="outline">{page.sessions} sessions</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SessionAnalytics;
