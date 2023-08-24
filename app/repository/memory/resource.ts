import { InMemoryClient } from './client';

export function getResources(client: InMemoryClient, limit: number) {
  if (limit > client.length) return client;

  return client.slice(0, limit);
}
