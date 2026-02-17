import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
}

export async function GET(req: Request) {
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

    // Fetch user's invoices using raw MongoDB command to bypass Prisma Client desync
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
    const pendingInvoices = invoices.filter((inv) => !inv.isScaled);

    const totalRevenue = scaledInvoices.reduce(
      (sum, inv) => sum + (inv.totalHT || 0),
      0,
    );
    const totalMaterial = scaledInvoices.reduce(
      (sum, inv) => sum + (inv.totalMaterial || 0),
      0,
    );

    const pendingRevenue = pendingInvoices.reduce(
      (sum, inv) => sum + (inv.totalHT || 0),
      0,
    );
    const pendingCount = pendingInvoices.length;

    // Group by month for the chart (last 6 months) - only scaled invoices
    const monthlyStats: Record<string, number> = {};
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Initialize last 6 months
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${months[d.getMonth()]}`;
      monthlyStats[monthKey] = 0;
    }

    scaledInvoices.forEach((inv) => {
      const d = new Date(inv.createdAt);
      const monthKey = `${months[d.getMonth()]}`;
      if (monthlyStats.hasOwnProperty(monthKey)) {
        monthlyStats[monthKey] += inv.totalHT || 0;
      }
    });

    const chartData = Object.entries(monthlyStats).map(([name, total]) => ({
      name,
      total,
    }));

    // Get 4 most recent invoices
    const recentInvoices = [...invoices]
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 4)
      .map((inv) => ({
        id: inv.id,
        reference: inv.reference,
        clientName: inv.clientName,
        totalHT: inv.totalHT,
        isScaled: inv.isScaled,
        createdAt: inv.createdAt,
      }));

    // Calculate growth (simplistic)
    const currentMonthData = chartData[chartData.length - 1]?.total || 0;
    const prevMonthData = chartData[chartData.length - 2]?.total || 0;
    const growth =
      prevMonthData === 0
        ? 0
        : ((currentMonthData - prevMonthData) / prevMonthData) * 100;

    return NextResponse.json({
      totalRevenue,
      totalMaterial,
      pendingRevenue,
      pendingCount,
      chartData,
      growth: growth.toFixed(1),
      invoiceCount: scaledInvoices.length,
      recentInvoices,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}
