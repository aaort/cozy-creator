import type { ComponentProps } from "react";

interface LogoProps extends ComponentProps<"div"> {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "icon-only" | "text-only";
  href?: string;
}

function Logo({
  size = "md",
  variant = "default",
  href = "/",
  className,
  ...props
}: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
    xl: "h-12 w-12",
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  const LogoIcon = () => (
    <img
      className={`${sizeClasses[size]} text-primary`}
      src="https://cozy.art/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fcozycreator.d003a573.png&w=3840&q=75"
    />
  );

  const LogoText = () => (
    <span className={`${textSizeClasses[size]} font-bold text-foreground`}>
      Cozy Creator
    </span>
  );

  const LogoContent = () => {
    switch (variant) {
      case "icon-only":
        return <LogoIcon />;
      case "text-only":
        return <LogoText />;
      default:
        return (
          <div className="flex items-center gap-2">
            <LogoIcon />
            <LogoText />
          </div>
        );
    }
  };

  const logoElement = (
    <div className={`flex items-center ${className || ""}`} {...props}>
      <LogoContent />
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        className="flex items-center transition-opacity hover:opacity-80"
        aria-label="Cozy Creator Home"
      >
        {logoElement}
      </a>
    );
  }

  return logoElement;
}

export { Logo };
export type { LogoProps };
