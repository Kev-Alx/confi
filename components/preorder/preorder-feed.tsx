"use client";

import { useSearchParams } from "next/navigation";
import React from "react";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import kyInstance from "@/lib/ky";

import InfiniteScrollContainer from "../infinite-scroll-container";
import RequestLoadingSkeleton from "../request/request-loading-skeleton";
import PreOrderCard from "./preorder-card";

/* eslint-disable @typescript-eslint/no-explicit-any */

const PreorderFeed = () => {
  const searchParams = useSearchParams();

  const queryName = searchParams.get("q");
  const queryLocation = searchParams.get("l");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["preorders", queryName],
    queryFn: ({ pageParam }) => {
      const params: Record<string, string> = {};
      if (pageParam) params.cursor = pageParam;
      if (queryName) params.q = queryName;
      if (queryLocation) params.l = queryLocation;
      return kyInstance.get("/api/preorder", { searchParams: params }).json();
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage: any) => lastPage.nextCursor,
    gcTime: 0,
  });

  const preorder = data?.pages.flatMap((page: any) => page.requests) || [];

  if (status === "pending") {
    return <RequestLoadingSkeleton />;
  }
  if (status === "success" && !preorder.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        There are no open preorders at the moment.
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        {queryName || queryLocation
          ? "No preorders found matching your filters."
          : "There are no open preorders at the moment."}
      </p>
    );
  }
  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
        {preorder.map((req, i) => (
          <PreOrderCard key={i} preorder={req} count={req._count.items} />
        ))}
      </div>

      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
};

export default PreorderFeed;
