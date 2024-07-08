import { PrismaClient } from '@prisma/client';
import express from 'express';

import cors from 'cors';
import type { Application, Request, RequestHandler, Response } from 'express';
import "dotenv/config";

const prisma = new PrismaClient();
const app = express();
const port = 3010;

app.use(express.json());

app.get('/users', async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});

app.post('/users', async (req, res) => {
    const { name, email } = req.body;
    const user = await prisma.user.create({
        data: { name, email },
    });
    res.json(user);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
