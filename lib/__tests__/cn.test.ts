import { cn } from '../cn';

describe('cn utility', () => {
  it('should merge class names correctly', () => {
    const result = cn('text-red-500', 'bg-blue-500');
    expect(result).toContain('text-red-500');
    expect(result).toContain('bg-blue-500');
  });

  it('should handle conditional classes', () => {
    const isActive = true;
    const result = cn('base-class', isActive && 'active-class');
    expect(result).toContain('base-class');
    expect(result).toContain('active-class');
  });

  it('should filter out falsy values', () => {
    const result = cn('class1', false, 'class2', null, 'class3', undefined);
    expect(result).toContain('class1');
    expect(result).toContain('class2');
    expect(result).toContain('class3');
    expect(result).not.toContain('false');
    expect(result).not.toContain('null');
  });
});
