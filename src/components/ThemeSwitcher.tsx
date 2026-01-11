import { useTheme } from '@/context/ThemeContext';
import { Monitor, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeSwitcherProps {
  className?: string;
}

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={cn(
        'relative flex items-center bg-secondary/60 backdrop-blur border border-border rounded-lg p-1 w-fit',
        className
      )}
    >
      {/* Sliding active pill */}
      <div
        className={cn(
          'absolute top-1 bottom-1 w-[50%] rounded-md bg-primary transition-all duration-300 ease-out',
          theme === 'ops' ? 'left-1' : 'left-[calc(50%+2px)]'
        )}
      />

      {/* OPS */}
      <button
        onClick={() => setTheme('ops')}
        className={cn(
          'relative z-10 flex items-center gap-2 px-4 py-1.5 text-sm font-medium transition-colors w-[110px] justify-center',
          theme === 'ops'
            ? 'text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <Monitor className="w-4 h-4" />
        OPS
      </button>

      {/* BIZ */}
      <button
        onClick={() => setTheme('biz')}
        className={cn(
          'relative z-10 flex items-center gap-2 px-4 py-1.5 text-sm font-medium transition-colors w-[110px] justify-center',
          theme === 'biz'
            ? 'text-primary-foreground'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <Building2 className="w-4 h-4" />
        BIZ
      </button>
    </div>
  );
}
