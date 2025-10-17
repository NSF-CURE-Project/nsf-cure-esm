import Sidebar from "@/app/components/root/Sidebar";
import Toc from "@/app/components/root/Toc";

export default function RootLayout({children}: {children: React.ReactNode} ) {
    return (
        <div className="min-h-dvh grid grid-cols-1 lg:grid-cols-[18rem_1fr_16rem]">
            {/* left sidebar */}
            <aside className="hidden lg:block border-r p-4 overflow-y-auto">
                <Sidebar />
            </aside>

            {/* main content */}
            <main className="p-6 overflow-x-hidden">{children}</main>

            {/* right toc */}
            <aside className="hidden xl:block border-l p-4 overflow-y-auto">
                <Toc />
            </aside>
        </div>
    )
}