"use client"

import { useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MessageCircle, Clock, UserPlus } from 'lucide-react';
import { cn } from '@/utils/utils';

const StatsDisplay = ({ token }: { token?: string }) => {
  const { stats, isConnected, requestStats } = useSocket(token || undefined);

  useEffect(() => {
    if (isConnected) {
      requestStats();
      const interval = setInterval(requestStats, 5000);
      return () => clearInterval(interval);
    }
  }, [isConnected, requestStats]);

  const StatusIndicator = ({ count }: { count: number }) => (
    <span className="flex items-center gap-2">
      <span
        className={cn(
          "relative flex h-3 w-3",
          "after:absolute after:inset-0",
          "after:animate-ping after:rounded-full after:opacity-75",
          count > 0 ? "after:bg-green-500" : "after:bg-red-500"
        )}
      >
        <span className={cn(
          "relative inline-flex rounded-full h-3 w-3",
          count > 0 ? "bg-green-500" : "bg-red-500"
        )} />
      </span>
    </span>
  );

  const StatCard = ({ title, icon, count, subtitle, showStatus = false, iconColor }: {
    title: string;
    icon: React.ReactNode;
    count: number;
    subtitle: string;
    showStatus?: boolean;
    iconColor: string;
  }) => (
    <Card className="bg-fg-primary hover:bg-accent/50 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2 min-w-0">
          <CardTitle className="text-sm font-medium truncate">{title}</CardTitle>
          {showStatus && <StatusIndicator count={count} />}
        </div>
        <div className={`shrink-0 ${iconColor}`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full p-4">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          icon={<Users className="h-4 w-4" />}
          count={stats?.totalConnections || 0}
          subtitle="Connected users"
          showStatus={true}
          iconColor="text-orange-500"
        />
        <StatCard
          title="Active Chats"
          icon={<MessageCircle className="h-4 w-4" />}
          count={stats?.activeChats || 0}
          subtitle="Ongoing conversations"
          iconColor="text-blue-500"
        />
        <StatCard
          title="Waiting Users"
          icon={<Clock className="h-4 w-4" />}
          count={stats?.waitingUsers || 0}
          subtitle="Users looking for chat"
          iconColor="text-yellow-500"
        />
        <StatCard
          title="Authenticated Users"
          icon={<UserPlus className="h-4 w-4" />}
          count={stats?.authenticatedUsers || 0}
          subtitle="Logged in users"
          iconColor="text-green-500"
        />
      </div>
    </div>
  );
};

export default StatsDisplay;