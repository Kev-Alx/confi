"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useRef } from "react";

import { SearchIcon } from "lucide-react";

import { Input } from "./ui/input";

const Search = () => {
  const params = useSearchParams();
  const router = useRouter();
  const ref = useRef<HTMLInputElement | null>(null);
  const type = params.get("type") || "request";
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/search/?type=${type}&q=${ref.current?.value.trim()}`);
        ref.current!.value = "";
      }}
    >
      <SearchIcon
        onClick={() => router.push("/search")}
        className="absolute cursor-pointer w-5 h-5 left-3 top-1/2 transform -translate-y-1/2 text-gray-500 z-10"
      />
      <Input
        ref={ref}
        type="text"
        placeholder="Search"
        className="pl-10 focus-visible:ring-1  pr-3 py-2"
      />
    </form>
  );
};

export default Search;
