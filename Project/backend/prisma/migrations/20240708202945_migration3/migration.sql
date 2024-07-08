/*
  Warnings:

  - You are about to drop the `Email` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Lists` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `authorId` to the `MailingList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clerkId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MailingList" ADD COLUMN     "authorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "clerkId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Email";

-- DropTable
DROP TABLE "Lists";

-- CreateTable
CREATE TABLE "Blast" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "Blast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,
    "blastId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BlastToMailingList" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ContactToMailingList" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_BlastToMailingList_AB_unique" ON "_BlastToMailingList"("A", "B");

-- CreateIndex
CREATE INDEX "_BlastToMailingList_B_index" ON "_BlastToMailingList"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ContactToMailingList_AB_unique" ON "_ContactToMailingList"("A", "B");

-- CreateIndex
CREATE INDEX "_ContactToMailingList_B_index" ON "_ContactToMailingList"("B");

-- AddForeignKey
ALTER TABLE "MailingList" ADD CONSTRAINT "MailingList_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blast" ADD CONSTRAINT "Blast_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_blastId_fkey" FOREIGN KEY ("blastId") REFERENCES "Blast"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlastToMailingList" ADD CONSTRAINT "_BlastToMailingList_A_fkey" FOREIGN KEY ("A") REFERENCES "Blast"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlastToMailingList" ADD CONSTRAINT "_BlastToMailingList_B_fkey" FOREIGN KEY ("B") REFERENCES "MailingList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContactToMailingList" ADD CONSTRAINT "_ContactToMailingList_A_fkey" FOREIGN KEY ("A") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContactToMailingList" ADD CONSTRAINT "_ContactToMailingList_B_fkey" FOREIGN KEY ("B") REFERENCES "MailingList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
