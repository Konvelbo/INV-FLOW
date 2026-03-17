import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { resend } from "@/lib/resend";

export async function POST(req: Request) {
  try {
    const userId = verifyToken(req);
    // userId is optional for feedback as requested, but if authenticated we link it
    
    const data = await req.json();
    const { content, rating } = data;

    if (!content) {
      return NextResponse.json({ message: "Content is required" }, { status: 400 });
    }

    const feedbackData = {
      content,
      rating: Number(rating) || 5,
      userId: userId || null,
      createdAt: new Date(),
    };

    let feedback;
    // Check if the feedback model is available in the generated client
    if ((prisma as any).feedback) {
      feedback = await (prisma as any).feedback.create({
        data: feedbackData,
      });
    } else {
      // Fallback for when Prisma generation is blocked by Windows file locks
      console.warn("Prisma feedback model not found in client, using raw command fallback.");
      await prisma.$runCommandRaw({
        insert: "Feedback",
        documents: [
          {
            content: feedbackData.content,
            rating: feedbackData.rating,
            userId: feedbackData.userId ? { $oid: feedbackData.userId } : null,
            createdAt: { $date: feedbackData.createdAt.toISOString() },
          },
        ],
      });
      feedback = { ...feedbackData, id: "raw-inserted" };
    }

    // 2. Send Email via Resend
    try {
      await resend.emails.send({
        from: 'Essor Feedback <onboarding@resend.dev>',
        to: 'fiatechnologiecam@gmail.com',
        subject: `Nouveau Feedback - ${feedbackData.rating}/5 étoiles`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 10px;">Nouveau Feedback Reçu</h2>
            <div style="margin: 20px 0;">
              <p><strong>Note :</strong> ${feedbackData.rating} / 5 ⭐</p>
              <p><strong>Utilisateur ID :</strong> ${feedbackData.userId || 'Anonyme'}</p>
              <p><strong>Date :</strong> ${feedbackData.createdAt.toLocaleString()}</p>
            </div>
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; font-style: italic;">
              "${feedbackData.content}"
            </div>
            <footer style="margin-top: 30px; font-size: 12px; color: #6b7280; text-align: center;">
              Envoyé automatiquement par le système de feedback Essor
            </footer>
          </div>
        `
      });
    } catch (emailError) {
      console.error("Failed to send feedback email:", emailError);
      // We don't fail the request if email fails, as it's already in the DB
    }

    return NextResponse.json(feedback, { status: 201 });
  } catch (error) {
    console.error("Feedback creation error:", error);
    return NextResponse.json(
      { message: "Error creating feedback", error: String(error) },
      { status: 500 }
    );
  }
}
