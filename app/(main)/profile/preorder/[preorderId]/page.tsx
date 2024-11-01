import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

import { PreorderStatus } from "@prisma/client";
import { ChevronLeft } from "lucide-react";

import { db } from "@/lib/db";
import { cn } from "@/lib/utils";

import ProofPage from "../../_components/proof-page";

/* eslint-disable @typescript-eslint/no-explicit-any */

type Props = {
  params: { preorderId: string };
};

const statusLabelMap = {
  [PreorderStatus.WAITING]: "Waiting until travel date",
  [PreorderStatus.TRAVELLING]: "Travelling",
  [PreorderStatus.ITEM_BOUGHT]: "Item bought",
  [PreorderStatus.LEGIT_CHECK]: "Legit checking",
  [PreorderStatus.DONE]: "Done",
};

const Page = async ({ params }: Props) => {
  const pre = await db.preOrder.findUnique({
    where: {
      id: params.preorderId,
    },
    include: {
      items: {
        include: {
          photos: true,
          Proof: true,
        },
      },
    },
  });

  if (!pre) {
    return notFound();
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="bg-slate-950 p-4 rounded-md flex gap-4">
        <Link
          href={`/profile`}
          className="hover:text-slate-100 mt-1.5 aspect-square text-slate-50 transition-colors rounded hover:bg-slate-700 h-fit"
        >
          <ChevronLeft />
        </Link>
        <div>
          <h1 className="text-slate-50 font-bold text-3xl mb-4">
            {pre?.title}
          </h1>
          <p className="text-slate-50">{pre?.location}</p>
        </div>
      </div>
      <div className="grid grid-cols-[1fr_4fr] gap-4 md:gap-6 p-4 max-w-5xl mx-auto">
        <aside className="space-y-2">
          <h1 className="font-bold text-xl w-max">Status preorder</h1>
          {Object.entries(statusLabelMap).map(([key, value]) => {
            return (
              <p
                key={key}
                className={cn(
                  key === pre?.status
                    ? "text-white bg-slate-950 p-1 px-2 rounded"
                    : ""
                )}
              >
                {value}
              </p>
            );
          })}
        </aside>
        <div>
          <ProofPage type="preorder" items={pre.items} />
        </div>
      </div>
    </div>
  );
};

export default Page;
