import { NextRequest } from "next/server";

import { auth } from "@/auth";
import { ITEMS_PER_PAGE } from "@/lib/config";
import { db } from "@/lib/db";

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const cursor = searchParams.get("cursor") || undefined;
    const query = searchParams.get("q")?.toLowerCase();
    const location = searchParams.get("l");
    const pageSize = ITEMS_PER_PAGE;

    const session = await auth();
    const user = session?.user;

    if (!user) {
      return { error: "Unauthorized" };
    }
    const whereClause: any = {
      AND: [] as any[],
    };

    if (query) {
      whereClause.AND.push({
        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      });
    }
    if (location) {
      whereClause.AND.push({
        location: {
          equals: location,
        },
      });
    }
    if (whereClause.AND.length === 0) {
      delete whereClause.AND;
    }
    const requests = await db.preOrder.findMany({
      where: whereClause,
      include: {
        _count: {
          select: {
            items: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor =
      requests.length > pageSize ? requests[pageSize].id : null;

    const data = {
      requests: requests.slice(0, pageSize),
      nextCursor,
    };

    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: error });
  }
}
