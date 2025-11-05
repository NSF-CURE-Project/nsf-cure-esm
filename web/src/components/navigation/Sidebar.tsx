import { getClassesTree } from "@/lib/strapiSdk/root";
import SidebarClient from "@/components/navigation/SidebarClient";
import type { ClassItem } from "@/lib/strapiSdk/types";

// Fetch all classes for the left nav (adjust if your fetcher differs)
export default async function Sidebar() {
  const classes: ClassItem[] = await getClassesTree();
  return <SidebarClient classes={classes as unknown as ClassItem[]} />;
}
