"use client";

import { useSearchParams } from "next/navigation";

import PreorderFeed from "@/components/preorder/preorder-feed";
import RequestFeed from "@/components/request/request-feed";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Page() {
  const searchParams = useSearchParams();
  const isRequest = searchParams.get("type") === "preorder" ? false : true;
  return (
    <>
      <div>
        <div className="flex gap-2">
          <SidebarTrigger />
          <h1 className="font-semibold text-2xl">
            {isRequest ? "Requests" : "Preorders"}
          </h1>
        </div>
        <div className="pl-7">
          {isRequest ? <RequestFeed /> : <PreorderFeed />}
        </div>
      </div>
    </>
  );
}
