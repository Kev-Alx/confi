import Link from "next/link";
import React, { Suspense } from "react";

import { format } from "date-fns";
import { ArrowUpRight, ChevronRight } from "lucide-react";

import RequestCard from "@/components/request/request-card";
import { Separator } from "@/components/ui/separator";
import { db } from "@/lib/db";

type Props = {
  params: { preorderId: string };
};
const Page = async ({ params }: Props) => {
  const preorder = await db.preOrder.findUnique({
    where: {
      id: params.preorderId,
    },
    include: {
      jastiper: {
        select: {
          name: true,
        },
      },
      items: {
        include: {
          photos: true,
        },
      },
    },
  });

  if (!preorder) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">Preorder not found</div>
    );
  }
  console.log(preorder);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex font-medium items-center gap-2 mb-8">
        <Link href={"/search?type=preorder"}>Preorder</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-muted-foreground">{preorder.title}</span>
      </div>
      <div className="max-w-5xl mx-auto">
        <div className="bg-slate-950 w-full py-6 px-4 rounded-lg flex flex-col sm:gap-6 sm:flex-row justify-between ">
          <div>
            <h1 className="font-semibold text-3xl text-slate-50">
              {preorder.title}
            </h1>
            <p className="text-slate-50 sm:mt-4 mt-2 mb-4 sm:mb-6">
              Closes at {format(new Date(preorder.closeDate), "dd MMMM yyyy")}
            </p>
            <p className="text-sm text-gray-300">
              Opened by {preorder.jastiper.name}
            </p>
          </div>
          {preorder.isRequestable && (
            <>
              <Separator className="mt-6 mb-2 bg-muted-foreground sm:hidden" />
              <div className="text-slate-50  shrink-0 sm:self-end">
                <p>Didn&apos;t find the items you hoped for?</p>
                <p className="text-sm text-gray-300 flex gap-1">
                  This preorder is requestable.
                  <Link
                    href={`/preorder/${preorder.id}/request`}
                    className="flex hover:underline items-center text-slate-50"
                  >
                    Request here <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="m max-w-4xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 place-items-center py-6 gap-4">
        <Suspense fallback={null}>
          {preorder.items.map((item) => (
            <RequestCard
              item={item}
              key={item.id}
              className="w-fit"
              reqId={`/preorder/${preorder.id}/${item.id}`}
            />
          ))}
        </Suspense>
      </div>
    </div>
  );
};

export default Page;
