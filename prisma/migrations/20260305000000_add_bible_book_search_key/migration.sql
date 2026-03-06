-- CreateTable
CREATE TABLE "BibleBookSearchKey" (
    "id" TEXT NOT NULL,
    "bookId" TEXT NOT NULL,
    "lang" TEXT NOT NULL,
    "key" TEXT NOT NULL,

    CONSTRAINT "BibleBookSearchKey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BibleBookSearchKey_lang_key_idx" ON "BibleBookSearchKey"("lang", "key");

-- CreateIndex
CREATE UNIQUE INDEX "BibleBookSearchKey_bookId_lang_key_key" ON "BibleBookSearchKey"("bookId", "lang", "key");

-- AddForeignKey
ALTER TABLE "BibleBookSearchKey" ADD CONSTRAINT "BibleBookSearchKey_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "BibleBook"("id") ON DELETE CASCADE ON UPDATE CASCADE;
