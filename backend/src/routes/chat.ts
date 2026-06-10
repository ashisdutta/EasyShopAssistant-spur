import { error } from 'node:console';
import { prisma } from '../../lib/prisma.js'
import { Router, Request, Response } from 'express'
import { generateReply } from '../services/llm.js';

const router = Router();

const MAX_MESSAGE_LENGTH = 500;


router.get('/messages/:sessionId', async (req: Request, res: Response) => {
    const { sessionId } = req.params;

    try {
        const conversation = await prisma.conversation.findUnique({
        where: { id: sessionId as string},
        include: {
            messages: {
            orderBy: { timeStamp: 'asc' },
            },
        },
        });

        if (!conversation) {
            return res.status(404).json({ error: 'Session not found.' });
        }

        return res.json({ messages: conversation.messages });
    } catch (err) {
        console.error('Failed to fetch session:', err);
        return res.status(500).json({ error: 'Failed to fetch session. Please try again.'});
    }
});


router.post('/message', async (req: Request, res: Response) => {
    const { message} = req.body; 
    let {sessionId} = req.body;

    if(!message || typeof message!=='string' || message.trim()===''){
        return res.status(400).json({error: 'Message cannot be empty.'})
    }

    const trimmedMessage = message.trim().slice(0, MAX_MESSAGE_LENGTH);

    try {
        if (!sessionId || typeof sessionId !== 'string') {
        const conversation = await prisma.conversation.create({ data: {} });
        sessionId = conversation.id;

        } else {
        const conversation = await prisma.conversation.findUnique({
            where: { id: sessionId },
        });

        if (!conversation) {
            return res.status(404).json({ error: 'Session not found.' });
        }
        }

        const history = await prisma.message.findMany({
            where: { conversationId: sessionId },
            orderBy: { timeStamp: 'asc' },
            take: 5
        });

        const recentHistory = history.reverse();

        const aiReply = await generateReply(recentHistory, trimmedMessage);

        await prisma.message.createMany({
            data: [
                { conversationId: sessionId, sender: 'user', text: trimmedMessage },
                { conversationId: sessionId, sender: 'ai', text: aiReply },
            ],
        });

        return res.json({ reply: aiReply, sessionId });

    } catch (error) {
        console.error('Failed to process message:', error);
        return res.status(500).json({
        error: 'Our agent is having trouble responding right now. Please try again in a moment.',
        });
    }
})


export default router;