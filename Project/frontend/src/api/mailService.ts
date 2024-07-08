const API_URL = 'http://localhost:3010';

import { PrismaClient } from '@prisma/client';
import { User, MailingList, Lists, Contact, Email } from '../../../shared/types/Types'

const prisma = new PrismaClient();

// Get recently sent email blasts
export const getEmails = async (token: string | null) => {

    if (!token) {

    }

    try { }

    catch (error) {

    }
};