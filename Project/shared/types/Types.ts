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

    blasts: Blast[];              // Array of Blasts using this MailingList
    contacts: Contact[];          // Array of Contacts in this MailingList
    author: User;                 // The User who created this MailingList
}

export type Blast = {
    id: string;
    name: string;

    messages: Message[];          // Array of Messages in the Blast
    author: User;                 // The User who created the Blast
    targetLists: MailingList[];   // Array of MailingLists targeted by the Blast
}

export type Contact = {
    id: string;
    name: string;
    email: string;

    mailingLists: MailingList[];  // Array of MailingLists the Contact is part of
    messages: Message[];          // Array of Messages received by the Contact
}

export type Message = {
    id: string;
    recipient: string;
    subject: string;
    body: string;
    sentAt: Date;
    receivedAt: Date;
    deletedAt: Date;

    author: User;                 // The User who sent the Message
    blast: Blast;                 // The Blast associated with the Message
    contact: Contact;             // The Contact who received the Message
}