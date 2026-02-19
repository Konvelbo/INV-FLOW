import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
export const dynamic = "force-dynamic";

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
    } catch {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // Fetch user's invoices using standard Prisma Client
    const invoices = await prisma.invoice.findMany({
      where: { userId: userId },
      orderBy: { createdAt: "desc" },
    });

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

    const chartData: { name: string; total: number }[] = [];
    const now = new Date();

    // Initialize last 6 months in correct order
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      chartData.push({
        name: months[d.getMonth()],
        total: 0,
      });
    }

    scaledInvoices.forEach((inv) => {
      const d = new Date(inv.createdAt);
      const monthName = months[d.getMonth()];
      const monthStat = chartData.find((m) => m.name === monthName);
      if (monthStat) {
        monthStat.total += inv.totalHT || 0;
      }
    });

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

    // Performance calculation: Proportion of Scaled Revenue vs Total Revenue for the current month
    let performance = 0;
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const currentMonthInvoices = invoices.filter((inv) => {
      const d = new Date(inv.createdAt);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const scaledHTThisMonth = currentMonthInvoices
      .filter((inv) => inv.isScaled)
      .reduce((sum, inv) => sum + (inv.totalHT || 0), 0);

    const totalHTThisMonth = currentMonthInvoices.reduce(
      (sum, inv) => sum + (inv.totalHT || 0),
      0,
    );

    if (totalHTThisMonth > 0) {
      performance = (scaledHTThisMonth / totalHTThisMonth) * 100;
    }

    return NextResponse.json({
      totalRevenue,
      totalMaterial,
      pendingRevenue,
      pendingCount,
      chartData,
      growth: growth.toFixed(1),
      performance: performance.toFixed(1),
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
