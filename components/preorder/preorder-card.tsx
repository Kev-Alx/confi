import Image from "next/image";
import Link from "next/link";
import React from "react";

import { PreOrder } from "@prisma/client";
import { format } from "date-fns";

type Props = {
  preorder: PreOrder;
  count: number;
};

const PreOrderCard = ({ preorder, count }: Props) => {
  return (
    <Link
      href={`/preorder/${preorder.id}`}
      className="hover:bg-slate-50 cursor-pointer p-2 w-fit"
    >
      <Image
        alt="hi"
        src={preorder.coverImage}
        width={300}
        height={200}
        className="rounded-md max-h-64 object-cover"
      />
      <div>
        <div className="flex justify-between items-center">
          <p className="text-xs text-muted-foreground mt-4">
            from <span className="text-sm">{preorder.location}</span>
          </p>
          {preorder.isRequestable && (
            <p className="text-xs text-gray-800 mt-4 px-2 py-1 rounded-full bg-slate-100">
              Requestable
            </p>
          )}
        </div>
        <p className="font-medium text-lg mt-2 text-black">{preorder.title}</p>
        <p className="font-medium text-black">Open {"" + count} item</p>
        <p className="text-muted-foreground mt-4">
          Closes at {format(new Date(preorder.closeDate), "dd MMMM yyyy")}
        </p>
      </div>
    </Link>
  );
};

export default PreOrderCard;
