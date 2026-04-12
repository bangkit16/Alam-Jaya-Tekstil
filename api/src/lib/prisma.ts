// Hanya muat .env jika bukan di production
if (process.env.NODE_ENV !== "production") {
  const dotenv = await import("dotenv");
  dotenv.config();
}

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const connectionString = `${process.env["DATABASE_URL"]}`;

console.log("connectionString", connectionString);

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };

// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export { prisma };
