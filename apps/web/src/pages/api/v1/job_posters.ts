import prisma from '@/prisma'

import type { NextApiRequest, NextApiResponse } from 'next'

export type Data = {
  userId: string
  name: string
  email: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data[] | { message: string }>
) {
  if (req.method === 'GET') {
    const profile = await prisma.employerProfile.findMany({
      select: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (profile.length > 0) {
      const result: Data[] = profile.map(({ user: { id, name, email } }) => ({
        userId: id,
        name,
        email,
      }))
      res.status(200).json(result)
    } else {
      res.status(405).json({ message: 'no data returned' })
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).json({ message: `Method ${req.method} is not allowed` })
  }
}
