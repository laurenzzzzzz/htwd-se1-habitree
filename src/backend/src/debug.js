import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const checkHabits = async () => {
  
  const TEST_USER_ID = 1; 
  
  const habits = await prisma.habit.findMany({
    where: { userId: TEST_USER_ID }, // NEU: Benutze die Integer ID
    include: { entries: true },
  });

  console.log('Habits:', JSON.stringify(habits, null, 2));
};

checkHabits()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());