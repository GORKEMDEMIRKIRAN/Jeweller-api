import { PrismaClient } from "@prisma/client";
import seed from '../seed.js';  

const prisma = new PrismaClient();

const run = async () => {
  try{
    const userCount=await prisma.user.count();
    if(userCount===0){
      console.log("Database is empty,seeding...");
      await seed();
      console.log("Sending completed.");
    }else{
      console.log('Seeding skipped,database already populated.');
    }
  }catch (error) {
    console.error("Error seeding database:", error);
  }finally{
    await prisma.$disconnect();
  }
};

run();

// if(require.main===module){
//   run();
// }
//ESM'de dosya doğrudan çalıştırıldığında
// if(import.meta.url===process.argv[1] || import.meta.url===`file://${process.argv[1]}` ){
//   run();
// }

