'use client';

import { useState } from 'react';
import { 
  Users, 
  Search, 
  ChevronDown, 
  ChevronRight,
  UserPlus,
  Building2,
  DollarSign,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RoleGuard } from '@/components/shared/role-guard';
import { useTranslation } from '@/hooks/use-translation';
import { mockUsers, mockProperties, mockCommissions } from '@/lib/mock-data';
import { User } from '@/types';

export default function MembersPage() {
  const { t } = useTranslation();
  const [expandedMembers, setExpandedMembers] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const getSubMembers = (parentId: string) => {
    return mockUsers.filter(u => u.parentId === parentId);
  };

  const getMemberProperties = (memberId: string) => {
    return mockProperties.filter(p => p.ownerId === memberId);
  };

  const getMemberCommissions = (memberId: string) => {
    return mockCommissions.filter(c => c.memberId === memberId);
  };

  const toggleExpand = (memberId: string) => {
    const newExpanded = new Set(expandedMembers);
    if (newExpanded.has(memberId)) {
      newExpanded.delete(memberId);
    } else {
      newExpanded.add(memberId);
    }
    setExpandedMembers(newExpanded);
  };

  const admins = mockUsers.filter(u => u.role === 'admin');
  const rootMembers = mockUsers.filter(u => u.role === 'member' && !u.parentId);

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {t('members.title')}
            </h1>
            <p className="text-muted-foreground">
              {mockUsers.length} {t('members.title').toLowerCase()}
            </p>
          </div>
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('common.search') + ' ' + t('members.title').toLowerCase() + '...'}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Admin Members */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" />
              Administrators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {admins.map((admin) => (
                <MemberCard
                  key={admin.id}
                  member={admin}
                  properties={getMemberProperties(admin.id)}
                  commissions={getMemberCommissions(admin.id)}
                  isExpanded={expandedMembers.has(admin.id)}
                  onToggle={() => toggleExpand(admin.id)}
                  t={t}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Member Hierarchy */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              {t('members.hierarchy')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {rootMembers.map((member) => (
                <div key={member.id} className="space-y-2">
                  <MemberCard
                    member={member}
                    properties={getMemberProperties(member.id)}
                    commissions={getMemberCommissions(member.id)}
                    isExpanded={expandedMembers.has(member.id)}
                    onToggle={() => toggleExpand(member.id)}
                    t={t}
                  />
                  
                  {/* Sub Members */}
                  {expandedMembers.has(member.id) && (
                    <div className="ml-8 border-l-2 pl-4 space-y-2">
                      {getSubMembers(member.id).map((subMember) => (
                        <MemberCard
                          key={subMember.id}
                          member={subMember}
                          properties={getMemberProperties(subMember.id)}
                          commissions={getMemberCommissions(subMember.id)}
                          isExpanded={expandedMembers.has(subMember.id)}
                          onToggle={() => toggleExpand(subMember.id)}
                          isSubMember
                          t={t}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  );
}

interface MemberCardProps {
  member: User;
  properties: any[];
  commissions: any[];
  isExpanded: boolean;
  onToggle: () => void;
  isSubMember?: boolean;
  t: (key: string) => string;
}

function MemberCard({ member, properties, commissions, isExpanded, onToggle, isSubMember, t }: MemberCardProps) {
  const subMembers = mockUsers.filter(u => u.parentId === member.id);
  const hasSubMembers = subMembers.length > 0;

  return (
    <div className={`p-4 rounded-lg border ${isSubMember ? 'bg-muted/30' : 'bg-card'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {hasSubMembers && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onToggle}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}
          <Avatar className="h-10 w-10">
            <AvatarImage src={member.avatar} />
            <AvatarFallback>{member.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{member.name}</h3>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">{member.memberId}</p>
              <Badge variant="secondary">{member.role}</Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Building2 className="h-4 w-4" />
              {t('members.properties')}
            </p>
            <p className="font-bold">{properties.length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              {t('members.commissions')}
            </p>
            <p className="font-bold">{commissions.length}</p>
          </div>
          {hasSubMembers && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Users className="h-4 w-4" />
                {t('members.subMembers')}
              </p>
              <p className="font-bold">{subMembers.length}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}