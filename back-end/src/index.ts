import { PrismaClient } from "@prisma/client";
const cors = require('cors');
import express from "express";

const prisma = new PrismaClient();
const app = express();

var corsOption={
    origin:["http://localhost:5173"]
}

app.use(cors(corsOption));

app.use(express.json());

app.get(`/get`, async (req, res) => {
    const result = await prisma.list.findMany();
    res.json(result);
});

app.post(`/post`, async (req, res) => {
    const { title } = req.body;
    const result = await prisma.list.create({
        data: {
            title,
        },
    });
    res.json(result);
});

app.put("/finish/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const postData = await prisma.list.findUnique({
            where: { id: Number(id) },
            select: {
                status: true,
            },
        });

        const updatedPost = await prisma.list.update({
            where: { id: Number(id) || undefined },
            data: { status: !postData?.status  },
        });
        res.json(updatedPost);
    } catch (error) {
        res.json({ error: `Post with ID ${id} does not exist in the database` });
    }
});

app.put("/post/:id", async (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    try {
        const postData = await prisma.list.findUnique({
            where: { id: Number(id) },
            select: {
                title: true,
            },
        });

        const updatedPost = await prisma.list.update({
            where: { id: Number(id) || undefined },
            data: { title: title },
        });
        res.json(updatedPost);
    } catch (error) {
        res.json({ error: `Post with ID ${id} does not exist in the database` });
    }
});

app.delete(`/get/:id`, async (req, res) => {
    const { id } = req.params;
    const post = await prisma.list.delete({
        where: {
            id: Number(id),
        },
    });
    res.json(post);
});

const server = app.listen(3000, () => {
    console.log(`http://localhost:3000`);
});
