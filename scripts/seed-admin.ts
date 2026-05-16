/**
 * Run: npx tsx scripts/seed-admin.ts
 * Sets the first super_admin user. Edit EMAIL and PASSWORD below.
 */
import crypto from "crypto";
import { PrismaClient } from "@prisma/client";

const EMAIL = "natalie.hoang91@gmail.com";
const PASSWORD = "Admin@246";

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, key) => (err ? reject(err) : resolve(key)));
  });
  return `${salt}:${hash.toString("hex")}`;
}

async function main() {
  const user = await prisma.user.findFirst({ where: { email: EMAIL } });
  if (!user) {
    console.error(`No user found with email: ${EMAIL}`);
    process.exit(1);
  }

  const hashed = await hashPassword(PASSWORD);
  await prisma.user.update({
    where: { id: user.id },
    data: { role: "super_admin", adminPassword: hashed },
  });

  console.log(`✓ ${EMAIL} is now super_admin with admin password set.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
