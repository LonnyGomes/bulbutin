import { DateFormatPipe } from './date-format.pipe';

describe('DateFormatPipe', () => {
  let pipe: DateFormatPipe;

  beforeEach(() => {
    pipe = new DateFormatPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should format date string correctly', () => {
    const dateString = '2025-10-07T15:30:00';
    const result = pipe.transform(dateString);
    expect(result).toBe('7 October, 2025 15:30');
  });

  it('should format Date object correctly', () => {
    const date = new Date('2025-10-07T15:30:00');
    const result = pipe.transform(date);
    expect(result).toBe('7 October, 2025 15:30');
  });

  it('should handle single digit day', () => {
    const dateString = '2025-10-07T15:30:00';
    const result = pipe.transform(dateString);
    expect(result).toContain('7 October');
  });

  it('should handle double digit day', () => {
    const dateString = '2025-10-15T15:30:00';
    const result = pipe.transform(dateString);
    expect(result).toContain('15 October');
  });
});
