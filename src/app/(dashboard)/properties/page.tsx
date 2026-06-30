'use client';

import { useState, useEffect } from 'react';
import { 
  Plus,
  Search,
  Grid3X3,
  List,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Home,
  Building2,
  Warehouse,
  Trees,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/lib/auth-context';
import { useTranslation } from '@/hooks/use-translation';
import { mockProperties } from '@/lib/mock-data';
import { getStatusColor, formatPrice } from '@/lib/utils';
import { Property } from '@/types';
import Link from 'next/link';

function PropertiesList() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const properties = user?.role === 'admin'
    ? mockProperties
    : mockProperties.filter(p => p.ownerId === user?.id);

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? true;
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
    const matchesType = typeFilter === 'all' || property.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getTypeIcon = (type: Property['type']) => {
    switch (type) {
      case 'apartment': return Building2;
      case 'villa': return Home;
      case 'commercial': return Warehouse;
      case 'land': return Trees;
      default: return Building2;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {t('properties.title')}
          </h1>
          <p className="text-muted-foreground">
            {filteredProperties.length} {t('properties.title').toLowerCase()}
          </p>
        </div>
        <Button asChild>
          <Link href="/properties/add">
            <Plus className="h-4 w-4 mr-2" />
            {t('properties.addNew')}
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('common.search') + ' ' + t('properties.title').toLowerCase() + '...'}
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
            <SelectItem value="available">{t('properties.available')}</SelectItem>
            <SelectItem value="pending">{t('properties.pending')}</SelectItem>
            <SelectItem value="sold">{t('properties.sold')}</SelectItem>
            <SelectItem value="rented">{t('properties.rented')}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder={t('common.type')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('common.filter')}</SelectItem>
            <SelectItem value="apartment">{t('properties.apartment')}</SelectItem>
            <SelectItem value="villa">{t('properties.villa')}</SelectItem>
            <SelectItem value="land">{t('properties.land')}</SelectItem>
            <SelectItem value="commercial">{t('properties.commercial')}</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className={`grid gap-4 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
          : 'grid-cols-1'
      }`}>
        {filteredProperties.map((property) => {
          const TypeIcon = getTypeIcon(property.type);
          
          return viewMode === 'grid' ? (
            <Card key={property.id} className="group hover:shadow-lg transition-shadow">
              <div className="relative aspect-video overflow-hidden rounded-t-lg">
                <img
                  src={property.images[0]}
                  alt={property.type}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
                <Badge
                  className={`absolute top-2 right-2 ${
                    getStatusColor(property.status)
                  }`}
                >
                  {t(`properties.${property.status}`)}
                </Badge>
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <TypeIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h3 className="font-semibold">{t(`properties.${property.type}`)}</h3>
                      <p className="text-sm text-muted-foreground">
                        {property.area} m² • {property.rooms} {t('properties.rooms').toLowerCase()}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('properties.yearBuilt')}</span>
                    <span>{property.yearBuilt}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('properties.elevator')}</span>
                    <span>{property.elevator ? '✓' : '✗'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('properties.parkingSpots')}</span>
                    <span>{property.parkingSpots}</span>
                  </div>
                </div>
              </CardContent>
              {property.price && (
                <CardFooter className="border-t pt-4">
                  <p className="text-lg font-bold text-primary">
                    {formatPrice(property.price)}
                  </p>
                </CardFooter>
              )}
            </Card>
          ) : (
            <Card key={property.id} className="hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row">
                <div className="relative md:w-48 h-48 overflow-hidden rounded-l-lg">
                  <img
                    src={property.images[0]}
                    alt={property.type}
                    className="object-cover w-full h-full"
                  />
                  <Badge
                    className={`absolute top-2 right-2 ${
                      getStatusColor(property.status)
                    }`}
                  >
                    {t(`properties.${property.status}`)}
                  </Badge>
                </div>
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        <TypeIcon className="h-5 w-5" />
                        {t(`properties.${property.type}`)}
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-muted-foreground">{t('properties.area')}</p>
                          <p className="font-medium">{property.area} m²</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{t('properties.rooms')}</p>
                          <p className="font-medium">{property.rooms}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{t('properties.parkingSpots')}</p>
                          <p className="font-medium">{property.parkingSpots}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{t('properties.yearBuilt')}</p>
                          <p className="font-medium">{property.yearBuilt}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {property.price && (
                        <p className="text-lg font-bold text-primary">
                          {formatPrice(property.price)}
                        </p>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}

        {filteredProperties.length === 0 && (
          <div className="col-span-full text-center py-12">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">{t('common.noData')}</h3>
            <p className="text-muted-foreground">No properties found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <PropertiesList />;
}