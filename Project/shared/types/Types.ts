
export type User = {
    id: string;
    name: string;
    email: string;
}

export type MailingList = {
    id: string;
    name: string;
    emails: string[];
}

export type Lists = {
    id: string;
    name: string;
    lists: MailingList[];
}

export type Contact = {
    id: string;
    name: string;
    email: string;
}

export type Email = {
    id: string;
    from: string;
    to: string;
    subject: string;
    body: string;
    sentAt: Date;
    receivedAt: Date;
    deletedAt: Date;
}