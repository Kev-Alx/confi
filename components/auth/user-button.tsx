"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { User } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowUpRight, Check, LogOut, User2 } from "lucide-react";

import { logOut } from "@/actions/login";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { capitalize, cn } from "@/lib/utils";

import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

type Props = {
  user: User | null;
};

const UserButton = ({ user }: Props) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  if (!user) return <UserButtonSkeleton />;
  return (
    <DropdownMenu onOpenChange={setOpen} open={open}>
      <DropdownMenuTrigger asChild>
        <div className="h-8 grid place-items-center cursor-pointer w-8 rounded-full overflow-hidden bg-slate-950 text-white">
          <Image
            src={user.image || ""}
            width={32}
            height={32}
            alt="user logo"
            className={cn("hidden", user.image && "block")}
          />
          <span className={cn("block", user.image && "hidden")}>
            {user.name?.charAt(0)}
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <div className="flex flex-col space-y-4 p-2">
          <p className="text-xs font-medium leading-none text-muted-foreground">
            {user.email}
          </p>
          <div className="flex items-center gap-x-2">
            <div className="rounded-md bg-secondary p-1">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.image || ""} />
                <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-1">
              <p className="text-sm line-clamp-1">{user.name}</p>
              <p className="text-xs text-muted-foreground line-clamp-1 gap-2 flex items-center">
                {capitalize(user.role)}
                {user.role === "JASTIPER" && (
                  <Check className="text-emerald-600 h-4 w-4" />
                )}
              </p>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button
            asChild
            variant={"ghost"}
            onClick={() => setOpen(false)}
            className="w-full flex justify-start items-center"
          >
            <Link href={"/profile"}>
              <User2 /> Profile
            </Link>
          </Button>
        </DropdownMenuItem>
        {user.role === "USER" && (
          <DropdownMenuItem>
            <Button
              asChild
              variant={"ghost"}
              onClick={() => setOpen(false)}
              className="w-full flex justify-start items-center"
            >
              <Link href={"/jastiper/register"}>
                <ArrowUpRight /> Become a Jastiper
              </Link>
            </Button>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          asChild
          className="w-full  cursor-pointer text-red-600 "
        >
          <form action={logOut}>
            <Button
              variant={"ghost"}
              className="w-full flex items-center justify-start hover:text-red-700"
              type="submit"
              onClick={() => queryClient.clear()}
            >
              <LogOut /> Sign out
            </Button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const UserButtonSkeleton = () => {
  return <Skeleton className="h-8 w-8 rounded-full animate-pulse" />;
};

export default UserButton;
