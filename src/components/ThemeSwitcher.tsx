import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Monitor, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeSwitcherProps {
  className?: string;
}

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();

  const isOps = theme === 'ops';

  const toggleTheme = () => {
    setTheme(isOps ? 'biz' : 'ops');
  };

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={toggleTheme}
      className={cn(
        'gap-2 min-w-[140px] justify-center transition-all',
        className
      )}
    >
      {isOps ? (
        <>
          <Monitor className="w-4 h-4" />
          <span>Operations</span>
        </>
      ) : (
        <>
          <Building2 className="w-4 h-4" />
          <span>Business</span>
        </>
      )}
    </Button>
  );
}
