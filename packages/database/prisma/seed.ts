import { PrismaClient, UserRole, MessageStatus } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

function getRandomElement(arr: string[]) {
  const randomIndex = Math.floor(Math.random() * arr.length)
  return arr[randomIndex]
}

function generateFakeUniversityName() {
  const universitySuffixes = [
    'University',
    'Institute of Technology',
    'College',
    'Polytechnic',
    'State University',
  ]
  const city = faker.location.city()
  const suffix = getRandomElement(universitySuffixes)

  return `${city} ${suffix}`
}

function generateFakeEducation() {
  const degree = getRandomElement(['Bachelor', 'Master', 'Ph.D.', 'Associate'])
  const major = faker.person.jobArea()
  const university = generateFakeUniversityName()
  const graduationYear = faker.date
    .past({ years: 15, refDate: new Date() })
    .getFullYear()

  return `${degree} of ${major} from ${university} (Graduated in ${graduationYear})`
}

async function main() {
  // Seed Users with Applicant Profiles
  for (let i = 0; i < 10; i++) {
    const email = faker.internet.email()
    const name = faker.internet.userName()
    const user = await prisma.user.create({
      data: {
        email,
        name,
        role: UserRole.Applicant,
        applicantProfile: {
          create: {
            primaryRole: faker.person.jobTitle(),
            yearsOfExperience: faker.number.int({ min: 1, max: 10 }),
            education: generateFakeEducation(),
            skills: [
              faker.hacker.ingverb(),
              faker.hacker.ingverb(),
              faker.hacker.ingverb(),
            ],
          },
        },
      },
    })
  }

  // Seed Users with Employer Profiles
  for (let i = 0; i < 5; i++) {
    const email = faker.internet.email()
    const name = faker.internet.userName()
    const user = await prisma.user.create({
      data: {
        email,
        name,
        role: UserRole.Employer,
        employerProfile: {
          create: {},
        },
      },
    })
  }

  // Seed Jobs
  const employers = await prisma.employerProfile.findMany({})

  for (let employer of employers) {
    for (let i = 0; i < 4; i++) {
      await prisma.job.create({
        data: {
          title: faker.person.jobTitle(),
          description: faker.lorem.paragraph(),
          employerProfile: { connect: { userId: employer.userId } },
        },
      })
    }
  }

  const jobs = await prisma.job.findMany()
  const applicants = await prisma.applicantProfile.findMany({})

  for (let applicant of applicants) {
    const randomJobIndexes = new Set<number>()
    for (let i = 0; i < 3; i++) {
      randomJobIndexes.add(
        faker.number.int({
          min: 0,
          max: jobs.length - 1,
        })
      )
    }
    const jobIndexes = Array.from(randomJobIndexes)
    for (let i = 0; i < jobIndexes.length; i++) {
      await prisma.applicantProfilesOnJobs.create({
        data: {
          applicantProfile: { connect: { userId: applicant.userId } },
          job: { connect: { id: jobs[jobIndexes[i]].id } },
        },
      })
    }
  }

  // Seed Messages
  for (let employer of employers) {
    for (let applicant of applicants) {
      const messagesCount = faker.number.int({ min: 1, max: 5 })
      for (let i = 0; i < messagesCount; i++) {
        const senderId = faker.datatype.boolean()
          ? employer.userId
          : applicant.userId
        const receiverId =
          senderId === employer.userId ? applicant.userId : employer.userId

        await prisma.message.create({
          data: {
            content: faker.lorem.paragraph(),
            sender: { connect: { id: senderId } },
            receiver: { connect: { id: receiverId } },
            status: MessageStatus.DELIEVERED,
          },
        })
      }
    }
  }
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
