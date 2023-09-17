-- CreateTable
CREATE TABLE "Saving" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" INTEGER NOT NULL,
    "goalId" TEXT,
    CONSTRAINT "Saving_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Saving_goalId_key" ON "Saving"("goalId");
