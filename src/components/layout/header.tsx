import { Logo } from "@/components/ui/logo";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { HEADER_HEIGHT } from "@/constants/layout";
import type { ComponentProps } from "react";

interface HeaderProps extends ComponentProps<"header"> {}

function Header({ className, ...props }: HeaderProps) {
  return (
    <header
      style={{ height: HEADER_HEIGHT }}
      className={`
        sticky top-0 z-50 w-full border-b border-border/40
        bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60
        ${className || ""}
      `.trim()}
      {...props}
    >
      <div className="flex h-14 items-center">
        {/* Logo */}
        <div className="mr-4 hidden md:flex">
          <Logo />
        </div>

        {/* Mobile Logo */}
        <div className="mr-4 flex md:hidden">
          <Logo size="sm" variant="icon-only" />
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-4 text-sm lg:gap-6">
          <a
            href="/"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Home
          </a>
          <a
            href="/about"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            About
          </a>
          <a
            href="/projects"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Projects
          </a>
          <a
            href="/contact"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Contact
          </a>
        </nav>

        {/* Spacer */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search or other components can go here */}
          </div>

          <ModeToggle />
          {/* Theme Toggle */}
        </div>
      </div>
    </header>
  );
}

export { Header };
