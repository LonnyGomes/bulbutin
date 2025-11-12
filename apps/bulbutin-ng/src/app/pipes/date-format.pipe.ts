import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formats a date string to "7 October, 2025 15:30" format
 *
 * @example
 * {{ timestamp | dateFormat }}
 */
@Pipe({
  name: 'dateFormat',
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string | Date): string {
    const date = new Date(value);

    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'long' });
    const year = date.getFullYear();
    const time = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    return `${day} ${month}, ${year} ${time}`;
  }
}
