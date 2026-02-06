import { z } from "zod";

export const invoiceItemSchema = z.object({
  designation: z.string().min(1),
  unit: z.string().min(1),
  quantity: z.number().positive(),
  unitPrice: z.number().positive(),
});

export const invoiceSchema = z.object({
  reference: z.string(),
  type: z.enum(["PROFORMA", "FACTURE"]),
  city: z.string(),
  invoiceDate: z.string(),

  clientName: z.string(),
  object: z.string(),
  managerName: z.string(),

  items: z.array(invoiceItemSchema).min(1),
});
