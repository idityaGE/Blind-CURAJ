'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MessageSquare } from 'lucide-react';

export function OnlineUsers() {
  const [stats, setStats] = useState({
    onlineUsers: 0,
    activeSessions: 0,
  });

  useEffect(() => {
    // In a real app, this would connect to WebSocket to get live stats
    const interval = setInterval(() => {
      setStats({
        onlineUsers: Math.floor(Math.random() * 100) + 50,
        activeSessions: Math.floor(Math.random() * 30) + 10,
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Online Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.onlineUsers}</div>
          <div className="text-xs text-muted-foreground">
            Users currently online
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeSessions}</div>
          <div className="text-xs text-muted-foreground">
            Ongoing conversations
          </div>
        </CardContent>
      </Card>
    </div>
  );
}