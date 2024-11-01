import SummaryBar from "@/components/summary-bar";
import { db } from "@/lib/db";

type LayoutProps = {
  children: React.ReactNode;
  params: {
    itemId: string;
  };
};

export default async function Layout({ children, params }: LayoutProps) {
  const item = await db.item.findUnique({
    where: {
      id: params.itemId,
    },
  });
  return (
    <main className="w-full h-[calc(100vh-72px)] grid md:grid-cols-[2fr_1fr]">
      {children}
      {item && <SummaryBar item={item} />}
    </main>
  );
}
