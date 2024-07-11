-- DropForeignKey
ALTER TABLE "MailingListsOnBlasts" DROP CONSTRAINT "MailingListsOnBlasts_blastId_fkey";

-- DropForeignKey
ALTER TABLE "MailingListsOnContacts" DROP CONSTRAINT "MailingListsOnContacts_contactId_fkey";

-- AddForeignKey
ALTER TABLE "MailingListsOnContacts" ADD CONSTRAINT "MailingListsOnContacts_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MailingListsOnBlasts" ADD CONSTRAINT "MailingListsOnBlasts_blastId_fkey" FOREIGN KEY ("blastId") REFERENCES "Blast"("id") ON DELETE CASCADE ON UPDATE CASCADE;
