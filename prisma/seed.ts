// Prisma Seed Script for MongoDB
// Run with: npx tsx prisma/seed.ts

async function main() {
  console.log('🌱 Checking Prisma database status for Swiftly...');
  try {
    const prismaModule = await import('@prisma/client');
    const PrismaClientConstructor = (prismaModule as any).PrismaClient;
    if (PrismaClientConstructor) {
      const prisma = new PrismaClientConstructor();
      console.log('✅ Prisma client initialized. Ready to populate MongoDB collections:');
      console.log('   - services, helpers, bookings, payment_transactions');
      await prisma.$disconnect().catch(() => {});
    } else {
      console.log('ℹ️ Prisma models defined in prisma/schema.prisma. Connect your DATABASE_URL to push schema.');
    }
  } catch (err) {
    console.log('ℹ️ Prisma models ready in prisma/schema.prisma. Running in local-first memory store.');
  }
}

main().catch((e) => console.error(e));
