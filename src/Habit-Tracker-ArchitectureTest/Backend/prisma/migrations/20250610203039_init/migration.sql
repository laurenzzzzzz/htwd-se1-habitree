-- CreateTable
CREATE TABLE "Habit" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "Habit_pkey" PRIMARY KEY ("id")
);

-- Insert initial test data
INSERT INTO "Habit" ("name") VALUES ('Trinken 2L Wasser');