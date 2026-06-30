'use client';

import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/use-language';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setLanguage(language.code === 'en' ? 'fa' : 'en')}
      className="relative"
    >
      <Languages className="h-5 w-5" />
      <span className="absolute -bottom-0.5 -right-0.5 text-[10px] font-bold">
        {language.code === 'en' ? 'FA' : 'EN'}
      </span>
    </Button>
  );
}