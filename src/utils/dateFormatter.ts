import { format, isToday, isYesterday } from 'date-fns';

export function formatMessageTime(date: Date): string {
  return format(date, 'h:mm a');
}

export function formatDateSeparator(date: Date, previousDate?: Date): string | null {
  if (previousDate && isSameDay(date, previousDate)) {
    return null;
  }

  if (isToday(date)) {
    return 'Today';
  }

  if (isYesterday(date)) {
    return 'Yesterday';
  }

  return format(date, 'd MMM yyyy');
}

export function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}
