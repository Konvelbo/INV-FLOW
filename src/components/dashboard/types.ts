export interface Insight {
  id: string;
  type: "opportunity" | "warning" | "tip";
  title: string;
  description: string;
}

export interface RecentInvoice {
  id: string;
  reference: string;
  clientName: string;
  totalHT: number;
  isScaled: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalMaterial: number;
  pendingRevenue: number;
  pendingCount: number;
  chartData: Array<{ name: string; revenue: number }>;
  growth: string | number;
  performance: string;
  invoiceCount: number;
  recentInvoices: RecentInvoice[];
  currency?: string;
}

export interface Todo {
  id: string;
  title: string;
  status: "todo" | "in_progress" | "done";
  startTime?: string | null;
  endTime?: string | null;
  priority?: "low" | "medium" | "high";
  category?: string;
}

export interface User {
  name: string;
  email: string;
  token: string;
}
