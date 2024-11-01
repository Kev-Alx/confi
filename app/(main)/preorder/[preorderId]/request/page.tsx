import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

import { ChevronRight } from "lucide-react";

import RequestForm from "@/components/request/request-form";
import { db } from "@/lib/db";

type Props = {
  params: { preorderId: string };
};

const Page = async ({ params }: Props) => {
  const pre = await db.preOrder.findUnique({
    where: {
      id: params.preorderId,
    },
    select: {
      title: true,
      location: true,
    },
  });
  if (!pre) return notFound();
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex font-medium items-center gap-2 mb-8">
        <Link href={"/search?type=preorder"}>Preorder</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href={`/preorder/${params.preorderId}`}>{pre?.title}</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-muted-foreground">Request</span>
      </div>
      <RequestForm preorderId={params.preorderId} />
    </div>
  );
};

export default Page;
