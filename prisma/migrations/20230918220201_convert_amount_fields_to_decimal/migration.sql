/*
  Warnings:

  - You are about to alter the column `amount` on the `Saving` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal`.
  - You are about to alter the column `price` on the `Goal` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal`.
  - You are about to alter the column `saved` on the `Goal` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Saving" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" DECIMAL NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "event" TEXT
);
INSERT INTO "new_Saving" ("amount", "date", "event", "id") SELECT "amount", "date", "event", "id" FROM "Saving";
DROP TABLE "Saving";
ALTER TABLE "new_Saving" RENAME TO "Saving";
CREATE TABLE "new_Goal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "price" DECIMAL NOT NULL,
    "saved" DECIMAL NOT NULL DEFAULT 0
);
INSERT INTO "new_Goal" ("id", "name", "price", "saved") SELECT "id", "name", "price", "saved" FROM "Goal";
DROP TABLE "Goal";
ALTER TABLE "new_Goal" RENAME TO "Goal";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
