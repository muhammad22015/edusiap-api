import { PrismaClient } from '@prisma/client';
const Prisma = new PrismaClient();

Prisma.$connect()
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log("Error : ", err));
  
export { Prisma };