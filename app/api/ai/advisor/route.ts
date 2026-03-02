import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface JwtPayload {
  id: string;
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let userId: string;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
      userId = decoded.id;
    } catch (err) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const { message } = await req.json();

    // Fetch user's invoices to provide context
    const rawResult = await (prisma as any).$runCommandRaw({
      find: "Invoice",
      filter: { userId: { $oid: userId } },
    });

    const invoices = (rawResult.cursor.firstBatch as any[]).map((inv) => ({
      ...inv,
      id: inv._id.$oid,
      createdAt: inv.createdAt.$date
        ? new Date(inv.createdAt.$date)
        : new Date(inv.createdAt),
    }));

    const scaledInvoices = invoices.filter((inv) => inv.isScaled);
    const totalRevenue = scaledInvoices.reduce(
      (sum, inv) => sum + (inv.totalHT || 0),
      0,
    );
    const totalMaterial = scaledInvoices.reduce(
      (sum, inv) => sum + (inv.totalMaterial || 0),
      0,
    );
    const pendingInvoices = invoices.filter((inv) => !inv.isScaled);
    const pendingRevenue = pendingInvoices.reduce(
      (sum, inv) => sum + (inv.totalHT || 0),
      0,
    );

    // Prepare context for OpenAI
    const promptContext = `
      Données de facturation de l'utilisateur :
      - Factures validées : ${scaledInvoices.length}
      - Revenu total HT : ${totalRevenue.toLocaleString()}
      - Coûts matériels totaux : ${totalMaterial.toLocaleString()}
      - Factures en attente : ${pendingInvoices.length}
      - Revenu en attente : ${pendingRevenue.toLocaleString()}
    `;

    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Tu es un conseiller économique expert pour l'application ESSOR.
          Ton rôle est d'analyser les données de facturation de l'utilisateur et de lui donner des conseils financiers, stratégiques et technologiques pour optimiser sa rentabilité.
          Sois professionnel, précis et constructif. Utilise les données suivantes pour tes réponses : ${promptContext}`,
        },
        { role: "user", content: message },
      ],
      model: "gpt-4o",
    });

    const responseContent =
      chatCompletion.choices[0].message.content ||
      "Désolé, je n'ai pas pu générer de réponse.";

    return NextResponse.json({ response: responseContent });
  } catch (error: any) {
    console.error("Error in AI Advisor API:", error);

    // Check if the error is due to missing or invalid API key
    if (error?.status === 401 || error?.code === "invalid_api_key") {
      return NextResponse.json({
        response:
          "### ⚠️ Configuration Requise\nLa clé API OpenAI est manquante ou invalide. \n\nPour activer l'Assistant IA :\n1. Obtenez une clé API sur [OpenAI](https://platform.openai.com/).\n2. Ajoutez-la dans votre fichier `.env` : `OPENAI_API_KEY=votre_cle_ici`.",
      });
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
