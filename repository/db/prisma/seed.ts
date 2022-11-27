import { addResource } from "../resource";
import prisma from "./prisma";

const client = prisma;

async function seed() {
  console.log(`Start seeding ...`);

  for (let i = 0; i < 10; i++) {
    await addResource(client, `Resource ${i + 1}`);
  }

  console.log(`Seeding finished.`);
}

seed()
  .catch((e) => {
    console.log("Seeding failed ... !");
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await client.$disconnect();
  });
