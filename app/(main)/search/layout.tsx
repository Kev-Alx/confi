import FilterBar from "@/components/filter-bar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto relative px-4 py-6 flex">
      <SidebarProvider>
        <FilterBar />
        <SidebarInset className="w-full">{children}</SidebarInset>
      </SidebarProvider>
    </main>
  );
}
