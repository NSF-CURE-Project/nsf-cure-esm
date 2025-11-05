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
    flex items-center
    h-16 px-4 sm:px-6 border-b
    bg-background/80 backdrop-blur
    supports-[backdrop-filter]:bg-background/60
  "
>
  {/* Left: logos + links together */}
  <div className="flex items-center gap-6">
    <Link href="/" aria-label="Home" className="flex items-center gap-2">
      <Image src={cppLogo} alt="Cal Poly Pomona Logo" width={56} height={56} className="h-12 w-auto sm:h-14" priority />
    </Link>

    <Image src={nsfLogo} alt="NSF Logo" width={150} height={80} className="h-12 w-auto sm:h-14" />
    <span className="font-semibold text-lg sm:text-2xl text-foreground">
      NSF CURE ESM
    </span>

    {/* 🧭 Links — right next to wordmark */}
    <div className="flex items-center gap-5 ml-8 text-lg">
      <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
        Home
      </Link>
      <Link href="/contacts" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
        Contact Us
      </Link>
    </div>
  </div>

  {/* Optional: right-side cluster (theme toggle, etc.) */}
  <div className="ml-auto flex items-center gap-3">
    {/* <ThemeToggle /> */}
  </div>
</nav>

  );
}
