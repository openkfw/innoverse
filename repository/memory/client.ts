interface ResourceInMemory {
  id: string;
  text: string;
  createdAt: Date;
}

export type InMemoryClient = ResourceInMemory[];

const resources: InMemoryClient = [
  { id: "1", text: "Resource 1", createdAt: new Date() },
  { id: "2", text: "Resource 2", createdAt: new Date() },
  { id: "3", text: "Resource 3", createdAt: new Date() },
  { id: "4", text: "Resource 4", createdAt: new Date() },
  { id: "5", text: "Resource 5", createdAt: new Date() },
  { id: "6", text: "Resource 6", createdAt: new Date() },
  { id: "7", text: "Resource 7", createdAt: new Date() },
];

export default resources;

export function getResources(limit: number) {
  if (limit > resources.length) return resources;

  return resources.slice(0, limit);
}
