'use client';

import { useLanguage } from './use-language';
import { translations } from '@/lib/translations';

export function useTranslation() {
  const { language } = useLanguage();
  
  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = translations[language.code];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }
    
    return value;
  };
  
  return { t, language };
}