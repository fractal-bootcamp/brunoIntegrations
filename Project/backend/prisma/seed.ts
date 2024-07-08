import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

async function main() {
    // Generate 20 users
    const users = await Promise.all(
        Array.from({ length: 20 }).map(() =>
            prisma.user.create({
                data: {
                    name: faker.name.fullName(),
                    email: faker.internet.email(),
                },
            })
        )
    )

    // Generate 20 contacts
    const contacts = await Promise.all(
        Array.from({ length: 20 }).map(() =>
            prisma.contact.create({
                data: {
                    name: faker.name.fullName(),
                    email: faker.internet.email(),
                },
            })
        )
    )

    // Generate 3 mailing lists
    const mailingLists = await Promise.all(
        Array.from({ length: 3 }).map(() =>
            prisma.mailingList.create({
                data: {
                    name: faker.company.name(),
                    emails: Array.from({ length: 10 }).map(() => faker.internet.email()),
                },
            })
        )
    )

    // Generate a list containing the 3 mailing lists
    const list = await prisma.lists.create({
        data: {
            name: 'Master List',
            lists: mailingLists.map(list => ({
                id: list.id,
                name: list.name,
                emails: list.emails,
            })),
        },
    })

    // Generate equivalent emails
    const emails = await Promise.all(
        Array.from({ length: 20 }).map(() =>
            prisma.email.create({
                data: {
                    from: faker.internet.email(),
                    to: faker.internet.email(),
                    subject: faker.lorem.sentence(),
                    body: faker.lorem.paragraphs(),
                    sentAt: faker.date.past(),
                    receivedAt: faker.date.past(),
                    deletedAt: faker.date.future(),
                },
            })
        )
    )

    console.log({ users, contacts, mailingLists, list, emails })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
