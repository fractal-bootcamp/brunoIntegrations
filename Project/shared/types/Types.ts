export type User = {
    id: string;
    clerkId: string;
    name: string;
    email: string;

    mailingLists: MailingList[];  // Array of MailingLists associated with the User
    messages: Message[];          // Array of Messages associated with the User
    blasts: Blast[];              // Array of Blasts associated with the User
}

export type MailingList = {
    id: string;
    name: string;
    emails: string[];

    contacts: MailingListsOnContacts[];  // Array of MailingListsOnContacts (Junction Table)
    blasts: MailingListsOnBlasts[];      // Array of MailingListsOnBlasts (Junction Table)
    author: User;                        // The User who created this MailingList
}

export type Blast = {
    id: string;
    name: string;
    sentAt: Date;

    author: User;                        // The User who created the Blast
    messages: Message[];                 // Array of Messages in the Blast
    mailingLists: MailingListsOnBlasts[];// Array of MailingListsOnBlasts (Junction Table)
}

export type Contact = {
    id: string;
    name: string;
    email: string;

    mailingLists: MailingListsOnContacts[];  // Array of MailingListsOnContacts (Junction Table)
    messages: Message[];                     // Array of Messages received by the Contact
}

export type Message = {
    id: string;
    subject: string;
    body: string;
    sentAt: Date;
    receivedAt?: Date;
    deletedAt?: Date;

    author: User;                    // The User who sent the Message
    blast: Blast;                    // The Blast associated with the Message
    contact: Contact;                // The Contact who received the Message
}

export type MailingListsOnContacts = {
    contact: Contact;
    contactId: string;
    mailingList: MailingList;
    mailingListId: string;
}

export type MailingListsOnBlasts = {
    blast: Blast;
    blastId: string;
    mailingList: MailingList;
    mailingListId: string;
    sentAt: Date;
}
