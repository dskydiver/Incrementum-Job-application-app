import prisma from '@/prisma'

import type { NextApiRequest, NextApiResponse } from 'next'

type ApplierData = {
  userId: string
  name: string
  role: string
  yearsOfExperience: number
}

export type Data = {
  jobId: string
  title: string
  createdAt: Date
  description: string
  appliers: ApplierData[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data[] | { message: string }>
) {
  if (req.method === 'GET') {
    const { employer_id } = req.query

    const employerId = employer_id ? (employer_id as string) : ''

    const jobs = await prisma.job.findMany({
      where: { employerId },
      select: {
        id: true,
        title: true,
        createdAt: true,
        description: true,
        applicants: {
          select: {
            applicantProfile: {
              select: {
                user: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
                primaryRole: true,
                yearsOfExperience: true,
              },
            },
          },
        },
      },
    })

    const result: Data[] = jobs.map(
      ({ id, title, createdAt, description, applicants }) => ({
        jobId: id,
        title,
        createdAt,
        description,
        appliers: applicants.map(({ applicantProfile }) => ({
          userId: applicantProfile.user.id,
          name: applicantProfile.user.name,
          role: applicantProfile.primaryRole,
          yearsOfExperience: applicantProfile.yearsOfExperience,
        })),
      })
    )

    res.status(200).json(result)
  } else {
    res.setHeader('Allow', ['GET'])
    res.status(405).json({ message: `Method ${req.method} is not allowed` })
  }
}
