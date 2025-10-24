"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";

export default function Navbar() {
  const { theme, systemTheme } = useTheme();
  const effectiveTheme = theme === "system" ? systemTheme : theme;

  const cppLogo =
    effectiveTheme === "dark"
      ? "/assets/logos/cpp_yellow.png"
      : "/assets/logos/cpp_yellow.png";

  const nsfLogo =
  effectiveTheme === "dark"
    ? "/assets/logos/nsf.png"
    : "/assets/logos/nsf.png";

  return (
    <nav
      aria-label="Primary"
      className="
        sticky top-0 z-50
        flex items-center justify-between
        h-16 px-4 sm:px-6 border-b
        bg-background/80 backdrop-blur
        supports-[backdrop-filter]:bg-background/60
      "
    >
      {/* Left cluster: logos + wordmark */}
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <Link href="/" aria-label="Home" className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded">
          <Image
            src={cppLogo}
            alt="Cal Poly Pomona Logo"
            width={56}
            height={56}
            className="h-12 w-auto sm:h-14"
            priority
          />
        </Link>

        <Image
          src={nsfLogo}
          alt="NSF Logo"
          width={150}
          height={80}
          className="h-12 w-auto sm:h-14"
        />

        <span className="truncate font-semibold text-lg sm:text-2xl text-foreground">
          NSF CURE ESM
        </span>
      </div>

      {/* Right cluster: controls (theme toggle, etc.) */}
      <div className="flex items-center gap-3">
        {/* <ThemeToggle /> etc. */}
      </div>
    </nav>
  );
}
