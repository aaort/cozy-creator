import { cn } from "@/lib/utils";
import { Logo } from "@components/ui/logo";
import { ModeToggle } from "@components/ui/mode-toggle";
import { HEADER_HEIGHT } from "@constants/layout";
import type { ComponentProps } from "react";
import { Link, useLocation } from "react-router-dom";

interface HeaderProps extends ComponentProps<"header"> {}

function Header({ className, ...props }: HeaderProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };
  return (
    <header
      style={{ height: HEADER_HEIGHT }}
      className={cn(
        "absolute px-4 sm:px-6 lg:px-8 top-0 z-50 w-full bg-red-200/20 backdrop-blur-xl border-b-[0.1px] border-b-primary-200",
        className,
      )}
      {...props}
    >
      <div className="flex h-14 items-center relative z-10">
        {/* Logo */}
        <div className="mr-4 hidden md:flex">
          <Logo />
        </div>

        {/* Mobile Logo */}
        <div className="mr-4 flex md:hidden">
          <Logo size="sm" variant="icon-only" />
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1 text-sm lg:gap-2">
          <Link
            to="/"
            className={`px-3 py-2 rounded-md transition-all duration-200 hover:text-foreground hover:bg-accent/50 font-medium ${
              isActive("/")
                ? "text-foreground bg-accent/30"
                : "text-foreground/70"
            }`}
          >
            Live Feed
          </Link>
          <Link
            to="/videos"
            className={`px-3 py-2 rounded-md transition-all duration-200 hover:text-foreground hover:bg-accent/50 font-medium ${
              isActive("/videos")
                ? "text-foreground bg-accent/30"
                : "text-foreground/70"
            }`}
          >
            Videos
          </Link>
        </nav>

        {/* Spacer */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search or other components can go here */}
          </div>

          <div className="flex items-center space-x-2">
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

export { Header };
