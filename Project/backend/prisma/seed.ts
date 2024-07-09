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
                    clerkId: `clerkId${i + 1}`,
                    name: `User ${i + 1}`,
                    email: `user${i + 1}@example.com`,
                },
            })
        )
    );

    // Create contacts
    const contacts = await Promise.all(
        Array.from({ length: 50 }).map((_, i) =>
            prisma.contact.create({
                data: {
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
                    name: `MailingList ${i + 1}`,
                    emails: contacts.slice(i * 5, i * 5 + 5).map((c) => c.email),
                    author: { connect: { id: users[i % 10].id } },
                },
            })
        )
    );


    // Create blasts
    const blasts = await Promise.all(
        Array.from({ length: 10 }).map((_, i) =>
            prisma.blast.create({
                data: {
                    name: `Blast ${i + 1}`,
                    author: { connect: { id: users[i % 10].id } },
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
