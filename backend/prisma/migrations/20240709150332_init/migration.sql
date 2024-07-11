/*
  Warnings:

  - You are about to drop the column `recipient` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the `_BlastToMailingList` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ContactToMailingList` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BlastToMailingList" DROP CONSTRAINT "_BlastToMailingList_A_fkey";

-- DropForeignKey
ALTER TABLE "_BlastToMailingList" DROP CONSTRAINT "_BlastToMailingList_B_fkey";

-- DropForeignKey
ALTER TABLE "_ContactToMailingList" DROP CONSTRAINT "_ContactToMailingList_A_fkey";

-- DropForeignKey
ALTER TABLE "_ContactToMailingList" DROP CONSTRAINT "_ContactToMailingList_B_fkey";

-- AlterTable
ALTER TABLE "Blast" ADD COLUMN     "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "recipient",
ALTER COLUMN "receivedAt" DROP NOT NULL,
ALTER COLUMN "deletedAt" DROP NOT NULL;

-- DropTable
DROP TABLE "_BlastToMailingList";

-- DropTable
DROP TABLE "_ContactToMailingList";

-- CreateTable
CREATE TABLE "MailingListsOnContacts" (
    "contactId" TEXT NOT NULL,
    "mailingListId" TEXT NOT NULL,

    CONSTRAINT "MailingListsOnContacts_pkey" PRIMARY KEY ("contactId","mailingListId")
);

-- CreateTable
CREATE TABLE "MailingListsOnBlasts" (
    "blastId" TEXT NOT NULL,
    "mailingListId" TEXT NOT NULL,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MailingListsOnBlasts_pkey" PRIMARY KEY ("blastId","mailingListId")
);

-- AddForeignKey
ALTER TABLE "MailingListsOnContacts" ADD CONSTRAINT "MailingListsOnContacts_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MailingListsOnContacts" ADD CONSTRAINT "MailingListsOnContacts_mailingListId_fkey" FOREIGN KEY ("mailingListId") REFERENCES "MailingList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MailingListsOnBlasts" ADD CONSTRAINT "MailingListsOnBlasts_blastId_fkey" FOREIGN KEY ("blastId") REFERENCES "Blast"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MailingListsOnBlasts" ADD CONSTRAINT "MailingListsOnBlasts_mailingListId_fkey" FOREIGN KEY ("mailingListId") REFERENCES "MailingList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
