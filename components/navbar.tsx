import Link from "next/link";
import React from "react";

import { auth } from "@/auth";
import { cn } from "@/lib/utils";

import UserButton from "./auth/user-button";
import ConfLogo from "./conf-logo";
import Search from "./search";
import { Button } from "./ui/button";
import { SidebarTrigger } from "./ui/sidebar";

type Props = {
  isSidebar?: boolean;
};

const Navbar = async ({ isSidebar = false }: Props) => {
  const session = await auth();
  return (
    <nav
      className={cn(
        "w-full sticky top-0 z-20 bg-slate-50 flex flex-col gap-3 px-4 py-4",
        isSidebar && "pl-12 md:pl-16"
      )}
    >
      <div className="w-full flex justify-between items-center gap-2 sm:gap-4">
        {isSidebar && (
          <SidebarTrigger className="absolute z-50 top-5 left-2 md:left-4" />
        )}
        <Link href={"/"}>
          <ConfLogo />
        </Link>
        <div className="relative lg:ml-36 w-full hidden sm:block">
          <Search />
        </div>
        <div className="flex gap-4 items-center md:border-l shrink-0 md:border-gray-300 pl-4">
          <Link
            href="/request/create"
            className="sm:text-sm text-xs hover:text-black hover:underline"
          >
            Make request
          </Link>
          <Link
            href="/preorder/create"
            className="sm:text-sm text-xs hover:text-black hover:underline"
          >
            Open preorder
          </Link>
          {session?.user ? (
            // @ts-expect-error gjls
            <UserButton user={session.user} />
          ) : (
            <Button asChild className="px-3 py-1">
              <Link href="/auth/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
      <div className="relative w-full sm:hidden">
        <Search />
      </div>
    </nav>
  );
};

export default Navbar;
