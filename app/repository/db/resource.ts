import { PrismaClient } from '@prisma/client';

export async function getResources(client: PrismaClient, limit: number) {
  return client.resource.findMany({ take: limit });
}

export async function addResource(client: PrismaClient, text: string) {
  return client.resource.create({
    data: {
      text,
    },
  });
}
