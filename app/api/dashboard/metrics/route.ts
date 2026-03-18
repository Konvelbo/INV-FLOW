import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { getDashboardMetrics } from "@/lib/data-fetching/dashboard";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {
        const userId = verifyToken(req);
        if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const companyId = searchParams.get("companyId") || undefined;

        const metrics = await getDashboardMetrics(userId, companyId);

        return NextResponse.json(metrics);
    } catch (error) {
        console.error("Error fetching metrics:", error);
        return NextResponse.json({ message: "Error fetching metrics", error }, { status: 500 });
    }
}
