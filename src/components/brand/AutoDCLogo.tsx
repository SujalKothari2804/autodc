import { cn } from '@/lib/utils';

interface AutoDCLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
}

const sizeMap = {
  sm: 24,
  md: 32,
  lg: 48,
  xl: 96,
};

export function AutoDCLogo({ size = 'md', className, showText = false }: AutoDCLogoProps) {
  const pixelSize = sizeMap[size];

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        className="flex items-center justify-center rounded-lg bg-primary"
        style={{ width: pixelSize, height: pixelSize }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary-foreground"
          style={{ width: pixelSize * 0.65, height: pixelSize * 0.65 }}
        >
          <path
            d="M21 16V14L13 9V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9L2 14V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {showText && (
        <div>
          <h1
            className={cn(
              'font-bold text-foreground',
              size === 'sm' && 'text-base',
              size === 'md' && 'text-lg',
              size === 'lg' && 'text-xl',
              size === 'xl' && 'text-3xl'
            )}
          >
            AutoDC
          </h1>
          {size !== 'sm' && (
            <p
              className={cn(
                'text-muted-foreground',
                size === 'xl' ? 'text-sm' : 'text-xs'
              )}
            >
              {size === 'xl'
                ? 'Enterprise Autonomous Command System'
                : 'Autonomous Command'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
