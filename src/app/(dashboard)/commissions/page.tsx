'use client';

import { useState } from 'react';
import { 
  DollarSign, 
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RoleGuard } from '@/components/shared/role-guard';
import { useTranslation } from '@/hooks/use-translation';
import { mockCommissions, mockUsers, mockProperties } from '@/lib/mock-data';
import { getCommissionStatusColor, formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

export default function CommissionsPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getMemberName = (memberId: string) => {
    return mockUsers.find(u => u.id === memberId)?.name || 'Unknown';
  };

  const getMemberAvatar = (memberId: string) => {
    return mockUsers.find(u => u.id === memberId)?.avatar;
  };

  const getPropertyType = (propertyId: string) => {
    const property = mockProperties.find(p => p.id === propertyId);
    return property ? t(`properties.${property.type}`) : 'Unknown';
  };

  const filteredCommissions = mockCommissions.filter(commission => {
    const matchesSearch = getMemberName(commission.memberId).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || commission.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleMarkAsPaid = (commissionId: string) => {
    toast.success('Commission marked as paid');
    // In a real app, update the database
  };

  const handleCancel = (commissionId: string) => {
    toast.error('Commission cancelled');
  };

  const totalPending = mockCommissions
    .filter(c => c.status === 'pending')
    .reduce((sum, c) => sum + c.amount, 0);

  const totalPaid = mockCommissions
    .filter(c => c.status === 'paid')
    .reduce((sum, c) => sum + c.amount, 0);

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {t('commissions.title')}
            </h1>
            <p className="text-muted-foreground">
              {mockCommissions.length} {t('commissions.title').toLowerCase()}
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {t('commissions.pending')}
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {formatPrice(totalPending)}
              </div>
              <p className="text-xs text-muted-foreground">
                {mockCommissions.filter(c => c.status === 'pending').length} commissions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {t('commissions.paid')}
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatPrice(totalPaid)}
              </div>
              <p className="text-xs text-muted-foreground">
                {mockCommissions.filter(c => c.status === 'paid').length} commissions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total
              </CardTitle>
              <DollarSign className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatPrice(totalPending + totalPaid)}
              </div>
              <p className="text-xs text-muted-foreground">
                Overall commission volume
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('common.search') + ' ' + t('members.title').toLowerCase() + '...'}
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder={t('common.status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('common.filter')}</SelectItem>
              <SelectItem value="pending">{t('commissions.pending')}</SelectItem>
              <SelectItem value="paid">{t('commissions.paid')}</SelectItem>
              <SelectItem value="cancelled">{t('commissions.cancelled')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Commissions Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('commissions.memberId')}</TableHead>
                  <TableHead>{t('commissions.propertyId')}</TableHead>
                  <TableHead>{t('commissions.amount')}</TableHead>
                  <TableHead>{t('commissions.percentage')}</TableHead>
                  <TableHead>{t('commissions.status')}</TableHead>
                  <TableHead>{t('common.date')}</TableHead>
                  <TableHead className="text-right">{t('common.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCommissions.map((commission) => (
                  <TableRow key={commission.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={getMemberAvatar(commission.memberId)} />
                          <AvatarFallback>
                            {getMemberName(commission.memberId).charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {getMemberName(commission.memberId)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {commission.memberId}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">
                        {getPropertyType(commission.propertyId)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        #{commission.propertyId}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="font-bold">
                        {formatPrice(commission.amount)}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {commission.percentage}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getCommissionStatusColor(commission.status)}
                      >
                        {t(`commissions.${commission.status}`)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">
                        {commission.createdAt.toLocaleDateString()}
                      </p>
                      {commission.paidAt && (
                        <p className="text-xs text-muted-foreground">
                          Paid: {commission.paidAt.toLocaleDateString()}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {commission.status === 'pending' && (
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkAsPaid(commission.id)}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            {t('commissions.markAsPaid')}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive"
                            onClick={() => handleCancel(commission.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            {t('common.cancel')}
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredCommissions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <DollarSign className="h-8 w-8 mx-auto text-muted-foreground" />
                      <p className="mt-2 text-muted-foreground">{t('common.noData')}</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
}