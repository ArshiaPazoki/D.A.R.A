'use client';

import { create } from 'zustand';
import { Language } from '@/types';

interface LanguageStore {
  language: Language;
  setLanguage: (lang: 'en' | 'fa') => void;
}

export const useLanguage = create<LanguageStore>((set) => ({
  language: {
    code: 'en',
    dir: 'ltr',
  },
  setLanguage: (code) => {
    const dir = code === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = code;
    set({ language: { code, dir } });
  },
}));