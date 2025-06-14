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
          {/* <button
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors
                     focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
                     disabled:pointer-events-none disabled:opacity-50
                     hover:bg-accent hover:text-accent-foreground h-9 w-9"
            onClick={handleThemeToggle}
            aria-label="Toggle theme"
          >
            <svg
              className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
            >
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
            <svg
              className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button> */}
        </div>
      </div>
    </header>
  );
}

export { Header };
