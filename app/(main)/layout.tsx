import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import { EdgeStoreProvider } from "@/lib/edgestore";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <Navbar />
      <EdgeStoreProvider>
        {children}
        <Toaster />
      </EdgeStoreProvider>
    </main>
  );
}
