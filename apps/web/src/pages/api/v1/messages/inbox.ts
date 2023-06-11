import prisma, { MessageStatus } from '@/prisma'

import type { NextApiRequest, NextApiResponse } from 'next'

export type Data = {
  messageId: string
  senderId: string
  recipientId: string
  content: string
  timestamp: Date
  status: MessageStatus
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data[] | { message: string }>
) {
  if (req.method === 'GET') {
    const { employer_id, applier_id } = req.query
    const employerId = employer_id ? (employer_id as string) : ''
    const applierId = applier_id ? (applier_id as string) : ''

    const messages = await prisma.message.findMany({
      where: {
        AND: [
          {
            deletedAt: null,
          },
          {
            OR: [
              { senderId: applierId, receiverId: employerId },
              { senderId: employerId, receiverId: applierId },
            ],
          },
        ],
      },
      select: {
        id: true,
        createdAt: true,
        content: true,
        status: true,
        sender: {
          select: {
            id: true,
            name: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    const result: Data[] = messages.map(
      ({ id, createdAt, content, status, sender, receiver }) => ({
        messageId: id,
        senderId: sender.id,
        recipientId: receiver.id,
        content,
        timestamp: createdAt,
        status,
      })
    )
    res.status(200).json(result)
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).json({ message: `Method ${req.method} is not allowed` })
  }
}
