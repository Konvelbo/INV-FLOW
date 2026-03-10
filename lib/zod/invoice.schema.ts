import { z } from "zod";

export const invoiceItemSchema = z.object({
  designation: z.string().min(1),
  unit: z.string().min(1),
  quantity: z.number(),
  unitPrice: z.number(),
  totalPrice: z.number(),
});

export const invoiceSchema = z.object({
  reference: z.string().min(1),
  type: z.enum(["invoice", "quote"]),
  city: z.string().min(1),
  invoiceDate: z.string(),
  dueDate: z.string().nullable().optional(),

  clientName: z.string().min(1),
  clientAddress: z.string().optional(),
  clientContact: z.string().optional(),
  clientPOBox: z.string().optional(),
  object: z.string().min(1),
  managerName: z.string().min(1),

  items: z.array(invoiceItemSchema).min(1),
  totalHT: z.number(),
  totalMaterial: z.number(),
  currencyCode: z.string().optional(),
  language: z.enum(["fr", "en"]).optional(),
  style: z.string().optional(),
  amountWords: z.string().optional(),
});
