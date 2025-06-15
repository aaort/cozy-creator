import { cn } from "@/lib/utils";
import { Button } from "@components/ui/button";
import { Logo } from "@components/ui/logo";
import { ModeToggle } from "@components/ui/mode-toggle";
import { HEADER_HEIGHT } from "@constants/layout";
import { Github, LogIn } from "lucide-react";
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

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-md text-foreground/70 hover:text-foreground hover:bg-accent/50 transition-all duration-200"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-md text-foreground/70 hover:text-foreground hover:bg-accent/50 transition-all duration-200"
                aria-label="Discord"
              >
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0002 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9554 2.4189-2.1568 2.4189Z" />
                </svg>
              </a>
              <ModeToggle />
            </div>

            <Button variant="outline" size="sm" className="gap-2">
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

export { Header };
