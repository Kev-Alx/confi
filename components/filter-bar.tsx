"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import { Category } from "@prisma/client";
import { ArrowLeftRight, ChevronRight, LayoutGridIcon } from "lucide-react";

import { capitalize } from "@/lib/utils";

import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "./ui/sidebar";

const FilterBar = () => {
  const searchParams = useSearchParams();
  const isRequest = searchParams.get("type") === "preorder" ? false : true;
  const q = searchParams.get("q");
  const initialCategories = searchParams.get("c")?.split(",") || [];
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(initialCategories);
  const router = useRouter();

  useEffect(() => {
    const query = new URLSearchParams(searchParams);
    if (selectedCategories.length) {
      query.set("c", selectedCategories.join(","));
    } else {
      query.delete("c");
    }

    if (q) {
      query.set("q", q);
    }
    router.replace(`/search?${query.toString()}`);
  }, [selectedCategories, searchParams, router, q]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };
  return (
    <Sidebar className="pt-20">
      <SidebarContent>
        <SidebarGroup>
          <p className="font-semibold mt-4 mb-2 flex justify-between items-center">
            Type <ArrowLeftRight className="h-4" />
          </p>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button asChild variant={isRequest ? "default" : "ghost"}>
                    <Link
                      className="flex justify-between transition-colors py-5"
                      href={"/search?type=request"}
                    >
                      Request <ChevronRight className="h-4" />
                    </Link>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Button asChild variant={isRequest ? "ghost" : "default"}>
                    <Link
                      className="flex justify-between transition-colors py-5"
                      href={"/search?type=preorder"}
                    >
                      Preorder <ChevronRight className="h-4" />
                    </Link>
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        {isRequest && (
          <SidebarGroup>
            <p className="font-semibold my-2 flex justify-between items-center">
              Categories <LayoutGridIcon className="h-4" />
            </p>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {Object.entries(Category).map(([key, value]) => (
                  <SidebarMenuItem key={value}>
                    <SidebarMenuButton asChild>
                      <div>
                        <Checkbox
                          id={key}
                          checked={selectedCategories.includes(key)}
                          onCheckedChange={() => handleCategoryChange(key)}
                        />
                        <Label
                          htmlFor={key}
                          className="cursor-pointer w-full p-1 -m-1"
                        >
                          {capitalize(key)}
                        </Label>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
};

export default FilterBar;
