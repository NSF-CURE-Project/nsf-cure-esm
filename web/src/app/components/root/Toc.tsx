"use client";

import { useEffect, useState } from "react";

type TocItem = { id: string; text: string; level: number };

export default function Toc() {
  const [items, setItems] = useState<TocItem[]>([]);

  useEffect(() => {
    // Grab all h2 and h3 elements from the main content area
    const headings = Array.from(document.querySelectorAll("main h2, main h3")) as HTMLHeadingElement[];

    const tocItems = headings.map((h) => {
      // If the heading doesn't have an id, create one
      const id = h.id || h.textContent?.toLowerCase().replace(/\s+/g, "-") || "";
      h.id = id; // make sure the id exists for <a href="#id">
      return {
        id,
        text: h.textContent || "",
        level: h.tagName === "H2" ? 2 : 3,
      };
    });

    setItems(tocItems);
  }, []);

  return (
    <nav className="text-sm">
      <p className="font-semibold mb-2">On this page</p>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id} className={item.level === 3 ? "ml-3" : ""}>
            <a
              href={`#${item.id}`}
              className="hover:underline text-gray-600 dark:text-gray-300"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
