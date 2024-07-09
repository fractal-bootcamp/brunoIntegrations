import { PrismaClient } from '@prisma/client';
import express from 'express';

import cors from 'cors';
import type { Application, Request, RequestHandler, Response } from 'express';
import dotenv from 'dotenv'
dotenv.config();

import "dotenv/config";

import { requireAuth } from '@clerk/clerk-sdk-node'
import { ClerkExpressWithAuth, type EmailAddress } from '@clerk/clerk-sdk-node'
// import cookieParser from 'cookie-parser';
import optionalUser from '../middleware';
import bodyParser from 'body-parser';

const prisma = new PrismaClient();
const app: Application = express();
const port = 3010;

// declare global {
//     namespace Express {
//         interface Request extends LooseAuthProp { }
//     }
// }

// const clerk = ClerkExpressWithAuth({
//     apiKey: process.env.CLERK_API_KEY,
// })

app.use(express.json());



// allow urlencoded data to be submitted using middleware
app.use(express.urlencoded({ extended: true }))

// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));

// clerk modifies the request by adding req.auth
// this takes the token and communicates with clerk to get user information
// which gets assigned to req.auth
app.use(ClerkExpressWithAuth())
//this is the clerk middleware we wrote for auth
app.use(optionalUser)
// const exampleMiddleware: RequestHandler = (req, res, next) => {
//     // modify request
//     req.user = {
//         id: "1"
//     }
//     console.log(req.user)
//     next()
// }
//on the /artfeed endpoint, create GET to pull in prisma art data


const CLERK_SECRET_KEY = 'sk_test_Z0n7KabEw4xNQGadmIjqXUxTIvYlGCjSoksOM9apAL'

const CLERK_PUBLISHABLE_KEY = 'pk_test_ZmFpdGhmdWwtbWFzdG9kb24tOTUuY2xlcmsuYWNjb3VudHMuZGV2JA'

const clerkPublishableKey = process.env.CLERK_PUBLISHABLE_KEY;


if (!clerkPublishableKey) {
    throw new Error("Clerk publishable key not set. Check your environment variables.");
}


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

//GET all blasts

app.get('/blast/all', async (req, res) => {

    try {
        const blasts = await prisma.blast.findMany({
            select: {
                id: true,
                name: true,
                sentAt: true,
                authorId: true,
            }
        });
        res.json(blasts)

    }
    catch (error) {
        res.status(500).json({ error: 'No blasts done yet!' })
    }
})

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
            select: {
                name: true,
                emails: true,
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

//here until monday


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

app.post('/list/new-contact', async (req, res) => {
    const { name, email, mailingListIds } = req.body;

    try {

        const newContact = await prisma.contact.create({
            data: {
                name,
                email
            }

        }
        );

        res.status(201).json(newContact)


    } catch (error) {
        console.error(error)
        res.status(500).json('Error creating a new contact')
    }

})

app.get('/contact/:email', async (req, res) => {

    const { email } = req.params;

    try {
        const userFetched = await prisma.contact.findUnique({

            where: {
                email: email
            },

            select: {
                id: true,
                name: true,
                email: true,
                mailingLists: true,
                messages: true
            }

        })


        if (!userFetched) {
            return res.status(404).json({ error: 'Contact not found' });
        }


        res.json(userFetched)
    } catch (error) {
        res.status(500).json({ error: 'Error finding that email' })
    }

})


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