import { Message, File } from '@prisma/client'

export type ExtendedMessage = Message & {
  isUserMessage: boolean
}

export type FileWithMessages = File & {
  messages: Message[]
}