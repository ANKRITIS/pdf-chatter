import { z } from 'zod'

export const SendMessageValidator = z.object({
  fileId: z.string(),
  message: z.string().min(1).max(2000),
})

export const GenerateFlashcardsValidator = z.object({
  fileId: z.string(),
  count: z.number().min(5).max(50).default(10),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
})