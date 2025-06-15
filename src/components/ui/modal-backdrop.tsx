import { cn } from "@/lib/utils";
import React from "react";

export interface ModalBackdropProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  blur?: "sm" | "md" | "lg" | "xl";
  opacity?: "light" | "medium" | "dark";
  disableClickOutside?: boolean;
}

export const ModalBackdrop: React.FC<ModalBackdropProps> = ({
  isOpen,
  onClose,
  children,
  className = "",
  contentClassName = "",
  blur = "xl",
  opacity = "medium",
  disableClickOutside = false,
}) => {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disableClickOutside || !onClose) return;

    // Only close if clicked on the backdrop itself, not its children
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const blurClasses = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
    xl: "backdrop-blur-xl",
  };

  const opacityClasses = {
    light: "bg-background/60",
    medium: "bg-background/80",
    dark: "bg-background/90",
  };

  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        blurClasses[blur],
        opacityClasses[opacity],
        "transition-all duration-300 ease-out",
        className
      )}
      onClick={handleBackdropClick}
    >
      <div
        className={cn(
          "relative max-w-full max-h-full",
          "transition-all duration-300 ease-out",
          contentClassName
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

// Export variants for common use cases
export const GlassModalBackdrop: React.FC<Omit<ModalBackdropProps, "blur" | "opacity">> = (props) => (
  <ModalBackdrop {...props} blur="xl" opacity="medium" />
);

export const LightModalBackdrop: React.FC<Omit<ModalBackdropProps, "blur" | "opacity">> = (props) => (
  <ModalBackdrop {...props} blur="lg" opacity="light" />
);

export const DarkModalBackdrop: React.FC<Omit<ModalBackdropProps, "blur" | "opacity">> = (props) => (
  <ModalBackdrop {...props} blur="xl" opacity="dark" />
);
