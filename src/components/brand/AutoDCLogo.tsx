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
        {/* Stylized head silhouette pointing top-right (↗) - Vision, Autonomy, Forward Intelligence */}
        <svg 
          viewBox="0 0 32 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary-foreground"
          style={{ width: pixelSize * 0.625, height: pixelSize * 0.625 }}
        >
          {/* Head silhouette facing top-right */}
          <path 
            d="M8 24C8 24 8 20 10 18C12 16 14 15 14 12C14 9 12 7 14 5C16 3 19 3 21 5L25 9C27 11 27 14 25 16C23 18 21 18 21 21C21 24 23 26 21 28C19 30 16 29 14 27L10 23C9 22 8 24 8 24Z"
            fill="currentColor"
          />
          {/* Forward arrow indicator */}
          <path 
            d="M22 6L26 4L24 8L22 6Z"
            fill="currentColor"
          />
          {/* Eye/vision dot */}
          <circle 
            cx="17" 
            cy="10" 
            r="2" 
            className="fill-primary"
          />
        </svg>
      </div>
      {showText && (
        <div>
          <h1 className={cn(
            'font-bold text-foreground',
            size === 'sm' && 'text-base',
            size === 'md' && 'text-lg',
            size === 'lg' && 'text-xl',
            size === 'xl' && 'text-3xl'
          )}>
            AutoDC
          </h1>
          {size !== 'sm' && (
            <p className={cn(
              'text-muted-foreground',
              size === 'xl' ? 'text-sm' : 'text-xs'
            )}>
              {size === 'xl' ? 'Enterprise Autonomous Command System' : 'Autonomous Command'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
