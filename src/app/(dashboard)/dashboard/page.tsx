'use client';

import { useState } from 'react';
import { 
  Building2, 
  Users, 
  DollarSign, 
  TrendingUp,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Eye,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth-context';
import { useTranslation } from '@/hooks/use-translation';
import { mockProperties, mockUsers, mockCommissions, mockActivities } from '@/lib/mock-data';
import { formatPrice } from '@/lib/utils';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const { t, language } = useTranslation();
  const isRTL = language.dir === 'rtl';

  // Filter data based on user role
  const properties = user?.role === 'admin' 
    ? mockProperties 
    : mockProperties.filter(p => p.ownerId === user?.id);

  const users = user?.role === 'admin' 
    ? mockUsers 
    : mockUsers.filter(u => u.parentId === user?.id || u.id === user?.id);

  const commissions = user?.role === 'admin'
    ? mockCommissions
    : mockCommissions.filter(c => c.memberId === user?.id);

  const stats = [
    {
      title: t('dashboard.totalProperties'),
      value: properties.length,
      icon: Building2,
      change: '+12%',
      trend: 'up',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: t('dashboard.activeMembers'),
      value: users.length,
      icon: Users,
      change: '+8%',
      trend: 'up',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: t('dashboard.pendingCommissions'),
      value: commissions.filter(c => c.status === 'pending').length,
      icon: DollarSign,
      change: '-3%',
      trend: 'down',
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    },
    {
      title: t('dashboard.monthlyRevenue'),
      value: formatPrice(125000000),
      icon: TrendingUp,
      change: '+23%',
      trend: 'up',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {t('dashboard.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('dashboard.welcome')}, {user?.name}
          </p>
        </div>
        <Button asChild>
          <Link href="/properties/add">
            <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('dashboard.addProperty')}
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                )}
                <span className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                  {stat.change}
                </span>
                <span>from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {t('dashboard.recentActivity')}
            </CardTitle>
            <CardDescription>Latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockActivities.slice(0, 5).map((activity) => {
                const user = mockUsers.find(u => u.id === activity.userId);
                return (
                  <div key={activity.id} className="flex items-start gap-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.timestamp.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {t('dashboard.quickActions')}
            </CardTitle>
            <CardDescription>Frequently used actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-auto p-4 flex-col gap-2" asChild>
                <Link href="/properties/add">
                  <Plus className="h-8 w-8" />
                  <span className="text-sm">{t('dashboard.addProperty')}</span>
                </Link>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex-col gap-2" asChild>
                <Link href="/properties">
                  <Eye className="h-8 w-8" />
                  <span className="text-sm">{t('dashboard.viewProperties')}</span>
                </Link>
              </Button>
              {user?.role === 'admin' && (
                <>
                  <Button variant="outline" className="h-auto p-4 flex-col gap-2" asChild>
                    <Link href="/members">
                      <Users className="h-8 w-8" />
                      <span className="text-sm">{t('dashboard.manageMembers')}</span>
                    </Link>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex-col gap-2" asChild>
                    <Link href="/commissions">
                      <DollarSign className="h-8 w-8" />
                      <span className="text-sm">{t('dashboard.viewCommissions')}</span>
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}