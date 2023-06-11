import { PrismaClient } from 'database'

export type { MessageStatus, Message, EmployerProfile } from 'database'

export default new PrismaClient()
