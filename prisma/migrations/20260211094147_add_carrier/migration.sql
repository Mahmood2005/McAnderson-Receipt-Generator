-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Receipt" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "receiptNumber" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "customerName" TEXT NOT NULL,
    "amountWords" TEXT NOT NULL,
    "amountNumeric" REAL NOT NULL,
    "trackingNumber" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "carrier" TEXT NOT NULL DEFAULT 'UPS',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Receipt" ("amountNumeric", "amountWords", "createdAt", "customerName", "date", "id", "purpose", "receiptNumber", "trackingNumber") SELECT "amountNumeric", "amountWords", "createdAt", "customerName", "date", "id", "purpose", "receiptNumber", "trackingNumber" FROM "Receipt";
DROP TABLE "Receipt";
ALTER TABLE "new_Receipt" RENAME TO "Receipt";
CREATE UNIQUE INDEX "Receipt_receiptNumber_key" ON "Receipt"("receiptNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
