// SERVER component (no "use client")
import React from "react";
import { cookies } from "next/headers";

import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";          // ⬅️ Provider + inset

import AppSidebar from "@/components/admin-panel/sidebar";
import Toc from "@/components/navigation/Toc";
import Footer from "@/components/Footer";
import { getClassesTree } from "@/lib/strapiSdk/root";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // restore open/closed state if you want
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  const classes = await getClassesTree();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-dvh bg-background text-foreground flex">
        {/* LEFT: Salimi sidebar with your dynamic items */}
        <AppSidebar classes={classes} />

        {/* RIGHT: main + TOC lives in SidebarInset so it shifts when collapsed */}
        <SidebarInset className="flex-1">
          <div
            id="layout"
            className="
              min-h-dvh
              grid grid-cols-1
              lg:grid-cols-[minmax(0,1.5fr)_minmax(0,var(--toc-w,14rem))]
              lg:gap-[var(--toc-gap,1.25rem)]
            "
            style={{ gridTemplateRows: "1fr auto" }}
          >
            <main className="min-w-0 overflow-x-hidden p-6 lg:px-8 lg:row-start-1">
              <div
                id="content"
                className="mx-auto w-full max-w-[var(--content-max,100ch)] transition-[max-width] duration-300"
              >
                {children}
              </div>
            </main>

            <div className="hidden lg:block lg:row-start-1 relative">
              <Toc />
            </div>

            <footer className="border-t bg-background/80 backdrop-blur py-8 px-6 text-center text-sm text-muted-foreground col-span-full lg:row-start-2">
              <Footer />
            </footer>
          </div>
        </SidebarInset>

      </div>
    </SidebarProvider>
  );
}
