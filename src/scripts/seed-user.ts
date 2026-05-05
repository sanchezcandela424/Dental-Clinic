
/**
 * Seed script — creates an initial MASTER user.
 *
 * Run with:
 *   npx tsx src/scripts/seed-user.ts
 *
 * Safe to run multiple times: uses upsert so it won't duplicate records.
 */

import { prisma } from "../lib/prisma";
import { hashPassword } from "../lib/password";

async function main() {
    console.log("🌱 Seeding initial users...");

    // ── MASTER user ────────────────────────────────────────────────────────────
    const masterHash = await hashPassword("password123");

    const master = await prisma.user.upsert({
        where: { email: "admin@citydent.com" },
        update: {},
        create: {
            email: "admin@citydent.com",
            passwordHash: masterHash,
            role: "MASTER",
            isActive: true,
        },
    });

    // ── STAFF user ─────────────────────────────────────────────────────────────
    const staffHash = await hashPassword("staff123");

    const staff = await prisma.user.upsert({
        where: { email: "staff@citydent.com" },
        update: {},
        create: {
            email: "staff@citydent.com",
            passwordHash: staffHash,
            role: "STAFF",
            isActive: true,
        },
    });
}

main()
    .catch((err) => {
        console.error("Seed failed:", err);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());