import prisma, { MessageStatus } from '@/prisma'

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { message_id } = req.body
    if (!message_id) {
      res.status(400).json({ error: 'Message id is required' })
      return
    }
    try {
      const message = await prisma.message.update({
        where: { id: message_id },
        data: {
          status: 'DELIEVERED',
        },
      })
      res.status(200).json(message)
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'update message error' })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).json({ message: `Method ${req.method} is not allowed` })
  }
}
