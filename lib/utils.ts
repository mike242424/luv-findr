import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateWithLeadingZeros(value: number) {
  return value < 10 ? `0${value}` : value;
}
