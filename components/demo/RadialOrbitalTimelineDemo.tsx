"use client";

import { FileText, Users, Zap, Shield, Globe, Sparkles, Code, Database } from "lucide-react";
import RadialOrbitalTimeline from "@/components/ui/radial-orbital-timeline";

const collabSpaceTimelineData = [
  {
    id: 1,
    title: "Real-Time Editing",
    date: "Core Feature",
    content: "Operational Transformation engine for conflict-free collaborative editing with instant synchronization.",
    category: "Collaboration",
    icon: FileText,
    relatedIds: [2, 3],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "Live Presence",
    date: "Core Feature",
    content: "Real-time user presence tracking with cursor positions and active user indicators.",
    category: "Collaboration",
    icon: Users,
    relatedIds: [1, 3, 4],
    status: "completed" as const,
    energy: 95,
  },
  {
    id: 3,
    title: "WebSocket Server",
    date: "Backend",
    content: "Socket.io server handling real-time connections, document sync, and presence updates.",
    category: "Infrastructure",
    icon: Zap,
    relatedIds: [1, 2, 5],
    status: "completed" as const,
    energy: 90,
  },
  {
    id: 4,
    title: "Security & Auth",
    date: "Backend",
    content: "Enterprise-grade security with JWT authentication, role-based access control, and encrypted connections.",
    category: "Security",
    icon: Shield,
    relatedIds: [2, 6],
    status: "in-progress" as const,
    energy: 70,
  },
  {
    id: 5,
    title: "Redis Cache",
    date: "Infrastructure",
    content: "High-performance caching with Redis for sessions, presence tracking, and document locking.",
    category: "Infrastructure",
    icon: Database,
    relatedIds: [3, 6],
    status: "completed" as const,
    energy: 85,
  },
  {
    id: 6,
    title: "Workspace Management",
    date: "Feature",
    content: "Create and manage workspaces with member permissions, document organization, and team collaboration.",
    category: "Features",
    icon: Globe,
    relatedIds: [4, 5, 7],
    status: "pending" as const,
    energy: 40,
  },
  {
    id: 7,
    title: "Document Editor",
    date: "Feature",
    content: "Rich text editor with Quill.js integration, version history, and collaborative cursors.",
    category: "Features",
    icon: Code,
    relatedIds: [1, 6],
    status: "pending" as const,
    energy: 30,
  },
  {
    id: 8,
    title: "Smart Features",
    date: "Advanced",
    content: "Comments, mentions, notifications, and intelligent conflict resolution built-in.",
    category: "Features",
    icon: Sparkles,
    relatedIds: [1, 2, 7],
    status: "pending" as const,
    energy: 20,
  },
];

export function RadialOrbitalTimelineDemo() {
  return (
    <>
      <RadialOrbitalTimeline timelineData={collabSpaceTimelineData} />
    </>
  );
}

export default {
  RadialOrbitalTimelineDemo,
};
