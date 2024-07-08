const API_URL = 'http://localhost:3010';

import { User, MailingList, Blast, Contact, Message } from '../../../shared/types/Types';


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
