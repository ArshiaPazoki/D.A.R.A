'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  X, 
  FileText, 
  Image as ImageIcon,
  ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { propertySchema, PropertyFormData } from '@/lib/validations';
import { toast } from 'sonner';
import Link from 'next/link';

export default function AddPropertyPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [images, setImages] = useState<File[]>([]);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState('form');

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      elevator: false,
      parkingSpots: 0,
      rooms: 0,
      area: 0,
      yearBuilt: 1402,
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setImages(prev => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 10,
    maxSize: 5 * 1024 * 1024,
  });

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handlePdfUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
      toast.success('PDF uploaded successfully. Data extraction in progress...');
    }
  };

  const onSubmit = async (data: PropertyFormData) => {
    try {
      console.log('Form data:', data);
      console.log('Images:', images);
      console.log('PDF:', pdfFile);
      
      toast.success('Property added successfully!');
      router.push('/properties');
    } catch (error) {
      toast.error('Failed to add property');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/properties">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            {t('properties.addNew')}
          </h1>
          <p className="text-muted-foreground">
            Fill in the details or upload a PDF to add a new property
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="form">
            <FileText className="h-4 w-4 mr-2" />
            Manual Form
          </TabsTrigger>
          <TabsTrigger value="pdf">
            <Upload className="h-4 w-4 mr-2" />
            PDF Upload
          </TabsTrigger>
        </TabsList>

        <TabsContent value="form">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('properties.type')}</Label>
                    <Select 
                      onValueChange={(value: PropertyFormData['type']) => setValue('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('properties.type')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">{t('properties.apartment')}</SelectItem>
                        <SelectItem value="villa">{t('properties.villa')}</SelectItem>
                        <SelectItem value="land">{t('properties.land')}</SelectItem>
                        <SelectItem value="commercial">{t('properties.commercial')}</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.type && (
                      <p className="text-sm text-destructive">{errors.type.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="area">{t('properties.area')}</Label>
                    <Input
                      id="area"
                      type="number"
                      placeholder="120"
                      {...register('area', { valueAsNumber: true })}
                      className={errors.area ? 'border-destructive' : ''}
                    />
                    {errors.area && (
                      <p className="text-sm text-destructive">{errors.area.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rooms">{t('properties.rooms')}</Label>
                    <Input
                      id="rooms"
                      type="number"
                      placeholder="3"
                      {...register('rooms', { valueAsNumber: true })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="yearBuilt">{t('properties.yearBuilt')}</Label>
                    <Input
                      id="yearBuilt"
                      type="number"
                      placeholder="1402"
                      {...register('yearBuilt', { valueAsNumber: true })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="parkingSpots">{t('properties.parkingSpots')}</Label>
                    <Input
                      id="parkingSpots"
                      type="number"
                      placeholder="2"
                      {...register('parkingSpots', { valueAsNumber: true })}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="elevator"
                      onCheckedChange={(checked: boolean) => setValue('elevator', checked)}
                    />
                    <Label htmlFor="elevator">{t('properties.elevator')}</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">{t('properties.description')}</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the property..."
                    rows={4}
                    {...register('description')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">{t('properties.price')}</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="2500000000"
                    {...register('price', { valueAsNumber: true })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('properties.images')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? 'border-primary bg-primary/5'
                      : 'border-muted-foreground/25 hover:border-primary/50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="mt-4 text-lg font-medium">
                    {t('properties.dragDrop')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    PNG, JPG, WEBP up to 5MB each (max 10 files)
                  </p>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {images.map((file, index) => (
                      <div key={`${file.name}-${index}`} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-end">
              <Button variant="outline" type="button" asChild>
                <Link href="/properties">{t('common.cancel')}</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('common.loading') : t('common.save')}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="pdf">
          <Card>
            <CardHeader>
              <CardTitle>{t('properties.uploadPdf')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="mt-4 text-lg font-medium">
                  Upload a property listing PDF
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  We'll automatically extract the property details
                </p>
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={handlePdfUpload}
                  className="max-w-sm mx-auto"
                />
                {pdfFile && (
                  <div className="mt-4 p-4 bg-primary/5 rounded-lg">
                    <p className="font-medium">{pdfFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      PDF uploaded successfully. Extracting data...
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}