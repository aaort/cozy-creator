import type { ComponentProps } from "react";

interface ImageCardProps extends ComponentProps<'div'> {
  src: string;
  alt: string;
  title?: string;
  description?: string;
  aspectRatio?: 'square' | '4:3' | '16:9' | '3:2' | 'auto';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  loading?: 'lazy' | 'eager';
  overlay?: boolean;
  href?: string;
  onImageClick?: () => void;
  footer?: React.ReactNode;
}

function ImageCard({
  src,
  alt,
  title,
  description,
  aspectRatio = '4:3',
  objectFit = 'cover',
  loading = 'lazy',
  overlay = false,
  href,
  onImageClick,
  footer,
  className,
  ...props
}: ImageCardProps) {
  const aspectRatioClasses = {
    square: 'aspect-square',
    '4:3': 'aspect-[4/3]',
    '16:9': 'aspect-video',
    '3:2': 'aspect-[3/2]',
    auto: ''
  };

  const objectFitClasses = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down'
  };

  const ImageContent = () => (
    <div className="relative overflow-hidden rounded-lg group">
      <div className={`${aspectRatioClasses[aspectRatio]} w-full overflow-hidden`}>
        <img
          src={src}
          alt={alt}
          loading={loading}
          className={`
            w-full h-full transition-transform duration-300 ease-in-out
            group-hover:scale-105 ${objectFitClasses[objectFit]}
          `}
        />

        {/* Overlay */}
        {overlay && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
        )}

        {/* Content overlay */}
        {(title || description) && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
            {title && (
              <h3 className="text-white font-semibold text-lg mb-1 line-clamp-2">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-white/90 text-sm line-clamp-2">
                {description}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const CardContent = () => (
    <div
      className={`
        bg-card text-card-foreground rounded-lg border border-border
        shadow-sm hover:shadow-md transition-shadow duration-300
        ${className || ''}
      `}
      {...props}
    >
      {href || onImageClick ? (
        <div
          className="cursor-pointer"
          onClick={onImageClick}
          role={onImageClick ? "button" : undefined}
          tabIndex={onImageClick ? 0 : undefined}
          onKeyDown={onImageClick ? (e) => e.key === 'Enter' && onImageClick() : undefined}
        >
          <ImageContent />
        </div>
      ) : (
        <ImageContent />
      )}

      {/* Card footer */}
      {footer && (
        <div className="p-4 border-t border-border">
          {footer}
        </div>
      )}

      {/* Card content (when not using overlay) */}
      {!overlay && (title || description) && (
        <div className="p-4">
          {title && (
            <h3 className="font-semibold text-lg mb-2 text-foreground line-clamp-2">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-muted-foreground text-sm line-clamp-3">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        className="block transition-transform hover:scale-[1.02] focus:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg"
      >
        <CardContent />
      </a>
    );
  }

  return <CardContent />;
}

export { ImageCard };
export type { ImageCardProps };
