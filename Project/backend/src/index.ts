import { PrismaClient } from '@prisma/client';
import express from 'express';

import cors from 'cors';
import type { Application, Request, RequestHandler, Response } from 'express';
import "dotenv/config";

import { requireAuth } from '@clerk/clerk-sdk-node'
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node'

const prisma = new PrismaClient();
const app = express();
const port = 3010;

// const clerk = ClerkExpressWithAuth({
//     apiKey: process.env.CLERK_API_KEY,
// })

app.use(express.json());


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

//GET blast by id
app.get('/blast/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const blast = await prisma.blast.findUnique({
            where: { id },
            include: {
                author: true,
                messages: {
                    include: {
                        author: true,
                        contact: true,
                    },
                },
                targetLists: {
                    include: {
                        contacts: true,
                        author: true,
                        blasts: true,
                    },
                },
            },
        });
        res.json(blast);
    } catch (error) {
        res.status(500).json({ error: 'Blast not found' });
    }
});


//GET all Mailinglists
app.get('/list/all', async (req, res) => {

    try {
        const lists = await prisma.mailingList.findMany({
            include: {
                author: true,
                contacts: true,
                blasts: true,
            },
        });
        res.json(lists);
    } catch (error) {
        res.status(500).json({ error: 'Error getting all lists' });
    }
})

// POST create a new blast
app.post('/blast', async (req, res) => {
    const { name, authorId, targetListIds, messages } = req.body;

    try {
        const newBlast = await prisma.blast.create({
            data: {
                name,
                author: { connect: { id: authorId } },
                targetLists: { connect: targetListIds.map((id: string) => ({ id })) },
                messages: {
                    create: messages.map((msg: any) => ({
                        recipient: msg.recipient,
                        subject: msg.subject,
                        body: msg.body,
                        sentAt: new Date(),
                        receivedAt: new Date(),
                        deletedAt: new Date(),
                        author: { connect: { id: msg.authorId } },
                        contact: { connect: { id: msg.contactId } },
                    }))
                }
            }
        });

        res.status(201).json(newBlast);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating blast' });
    }
});

app.delete('/mailingList/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedMailingList = await prisma.mailingList.delete(
            {
                where: { id },
            }
        );
        res.json(deletedMailingList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting mailing list' });
    }
}


);

app.post('/mailingList/new', async (req, res) => {
    const { name, emails, authorId, contactIds } = req.body;

    try {

        const newMailingList = await prisma.mailingList.create({
            data: {
                name,
                emails,
                author: { connect: { id: authorId } },
                contacts: { connect: contactIds.map((id: string) => ({ id })) },
            },
        })
        res.status(201).json(newMailingList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating mailing list' });
    }

}

)

app.post('/mailingList/update', async (req, res) => {
    //we first destructure the mailing list in order to upload info
    //we need name and email

    const { name, emails, authorId } = req.body;
    const mailingListId: string = req.body.id
    try {
        const newContactInMailingList = await prisma.mailingList.update({
            data: {
                name,
                emails,
                author: { connect: { id: authorId } },
            },
            where: { id: mailingListId } // Replace `mailingListId` with the actual ID of the mailing list you want to update
        })
        res.status(201).json(newContactInMailingList);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error in updating contact in mailing list' });
    }
})