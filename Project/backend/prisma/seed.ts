import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Delete existing data if tables exist
    try {
        await prisma.message.deleteMany();
        await prisma.blast.deleteMany();
        await prisma.contact.deleteMany();
        await prisma.mailingList.deleteMany();
        await prisma.user.deleteMany();
    } catch (error) {
        console.error('Error deleting existing data: ', error);
    }

    // Create users
    const users = await Promise.all(
        Array.from({ length: 10 }).map((_, i) =>
            prisma.user.create({
                data: {
                    id: `user${i + 1}-id`,
                    clerkId: `clerkId${i + 1}`,
                    name: `User ${i + 1}`,
                    email: `user${i + 1}@example.com`,
                },
            })
        )
    );

    // Create contacts
    const contacts = await Promise.all(
        Array.from({ length: 10 }).map((_, i) =>
            prisma.contact.create({
                data: {
                    id: `contact${i + 1}-id`,
                    name: `Contact ${i + 1}`,
                    email: `contact${i + 1}@example.com`,
                },
            })
        )
    );

    // Create mailing lists
    const mailingLists = await Promise.all(
        Array.from({ length: 10 }).map((_, i) =>
            prisma.mailingList.create({
                data: {
                    id: `ml${i + 1}-id`,
                    name: `MailingList ${i + 1}`,
                    emails: contacts.slice(i, i + 1).map((c) => c.email),
                    author: { connect: { id: users[i % 10].id } },
                    contacts: {
                        connect: contacts.slice(i, i + 1).map((c) => ({ id: c.id })),
                    },
                },
            })
        )
    );

    // Create blasts
    const blasts = await Promise.all(
        Array.from({ length: 10 }).map((_, i) =>
            prisma.blast.create({
                data: {
                    id: `blast${i + 1}-id`,
                    name: `Blast ${i + 1}`,
                    author: { connect: { id: users[i % 10].id } },
                    targetLists: { connect: [{ id: mailingLists[i % 10].id }] },
                    messages: {
                        create: contacts.slice(i, i + 1).map((contact, j) => ({
                            id: `message${i * 10 + j + 1}-id`,
                            recipient: contact.email,
                            subject: `Hello ${contact.name}`,
                            body: `This is a message for ${contact.name}`,
                            sentAt: new Date(),
                            receivedAt: new Date(),
                            deletedAt: new Date(),
                            author: { connect: { id: users[i % 10].id } },
                            contact: { connect: { id: contact.id } },
                        })),
                    },
                },
            })
        )
    );

    console.log({ users, contacts, mailingLists, blasts });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
