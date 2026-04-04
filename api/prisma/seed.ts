import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Role } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("123", 10);

  const users = [
    {
      name: "Super Admin",
      email: "superadmin@gmail.com",
      role: Role.SUPERADMIN,
    },
    { name: "Bagian Potong", email: "potong@gmail.com", role: Role.POTONG },
    {
      name: "Bagian Penjahit",
      email: "penjahit@gmail.com",
      role: Role.PENJAHIT,
    },
    { name: "Bagian Resi", email: "resi@gmail.com", role: Role.RESI },
    { name: "Bagian Print", email: "print@gmail.com", role: Role.PRINT },
  ];

  console.log("Memulai seeding data user...");

  for (const u of users) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        name: u.name,
        email: u.email,
        password: passwordHash,
        role: u.role,
      },
    });
    console.log(`User created/found: ${user.email} with role ${user.role}`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
    console.log("Seeding selesai.");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
