import { PrismaClient } from '@prisma/client';
import express from 'express';

import cors from 'cors';
import type { Application, Request, RequestHandler, Response } from 'express';

import dotenv from 'dotenv';
dotenv.config();


import { requireAuth } from '@clerk/clerk-sdk-node'
import { ClerkExpressWithAuth, type EmailAddress } from '@clerk/clerk-sdk-node'
// import cookieParser from 'cookie-parser';
import optionalUser from '../middleware';
import bodyParser from 'body-parser';
import { User, MailingList, Blast, Contact, Message, MailingListsOnContacts, MailingListsOnBlasts, MenuItemStyles } from '../../shared/types/Types'

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


const clerkPublishableKey = process.env.CLERK_PUBLISHABLE_KEY;


if (!clerkPublishableKey) {
    throw new Error("Clerk publishable key not set. Check your environment variables.");
}




app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});



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


app.delete('/list/:id', async (req, res) => {
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





app.post('/list/new-list', async (req, res: Response) => {
    const { name, emails, authorId, authorEmail } = req.body;

    try {
        if (!name || !emails || (!authorId && !authorEmail)) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const authorConnect = authorId
            ? { clerkId: authorId }
            : { email: authorEmail };

        // / First, check if the user exists in your database
        const user = await prisma.user.findUnique({
            where: { clerkId: authorId }
        });

        if (!user) {
            // If the user doesn't exist, you might want to create one
            // or return an error
            return res.status(404).json({ error: 'User not found in database' });
        }


        const newMailingList = await prisma.mailingList.create({
            data: {
                name,
                emails,
                author: { connect: authorConnect },
            },
        })
        res.status(201).json(newMailingList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating mailing list' });
    }

}

)

app.post('/list/update', async (req, res) => {
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


app.post('/contact/edit', async (req, res) => {

    const { name, email } = req.body;
    const contactId: string = req.body.id;

    try {
        const contactDetails = await prisma.contact.update({
            data:
            {
                name,
                email,
            },

            where: { id: contactId }
        })

        res.status(201).json(contactDetails)
    }

    catch (error) {
        console.error(error);
        res.status(500).json({ error: `Error in updating contact's information` });
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


//GET all contact DONE
//DELETE contact by Id DONE

//POST edit Blast DONE
//DELETE Blast DONE 

//DELETE MailingList (email in emails[])



//GET all contact
app.get('/contact/all', async (req, res) => {

    try {
        const contacts = await prisma.contact.findMany({
            select: {
                id: true,
                name: true,
                email: true,
            },
        });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ error: 'Error getting all lists' });
    }

})

//DELETE contact by Id
app.delete('/contact/:id', async (req, res) => {
    const { id } = req.params;
    try {

        await prisma.$transaction(async (prisma) => {
            // Get the contact to be deleted, including its related mailing lists
            const deleteContact = await prisma.contact.findUnique({
                where: { id },
                include: {
                    mailingLists: true,
                },
            });
            if (!deleteContact) {
                return res.status(404).json({ error: 'Contact not found' });
            }
            // Update the mailing lists to remove the contact's email
            for (const mailingListRelation of deleteContact.mailingLists) {
                const mailingList = await prisma.mailingList.findUnique({
                    where: { id: mailingListRelation.mailingListId },
                });
                if (mailingList) {
                    const updatedEmails = mailingList.emails.filter(email => email !== deleteContact.email);

                    await prisma.mailingList.update({
                        where: { id: mailingList.id },
                        data: {
                            emails: updatedEmails,
                        },
                    });
                }
            }
            // Delete the contact
            await prisma.contact.delete({
                where: { id },
            });
        });
        res.status(200).json({ message: 'Contact deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the contact' });
    }
})

//POST update blast
app.post('/blast/update', async (req, res) => {
    const { id, name, sentAt } = req.body;

    try {
        const blastFromData = await prisma.blast.update({
            where: { id: id },
            data: {
                name: name,
                sentAt: sentAt,
            },
        });
        res.status(201).json(blastFromData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error in updating blast' });
    }
});

//DELETE Blast
app.delete('/blast/:id', async (req, res) => {

    const { id } = req.body.id

    try {
        const deletedBlast = await prisma.blast.delete(
            {
                where: { id },
            }
        );
        res.json(deletedBlast)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting blast' });
    }
})

//DELETE emails from email list

app.delete('/list/emails/:mailingListId', async (req, res) => {
    const { mailingListId } = req.params;
    const { email } = req.body;

    try {
        // Find the current emails in the mailing list
        const mailingList = await prisma.mailingList.findUnique({
            where: { id: mailingListId },
            select: { emails: true },
        });

        if (!mailingList) {
            return res.status(404).json({ error: 'Mailing list not found' });
        }

        // Filter out the email to be deleted
        const updatedEmails = mailingList.emails.filter((e) => e !== email);

        // Update the mailing list with the new emails array
        const updatedMailingList = await prisma.mailingList.update({
            where: { id: mailingListId },
            data: { emails: updatedEmails },
        });

        res.status(200).json(updatedMailingList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting email from mailing list' });
    }
});
