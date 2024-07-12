const API_URL = 'http://localhost:3010';

import CreateContactForm from '../components/CreateContactForm.tsx'
import { MailingList } from "../../../shared/types/Types.ts"; // Adjust the import path as needed
// Get recently sent email blasts
export const getAllBlasts = async (token: string | null) => {

    if (!token) {
        console.error('No token provided');
        return null;
    }

    try {
        const response = await fetch(`${API_URL}/blast/all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to get blasts: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log('Fetched blasts:', result);
        return result;
    } catch (error) {
        console.error('Error fetching blasts:', error);
        return null;
    }
};

export const getBlastById = async (token: string | null, id: string) => {

    if (!token) {
        console.error('No token provided');
        return null;
    }

    try {
        const response = await fetch(`${API_URL}/blast/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to get blast by ID: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log('Fetched blast by ID:', result);
        return result;
    } catch (error) {
        console.error('Error fetching blast by ID:', error);
        return null;
    }
};

export const getAllMailingLists = async (token: string): Promise<MailingList[]> => {
    const response = await fetch("/api/mailingLists", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error("Failed to fetch mailing lists");
    }
    const data: MailingList[] = await response.json();
    return data;
};

export const createNewList = async (token: string | null, listData: { name: string; emails: string[], authorId: string }) => {

    if (!token) {
        console.error('No token provided');
        return null;
    }

    try {
        const response = await fetch(`${API_URL}/list/new-list`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(listData)
        })

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to create a new contact: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log('Created new mailing list:', result);
        return result;

    } catch (error) {
        console.error('Error creating a new mailing list:', error);
        return null;
    }
}

export const createNewContact = async (token: string | null, contactData: { name: string; email: string }) => {

    if (!token) {
        console.error('No token provided');
        return null;
    }

    try {
        const response = await fetch(`${API_URL}/list/new-contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(contactData)
        })

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to create a new contact: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log('Created new contact:', result);
        return result;

    } catch (error) {
        console.error('Error creating a new contact:', error);
        return null;
    }
}

export const editList = async (token: string | null, data: {
    id: string;
    name?: string;
    emails?: string[];
    authorId?: string;
}) => {

    if (!token) {
        console.error('No token provided');
        return null;
    }

    try {

        const response = await fetch(`${API_URL}/list/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data)
        })

        const result = await response.json();
        console.log('List updated:', result);
        return result

    } catch (error) {
        console.error('Error editing the list:', error);
        return null;
    }

}



export const editContact = async (
    token: string | null,
    listId: string,
    email: string,
    newEmail: string
) => {
    if (!token) {
        console.error('No token provided');
        return null;
    }

    try {
        const response = await fetch(`${API_URL}/contact/edit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ listId, email, newEmail }), // Send the list ID as well
        });

        if (!response.ok) {
            throw new Error('Failed to edit contact');
        }

        const result = await response.json();
        console.log('Information of the contact updated:', result);
        return result;

    } catch (error) {
        console.error(`Error editing contact's information:`, error);
        return null;
    }
};

//DELETE contact for ListEditor (only the email)

export const deleteContact = async (token: string | null, email: string) => {
    if (!token) {
        console.error('No token provided');
        return null;
    }

    try {
        const response = await fetch(`${API_URL}/contact`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(email)
        });

        const result = await response.json();

        return result;

    } catch (error) {
        console.error('Error deleting contact:', error);
        return null;
    }
};

//DELETE mailing list
export const deleteMailingList = async (token: string | null, listData: { id?: string, name?: string, emails?: string[] }) => {
    if (!token) {
        console.error('No token provided');
        return null;
    }

    try {
        const response = await fetch(`${API_URL}/list`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(listData)
        });

        const result = await response.json();
        return result;

    } catch (error) {
        console.error('Error deleting mailing list:', error);
        return null;
    }
};


//DELETE mailing list emails one by one (emails[])
export const deleteMailFromMailingList = async (token: string | null, listId: string, email: string) => {
    if (!token) {
        console.error('No token provided');
        return null;
    }

    try {
        const response = await fetch(`${API_URL}/list/emails/${listId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ email })
        });
        const result = await response.json();
        return result;

    } catch (error) {
        console.error('Error deleting email from mailing list:', error);
        return null;
    }
};


//GET contact by email

export const getContactByEmail = async (token: string | null, email: string) => {
    if (!token) {
        console.error('No token provided');
        return null;
    }

    try {
        const response = await fetch(`${API_URL}/contact/${email}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to get contact info: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log('Fetched contact info:', result);
        return result;
    } catch (error) {
        console.error('Error fetching contact info:', error);
        return null;
    }
};


//DELETE blast all

//GET blast by sentAt