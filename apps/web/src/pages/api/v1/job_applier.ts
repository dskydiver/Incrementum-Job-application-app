import prisma from '@/prisma'

import type { NextApiRequest, NextApiResponse } from 'next'

export type Data = {
  userId: string
  name: string
  email: string
  role: string
  yearsOfExperience: number
  education: string
  skills: string[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | { message: string }>
) {
  if (req.method === 'GET') {
    const { job_applier_id } = req.query
    const jobApplierId = job_applier_id ? (job_applier_id as string) : ''

    const profile = await prisma.applicantProfile.findUnique({
      where: { userId: jobApplierId },
      select: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        primaryRole: true,
        yearsOfExperience: true,
        education: true,
        skills: true,
      },
    })

    if (profile) {
      const result: Data = {
        userId: profile.user.id,
        name: profile.user.name,
        email: profile.user.email,
        yearsOfExperience: profile.yearsOfExperience,
        role: profile.primaryRole,
        education: profile.education,
        skills: profile.skills,
      }

      res.status(200).json(result)
    }
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).json({ message: `Method ${req.method} is not allowed` })
  }
}
