"use client"

import { useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MessageCircle, Clock, UserPlus } from 'lucide-react';

const StatsDisplay = ({ token }: { token?: string }) => {

  const { stats, isConnected, requestStats } = useSocket(token || undefined);

  useEffect(() => {
    if (isConnected) {
      requestStats();
    }
  }, [isConnected, requestStats]);

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-8">
      <Card className='bg-fg-primary'>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats?.totalConnections || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            Connected users
          </p>
        </CardContent>
      </Card>

      <Card className='bg-fg-primary'>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
          <MessageCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats?.activeChats || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            Ongoing conversations
          </p>
        </CardContent>
      </Card>

      <Card className='bg-fg-primary'>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Waiting Users</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats?.waitingUsers || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            Users looking for chat
          </p>
        </CardContent>
      </Card>

      <Card className='bg-fg-primary'>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Authenticated Users</CardTitle>
          <UserPlus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats?.authenticatedUsers || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            Logged in users
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsDisplay;