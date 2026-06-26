const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.companyInsight.deleteMany();
  await prisma.company.deleteMany();
  console.log('Cleared company cache');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
