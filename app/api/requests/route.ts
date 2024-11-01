/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";

import { auth } from "@/auth";
import { ITEMS_PER_PAGE } from "@/lib/config";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const cursor = searchParams.get("cursor") || undefined;
    const query = searchParams.get("q")?.toLowerCase();
    const location = searchParams.get("l");
    const category = searchParams.get("c");
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
            item: {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
          {
            item: {
              description: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
        ],
      });
    }

    if (category) {
      const categories = category.split(",").map((cat) => cat.trim());

      whereClause.AND.push({
        OR: categories.map((cat) => ({
          item: {
            category: {
              equals: cat,
            },
          },
        })),
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
    const requests = await db.request.findMany({
      where: {
        ...whereClause,
        status: "WAITING",
      },
      include: {
        item: {
          include: {
            photos: true,
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
