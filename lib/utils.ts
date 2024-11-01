import { Request as RequestType } from "@prisma/client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(input: string): string {
  return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
}

export function addDotsToNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function addIsJastiper(requests: RequestType[], userId: string) {
  return requests.map((request) => ({
    ...request,
    isJastiper: request.jastiperId === userId,
  }));
}
