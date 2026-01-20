"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { FloatingShapes, Sticker, BrutalistCard, BrutalistButton } from '@/components/ui/RetroElements';
import { 
  Users, 
  UserPlus, 
  Search, 
  Check, 
  X, 
  Clock, 
  ArrowLeft,
  Zap,
  UserMinus,
  Send
} from 'lucide-react';

interface UserResult {
  _id: string;
  name: string;
  email: string;
  connectionStatus: 'none' | 'pending-sent' | 'pending-received' | 'connected';
  connectionId?: string;
}

interface Connection {
  _id: string;
  requester: { _id: string; name: string; email: string };
  recipient: { _id: string; name: string; email: string };
  status: string;
  createdAt: string;
}

export default function ConnectionsPage() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'friends' | 'pending' | 'find'>('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserResult[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [pendingReceived, setPendingReceived] = useState<Connection[]>([]);
  const [pendingSent, setPendingSent] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchConnections();
    }
  }, [isAuthenticated]);

  const fetchConnections = async () => {
    try {
      const [friendsRes, pendingRes] = await Promise.all([
        fetch('/api/connections?status=accepted'),
        fetch('/api/connections?status=pending'),
      ]);

      if (friendsRes.ok) {
        const data = await friendsRes.json();
        setConnections(data.connections || []);
      }

      if (pendingRes.ok) {
        const data = await pendingRes.json();
        const pending = data.connections || [];
        const userId = (user as any)?.id || '';
        setPendingReceived(pending.filter((c: Connection) => c.recipient?._id === userId || c.recipient?.id === userId));
        setPendingSent(pending.filter((c: Connection) => c.requester?._id === userId || c.requester?.id === userId));
      }
    } catch (error) {
      console.error('Error fetching connections:', error);
    }
  };

  const searchUsers = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.users || []);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendRequest = async (userId: string) => {
    try {
      const res = await fetch('/api/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientId: userId }),
      });

      if (res.ok) {
        searchUsers();
        fetchConnections();
      }
    } catch (error) {
      console.error('Error sending request:', error);
    }
  };

  const acceptRequest = async (connectionId: string) => {
    try {
      const res = await fetch(`/api/connections/${connectionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'accept' }),
      });

      if (res.ok) {
        fetchConnections();
      }
    } catch (error) {
      console.error('Error accepting request:', error);
    }
  };

  const rejectRequest = async (connectionId: string) => {
    try {
      const res = await fetch(`/api/connections/${connectionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject' }),
      });

      if (res.ok) {
        fetchConnections();
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const cancelRequest = async (connectionId: string) => {
    try {
      const res = await fetch(`/api/connections/${connectionId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchConnections();
      }
    } catch (error) {
      console.error('Error canceling request:', error);
    }
  };

  const unfriend = async (connectionId: string) => {
    try {
      const res = await fetch(`/api/connections/${connectionId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchConnections();
      }
    } catch (error) {
      console.error('Error unfriending:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FFF8E7] dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="retro-loader"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'friends', label: 'My Friends', icon: Users, count: connections.length },
    { id: 'pending', label: 'Pending', icon: Clock, count: pendingReceived.length + pendingSent.length },
    { id: 'find', label: 'Find People', icon: Search },
  ];

  return (
    <div className="min-h-screen bg-[#FFF8E7] dark:bg-[#0a0a0a] grid-pattern relative overflow-hidden">
      <FloatingShapes />

      {/* Header */}
      <header className="relative z-10 border-b-4 border-black dark:border-white bg-white dark:bg-[#1a1a1a]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#FFE500] border-3 border-black flex items-center justify-center" style={{ borderWidth: '3px' }}>
              <Zap className="w-5 h-5 text-black" />
            </div>
            <span className="font-black text-xl text-black dark:text-white">CollabSpace</span>
          </Link>
        </div>
      </header>

      <main className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 mb-6 text-black dark:text-white hover:text-[#FF6B35] transition font-bold"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>

        <div className={`mb-8 ${mounted ? 'animate-slide-up' : 'opacity-0'}`}>
          <Sticker variant="mint" className="mb-4">Network</Sticker>
          <h1 className="text-4xl font-black text-black dark:text-white mb-2">
            <span className="inline-block bg-[#FFE500] px-3 transform -rotate-1">Connections</span>
          </h1>
          <p className="text-black/60 dark:text-white/60">Find and connect with other users</p>
        </div>

        {/* Tabs */}
        <div className="flex border-3 border-black mb-8" style={{ borderWidth: '3px' }}>
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 px-4 font-bold uppercase tracking-wide text-sm transition flex items-center justify-center gap-2 ${
                index > 0 ? 'border-l-3 border-black' : ''
              } ${
                activeTab === tab.id 
                  ? 'bg-[#FFE500] text-black' 
                  : 'bg-white text-black/60 hover:bg-gray-100'
              }`}
              style={index > 0 ? { borderLeftWidth: '3px' } : {}}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className="ml-1 px-2 py-0.5 bg-black text-white text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className={`${mounted ? 'animate-slide-up delay-200' : 'opacity-0'}`}>
          {/* My Friends Tab */}
          {activeTab === 'friends' && (
            <div className="space-y-4">
              {connections.length === 0 ? (
                <BrutalistCard variant="white" className="p-8 text-center">
                  <Users className="w-16 h-16 text-black/30 mx-auto mb-4" />
                  <p className="font-bold text-black text-lg">No connections yet</p>
                  <p className="text-black/60 mb-4">Find people to connect with!</p>
                  <BrutalistButton variant="orange" onClick={() => setActiveTab('find')}>
                    Find People
                  </BrutalistButton>
                </BrutalistCard>
              ) : (
                connections.map((conn) => {
                  const friend = conn.requester._id === (user as any)?.id ? conn.recipient : conn.requester;
                  return (
                    <BrutalistCard key={conn._id} variant="white" className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#FFE500] border-3 border-black flex items-center justify-center font-black text-black text-lg" style={{ borderWidth: '3px' }}>
                            {friend.name?.charAt(0) || '?'}
                          </div>
                          <div>
                            <p className="font-bold text-black">{friend.name}</p>
                            <p className="text-sm text-black/60">{friend.email}</p>
                          </div>
                        </div>
                        <BrutalistButton
                          variant="ghost"
                          size="sm"
                          onClick={() => unfriend(conn._id)}
                          className="text-[#FF6B35]"
                        >
                          <UserMinus className="w-4 h-4 mr-1" />
                          Unfriend
                        </BrutalistButton>
                      </div>
                    </BrutalistCard>
                  );
                })
              )}
            </div>
          )}

          {/* Pending Tab */}
          {activeTab === 'pending' && (
            <div className="space-y-6">
              {/* Received Requests */}
              <div>
                <Sticker variant="orange" className="mb-4">Received Requests</Sticker>
                <div className="space-y-3">
                  {pendingReceived.length === 0 ? (
                    <p className="text-black/60 dark:text-white/60">No pending requests</p>
                  ) : (
                    pendingReceived.map((conn) => (
                      <BrutalistCard key={conn._id} variant="yellow" className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white border-3 border-black flex items-center justify-center font-black text-black text-lg" style={{ borderWidth: '3px' }}>
                              {conn.requester.name?.charAt(0) || '?'}
                            </div>
                            <div>
                              <p className="font-bold text-black">{conn.requester.name}</p>
                              <p className="text-sm text-black/60">{conn.requester.email}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <BrutalistButton
                              variant="orange"
                              size="sm"
                              onClick={() => acceptRequest(conn._id)}
                            >
                              <Check className="w-4 h-4" />
                            </BrutalistButton>
                            <BrutalistButton
                              variant="ghost"
                              size="sm"
                              onClick={() => rejectRequest(conn._id)}
                            >
                              <X className="w-4 h-4" />
                            </BrutalistButton>
                          </div>
                        </div>
                      </BrutalistCard>
                    ))
                  )}
                </div>
              </div>

              {/* Sent Requests */}
              <div>
                <Sticker variant="mint" className="mb-4">Sent Requests</Sticker>
                <div className="space-y-3">
                  {pendingSent.length === 0 ? (
                    <p className="text-black/60 dark:text-white/60">No sent requests</p>
                  ) : (
                    pendingSent.map((conn) => (
                      <BrutalistCard key={conn._id} variant="white" className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#00D9A5] border-3 border-black flex items-center justify-center font-black text-black text-lg" style={{ borderWidth: '3px' }}>
                              {conn.recipient.name?.charAt(0) || '?'}
                            </div>
                            <div>
                              <p className="font-bold text-black">{conn.recipient.name}</p>
                              <p className="text-sm text-black/60">Pending...</p>
                            </div>
                          </div>
                          <BrutalistButton
                            variant="ghost"
                            size="sm"
                            onClick={() => cancelRequest(conn._id)}
                          >
                            Cancel
                          </BrutalistButton>
                        </div>
                      </BrutalistCard>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Find People Tab */}
          {activeTab === 'find' && (
            <div>
              <div className="flex gap-3 mb-6">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
                  placeholder="Search by name or email..."
                  className="brutalist-input flex-1"
                />
                <BrutalistButton onClick={searchUsers} variant="orange" disabled={loading}>
                  <Search className="w-5 h-5" />
                </BrutalistButton>
              </div>

              <div className="space-y-3">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="retro-loader"></div>
                  </div>
                ) : searchResults.length === 0 ? (
                  <BrutalistCard variant="white" className="p-8 text-center">
                    <Search className="w-16 h-16 text-black/30 mx-auto mb-4" />
                    <p className="text-black/60">Search for users to connect with</p>
                  </BrutalistCard>
                ) : (
                  searchResults.map((result) => (
                    <BrutalistCard key={result._id} variant="white" className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#FFE500] border-3 border-black flex items-center justify-center font-black text-black text-lg" style={{ borderWidth: '3px' }}>
                            {result.name?.charAt(0) || '?'}
                          </div>
                          <div>
                            <p className="font-bold text-black">{result.name}</p>
                            <p className="text-sm text-black/60">{result.email}</p>
                          </div>
                        </div>
                        {result.connectionStatus === 'none' && (
                          <BrutalistButton
                            variant="orange"
                            size="sm"
                            onClick={() => sendRequest(result._id)}
                          >
                            <UserPlus className="w-4 h-4 mr-1" />
                            Connect
                          </BrutalistButton>
                        )}
                        {result.connectionStatus === 'pending-sent' && (
                          <Sticker variant="mint">Pending</Sticker>
                        )}
                        {result.connectionStatus === 'pending-received' && (
                          <BrutalistButton
                            variant="yellow"
                            size="sm"
                            onClick={() => acceptRequest(result.connectionId!)}
                          >
                            Accept
                          </BrutalistButton>
                        )}
                        {result.connectionStatus === 'connected' && (
                          <Sticker variant="mint">Connected ✓</Sticker>
                        )}
                      </div>
                    </BrutalistCard>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
