import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.habit.createMany({
    data: [
      { name: '1L Wasser trinken' },
      { name: 'Täglich meditieren' },
      { name: '30 Minuten Sport' },
    ],
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
