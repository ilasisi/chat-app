import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (name?: string): string | undefined => {
  return name
    ?.split(' ')
    ?.map((part) => part[0]?.toUpperCase())
    ?.join('');
};
