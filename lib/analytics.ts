// Analytics utility functions and types

export interface AnalyticsData {
  userActivity: UserActivityData[];
  documentStats: DocumentStats;
  workspaceMetrics: WorkspaceMetrics;
  realtimeStats: RealtimeStats;
  weeklyTrends: WeeklyTrend[];
}

export interface UserActivityData {
  date: string;
  logins: number;
  activeUsers: number;
  newUsers: number;
  sessionDuration: number; // in minutes
}

export interface DocumentStats {
  totalDocuments: number;
  documentsCreatedToday: number;
  documentsCreatedThisWeek: number;
  documentsCreatedThisMonth: number;
  averageEditsPerDocument: number;
  mostEditedDocument: {
    id: string;
    title: string;
    editCount: number;
  } | null;
}

export interface WorkspaceMetrics {
  totalWorkspaces: number;
  activeWorkspaces: number;
  totalMembers: number;
  averageMembersPerWorkspace: number;
  mostActiveWorkspace: {
    id: string;
    name: string;
    activityScore: number;
  } | null;
}

export interface RealtimeStats {
  activeUsers: number;
  activeDocuments: number;
  ongoingMeetings: number;
  messagesLastHour: number;
}

export interface WeeklyTrend {
  day: string;
  documents: number;
  users: number;
  meetings: number;
}

// Generate demo analytics data
export function generateDemoAnalytics(): AnalyticsData {
  const today = new Date();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Generate last 7 days of user activity
  const userActivity: UserActivityData[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    userActivity.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      logins: Math.floor(Math.random() * 50) + 20,
      activeUsers: Math.floor(Math.random() * 40) + 15,
      newUsers: Math.floor(Math.random() * 10) + 1,
      sessionDuration: Math.floor(Math.random() * 30) + 15,
    });
  }

  // Generate weekly trends
  const weeklyTrends: WeeklyTrend[] = days.map((day) => ({
    day,
    documents: Math.floor(Math.random() * 20) + 5,
    users: Math.floor(Math.random() * 30) + 10,
    meetings: Math.floor(Math.random() * 10) + 2,
  }));

  return {
    userActivity,
    documentStats: {
      totalDocuments: 156,
      documentsCreatedToday: 8,
      documentsCreatedThisWeek: 34,
      documentsCreatedThisMonth: 89,
      averageEditsPerDocument: 12.5,
      mostEditedDocument: {
        id: 'doc-001',
        title: 'Q1 Strategy Document',
        editCount: 47,
      },
    },
    workspaceMetrics: {
      totalWorkspaces: 12,
      activeWorkspaces: 8,
      totalMembers: 45,
      averageMembersPerWorkspace: 3.75,
      mostActiveWorkspace: {
        id: 'ws-001',
        name: 'Engineering Team',
        activityScore: 92,
      },
    },
    realtimeStats: {
      activeUsers: Math.floor(Math.random() * 15) + 5,
      activeDocuments: Math.floor(Math.random() * 10) + 3,
      ongoingMeetings: Math.floor(Math.random() * 3) + 1,
      messagesLastHour: Math.floor(Math.random() * 50) + 20,
    },
    weeklyTrends,
  };
}

// Format large numbers
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Calculate percentage change
export function calculateChange(current: number, previous: number): {
  value: number;
  isPositive: boolean;
} {
  if (previous === 0) return { value: 100, isPositive: true };
  const change = ((current - previous) / previous) * 100;
  return {
    value: Math.abs(Math.round(change)),
    isPositive: change >= 0,
  };
}
