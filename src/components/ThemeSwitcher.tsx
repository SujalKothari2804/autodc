import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Monitor, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeSwitcherProps {
  variant?: 'button' | 'toggle' | 'dropdown';
  className?: string;
}

export function ThemeSwitcher({ variant = 'toggle', className }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();

  if (variant === 'button') {
    return (
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setTheme(theme === 'ops' ? 'biz' : 'ops')}
        className={cn('gap-2', className)}
      >
        {theme === 'ops' ? (
          <>
            <Monitor className="w-4 h-4" />
            <span>OPS</span>
          </>
        ) : (
          <>
            <Building2 className="w-4 h-4" />
            <span>BIZ</span>
          </>
        )}
      </Button>
    );
  }

  return (
    <div className={cn('flex items-center gap-1 p-1 rounded-lg bg-secondary', className)}>
      <button
        onClick={() => setTheme('ops')}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
          theme === 'ops' 
            ? 'bg-primary text-primary-foreground' 
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <Monitor className="w-4 h-4" />
        <span>OPS</span>
      </button>
      <button
        onClick={() => setTheme('biz')}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
          theme === 'biz' 
            ? 'bg-primary text-primary-foreground' 
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <Building2 className="w-4 h-4" />
        <span>BIZ</span>
      </button>
    </div>
  );
}
