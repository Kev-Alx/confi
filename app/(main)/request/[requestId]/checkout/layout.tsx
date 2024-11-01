import { db } from "@/lib/db";

import SummaryBar from "../../../../../components/summary-bar";

type LayoutProps = {
  children: React.ReactNode;
  params: {
    requestId: string;
  };
};

export default async function Layout({ children, params }: LayoutProps) {
  const request = await db.request.findUnique({
    where: {
      id: params.requestId,
    },
    include: {
      item: true,
    },
  });
  return (
    <main className="w-full h-[calc(100vh-72px)] grid md:grid-cols-[2fr_1fr]">
      {children}
      {request && <SummaryBar item={request.item} />}
    </main>
  );
}
