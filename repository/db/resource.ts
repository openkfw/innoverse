import { PrismaClient } from "@prisma/client";

export async function getResources(client: PrismaClient, limit: number) {
  return await client.resource.findMany({ take: limit });
}
