import { z } from "zod";

export const todoSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional().nullable(),
  status: z.enum(["todo", "in_progress", "done"]).default("todo"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  category: z.string().default("work"),
  startTime: z.string().optional().nullable(),
  endTime: z.string().optional().nullable(),
  reminderAt: z.string().optional().nullable(),
  completed: z.boolean().optional(),
});

export const todoPatchSchema = todoSchema.partial();

export const invoiceItemSchema = z.object({
  designation: z.string().min(1, "La désignation est requise"),
  unit: z.string().default("U"),
  quantity: z.number().positive(),
  unitPrice: z.number().min(0),
  totalPrice: z.number().min(0),
});

export const invoiceSchema = z.object({
  reference: z.string().min(1),
  city: z.string().min(1),
  clientName: z.string().min(1),
  object: z.string().min(1),
  clientAddress: z.string().optional().nullable(),
  clientContact: z.string().optional().nullable(),
  clientPOBox: z.string().optional().nullable(),
  managerName: z.string().min(1),
  totalHT: z.number(),
  totalMaterial: z.number(),
  amountWords: z.string().optional().nullable(),
  style: z.string().default("default"),
  isScaled: z.boolean().default(false),
  items: z.array(invoiceItemSchema),
});

export const pushSubscriptionSchema = z.object({
  endpoint: z.string().url(),
  keys: z.object({
    p256dh: z.string(),
    auth: z.string(),
  }),
});
