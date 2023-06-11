import prisma, { MessageStatus } from '@/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { sender_id, recipient_id, content } = req.body

    if (!sender_id || !recipient_id || !content) {
      res.status(400).json({ error: 'All fields are required' })
      return
    }

    try {
      const message = await prisma.message.create({
        data: {
          content,
          sender: { connect: { id: sender_id } },
          receiver: { connect: { id: recipient_id } },
          status: 'UNDELIEVERED',
        },
      })

      res.status(201).json(message)
    } catch (error) {
      console.error('Error creating message:', error)
      res.status(500).json({ error: 'Unable to create message' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).json({ message: `Method ${req.method} not allowed` })
  }
}

export default handler
