import Image from "next/image";
import Link from "next/link";
import React from "react";

import { Item, PreOrder } from "@prisma/client";
import { format } from "date-fns";
import { ArrowUpRight } from "lucide-react";

type Props = {
  pre: PreOrder & {
    items: Item & { _count: { PreorderJoins: number } }[];
  };
};

const MyPreorderCard = ({ pre }: Props) => {
  const joins = pre.items.reduce((a, b) => a + b._count.PreorderJoins, 0);
  return (
    <Link
      href={`/profile/preorder/${pre.id}`}
      className="flex gap-4 w-full flex-col md:flex-row bg-white border p-4 border-slate-200"
    >
      <div className="relative w-full aspect-video max-h-36 mx-auto">
        <Image
          src={pre.coverImage}
          fill
          alt="cover image"
          className="rounded-md self-start object-contain"
        />
      </div>

      <div className="flex flex-col w-full justify-between">
        <div>
          <h1 className="font-medium text-lg">{pre.title}</h1>
          <div className="flex justify-between">
            <p className="text-muted-foreground text-sm">{pre.location}</p>
            <p>Closes at {format(pre.closeDate, "dd MMMM yyyy")}</p>
          </div>
        </div>
        <div className="space-y-3">
          <p className="flex gap-2 items-center">
            Open {pre.items.length} items <ArrowUpRight />
          </p>
          <div className="flex gap-6 bg-slate-100 w-fit rounded-full px-6 py-1.5 items-center">
            <p>
              Join <span className="ml-6">{joins}</span>
            </p>
            <p>
              Requests <span className="ml-6">0</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MyPreorderCard;
