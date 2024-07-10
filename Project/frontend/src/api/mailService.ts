const API_URL = 'http://localhost:3010';

import CreateContactForm from '../components/CreateContactForm.tsx'

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

export const getAllMailingLists = async (token: string | null) => {

    if (!token) {
        console.error('No token provided');
        return null;
    }

    try {
        const response = await fetch(`${API_URL}/list/all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to get mailing lists: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log('Fetched mailing lists:', result);
        return result;
    } catch (error) {
        console.error('Error fetching all mailing lists:', error);
        return null;
    }
};

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

export const editList = async (token: string, data: {
    id: string;
    name?: string;
    emails?: string[];
    authorId: string;
}) => {

    if (!token) {
        console.error('No token provided');
        return null;
    }

    try {

        const response = await fetch(`${API_URL}/mailing-list/update`, {
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

export const editContact = async (token: string | null, contactData: { name?: string, email?: string }) => {
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
            body: JSON.stringify(contactData)
        })

        const result = await response.json();
        console.log('Information of the contact updated:', result)
        return result

    } catch (error) {
        console.error(`Error editing contact's information:`, error);
        return null;
    }

}


