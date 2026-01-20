"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/loading';
import { 
  Users, 
  UserPlus, 
  Search, 
  Check, 
  X, 
  UserMinus,
  Clock,
  Send
} from 'lucide-react';

interface UserResult {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  connectionStatus: 'none' | 'pending' | 'accepted' | 'rejected' | 'blocked';
  connectionId?: string;
  isRequester?: boolean;
}

interface Connection {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  status: string;
  isRequester: boolean;
  createdAt: string;
}

export default function ConnectionsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'friends' | 'pending' | 'find'>('friends');
  const [friends, setFriends] = useState<Connection[]>([]);
  const [pendingReceived, setPendingReceived] = useState<Connection[]>([]);
  const [pendingSent, setPendingSent] = useState<Connection[]>([]);
  const [searchResults, setSearchResults] = useState<UserResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch connections
  useEffect(() => {
    if (!authLoading && user) {
      fetchConnections();
    }
  }, [authLoading, user]);

  const fetchConnections = async () => {
    setLoading(true);
    try {
      // Fetch friends
      const friendsRes = await fetch('/api/connections?status=accepted');
      const friendsData = await friendsRes.json();
      setFriends(friendsData.connections || []);

      // Fetch pending received
      const pendingReceivedRes = await fetch('/api/connections?status=pending&type=received');
      const pendingReceivedData = await pendingReceivedRes.json();
      setPendingReceived(pendingReceivedData.connections || []);

      // Fetch pending sent
      const pendingSentRes = await fetch('/api/connections?status=pending&type=sent');
      const pendingSentData = await pendingSentRes.json();
      setPendingSent(pendingSentData.connections || []);
    } catch (error) {
      console.error('Failed to fetch connections:', error);
    } finally {
      setLoading(false);
    }
  };

  // Search users
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSearchResults(data.users || []);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setSearching(false);
    }
  };

  // Send friend request
  const sendRequest = async (recipientId: string) => {
    setActionLoading(recipientId);
    try {
      const res = await fetch('/api/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientId }),
      });
      
      if (res.ok) {
        // Update search results
        setSearchResults(prev => prev.map(u => 
          u._id === recipientId 
            ? { ...u, connectionStatus: 'pending', isRequester: true }
            : u
        ));
        // Refresh pending sent
        fetchConnections();
      }
    } catch (error) {
      console.error('Failed to send request:', error);
    } finally {
      setActionLoading(null);
    }
  };

  // Accept/Reject request
  const handleRequest = async (connectionId: string, action: 'accept' | 'reject') => {
    setActionLoading(connectionId);
    try {
      const res = await fetch(`/api/connections/${connectionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      
      if (res.ok) {
        fetchConnections();
      }
    } catch (error) {
      console.error(`Failed to ${action} request:`, error);
    } finally {
      setActionLoading(null);
    }
  };

  // Remove connection
  const removeConnection = async (connectionId: string) => {
    setActionLoading(connectionId);
    try {
      const res = await fetch(`/api/connections/${connectionId}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        fetchConnections();
      }
    } catch (error) {
      console.error('Failed to remove connection:', error);
    } finally {
      setActionLoading(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  const getInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex transition-colors duration-300">
      <Sidebar />
      
      <main className="flex-1 p-8 ml-64">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Connections</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your friends and connections</p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-8 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('friends')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'friends'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>My Friends</span>
              {friends.length > 0 && (
                <span className="bg-sky-100 dark:bg-sky-900 text-sky-600 dark:text-sky-400 px-2 py-0.5 rounded-full text-xs">
                  {friends.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'pending'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Pending</span>
              {pendingReceived.length > 0 && (
                <span className="bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full text-xs">
                  {pendingReceived.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('find')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'find'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Find People</span>
            </button>
          </div>

          {/* Content */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            {loading && activeTab !== 'find' ? (
              <div className="flex items-center justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : (
              <>
                {/* My Friends Tab */}
                {activeTab === 'friends' && (
                  <div>
                    {friends.length === 0 ? (
                      <div className="text-center py-12">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No friends yet</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">Start connecting with people!</p>
                        <Button onClick={() => setActiveTab('find')} className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Find People
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {friends.map((conn) => (
                          <div key={conn._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <div className="flex items-center space-x-3">
                              {conn.user.avatar ? (
                                <img src={conn.user.avatar} alt="" className="w-12 h-12 rounded-full" />
                              ) : (
                                <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                                  {getInitials(conn.user.name)}
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{conn.user.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{conn.user.email}</p>
                              </div>
                            </div>
                            <Button
                              onClick={() => removeConnection(conn._id)}
                              variant="ghost"
                              className="text-gray-500 hover:text-red-500"
                              disabled={actionLoading === conn._id}
                            >
                              {actionLoading === conn._id ? <Spinner size="sm" /> : <UserMinus className="w-4 h-4" />}
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Pending Tab */}
                {activeTab === 'pending' && (
                  <div className="space-y-6">
                    {/* Received Requests */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                        Received Requests
                      </h3>
                      {pendingReceived.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">No pending requests</p>
                      ) : (
                        <div className="space-y-3">
                          {pendingReceived.map((conn) => (
                            <div key={conn._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                              <div className="flex items-center space-x-3">
                                {conn.user.avatar ? (
                                  <img src={conn.user.avatar} alt="" className="w-12 h-12 rounded-full" />
                                ) : (
                                  <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                                    {getInitials(conn.user.name)}
                                  </div>
                                )}
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-white">{conn.user.name}</p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">{conn.user.email}</p>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  onClick={() => handleRequest(conn._id, 'accept')}
                                  className="bg-green-500 hover:bg-green-600 text-white"
                                  disabled={actionLoading === conn._id}
                                >
                                  {actionLoading === conn._id ? <Spinner size="sm" /> : <Check className="w-4 h-4" />}
                                </Button>
                                <Button
                                  onClick={() => handleRequest(conn._id, 'reject')}
                                  variant="ghost"
                                  className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  disabled={actionLoading === conn._id}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Sent Requests */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                        Sent Requests
                      </h3>
                      {pendingSent.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">No sent requests</p>
                      ) : (
                        <div className="space-y-3">
                          {pendingSent.map((conn) => (
                            <div key={conn._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                              <div className="flex items-center space-x-3">
                                {conn.user.avatar ? (
                                  <img src={conn.user.avatar} alt="" className="w-12 h-12 rounded-full" />
                                ) : (
                                  <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                                    {getInitials(conn.user.name)}
                                  </div>
                                )}
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-white">{conn.user.name}</p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">{conn.user.email}</p>
                                </div>
                              </div>
                              <Button
                                onClick={() => removeConnection(conn._id)}
                                variant="ghost"
                                className="text-gray-500"
                                disabled={actionLoading === conn._id}
                              >
                                {actionLoading === conn._id ? <Spinner size="sm" /> : 'Cancel'}
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Find People Tab */}
                {activeTab === 'find' && (
                  <div>
                    {/* Search Input */}
                    <div className="relative mb-6">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search by name or email..."
                        className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>

                    {/* Search Results */}
                    {searching ? (
                      <div className="flex items-center justify-center py-12">
                        <Spinner size="lg" />
                      </div>
                    ) : searchQuery.length < 2 ? (
                      <div className="text-center py-12">
                        <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">Enter at least 2 characters to search</p>
                      </div>
                    ) : searchResults.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-gray-500 dark:text-gray-400">No users found</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {searchResults.map((userResult) => (
                          <div key={userResult._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <div className="flex items-center space-x-3">
                              {userResult.avatar ? (
                                <img src={userResult.avatar} alt="" className="w-12 h-12 rounded-full" />
                              ) : (
                                <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                                  {getInitials(userResult.name)}
                                </div>
                              )}
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{userResult.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{userResult.email}</p>
                              </div>
                            </div>
                            <div>
                              {userResult.connectionStatus === 'none' ? (
                                <Button
                                  onClick={() => sendRequest(userResult._id)}
                                  className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white"
                                  disabled={actionLoading === userResult._id}
                                >
                                  {actionLoading === userResult._id ? (
                                    <Spinner size="sm" />
                                  ) : (
                                    <>
                                      <UserPlus className="w-4 h-4 mr-2" />
                                      Connect
                                    </>
                                  )}
                                </Button>
                              ) : userResult.connectionStatus === 'pending' ? (
                                <span className="flex items-center text-orange-500 text-sm">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {userResult.isRequester ? 'Pending' : 'Accept?'}
                                </span>
                              ) : userResult.connectionStatus === 'accepted' ? (
                                <span className="flex items-center text-green-500 text-sm">
                                  <Check className="w-4 h-4 mr-1" />
                                  Friends
                                </span>
                              ) : null}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
