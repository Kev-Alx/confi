"use client";

import { useSearchParams } from "next/navigation";
import React from "react";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import kyInstance from "@/lib/ky";

import InfiniteScrollContainer from "../infinite-scroll-container";
import RequestCard from "./request-card";
import RequestLoadingSkeleton from "./request-loading-skeleton";

/* eslint-disable @typescript-eslint/no-explicit-any */

const RequestFeed = () => {
  const searchParams = useSearchParams();

  const queryName = searchParams.get("q");
  const categoryName = searchParams.get("c");
  const queryLocation = searchParams.get("l");
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["requests", queryName, categoryName],
    queryFn: ({ pageParam }) => {
      const params: Record<string, string> = {};
      if (pageParam) params.cursor = pageParam;
      if (queryName) params.q = queryName;
      if (categoryName) params.c = categoryName;
      if (queryLocation) params.l = queryLocation;
      return kyInstance.get("/api/requests", { searchParams: params }).json();
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage: any) => lastPage.nextCursor,
    gcTime: 0,
  });

  const requests = data?.pages.flatMap((page: any) => page.requests) || [];

  if (status === "pending") {
    return <RequestLoadingSkeleton />;
  }
  if (status === "success" && !requests.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground pt-8">
        {queryName || categoryName || queryLocation
          ? "No requests found matching your filters."
          : "There are no open requests at the moment."}
      </p>
    );
  }

  if (status === "error") {
    return (
      <p className="text-center text-destructive pt-8">
        An error occurred while loading requests.
      </p>
    );
  }
  return (
    <InfiniteScrollContainer
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
        {requests.map((req, i) => (
          <RequestCard
            key={i}
            item={req.item}
            reqId={`request/${req.id}`}
            location={req.location}
            className="w-fit"
          />
        ))}
      </div>

      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollContainer>
  );
};

export default RequestFeed;
