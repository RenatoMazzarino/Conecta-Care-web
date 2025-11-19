import type { Professional } from '@/lib/types';

export type ClientProfessional = Omit<Professional, 'compatibilityTags'> & {
  compatibilityTags?: { text: string; variant?: 'default' | 'positive' | 'warning' }[];
};
