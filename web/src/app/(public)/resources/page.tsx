// app/resources/page.tsx
export const dynamic = "force-dynamic";
export const fetchCache = "default-no-store";

export default function ResourcesPage() {
  return (
    <main className="min-w-0 overflow-x-hidden p-6 lg:px-8">
      <div className="mx-auto w-full max-w-[var(--content-max,110ch)]">
        <h1 className="text-3xl font-bold tracking-tight">
          Additional Resources
        </h1>

        <p className="mt-3 text-muted-foreground">
          Here you can find extra readings, reference sheets, formula summaries,
          videos, and practice materials that support the main lessons.
        </p>

        <section className="mt-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Reference Sheets</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              <li>
                <a
                  href="#"
                  className="underline hover:no-underline"
                >
                  Statics Formula Sheet (PDF)
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="underline hover:no-underline"
                >
                  Thermodynamics Key Equations
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Videos</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-muted-foreground">
              <li>
                <a
                  href="#"
                  className="underline hover:no-underline"
                >
                  Free-body diagrams walkthrough
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="underline hover:no-underline"
                >
                  Intro to the First Law of Thermodynamics
                </a>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}
