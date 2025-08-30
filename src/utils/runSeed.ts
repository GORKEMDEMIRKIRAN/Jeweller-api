import { PrismaClient } from "@prisma/client";
import seed from '../seed.js';  
const prisma = new PrismaClient();



const run = async () => {
  seed()
    .then(() => {
      return prisma.$disconnect();
    })
    .catch((e) => {
      console.error(e);
      return prisma.$disconnect();
    });
};


export default  async function runSeed() {
  const userTypeCount = await prisma.user.count();
  if (userTypeCount === 0) {
    console.log("Database empty, seeding....");
    await run();
    console.log("Seeding completed.");
  } else {
    console.log('Seeding skipped, database already populated.');
  }
}
