"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { UserActivityChart, WeeklyTrendChart } from '@/components/analytics/Charts';
import { StatsCard, MetricCard, RealtimeIndicator } from '@/components/analytics/StatsCards';
import { generateDemoAnalytics, AnalyticsData } from '@/lib/analytics';
import { Spinner } from '@/components/ui/loading';
import {
  Users,
  FileText,
  Briefcase,
  Activity,
  Clock,
  Video,
  MessageSquare,
  BarChart2,
  ArrowLeft,
  RefreshCw,
  Download,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function AnalyticsPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    // Load demo analytics data
    const loadAnalytics = () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setAnalytics(generateDemoAnalytics());
        setLoading(false);
      }, 500);
    };
    loadAnalytics();
  }, [timeRange]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setAnalytics(generateDemoAnalytics());
      setRefreshing(false);
    }, 1000);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user || !analytics) return null;

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center text-white hover:text-gray-300 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Dashboard
              </Link>
              <div className="h-6 w-px bg-white/20" />
              <div className="flex items-center space-x-2">
                <BarChart2 className="w-6 h-6 text-white" />
                <h1 className="text-xl font-bold text-white">Analytics</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Time Range Selector */}
              <div className="flex bg-white/10 rounded-lg p-1">
                {(['7d', '30d', '90d'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 rounded-md text-sm transition-colors ${
                      timeRange === range
                        ? 'bg-white text-black'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
                  </button>
                ))}
              </div>

              <Button
                onClick={handleRefresh}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                disabled={refreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>

              <Button className="bg-white text-black hover:bg-gray-200">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Realtime Stats Bar */}
        <div className="relative mb-8">
          <div className="relative rounded-xl border border-white/20 p-1">
            <GlowingEffect
              spread={60}
              glow={true}
              disabled={false}
              proximity={100}
              inactiveZone={0.01}
              borderWidth={2}
            />
            <div className="relative bg-black rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-green-400" />
                  <span className="text-white font-medium">Live Activity</span>
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1" />
                    <span className="text-xs text-gray-400">Real-time</span>
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Updated just now
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <RealtimeIndicator
                  label="Active Users"
                  value={analytics.realtimeStats.activeUsers}
                  icon={Users}
                />
                <RealtimeIndicator
                  label="Open Documents"
                  value={analytics.realtimeStats.activeDocuments}
                  icon={FileText}
                />
                <RealtimeIndicator
                  label="Ongoing Meetings"
                  value={analytics.realtimeStats.ongoingMeetings}
                  icon={Video}
                />
                <RealtimeIndicator
                  label="Messages (1h)"
                  value={analytics.realtimeStats.messagesLastHour}
                  icon={MessageSquare}
                  pulse={false}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Documents"
            value={analytics.documentStats.totalDocuments}
            change={12}
            icon={FileText}
            isPositive={true}
          />
          <StatsCard
            title="Active Workspaces"
            value={analytics.workspaceMetrics.activeWorkspaces}
            change={8}
            icon={Briefcase}
            isPositive={true}
          />
          <StatsCard
            title="Total Users"
            value={analytics.workspaceMetrics.totalMembers}
            change={15}
            icon={Users}
            isPositive={true}
          />
          <StatsCard
            title="Avg. Session Time"
            value={`${analytics.userActivity[analytics.userActivity.length - 1]?.sessionDuration || 0}m`}
            change={5}
            icon={Clock}
            isPositive={true}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* User Activity Chart */}
          <div className="relative">
            <div className="relative rounded-xl border border-white/20 p-1">
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
                borderWidth={2}
              />
              <div className="relative bg-black rounded-lg p-6">
                <h2 className="text-lg font-semibold text-white mb-4">
                  User Activity
                </h2>
                <UserActivityChart data={analytics.userActivity} />
              </div>
            </div>
          </div>

          {/* Weekly Trends Chart */}
          <div className="relative">
            <div className="relative rounded-xl border border-white/20 p-1">
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
                borderWidth={2}
              />
              <div className="relative bg-black rounded-lg p-6">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Weekly Trends
                </h2>
                <WeeklyTrendChart data={analytics.weeklyTrends} />
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard
            title="Document Statistics"
            icon={FileText}
            metrics={[
              { label: 'Created Today', value: analytics.documentStats.documentsCreatedToday },
              { label: 'This Week', value: analytics.documentStats.documentsCreatedThisWeek },
              { label: 'This Month', value: analytics.documentStats.documentsCreatedThisMonth },
              { label: 'Avg. Edits/Doc', value: analytics.documentStats.averageEditsPerDocument.toFixed(1) },
            ]}
          />

          <MetricCard
            title="Workspace Metrics"
            icon={Briefcase}
            metrics={[
              { label: 'Total Workspaces', value: analytics.workspaceMetrics.totalWorkspaces },
              { label: 'Active Workspaces', value: analytics.workspaceMetrics.activeWorkspaces },
              { label: 'Total Members', value: analytics.workspaceMetrics.totalMembers },
              { label: 'Avg. Members/WS', value: analytics.workspaceMetrics.averageMembersPerWorkspace.toFixed(1) },
            ]}
          />

          <MetricCard
            title="Most Active"
            icon={Activity}
            metrics={[
              {
                label: 'Top Document',
                value: analytics.documentStats.mostEditedDocument?.title || 'N/A',
              },
              {
                label: 'Edit Count',
                value: analytics.documentStats.mostEditedDocument?.editCount || 0,
              },
              {
                label: 'Top Workspace',
                value: analytics.workspaceMetrics.mostActiveWorkspace?.name || 'N/A',
              },
              {
                label: 'Activity Score',
                value: `${analytics.workspaceMetrics.mostActiveWorkspace?.activityScore || 0}%`,
              },
            ]}
          />
        </div>
      </main>
    </div>
  );
}
