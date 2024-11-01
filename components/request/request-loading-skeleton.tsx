import React from "react";

import { Skeleton } from "../ui/skeleton";

const RequestLoadingSkeleton = () => {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 w-[80%] mt-6">
      <Skeleton className="h-[300px] animate-pulse" />
      <Skeleton className="h-[300px] animate-pulse" />
      <Skeleton className="h-[300px] animate-pulse" />
    </div>
  );
};

export default RequestLoadingSkeleton;
