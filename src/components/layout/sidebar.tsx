'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  Users,
  DollarSign,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';
import { useTranslation } from '@/hooks/use-translation';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { t } = useTranslation();

  const menuItems = [
    {
      href: '/dashboard',
      icon: LayoutDashboard,
      label: t('dashboard.title'),
    },
    {
      href: '/properties',
      icon: Building2,
      label: t('properties.title'),
    },
    ...(user?.role === 'admin'
      ? [
          {
            href: '/members',
            icon: Users,
            label: t('members.title'),
          },
          {
            href: '/commissions',
            icon: DollarSign,
            label: t('commissions.title'),
          },
        ]
      : []),
    {
      href: '/settings',
      icon: Settings,
      label: t('settings.title'),
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 right-0 z-50 h-full w-64 bg-background border-l transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0',
          isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              <div>
                <h1 className="text-lg font-bold">{t('common.appName')}</h1>
                <p className="text-xs text-muted-foreground">
                  {t('common.appFullName')}
                </p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={cn(
                      'w-full justify-start gap-3',
                      isActive && 'bg-secondary'
                    )}
                    onClick={onClose}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t">
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.memberId}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}